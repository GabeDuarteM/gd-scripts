import path from 'path'
import spawn from 'cross-spawn'
import glob from 'glob'
import { SpawnSyncReturns } from 'child_process'
import chalk from 'chalk'

import { isGdScripts } from './utils'

const [processExecutor, ignoredBin, script, ...args] = process.argv

const executor = isGdScripts() ? 'ts-node' : processExecutor

const handleSignal = (result: SpawnSyncReturns<Buffer>) => {
  if (result.signal === 'SIGKILL') {
    // eslint-disable-next-line no-console
    console.log(
      `The script "${script}" failed because the process exited too early. ` +
        'This probably means the system ran out of memory or someone called ' +
        '`kill -9` on the process.',
    )
  } else if (result.signal === 'SIGTERM') {
    // eslint-disable-next-line no-console
    console.log(
      `The script "${script}" failed because the process exited too early. ` +
        'Someone might have called `kill` or `killall`, or the system could ' +
        'be shutting down.',
    )
  }
  process.exit(1)
}

const attemptResolve = (...resolveArgs: string[]) => {
  try {
    return (require.resolve as any)(...resolveArgs)
  } catch (error) {
    return null
  }
}

const getNodeEnv: () => 'test' | 'development' | 'production' = () => {
  switch (script) {
    case 'test':
      return 'test'
    case 'build':
      return 'production'
    default:
      return 'development'
  }
}

// this is required to address an issue in cross-spawn
// https://github.com/kentcdodds/kcd-scripts/issues/4
const getEnv = () =>
  Object.keys(process.env)
    .filter(key => process.env[key] !== undefined)
    .reduce(
      (envCopy, key) => {
        envCopy[key] = process.env[key] as any

        return envCopy
      },
      {
        [`SCRIPTS_${script.toUpperCase()}`]: true.toString(),
        NODE_ENV: getNodeEnv(),
      },
    )

const spawnScript = () => {
  const relativeScriptPath = path.join(__dirname, './scripts', script)
  const scriptPath = attemptResolve(relativeScriptPath)

  if (!scriptPath) {
    throw new Error(`Unknown script "${script}".`)
  }
  const result = spawn.sync(executor, [scriptPath, ...args], {
    stdio: 'inherit',
    env: getEnv(),
  })

  if (result.signal) {
    handleSignal(result)
  } else {
    process.exit(result.status)
  }
}

if (script) {
  spawnScript()
} else {
  const scriptsPath = path.join(__dirname, 'scripts/')
  const scriptsAvailable = glob.sync(path.join(__dirname, 'scripts', '*'))
  // `glob.sync` returns paths with unix style path separators even on Windows.
  // So we normalize it before attempting to strip out the scripts path.
  const scriptsAvailableMessage = scriptsAvailable
    .map(path.normalize)
    .filter(x => !(x.endsWith('.map') || x.endsWith('.d.ts')))
    .map(s =>
      s
        .replace(scriptsPath, '')
        .replace(/__tests__/, '')
        .replace(/\.(t|j)s$/, ''),
    )
    .filter(Boolean)
    .filter(x => x !== 'hidden-scripts')
    .join('\n  ')
    .trim()
  const fullMessage = `
${chalk.cyan('Usage')}: 
  ${ignoredBin} [script] [--flags]

${chalk.cyan('Available Scripts')}:
  ${scriptsAvailableMessage}

${chalk.cyan('Options')}:
  All options depend on the script. Docs will be improved eventually, 
  but for most scripts you can assume that the args you pass will be 
  forwarded to the respective tool that's being run under the hood.

${chalk.green('May the force be with you')}.
  `.trim()
  console.log(`\n${fullMessage}\n`) // eslint-disable-line no-console
}
