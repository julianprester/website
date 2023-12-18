const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')
const { TwitterApi } = require("twitter-api-v2")

const client = new TwitterApi({
    appKey: process.env.TWITTER_APP_KEY,
    appSecret: process.env.TWITTER_APP_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
    bearerToken: process.env.TWITTER_BEARER_TOKEN,
})

const rwClient = client.readWrite

function getPost() {
    const files = fs.readdirSync('src/links')
    const today = new Date().toISOString().slice(0, 10)
    for (const file of files) {
        const content = fs.readFileSync(path.join('src/links', file), 'utf8')
        const frontmatter = matter(content).data
        if (frontmatter.published) {
            if (frontmatter.published.toISOString().slice(0, 10) === today) {
                return content
            }
        }
    }
    return null
}

function publishToTwitter(content) {
    rwClient.v2.tweet(`${matter(content).content}\n${matter(content).data.url}`)
}

const post = getPost()
if (post) {
    publishToTwitter(post)
}