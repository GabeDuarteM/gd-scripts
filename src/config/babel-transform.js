// @ts-check

const babelJest = require('babel-jest') // eslint-disable-line import/no-extraneous-dependencies

module.exports = babelJest.createTransformer({
  presets: [require.resolve('./babelrc')],
})
