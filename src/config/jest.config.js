const path = require("path")
const { testMatch, testIgnores } = require("./jest.patterns")
const { ifAnyDep, hasFile, hasPkgProp } = require("../utils")

const here = p => path.join(__dirname, p)

const useBuiltInBabelConfig = !hasFile(".babelrc") && !hasPkgProp("babel")

const jestConfig = {
  testEnvironment: ifAnyDep(["webpack", "rollup", "react"], "jsdom", "node"),
  moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx"],
  collectCoverageFrom: ["src/**/*.+(js|jsx|ts|tsx)"],
  testMatch,
  testPathIgnorePatterns: [...testIgnores],
  coveragePathIgnorePatterns: [...testIgnores, "src/(umd|cjs|esm)-entry.js$"],
  transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$"],
}

if (useBuiltInBabelConfig) {
  jestConfig.transform = { "^.+\\.(j|t)sx?$": here("./babel-transform") }
}

module.exports = jestConfig
