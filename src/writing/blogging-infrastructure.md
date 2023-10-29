---
title: An Inside Look at the Infrastructure of this Website
date: 2023-10-28
tags:
  - published
  - writing
  - infrastructure
---

Building and maintaining a personal website to me goes far beyond just publishing content.
It also involves the tinkering with a multitude of tools and tech, designing an infrastructure that makes publishing content easy and efficient.
In this post, let's delve into the details of the tech stack underpinning this blog.
As you can imagine this is the first, more technical piece of writing on this page, so skip if that's not for you.

## Static Sites and the 11TEA Stack 🍵

Static sites are web pages with fixed content coded in HTML, CSS, and occasionally JavaScript, which are delivered to the user exactly as stored by the server.
These sites display the same content to every visitor and do not require a database or backend server code.
This type of website excels in delivering speed, reliability, and security.
For blogs and personal websites, the content often doesn't change rapidly or dynamically, making static sites a perfect fit.

Eleventy is the static site generator I use for this website.
Eleventy prides itself on its top-notch performance.
What I also like about it is that it doesn't tie you to any client-side JavaScript frameworks.
It also supports several template languages.

Eleventy is the core of what is called the ElevenTEA stack.
Eleventy is used to generate the static websites.
The 'T' stands for TailwindCSS.
Tailwind is a CSS framework that consists of a set of pre-defined utility classes that can be composed to build any website design, directly in your HTML files.
For example, we can use several utility classes on a button:

```html
<button class="bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400">
  Launch Website
</button>
```

And the button will look like this:

<button class="bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400">
  Launch Website
</button>

While this long list of css classes may look confusing at first, but after some time of working with Tailwind this becomes so convenient.

Lastly, the 'A' in the ElevenTEA stack stands for AlpineJS.
What Tailwind is for CSS, Alpine is for Javascript.
My personal website doesn't use a lot of Javascript.
That's why I wouldn't want to use a huge frontend framework.
AlpineJS is minimal and has the same useful characteristic that you can write Javascript behaviour directly into your HTML markup.

For example, we can build a simple counter like this:

```html
<div x-data="{ count: 0 }">
    <button x-on:click="count++">Increment</button>
    <span x-text="count"></span>
</div>
```

See all these 'x-' attributes in the HTML markup?
Those are the Alpine directives.
Our counter will look like this:

<div x-data="{ count: 0 }" class="border rounded p-4">
    <button x-on:click="count++" class="bg-slate-200 text-slate-900 border border-gray-400 rounded p-2">Increment</button>
    <span x-text="count"></span>
</div>

Again, it may be wierd at first not having your Javascript in a separate file or inside a `<script>` tag, but after having worked with it for a while I love having markup, style and behaviour all in one HTML file.

## Hosting via GitHub and Netlify

All the code that drives this website is entirely open source on GitHub at [julianprester/website](https://github.com/julianprester/website).
Go check it out and feel free to copy things for your own website if you like the idea of a simple, performant, free and low maintenance personal website.
Because static sites are so efficient to host, there are a bunch of hosting providers out there that host your static sites for free.
For example, I'm using [Netlify](https://www.netlify.com/) to host this website.
Netlify enables direct deployment via a GitHub repository, ensuring version control and efficient code management.
That means whenever I push an update to GitHub, Netlify instantly rebuilds my website and deploys it.
While I use only a fraction of its features, these hosting providers actually offer many more advanced perks like form handling, A/B testing, pull request previews, and more.

On top of that, since everything is kept on GitHub, I can use GitHub Actions to automate things.
For example, as you might have seen, I'm sharing interesting links I find on the Internet on the right side of this page.
Adding these links is super easy using GitHub actions.
My workflow looks like this:

1. I tend to consume short form content on my phone
2. When I come across something I think is worth reading I save the link to my [wallabag](https://www.wallabag.it/en) bookmarking service.
3. I later read the post or article, and when I think it's worth sharing, I share with my [Gotify](https://gotify.net/) app, including a short comment
4. A GitHub action which you can find [here](https://github.com/julianprester/website/blob/main/.github/workflows/links.yml) automatically checks my Gotify every 24 hours for new links, turns them to a markdown file, pushes them to GitHub, and voila, Netlify automatically deploys a refreshed webpage

This may sound quite complicated and you might not know about all the services that I referenced here, but once set up this is an extremely efficient workflow for me.
Have a look at this services.
I really use them all the time.
I might also write separate posts about them and how I use them in the future.

## RSS for Content Distribution

Wondered what all these radio icons on this website are about?
RSS, or Really Simple Syndication, is a web feed that allows users to access updates to online content in a standardized, computer-readable format.
It's an older technology standard from the early internet days that often goes unnoticed in today's social-media-dominated landscape.
But that's exactly why I think it is important to keep it alive.
In fact, even though few people are aware of it, RSS is very much alive in the podcasting world.
Most podcasts still notify their listeners about new episodes via RSS.
Although it might seem like a remnant of the old internet, it holds significant utility for content syndication.
I'm using RSS in the context of this website to syndicate new articles and updates directly to people's feed readers.
Eleventy creates the RSS feed for me automatically.
I construct individual RSS feeds for various content types; be they general blog posts, book reviews, or links.
I don't know whether there is anyone that has subscribed to the feeds, but that's kind of what makes it appealing to me.
I might even implement more advanced content syndication strategies later on using the RSS feeds that could share my updates to social media.

So, there you go!
That's a quick tour behind the scenes of this website, revealing the design principles and technology behind its very existence.
Hopefully, it provided an understanding of how this website evolved and how it functions behind the front-end you see in your browser.
