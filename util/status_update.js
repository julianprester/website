import { Octokit } from '@octokit/rest';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const GITHUB_TOKEN = process.env.GH_TOKEN;

const GOTIFY_URL = process.env.GOTIFY_URL;
const GOTIFY_TOKEN = process.env.GOTIFY_TOKEN;

const LINKS_DIR = 'src/links';

const octokit = new Octokit({ auth: GITHUB_TOKEN });

async function getPullRequest() {
    let page = 1;
    let botPRCount = 0;
    let hasNextPage = true;

    try {
        while (hasNextPage) {
            const response = await octokit.rest.pulls.list({
                owner: 'julianprester',
                repo: 'website',
                state: 'open',
                per_page: 100,
                page: page
            });

            const botPRs = response.data.filter(pr => pr.title.startsWith('[SOCIALBOT]'));
            botPRCount += botPRs.length;

            hasNextPage = response.data.length === 100;
            page++;
        }

        return botPRCount;

    } catch (error) {
        console.error(`Error: ${error.message}`);
        return null;
    }
}

async function getLastScheduledDate() {
    try {
        const files = await fs.readdir(LINKS_DIR);

        let newestDate = null;

        for (const file of files) {
            if (path.extname(file) === '.md') {
                const content = await fs.readFile(path.join(LINKS_DIR, file), 'utf8');
                const { data } = matter(content);

                if (data.syndicated && !isNaN(new Date(data.syndicated))) {
                    const syndicatedDate = new Date(data.syndicated);
                    if (!newestDate || syndicatedDate > newestDate) {
                        newestDate = syndicatedDate;
                    }
                }
            }
        }

        return newestDate;
    } catch (error) {
        console.error('Error reading files:', error);
        return null;
    }
}

async function sendGotifyMessage(title, message, priority = 5) {
    const url = `${GOTIFY_URL}/message?token=${GOTIFY_TOKEN}`;

    const payload = {
        title: title,
        message: message,
        priority: priority
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Message sent successfully:', data);
        return data;
    } catch (error) {
        console.error('Error sending Gotify message:', error);
        throw error;
    }
}

async function getStatusUpdate() {
    const prCount = await getPullRequest();
    if (prCount > 30) {
        sendGotifyMessage('julianprester.com [PR]', `There are ${prCount} open PRs. Write some tweets!`);
    }
    const lastScheduledDate = await getLastScheduledDate();
    const daysUntil = Math.floor((lastScheduledDate - new Date()) / (1000 * 60 * 60 * 24));
    if (daysUntil <= 5) {
        sendGotifyMessage('julianprester.com [POSTS]', `There are only ${daysUntil} more posts scheduled. Refill the pipeline!`);
    }
}

getStatusUpdate();