// @ts-check

const browserslist = require("browserslist")
const arrify = require("arrify")
const has = require("lodash.has")
const fs = require("fs")
const readPkgUp = require("read-pkg-up")
const path = require("path")

// @TODO Stop duplicating those utils. Start babel through node instead
// of the cli
const { pkg, path: pkgPath } = readPkgUp.sync({
  cwd: fs.realpathSync(process.cwd()),
})
const appDirectory = path.dirname(pkgPath)
const envIsSet = name => {
  return (
    process.env.hasOwnProperty(name) &&
    process.env[name] &&
    process.env[name] !== "undefined"
  )
}
const parseEnv = (name, def) => {
  if (envIsSet(name)) {
    try {
      return JSON.parse(process.env[name])
    } catch (err) {
      return process.env[name]
    }
  }
  return def
}
const hasPkgProp = props => arrify(props).some(prop => has(pkg, prop))
const hasPkgSubProp = pkgProp => props =>
  hasPkgProp(arrify(props).map(p => `${pkgProp}.${p}`))
const hasPeerDep = hasPkgSubProp("peerDependencies")
const hasDep = hasPkgSubProp("dependencies")
const hasDevDep = hasPkgSubProp("devDependencies")
const hasAnyDep = args => [hasDep, hasDevDep, hasPeerDep].some(fn => fn(args))
const ifAnyDep = (deps, t, f) => (hasAnyDep(arrify(deps)) ? t : f)

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
