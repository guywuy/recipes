import { minify } from 'html-minifier'

export default function (content, outputPath) {
  if (outputPath && outputPath.endsWith('.html')) {
    let minified = minify(content, {
      useShortDoctags: true,
      removeComments: true,
      collapseWhitespace: true,
    })
    return minified
  }

  return content
}
