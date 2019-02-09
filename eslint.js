// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getEslintConfigPath } = require('./src/utils')

module.exports = require(getEslintConfigPath())
