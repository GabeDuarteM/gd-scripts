import path from 'path'
import spawn from 'cross-spawn'
import rimraf from 'rimraf'
import {
  hasPkgProp,
  fromRoot,
  resolveBin,
  hasFile,
  logScriptMessage,
} from '../utils'
import paths from '../paths'

const unnecessaryArgumentsCount = 2

const args = process.argv.slice(unnecessaryArgumentsCount)
const here = (p: string) => path.join(__dirname, p)

const isWatching = process.env.SCRIPT_WATCH === 'true'

const useBuiltinConfig =
  !args.includes('--presets') && !hasFile('.babelrc') && !hasPkgProp('babel')
const config = useBuiltinConfig
  ? ['--presets', here('../config/babelrc.js')]
  : []

const ignore = args.includes('--ignore')
  ? []
  : [
      '--ignore',
      '**/*.test.js,**/*.test.ts,**/*.test.tsx,**/*.d.ts,__mocks__,@types',
    ]

const copyFiles = args.includes('--no-copy-files') ? [] : ['--copy-files']

const isTypescript = hasFile('tsconfig.json')

const useSpecifiedOutDir = args.includes('--out-dir')
const outDir = useSpecifiedOutDir ? [] : ['--out-dir', paths.output]

const extensions = ['--extensions', '.ts,.tsx,.js']

const sourceMaps = isWatching ? [] : ['-s']

const watch = isWatching ? ['-w'] : []

if (!isWatching) {
  logScriptMessage('BUILD')
}

if (!useSpecifiedOutDir && !args.includes('--no-clean')) {
  rimraf.sync(fromRoot(paths.output))
  // eslint-disable-next-line no-console
  console.log('Cleaned the build dir.')
}

const babelArguments = [
  ...outDir,
  ...copyFiles,
  ...ignore,
  ...config,
  ...extensions,
  'src',
  ...sourceMaps,
  ...watch,
  ...args,
]

const resultBabel = spawn.sync(
  resolveBin('@babel/cli', { executable: 'babel' }),
  babelArguments,
  { stdio: 'inherit' },
)

if (isTypescript && !isWatching) {
  spawn.sync(
    resolveBin('typescript', { executable: 'tsc' }),
    ['--emitDeclarationOnly'],
    { stdio: 'inherit' },
  )
  console.log('Typescript declarations emitted.')
}

// Exclude ignored files from the build dir
if (ignore.length > 0 && !isWatching) {
  const buildIgnore = ignore[1]
    .split(',')
    .filter(x => x !== '**/*.d.ts') // Do not exclude type definitions
    .map(x => `dist/${x}`)
    .join(',')

  rimraf.sync(`{${buildIgnore}}`)
}

process.exit(resultBabel.status)
