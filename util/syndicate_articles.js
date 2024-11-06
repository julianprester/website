import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { TwitterApi } from 'twitter-api-v2';
import fetch from 'node-fetch';
import sharp from 'sharp';

const LINKS_DIR = 'src/links';

const client = new TwitterApi({
    appKey: process.env.TWITTER_APP_KEY,
    appSecret: process.env.TWITTER_APP_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
    bearerToken: process.env.TWITTER_BEARER_TOKEN,
})

async function getTodayPost() {
    const today = new Date().toISOString().slice(0, 10);
    const files = await fs.readdir(LINKS_DIR);

    for (const file of files) {
        const filePath = path.join(LINKS_DIR, file);
        const content = await fs.readFile(filePath, 'utf8');
        const post = matter(content);

        if (post.data.scheduled?.toISOString().slice(0, 10) === today) {
            return post;
        }
    }

    return null;
}

async function downloadImage(url) {
    const response = await fetch(url);
    return await response.buffer();
}

async function convertGifToJpg(buffer) {
    return await sharp(buffer)
        .toFormat('jpg')
        .toBuffer();
}

async function decardLink(urlStr) {
    const urlParts = urlStr.split('//');
    const domainParts = urlParts[1].split('/');
    const hostParts = domainParts[0].split('.');
    const lastPart = hostParts.pop();
    const modifiedHost = hostParts.join('.') + '\u200B.' + lastPart;
    domainParts[0] = modifiedHost;
    return urlParts[0] + '//' + domainParts.join('/');
}

async function publishToTwitter(post) {
    let tweet = { text: post.content.trim() };
    if (post.data.thumbnail && post.data.thumbnail !== 'None') {
        let imageBuffer = await downloadImage(post.data.thumbnail);

        const fileType = await sharp(imageBuffer).metadata();
        if (fileType.format === 'gif') {
            imageBuffer = await convertGifToJpg(imageBuffer);
        }

        const mediaId = await client.v1.uploadMedia(imageBuffer, { mimeType: 'image/jpeg' });
        tweet.media = { media_ids: [mediaId] };
    }
    const decardedLink = await decardLink(post.data.url);
    await client.v2.tweetThread([
        tweet,
        `For the original article check out:\n${decardedLink}`,
    ]);
    console.log('Tweet published successfully');
}

async function setSyndicated(post) {
    post.data.syndicated = true;
    await fs.writeFile(
        path.join(LINKS_DIR, post.file),
        matter.stringify(post.content, post.data)
    );
}

(async () => {
    try {
        const post = await getTodayPost();
        if (post) {
            await publishToTwitter(post);
            await setSyndicated(post);
        } else {
            console.log('No posts to publish today');
        }
    } catch (error) {
        console.error('Error publishing tweet:', error);
    }
})();
