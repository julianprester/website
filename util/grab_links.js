const fs = require('fs')
const path = require('path')
const yaml = require('yaml')
const matter = require('gray-matter')

function get_messages() {
    fetch(process.env.GOTIFY_URL, {
        headers: {
            "Authorization": `Bearer ${process.env.GOTIFY_TOKEN}`
        }
    })
        .then(response => response.json())
        .then(response => {
            for (message of response.messages) {
                const parsed = parse_message(message)
                if (parsed.text.length <= 256) {
                    delete parsed.published
                }
                write_message(parsed)
            }
        })
        // .then(() => delete_messages())
        .catch(error => console.error(error))
}

function parse_message(message) {
    const re = /(.*?) (https?:\/\/.*?) via @wallabagapp/
    const match = message.message.match(re)
    const nextPublicationDate = getNextPublicationDate('src/links')
    console.log(nextPublicationDate)
    return {
        "title": match[1],
        "url": match[2],
        "text": message.title,
        "slug": slugify(match[1]),
        "date": new Date().toISOString().substring(0, 10),
        "published": nextPublicationDate,
        "tags": ["links"]
    }
}

function slugify(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function getNextPublicationDate(dir) {
    const files = fs.readdirSync(dir)
    let latestDate = new Date()
    
    for (const file of files) {
        const content = fs.readFileSync(path.join(dir, file), 'utf8')
        console.log(content)
        const frontmatter = matter(content).data
        console.log(frontmatter)

        if (frontmatter.published && new Date(frontmatter.published) > latestDate) {
            latestDate = new Date(frontmatter.published)
        }
    }
    console.log(latestDate)
    latestDate.setDate(latestDate.getDate() + 1)
    console.log(latestDate)
    console.log(latestDate.toISOString().slice(0, 10))
    return latestDate.toISOString().slice(0, 10)
}

function write_message(message) { 
    const text = message.text
    const slug = message.slug
    const frontmatter = message
    delete frontmatter.text
    delete frontmatter.slug
    const data = `---\n${yaml.stringify(frontmatter)}---\n\n${text}\n`
    fs.writeFileSync(`src/links/${slug}.md`, data)
}

function delete_messages() {
    fetch(process.env.GOTIFY_URL, {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${process.env.GOTIFY_TOKEN}`
        }
    })
}

get_messages()