---
tags: links
layout: links
pagination:
  data: links
  size: 1
  alias: link
permalink: "links/{{ link.date | date: '%Y' }}/{{ link.title | slugify }}/"
eleventyExcludeFromCollections: true
---

[{{ link.title }}]({{ link.url }}). {{ link.comment }}

_Posted {{ link.date | date: '%d %b %Y' }}_