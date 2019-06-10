import spawn from 'cross-spawn'
import chalk from 'chalk'

import {
  hasTests,
  isGdScripts,
  resolveBin,
  logScriptMessage,
  hasFile,
} from '../utils'

process.env.SCRIPT_CI = 'true'

const unnecessaryArgumentsCount = 2

const args = process.argv.slice(unnecessaryArgumentsCount)

const gdScripts = isGdScripts()
const executor = gdScripts ? 'babel-node' : 'gd-scripts'
const getArgsSpawn = (script) =>
  gdScripts ? ['src', script, ...args] : [script, ...args]
const isTypescript = hasFile('tsconfig.json')

logScriptMessage('CI')

const resultLint = spawn.sync(resolveBin(executor), [...getArgsSpawn('lint')], {
  stdio: 'inherit',
})

const packageHasTests = hasTests()
let resultTypecheck = { status: 0 }
let resultTest = { status: 0 }
if (isTypescript) {
  resultTypecheck = spawn.sync(
    resolveBin(executor),
    [...getArgsSpawn('typecheck')],
    {
      stdio: 'inherit',
    },
  )
}
if (packageHasTests) {
  resultTest = spawn.sync(resolveBin(executor), [...getArgsSpawn('test')], {
    stdio: 'inherit',
  })
}
const resultBuild = spawn.sync(
  resolveBin(executor),
  [...getArgsSpawn('build')],
  {
    stdio: 'inherit',
  },
)

const finalResult = Math.max(
  resultLint.status,
  resultTest.status,
  resultTypecheck.status,
  resultBuild.status,
)

console.log(`\n${chalk.cyan('CI RESULTS:')}`)

const logStatus = (script, status) => {
  console.log(
    `${script}${status === 0 ? chalk.green('SUCCESS') : chalk.red('ERROR')}`,
  )
}

console.log()
logStatus('Lint\t   ', resultLint.status)
if (isTypescript) {
  logStatus('Typecheck  ', resultTypecheck.status)
}
if (packageHasTests) {
  logStatus('Test\t   ', resultTest.status)
}
logStatus('Build\t   ', resultBuild.status)
console.log()

process.exit(finalResult)
