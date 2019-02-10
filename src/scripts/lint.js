import spawn from 'cross-spawn'
import yargsParser from 'yargs-parser'

import {
  hasPkgProp,
  resolveBin,
  hasFile,
  logScriptMessage,
  getEslintConfigPath,
} from '../utils'

const unnecessaryArgumentsCount = 2

let args = process.argv.slice(unnecessaryArgumentsCount)
const parsedArgs = yargsParser(args)

const useBuiltinConfig =
  !args.includes('--config') &&
  !hasFile('.eslintrc') &&
  !hasFile('.eslintrc.js') &&
  !hasPkgProp('eslintConfig')

const useBuiltinIgnore =
  !args.includes('--ignore-path') &&
  !hasFile('.eslintignore') &&
  !hasPkgProp('eslintIgnore')

const ignore = useBuiltinIgnore
  ? ['--ignore-path', require.resolve('gd-configs/eslint/ignore')]
  : []

const config = useBuiltinConfig
  ? ['--config', require.resolve(getEslintConfigPath())]
  : []

const cache = args.includes('--no-cache') ? [] : ['--cache']

const filesGiven = parsedArgs._.length > 0

const filesToApply = filesGiven ? [] : ['.']

const extensions = ['--ext', '.js,.ts,.tsx']

const cacheLocation = ['--cache-location', 'node_modules/.cache/.eslintcache']

const isLintable = (file) =>
  file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.tsx')

const isCi = !!process.env.SCRIPT_CI
const maxWarnings = isCi ? ['--max-warnings=0'] : []

if (filesGiven) {
  // we need to take all the flag-less arguments (the files that should be linted)
  // and filter out the ones that aren't js files. Otherwise json or css files
  // may be passed through
  args = args.filter((a) => !parsedArgs._.includes(a) || isLintable(a))
}

const lintArguments = [
  ...config,
  ...ignore,
  ...maxWarnings,
  ...extensions,
  ...cacheLocation,
  ...cache,
  ...args,
  ...filesToApply,
]

logScriptMessage('LINT')

const result = spawn.sync(resolveBin('eslint'), lintArguments, {
  stdio: 'inherit',
})

process.exit(result.status)
