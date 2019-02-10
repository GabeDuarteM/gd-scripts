import spawn from 'cross-spawn'
import { resolveBin, logScriptMessage } from '../utils'

logScriptMessage('TYPECHECK')

const result = spawn.sync(
  resolveBin('typescript', { executable: 'tsc' }),
  ['--noEmit'],
  {
    stdio: 'inherit',
  },
)

process.exit(result.status)
