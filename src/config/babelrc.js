// @ts-check

const isTest = (process.env.BABEL_ENV || process.env.NODE_ENV) === "test"

const envTargets = isTest ? { node: "current" } : { node: "8" }
const envOptions = { modules: false, loose: true, targets: envTargets }

module.exports = () => ({
  presets: [
    require.resolve("@babel/preset-typescript"),
    [require.resolve("@babel/preset-env"), envOptions],
  ],
  plugins: [
    [
      require.resolve("@babel/plugin-proposal-class-properties"),
      { loose: true },
    ],
    [
      require.resolve("@babel/plugin-proposal-object-rest-spread"),
      { loose: true },
    ],
    require.resolve("babel-plugin-minify-dead-code-elimination"),
    [
      require.resolve("@babel/plugin-transform-modules-commonjs"),
      { loose: true },
    ],
  ],
})
