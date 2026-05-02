---
layout: news
tags: news
pagination:
  data: news
  size: 1
  alias: news
permalink: "news/{{ news.date | date: '%Y' }}/{{ news.title | slugify }}/"
eleventyExcludeFromCollections: true
---

{{ news.content }}

_Posted on <time datetime="{{ news.date }}">{{ news.date | date: '%d %b %Y' }}</time>_