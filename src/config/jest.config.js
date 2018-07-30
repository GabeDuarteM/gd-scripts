const path = require("path")
const { ifAnyDep, hasFile, hasPkgProp } = require("../utils")

const here = p => path.join(__dirname, p)

const useBuiltInBabelConfig = !hasFile(".babelrc") && !hasPkgProp("babel")

const ignores = [
  "/node_modules/",
  "/fixtures/",
  "/__tests__/helpers/",
  "__mocks__",
]

const jestConfig = {
  testEnvironment: ifAnyDep(["webpack", "rollup", "react"], "jsdom", "node"),
  moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx"],
  collectCoverageFrom: ["src/**/*.+(js|jsx|ts|tsx)"],
  testMatch: ["**/*.test.ts", "**/*.test.js", "**/*.test.tsx", "**/*.test.jsx"],
  testPathIgnorePatterns: [...ignores],
  coveragePathIgnorePatterns: [...ignores, "src/(umd|cjs|esm)-entry.js$"],
  transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$"],
}

if (useBuiltInBabelConfig) {
  jestConfig.transform = { "^.+\\.(j|t)sx?$": here("./babel-transform") }
}

module.exports = jestConfig
