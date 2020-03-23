const spawn = require('cross-spawn')
const { resolveBin, logScriptMessage } = require('../utils')

logScriptMessage('TYPECHECK')

const result = spawn.sync(
  resolveBin('typescript', { executable: 'tsc' }),
  ['--noEmit'],
  {
    stdio: 'inherit',
  },
)

process.exit(result.status)
