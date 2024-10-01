import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { TwitterApi } from 'twitter-api-v2';

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

        if (post.data.syndicated?.toISOString().slice(0, 10) === today) {
            return post;
        }
    }

    return null;
}

async function publishToTwitter(post) {
    const tweet = `${post.content.trim()}\n${post.data.url}`;
    await client.v2.tweet(tweet);
    console.log('Tweet published successfully');
}

(async () => {
    try {
        const post = await getTodayPost();
        if (post) {
            await publishToTwitter(post);
        } else {
            console.log('No posts to publish today');
        }
    } catch (error) {
        console.error('Error publishing tweet:', error);
    }
})();
