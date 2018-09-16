import { logScriptMessage } from '../utils'

process.env.SCRIPT_WATCH = 'true'

logScriptMessage('START')

require('./build')
