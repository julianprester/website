const fs = require('fs')

function get_messages() {
    fetch('https://gotify.julianprester.com/application/2/message', {
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
        .then(() => delete_messages())
        .catch(error => console.error(error))
}

function parse_message(message) {
    const re = /(.*?) (https?:\/\/.*?) via @wallabagapp/
    const match = message.message.match(re)
    return {
        "title": match[1],
        "url": match[2],
        "text": message.title,
        "slug": slugify(match[1])
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
    const data = `---\ntitle: ${message.title}\nurl: ${message.url}\ndate: ${new Date().toISOString().substring(0, 10)}\ntags:\n  - links\n---\n\n${message.text}\n`
    fs.writeFileSync(`src/links/${message.slug}.md`, data)
}

function delete_messages() {
    fetch('https://gotify.julianprester.com/application/2/message', {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${process.env.GOTIFY_TOKEN}`
        }
    })
}

get_messages()