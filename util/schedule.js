import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const LINKS_DIR = 'src/links';

async function getPostsData(dir) {
    const files = await fs.readdir(dir);
    const postsData = await Promise.all(
        files
            .filter(file => path.extname(file) === '.md')
            .map(async file => {
                const content = await fs.readFile(path.join(dir, file), 'utf8');
                return { file, ...matter(content) };
            })
    );
    return postsData;
}

function getLastScheduledDate(posts) {
    const today = new Date(new Date().setUTCHours(3, 0, 0, 0));
    return posts.reduce((latestDate, post) => {
        const scheduledDate = post.data.syndicated ? new Date(post.data.syndicated) : today;
        return scheduledDate > latestDate ? scheduledDate : latestDate;
    }, today);
}

async function schedule() {
    const posts = await getPostsData(LINKS_DIR);
    let nextDate = getLastScheduledDate(posts);
    nextDate.setDate(nextDate.getDate() + 1);

    for (const post of posts) {
        if (!post.data.syndicated) {
            post.data.syndicated = nextDate;
            await fs.writeFile(
                path.join(LINKS_DIR, post.file),
                matter.stringify(post.content, post.data)
            );
            nextDate.setDate(nextDate.getDate() + 1);
        }
    }
}

(async () => {
    await schedule();
})();