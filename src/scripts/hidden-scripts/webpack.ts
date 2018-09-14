import webpack from "webpack"
import WebpackDevServer, { Configuration } from "webpack-dev-server"
import { join } from "path"

import webpackConfigDev from "../../config/webpack.config.dev"
import webpackConfigProd from "../../config/webpack.config.prod"
import { fromRoot, checkRequiredFiles, RequiredFilesFailed } from "../../utils"

const protocol = process.env.HTTPS === "true" ? "https" : "http"
const paths = {
  html: fromRoot(join("public", "index.html")),
  js: fromRoot(join("src", "index.js")),
  ts: fromRoot(join("src", "index.tsx")),
}
const files = [paths.html, paths.js, paths.ts]

const checkedFiles = files.map(file => checkRequiredFiles(file))
const failedCheckedFiles = checkedFiles.filter(
  x => x.success === false,
) as RequiredFilesFailed[]

if (failedCheckedFiles) {
  let shouldFail = false
  const failedHtml = failedCheckedFiles.find(x => x.fileName === "index.html")
  const failedJs = failedCheckedFiles.find(x => x.fileName === "index.js")
  const failedTs = failedCheckedFiles.find(x => x.fileName === "index.tsx")

  if (failedHtml || (failedJs && failedTs)) {
    const failMessage = failedHtml
      ? failedHtml.message
      : (failedTs as RequiredFilesFailed).message
    console.log(failMessage)
    shouldFail = true
  }

  if (shouldFail) {
    process.exit(1)
  }
}

const config =
  process.env.NODE_ENV === "production" ? webpackConfigProd : webpackConfigDev

const compiler = webpack(config)
const devServerOptions: Configuration = {
  // Enable gzip compression of generated files.
  compress: true,
  // By default WebpackDevServer serves physical files from current directory
  // in addition to all the virtual build products that it serves from memory.
  // This is confusing because those files won’t automatically be available in
  // production build folder unless we copy them. However, copying the whole
  // project directory is dangerous because we may expose sensitive files.
  // Instead, we establish a convention that only files in `public` directory
  // get served. Our build script will copy `public` into the `build` folder.
  // In `index.html`, you can get URL of `public` folder with %PUBLIC_URL%:
  // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
  // In JavaScript code, you can access it with `process.env.PUBLIC_URL`.
  // Note that we only recommend to use `public` folder as an escape hatch
  // for files like `favicon.ico`, `manifest.json`, and libraries that are
  // for some reason broken when imported through Webpack. If you just want to
  // use an image, put it in `src` and `import` it from JavaScript instead.
  contentBase: fromRoot("public"),
  // By default files from `contentBase` will not trigger a page reload.
  watchContentBase: true,
  // Enable hot reloading server. It will provide /sockjs-node/ endpoint
  // for the WebpackDevServer client so it can learn when the files were
  // updated. The WebpackDevServer client is included as an entry point
  // in the Webpack development configuration. Note that only changes
  // to CSS are currently hot reloaded. JS changes will refresh the browser.
  hot: true,
  // It is important to tell WebpackDevServer to use the same "root" path
  // as we specified in the config. In development, we always serve from /.
  publicPath: (config.output as webpack.Output).publicPath,
  // Enable HTTPS if the HTTPS environment variable is set to 'true'
  https: protocol === "https",
  host: "0.0.0.0",
  overlay: true,
  historyApiFallback: {
    // Paths with dots should still use the history fallback.
    // See https://github.com/facebook/create-react-app/issues/387.
    disableDotRule: true,
  },
}
const server = new WebpackDevServer(compiler, devServerOptions)

const PORT = parseInt(process.env.PORT as any, 10) || 3000

server.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Starting server on http://localhost:${PORT}`)
})
