import { logScriptMessage, ifAnyDep } from '../utils'

process.env.SCRIPT_WATCH = 'true'

logScriptMessage('START')

const isReact = ifAnyDep('react', true, false)

if (isReact) {
  require('./hidden-scripts/webpack')
} else {
  require('./build')
}
