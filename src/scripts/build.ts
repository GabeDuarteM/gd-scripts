import { ifAnyDep } from '../utils'

const isReact = ifAnyDep('react', true, false)

if (isReact) {
  require('./hidden-scripts/webpack')
} else {
  require('./hidden-scripts/build')
}
