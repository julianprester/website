import { DateTime } from "luxon";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import eleventyImagePlugin from "@11ty/eleventy-img";
import eleventySyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginRss from "@11ty/eleventy-plugin-rss";
import markdownIt from "markdown-it";

async function imageShortcode(src, alt, sizes = "100vw") {
  if (alt === undefined) {
    // You bet we throw an error on missing alt (alt="" works okay)
    throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`);
  }

  let metadata = await eleventyImagePlugin(src, {
    widths: [300, 400, 500],
    formats: ['webp', 'jpeg'],
    urlPath: "/assets/cover/",
    outputDir: "./public/assets/cover/"
  });

  let lowsrc = metadata.jpeg[0];
  let highsrc = metadata.jpeg[metadata.jpeg.length - 1];

  return `<picture>
      ${Object.values(metadata).map(imageFormat => {
    return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`;
  }).join("\n")}
        <img
          src="${lowsrc.url}"
          width="${highsrc.width}"
          height="${highsrc.height}"
          class="rounded-lg shadow-lg"
          alt="${alt}"
          loading="lazy"
          decoding="async">
      </picture>`;
}

export default function (eleventyConfig) {
  eleventyConfig.addFilter("monthYearDateFromISO", (dateObj) => {
    return DateTime.fromISO(dateObj).toFormat('LLL yyyy');
  });

  eleventyConfig.addFilter("monthYearDateFromJSON", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toFormat('LLL yyyy');
  });

  eleventyConfig.addFilter("dayMonthYearDateFromISO", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toFormat('dd LLL yyyy');
  });

  eleventyConfig.addFilter("rawText", (content) => {
    return content.replace(/<\/?[^>]+(>|$)/g, "");
  });

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  eleventyConfig.setLibrary("md", markdownIt({
    html: true,
    typographer: true
  }));

  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(eleventySyntaxHighlight);
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addCollection("allNotes", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/writing/*.md");
  });

  eleventyConfig.addCollection("allWriting", function (collectionApi) {
    return collectionApi.getFilteredByGlob(["src/writing/*.md", "src/bookshelf/*.md"]);
  });

  eleventyConfig.addCollection("exceptLinks", function (collectionApi) {
    return collectionApi.getFilteredByGlob(["src/*.html", "src/writing/*.md", "src/bookshelf/*.md"]);
  });

  // Computed meta descriptions per page type
  eleventyConfig.addGlobalData("eleventyComputed", {
    description(data) {
      const url = data.page.url;
      const title = data.news?.title || data.title || "";
      const author = data.author || "";
      const fallback = "Julian Prester is a Senior Lecturer of Business Information Systems at The University of Sydney. Researching digital work, digital nomadism, and platform work.";

      if (url === '/') return fallback;
      if (url === '/research/') return "Julian Prester's research on digital work, digital nomadism, and platform work. Publications, conference papers, and presentations.";
      if (url === '/teaching/') return "Courses taught by Julian Prester — Data Visualisation, Managing Data at Scale, Business Intelligence, and more at the University of Sydney and UNSW.";
      if (url === '/writing/') return "Latest writing and ideas by Julian Prester on academia, technology, and digital work.";
      if (url === '/bookshelf/') return "Books that inform Julian Prester's research on digital work with personal reading notes and reviews.";
      if (url.startsWith('/bookshelf/') && url !== '/bookshelf/') return `${title}${author ? ` by ${author}` : ""} — book notes and review by Julian Prester`;
      if (url.startsWith('/writing/') && url !== '/writing/' && !url.startsWith('/tags/')) return `${title} — a post by Julian Prester on academia, technology, and digital work`;
      if (url.startsWith('/links/') && url !== '/links/' && !url.startsWith('/tags/')) return `${title} — a link shared by Julian Prester`;
      if (url.startsWith('/news/')) return `${title} — news from Julian Prester`;
      if (url.startsWith('/tags/')) return `Content tagged "${url.replace('/tags/', '').replace(/\/$/, '')}" on Julian Prester's website`;
      return fallback;
    }
  });

  eleventyConfig.addPassthroughCopy('src/assets/favicon');
  eleventyConfig.addPassthroughCopy('src/assets/cv');
  eleventyConfig.addPassthroughCopy('src/assets/pdf');
  eleventyConfig.addPassthroughCopy({
    './node_modules/alpinejs/dist/cdn.min.js': './js/alpine.js',
  });

  return {
    htmlTemplateEngine: "njk",
    dir: {
      input: 'src',
      output: 'public',
      layouts: 'layouts',
      includes: 'includes',
      data: 'data',
    }
  }
}