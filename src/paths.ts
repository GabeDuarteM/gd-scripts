import { join } from 'path'

import { fromRoot } from './utils'

const paths = {
  html: fromRoot(join('public', 'index.html')),
  js: fromRoot(join('src', 'index.js')),
  ts: fromRoot(join('src', 'index.tsx')),
  output: fromRoot('dist'),
  public: fromRoot('public'),
}

export default paths
