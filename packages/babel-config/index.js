const semver = require('semver')
const readPkgUp = require('read-pkg-up')
const fs = require('fs')

const { packageJson } = readPkgUp.sync({
  cwd: fs.realpathSync(process.cwd()),
})

const getNodeVersion = ({ engines: { node: nodeVersion = '10' } = {} }) => {
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

const envTargets = isTest
  ? { node: 'current' }
  : { node: getNodeVersion(packageJson) }
const envOptions = { modules: false, loose: true, targets: envTargets }

module.exports = (api) => {
  api.cache(true)

  return {
    presets: ['@babel/preset-typescript', ['@babel/preset-env', envOptions]],
    plugins: [
      'babel-plugin-macros',
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      ['@babel/plugin-proposal-object-rest-spread', { loose: true }],
      'babel-plugin-minify-dead-code-elimination',
      ['@babel/plugin-transform-modules-commonjs', { loose: true }],
    ],
  }
}
