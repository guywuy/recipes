const htmlMinTransform = require('./utils/transforms/htmlmin.js')
const contentParser = require('./utils/transforms/contentParser.js')
const pwaPlugin = require('eleventy-plugin-pwa')
const fs = require('fs')

/**
 * Import site configuration
 */
const siteConfig = require('./src/_data/config.json')

module.exports = function (eleventyConfig) {
  /**
   * Add custom watch targets
   *
   * @link https://www.11ty.dev/docs/config/#add-your-own-watch-targets
   */
  eleventyConfig.addWatchTarget('./bundle/')

  /**
   * Passthrough file copy
   *
   * @link https://www.11ty.io/docs/copy/
   */
  eleventyConfig.addPassthroughCopy({
    './static': '.'
  })
  eleventyConfig.addPassthroughCopy(`./src/assets/css/recipe-theme.css`)
  eleventyConfig.addPassthroughCopy({
    bundle: 'assets'
  })

  /**
   * Add filters
   *
   * @link https://www.11ty.io/docs/filters/
   */

   
  /**
   * Add Transforms
   *
   * @link https://www.11ty.io/docs/config/#transforms
   */
  if (process.env.ELEVENTY_ENV === 'production') {
    // Minify HTML when building for production
    eleventyConfig.addTransform('htmlmin', htmlMinTransform)
  }
  // Parse the page HTML content and perform some manipulation
  eleventyConfig.addTransform('contentParser', contentParser)

  /**
   * Add Plugins
   * @link https://github.com/okitavera/eleventy-plugin-pwa
   */
  eleventyConfig.addPlugin(pwaPlugin)


  /**
   * Override BrowserSync Server options
   *
   * @link https://www.11ty.dev/docs/config/#override-browsersync-server-options
   */
  eleventyConfig.setBrowserSyncConfig({
    notify: false,
    open: true,
    snippetOptions: {
      rule: {
        match: /<\/head>/i,
        fn: function (snippet, match) {
          return snippet + match
        },
      },
    },
    // Set local server 404 fallback
    callbacks: {
      ready: function (err, browserSync) {
        const content_404 = fs.readFileSync('dist/404.html')

        browserSync.addMiddleware('*', (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404)
          res.end()
        })
      },
    },
  })

  /*
   * Disable use gitignore for avoiding ignoring of /bundle folder during watch
   * https://www.11ty.dev/docs/ignores/#opt-out-of-using-.gitignore
   */
  eleventyConfig.setUseGitIgnore(false);

  /**
   * Eleventy configuration object
   */
  return {
    dir: {
      input: siteConfig.paths.src,
      includes: siteConfig.paths.includes,
      layouts: `${siteConfig.paths.includes}/layouts`,
      output: siteConfig.paths.output,
    },
    passthroughFileCopy: true,
    templateFormats: ['njk', 'md'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  }
}
