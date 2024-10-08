import axios from 'axios';
import { Octokit } from '@octokit/rest';
import OpenAI from 'openai';
import TurndownService from 'turndown';
import matter from 'gray-matter';

// Wallabag API credentials
const WALLABAG_URL = process.env.WALLABAG_URL;
const WALLABAG_CLIENT_ID = process.env.WALLABAG_CLIENT_ID;
const WALLABAG_CLIENT_SECRET = process.env.WALLABAG_CLIENT_SECRET;
const WALLABAG_USERNAME = process.env.WALLABAG_USERNAME;
const WALLABAG_PASSWORD = process.env.WALLABAG_PASSWORD;

// GitHub credentials
const GITHUB_TOKEN = process.env.GH_TOKEN;

// OpenAI credentials
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL;

// Initialize clients
const octokit = new Octokit({ auth: GITHUB_TOKEN });
const openai = new OpenAI({ apiKey: OPENAI_API_KEY, baseURL: OPENAI_BASE_URL });
const turndownService = new TurndownService();

// Prompt for OpenAI
const PROMPT = `
You will be summarizing an article into a short tweet.
Here are some example tweets to guide your style:
<example_tweets>
- Ubiquitous education seems like an impactful idea. Not sure higher education institutions are realizing the profoundness of the incoming disruption.
- I don't know why we're so obsessed with trying to find tasks that LLMs can't do. We have systems to generate randomness. We don't need LLMs to do that.
- While I agree that there is leapfrogging potential with gen AI, I don't currently see how chat interfaces would be able to kick off that process. We need other ways to interface with gen AI.
- Data is all we ever needed. Maybe we need to reconsider the 'AI moat' debate?
- Gen AI is now entering the gene editing space. If transformers are good at predicting sequences of words, why wouldn't they be able to predict DNA sequences?
- First principle thinking on the web and its publishing model. There is much more at stake than hallucinated references.
- We cannot rely on governments to regulate AI. All of AI's risks lie outside goverments' boundaries and election terms.
- After AI statements by the pope and other churches, and now 'Father Justin', it's quite interesting to see to what degree churches are trying to engage with gen AI.
- Secure reading rooms for frontier model research? Shows how critical this technology has already become.
- LLMs seem to have already gained super-human capabilities when it comes to persuasion. In this RCT LLMs were better at changing someone's opinion than humans, given the same information.
- Strong empirical evidence that return-to-office mandates don't improve firm performance and hurt employee satisfaction.
- USAToday survey says that 14 percent of US employees work entirely from home. This number will increase to 20 percent in 2025.
- Go is one of the AI use cases, where super-human ability has already been achieved. Go players aren't contemplating though; they're levelling up their skills and creativity. Encouraging findings for the future of work.
- Online labour markets could be a bellweather of what's to come for the future of work with AI. So far only few professions are actually being impacted by LLMs.
- Mass-personalization may finally become a reality with generative AI.
- Software development is THE use case for LLMs. Meta tried improving their software tests with LLMs. 73 percent of code recommendations were pushed to production.
- Agentic workflows is clearly the next frontier in large language models.
- Why do preprints work but preprint reviewing doesn't? Preprints don't compete with journals but preprint reviewing does.
- The state of AI research today is comparable to physics in the 20th century. Lots of experiments with surprising results to which we don't have an answer.
- Data poisoning attacks on LLMs are particularly dangerous because once poisoned it's almost impossible to fix models.
- LLMs capabilities may not be as 'emergent' as we thought. What emerges may be what we measure.
</example_tweets>

To summarize the article into a tweet, follow these steps:
1. Read the article carefully and identify the main topic or central message.
2. Determine the most important or interesting points that support the main topic.
3. Condense these key points into a concise summary.
4. Craft the summary into a tweet-length message (maximum 280 characters).
Guidelines for your tweet:
- Follow a critical, opinionated tone as in the example tweets.
- You are excited about technology but generally critical with regards to its development and progress.
- The tweet should be thought-provoking and engaging.
- You can take a controversial stance.
- Do not use hashtags or emojis.
- Ensure the tweet can stand alone and be understood without additional context.
Write your tweet summary inside <tweet> tags. Do not include any explanation or additional comments outside of the tweet tags.
`;

// Helper functions
const getAccessToken = async () => {
    const response = await axios.post(`${WALLABAG_URL}/oauth/v2/token`, {
        grant_type: "password",
        client_id: WALLABAG_CLIENT_ID,
        client_secret: WALLABAG_CLIENT_SECRET,
        username: WALLABAG_USERNAME,
        password: WALLABAG_PASSWORD,
    });
    return response.data.access_token;
};

const fetchArticles = async () => {
    const accessToken = await getAccessToken();
    const response = await axios.get(`${WALLABAG_URL}/api/entries?archive=0`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data._embedded.items;
};

const fetchNewArticles = async () => {
    const articles = await fetchArticles();
    return articles.filter(
        (article) => !article.tags.some((tag) => tag.label === "socialbot")
    );
};

const tagArticle = async (articleId) => {
    const accessToken = await getAccessToken();
    await axios.post(
        `${WALLABAG_URL}/api/entries/${articleId}/tags`,
        { tags: ["socialbot"] },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        }
    );
};

const simplifyContent = (article) => {
    article.content = turndownService.turndown(article.content);
    return article;
};

const getTweet = async (record) => {
    const response = await openai.chat.completions.create({
        model: "gemini-1.5-pro-exp",
        messages: [
            { role: "system", content: PROMPT },
            { role: "user", content: `<article_content>${record.content}</article_content>` },
        ],
    });
    const tweet = response.choices[0].message.content.match(/<tweet>(.*?)<\/tweet>/s)[1].trim();
    return tweet;
};

const slugify = (s) =>
    s
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-');

const createBranch = async (repo, record) => {
    const { data: ref } = await octokit.git.getRef({
        owner: repo.owner,
        repo: repo.name,
        ref: `heads/${repo.default_branch}`,
    });
    await octokit.git.createRef({
        owner: repo.owner,
        repo: repo.name,
        ref: `refs/heads/${slugify(record.title)}`,
        sha: ref.object.sha,
    });
};

const createFile = async (repo, record, tweet) => {
    const content = matter.stringify(tweet, {
        title: record.title,
        url: record.url,
        date: new Date().toISOString(),
        thumbnail: record.preview_picture,
    });

    await octokit.repos.createOrUpdateFileContents({
        owner: repo.owner,
        repo: repo.name,
        path: `src/links/${slugify(record.title)}.md`,
        message: "[SOCIALBOT]: new article",
        content: Buffer.from(content).toString('base64'),
        branch: slugify(record.title),
    });
};

const createPullRequest = async (repo, record, tweet) => {
    await octokit.pulls.create({
        owner: repo.owner,
        repo: repo.name,
        title: `[SOCIALBOT]: ${record.title}`,
        body: `${tweet}\n\n- [Wallabag URL](https://wb.julianprester.com/view/${record.id})\n- [Original URL](${record.url})`,
        head: slugify(record.title),
        base: repo.default_branch,
    });
};

const pushRecord = async (record) => {
    const tweet = await getTweet(record);
    const repo = { owner: "julianprester", name: "website", default_branch: "main" };
    await createBranch(repo, record);
    await createFile(repo, record, tweet);
    await createPullRequest(repo, record, tweet);
};

const publish = async () => {
    const articles = await fetchNewArticles();
    for (const article of articles) {
        const simplifiedArticle = simplifyContent(article);
        await pushRecord(simplifiedArticle);
        await tagArticle(article.id);
    }
};

publish();
