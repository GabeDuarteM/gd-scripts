const babelJest = require('babel-jest')

var a = 1

module.exports = babelJest.createTransformer({
  presets: [require.resolve('../babel')],
})
