---
tags: news
layout: base
pagination:
  data: news
  size: 1
  alias: news
permalink: "news/{{ news.title | slugify }}/"
---

{{ news.date | monthYearDateFromISO }} - {{ news.content }}