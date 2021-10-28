const htmlMinTransform = require('./utils/transforms/htmlmin.js')
const contentParser = require('./utils/transforms/contentParser.js')
const fs = require('fs')
let markdownIt = require('markdown-it')
const swBuild = require('./worker-builder.js')

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
    './static': '.',
  })
  eleventyConfig.addPassthroughCopy(`./src/assets/css/recipe-theme.css`)
  eleventyConfig.addPassthroughCopy({
    bundle: 'assets',
  })

  /**
   * Add custom collections
   *
   * @link https://www.11ty.dev/docs/collections/#collection-api-methods
   */
  eleventyConfig.addCollection('recipes', function (collectionApi) {
    return collectionApi
      .getAllSorted()
      .filter((i) => {
        return i.data.layout == 'recipe'
      })
      .sort((a, b) => a.data.title.localeCompare(b.data.title))
  })

  eleventyConfig.addCollection('tagList', function (collectionApi) {
    let tagSet = new Set()
    collectionApi.getAllSorted().forEach(function (item) {
      if ('tags' in item.data) {
        let tags = item.data.tags

        tags = tags.filter(function (item) {
          switch (item) {
            // this list should match the `filter` list in tags.njk
            case 'all':
            case 'nav':
            case 'post':
            case 'posts':
              return false
          }

          return true
        })

        for (const tag of tags) {
          tagSet.add(tag)
        }
      }
    })

    // returning an array in addCollection works in Eleventy 0.5.3
    return [...tagSet]
  })

  eleventyConfig.addCollection('ingredientList', function (collectionApi) {
    let ingredientSet = new Set()
    collectionApi.getAll().forEach(function (item) {
      if ('ingredients' in item.data) {
        let ingredients = item.data.ingredients
        for (const ingredient of ingredients) {
          ingredientSet.add(ingredient)
        }
      }
    })

    return [...ingredientSet].sort()
  })

  eleventyConfig.addCollection('dietTypeList', function (collectionApi) {
    let dietTypeSet = new Set()
    collectionApi.getAll().forEach(function (item) {
      if ('diettype' in item.data) {
        let dietType = item.data.diettype
        dietTypeSet.add(dietType)
      }
    })

    return [...dietTypeSet].sort()
  })

  /**
   * Add shortcodes
   *
   * @link https://www.11ty.io/docs/shortcodes/
   */
  eleventyConfig.addShortcode('editable', function (defaultAmount) {
    return `<span class="editable-amount" :class="{ 'editable-amount--editing': isEditing }">
<strong x-on:click="enableEditing()" x-text="format\( ${defaultAmount} \)" class="editable-amount__amount" :class="{ highlight: isEditing}">${defaultAmount}</strong>
</span>`
  })

  eleventyConfig.addShortcode('controlled', function (defaultAmount) {
    return `<strong x-text="format(${defaultAmount})" :class="{ 'highlight': isEditing }">${defaultAmount}</strong>`
  })

  eleventyConfig.addShortcode(
    'tooltip',
    function (ingredient, defaultAmount, unit) {
      return `<button class="tooltipped">${ingredient} <span class="tooltip" x-text="format(${defaultAmount}, '${unit}')"></span></button>`
    }
  )

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
   *
   */

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
  eleventyConfig.setUseGitIgnore(false)

  let options = {
    html: true,
  }
  let markdownLib = markdownIt(options).disable('code')
  eleventyConfig.setLibrary('md', markdownLib)

  // Generate Service Worker after build
  eleventyConfig.on('afterBuild', () => {
    const options = {};
    swBuild(options, siteConfig.paths.output).then((res) => console.log(res))
  })

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
