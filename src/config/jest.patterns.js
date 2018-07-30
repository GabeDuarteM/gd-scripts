const testMatch = [
  "**/*.test.ts",
  "**/*.test.js",
  "**/*.test.tsx",
  "**/*.test.jsx",
]
const testIgnores = [
  "node_modules/",
  "fixtures/",
  "__tests__/helpers/",
  "__mocks__",
]

module.exports = {
  testMatch,
  testIgnores,
}
