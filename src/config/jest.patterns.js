// @ts-check

const testMatch = ['**/*.test.ts', '**/*.test.tsx', '**/*.test.js']
const testIgnores = [
  'node_modules/',
  '<rootDir>/fixtures/',
  '__tests__/helpers/',
  '__mocks__',
]

module.exports = {
  testMatch,
  testIgnores,
}
