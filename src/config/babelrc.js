// @ts-check

const browserslist = require("browserslist")

const { parseEnv, appDirectory, ifAnyDep } = require("../utils")

const isTest = (process.env.BABEL_ENV || process.env.NODE_ENV) === "test"
const isRollup = parseEnv("BUILD_ROLLUP", false)
const isUMD = process.env.BUILD_FORMAT === "umd"
const isWebpack = parseEnv("BUILD_WEBPACK", false)
const treeshake = parseEnv("BUILD_TREESHAKE", isRollup || isWebpack)

/**
 * use the strategy declared by browserslist to load browsers configuration.
 * fallback to the default if don't found custom configuration
 * @see https://github.com/browserslist/browserslist/blob/master/node.js#L139
 */
const browsersConfig = browserslist.loadConfig({ path: appDirectory }) || [
  "ie 10",
  "ios 7",
]

const envTargets = isTest
  ? { node: "current" }
  : isWebpack || isRollup
    ? { browsers: browsersConfig }
    : { node: "4.5" }
const envOptions = { modules: false, loose: true, targets: envTargets }

module.exports = () => ({
  presets: [
    require.resolve("@babel/preset-typescript"),
    [require.resolve("@babel/preset-env"), envOptions],
    ifAnyDep(["react"], require.resolve("@babel/preset-react")),
  ].filter(Boolean),
  plugins: [
    isRollup ? require.resolve("@babel/plugin-external-helpers") : null,
    isUMD
      ? require.resolve("babel-plugin-transform-inline-environment-variables")
      : null,
    [
      require.resolve("@babel/plugin-proposal-class-properties"),
      { loose: true },
    ],
    [
      require.resolve("@babel/plugin-proposal-object-rest-spread"),
      { loose: true },
    ],
    require.resolve("babel-plugin-minify-dead-code-elimination"),
    treeshake
      ? null
      : [
          require.resolve("@babel/plugin-transform-modules-commonjs"),
          { loose: true },
        ],
  ].filter(Boolean),
})
