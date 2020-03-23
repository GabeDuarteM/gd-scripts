const isCI = require('is-ci')
const jestConfig = require('@gabrielduartem/jest-config')
// eslint-disable-next-line import/no-extraneous-dependencies
const jest = require('jest')
const { hasPkgProp, hasFile, logScriptMessage } = require('../utils')

process.env.BABEL_ENV = 'test'
process.env.NODE_ENV = 'test'

const unnecessaryArgumentsCount = 2

const args = process.argv.slice(unnecessaryArgumentsCount)
const isCiScript = process.env.SCRIPT_CI === 'true'

const watch =
  !isCI &&
  !isCiScript &&
  !args.includes('--no-watch') &&
  !args.includes('--coverage') &&
  !args.includes('--updateSnapshot')
    ? ['--watch']
    : []

const coverage = isCiScript ? ['--coverage'] : []

const config =
  !args.includes('--config') &&
  !hasFile('jest.config.js') &&
  !hasPkgProp('jest')
    ? ['--config', JSON.stringify(jestConfig)]
    : []

logScriptMessage('TEST')

jest.run([...config, ...watch, ...coverage, ...args])
