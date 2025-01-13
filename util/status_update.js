import { Octokit } from '@octokit/rest';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const GITHUB_TOKEN = process.env.GH_TOKEN;

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

                if (data.scheduled && !isNaN(new Date(data.scheduled))) {
                    const scheduledDate = new Date(data.scheduled);
                    if (!newestDate || scheduledDate > newestDate) {
                        newestDate = scheduledDate;
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

async function sendNtfyMessage(title, message, priority = 5) {
    fetch(process.env.NTFY_URL, {
        method: 'POST',
        body: message,
        headers: {
            'Title': title,
            'Priority': priority,
            'Authorization': `Bearer ${process.env.NTFY_TOKEN}`
        }
    })
        .then(data => console.log('Message sent successfully:', data))
        .catch(error => console.error('Error sending Ntfy message:', error));
}

async function getStatusUpdate() {
    const prCount = await getPullRequest();
    if (prCount > 10) {
        sendNtfyMessage('julianprester.com [PR]', `There are ${prCount} open PRs. Write some tweets!`);
    }
    const lastScheduledDate = await getLastScheduledDate();
    const daysUntil = Math.max(0, Math.floor((lastScheduledDate - new Date()) / (1000 * 60 * 60 * 24)));
    if (daysUntil <= 5) {
        sendNtfyMessage('julianprester.com [POSTS]', `There are only ${daysUntil} more posts scheduled. Refill the pipeline!`);
    }
}

getStatusUpdate();