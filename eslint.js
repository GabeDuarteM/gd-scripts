// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getEslintConfigPath } = require('./dist/utils')

module.exports = require(getEslintConfigPath())
