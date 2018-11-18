// @ts-check
const semver = require('semver')

const { ifAnyDep, pkg } = require('../utils')

const getNodeVersion = ({ engines: { node: nodeVersion = '8' } = {} }) => {
  const oldestVersion = semver
    .validRange(nodeVersion)
    .replace(/[>=<|]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .sort(semver.compare)[0]
  if (!oldestVersion) {
    throw new Error(
      `Unable to determine the oldest version in the range in your package.json at engines.node: "${nodeVersion}". Please attempt to make it less ambiguous.`,
    )
  }
  return oldestVersion
}

const isTest = (process.env.BABEL_ENV || process.env.NODE_ENV) === 'test'
const isReact = ifAnyDep('react', true, false)

const envTargets = isTest
  ? { node: 'current' }
  : !isReact
  ? { node: getNodeVersion(pkg) }
  : undefined
const envOptions = { modules: false, loose: true, targets: envTargets }

module.exports = () => ({
  presets: [
    require.resolve('@babel/preset-typescript'),
    isReact && require.resolve('@babel/preset-react'),
    [require.resolve('@babel/preset-env'), envOptions],
  ].filter(Boolean),
  plugins: [
    require.resolve('babel-plugin-macros'),
    [
      require.resolve('@babel/plugin-proposal-class-properties'),
      { loose: true },
    ],
    [
      require.resolve('@babel/plugin-proposal-object-rest-spread'),
      { loose: true },
    ],
    require.resolve('babel-plugin-minify-dead-code-elimination'),
    [
      require.resolve('@babel/plugin-transform-modules-commonjs'),
      { loose: true },
    ],
  ],
})
