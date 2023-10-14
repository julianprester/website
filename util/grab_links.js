const fs = require('fs')
const yaml = require('yaml')

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
                write_message(parsed)
            }
        })
        // .then(() => delete_messages())
        .catch(error => console.error(error))
}

function parse_message(message) {
    const re = /(.*?) (https?:\/\/.*?) via @wallabagapp/
    const match = message.message.match(re)
    return {
        "title": match[1],
        "url": match[2],
        "text": message.title,
        "slug": slugify(match[1]),
        "date": new Date().toISOString().substring(0, 10),
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