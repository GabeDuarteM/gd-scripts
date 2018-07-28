module.exports = {
  babel: require("./babelrc"),
  eslint: require("./eslintrc"),
  prettier: require("./prettierrc"),
  getRollupConfig: () => require("./rollup.config"),
}
