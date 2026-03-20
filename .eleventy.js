import htmlMinTransform from './utils/transforms/htmlmin.js'
import contentParser from './utils/transforms/contentParser.js'
import { readFileSync } from 'fs'
import markdownIt from 'markdown-it'
import swBuild from './worker-builder.js'

/**
 * Import site configuration
 */
const config = JSON.parse(readFileSync('./src/_data/config.json', 'utf8'))
const { paths } = config

export default function (eleventyConfig) {
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

  // When `permalink` is false, the file is not written to disk
  eleventyConfig.addGlobalData('eleventyComputed.permalink', function () {
    return (data) => {
      // Always skip during non-watch/serve builds
      if (data.draft && !process.env.BUILD_DRAFTS) {
        return false
      }

      return data.permalink
    }
  })

  // When `eleventyExcludeFromCollections` is true, the file is not included in any collections
  eleventyConfig.addGlobalData(
    'eleventyComputed.eleventyExcludeFromCollections',
    function () {
      return (data) => {
        // Always exclude from non-watch/serve builds
        if (data.draft && !process.env.BUILD_DRAFTS) {
          return true
        }

        return data.eleventyExcludeFromCollections
      }
    }
  )

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
    const options = {}
    swBuild(options, paths.output).then((res) => console.log(res))
  })

  /**
   * Eleventy configuration object
   */
  return {
    dir: {
      input: paths.src,
      includes: paths.includes,
      layouts: `${paths.includes}/layouts`,
      output: paths.output,
    },
    passthroughFileCopy: true,
    templateFormats: ['njk', 'md'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  }
}
