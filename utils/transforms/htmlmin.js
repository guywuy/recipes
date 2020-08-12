const htmlmin = require('html-minifier')

module.exports = function(content, outputPath) {
  if (outputPath.endsWith('.html')) {
    let minified = htmlmin.minify(content, {
      useShortDoctags: true,
      removeComments: true,
      collapseWhitespace: true,
      minifyCSS: true,
    })
    return minified
  }

  return content
}
