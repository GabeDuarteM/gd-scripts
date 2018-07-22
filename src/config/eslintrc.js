module.exports = {
  extends: ["plugin:prettier/recommended"],
  parser: "typescript-eslint-parser",
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 6,
  },
  plugins: ["typescript"],
  rules: {
    "typescript/no-explicit-any": "error",
  },
}
