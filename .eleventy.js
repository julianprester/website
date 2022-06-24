const { DateTime } = require("luxon");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const eleventyImagePlugin = require("@11ty/eleventy-img");

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

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("formatDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toFormat('LLLL yyyy');
  });

  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

  eleventyConfig.setBrowserSyncConfig({
    snippetOptions: {
      rule: {
        match: /<\/body>/i,
        fn: function (snippet, match) {
          return snippet + match;
        }
      }
    }
  });
  eleventyConfig.addPassthroughCopy('src/assets/favicon');
  eleventyConfig.addPassthroughCopy('src/assets/cv');
  eleventyConfig.addPassthroughCopy('src/robots.txt');
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