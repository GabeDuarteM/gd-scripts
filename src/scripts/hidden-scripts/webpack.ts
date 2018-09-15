import webpack, { Stats } from "webpack"
import WebpackDevServer, { Configuration } from "webpack-dev-server"
import { join } from "path"
import formatWebpackMessages from "react-dev-utils/formatWebpackMessages"
import printHostingInstructions from "react-dev-utils/printHostingInstructions"
import FileSizeReporter from "react-dev-utils/FileSizeReporter"
import printBuildError from "react-dev-utils/printBuildError"
import { printBrowsers } from "react-dev-utils/browsersHelper"
import { emptyDirSync, copySync } from "fs-extra"
import chalk from "chalk"

import webpackConfigDev from "../../config/webpack.config.dev"
import webpackConfigProd from "../../config/webpack.config.prod"
import {
  fromRoot,
  checkRequiredFiles,
  RequiredFilesFailed,
  pkg,
  appDirectory,
} from "../../utils"

const paths = {
  html: fromRoot(join("public", "index.html")),
  js: fromRoot(join("src", "index.js")),
  ts: fromRoot(join("src", "index.tsx")),
  output: fromRoot("build"),
  public: fromRoot("public"),
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

if (process.env.SCRIPTS_BUILD) {
  const copyPublicFolder = () => {
    copySync(paths.public, paths.output, {
      dereference: true,
      filter: file => file !== paths.html,
    })
  }

  interface BuildReturn {
    stats: Stats
    warnings: string[]
  }

  const build = (): Promise<BuildReturn> => {
    console.log("Creating an optimized production build...")

    return new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err) {
          return reject(err)
        }

        const messages = formatWebpackMessages((stats as any).toJson({}, true))
        if (messages.errors.length) {
          // Only keep the first error. Others are often indicative
          // of the same problem, but confuse the reader with noise.
          if (messages.errors.length > 1) {
            messages.errors.length = 1
          }
          return reject(new Error(messages.errors.join("\n\n")))
        }

        if (
          process.env.CI &&
          (typeof process.env.CI !== "string" ||
            process.env.CI.toLowerCase() !== "false") &&
          messages.warnings.length
        ) {
          console.log(
            chalk.yellow(
              "\nTreating warnings as errors because process.env.CI = true.\n" +
                "Most CI servers set it automatically.\n",
            ),
          )
          return reject(new Error(messages.warnings.join("\n\n")))
        }

        const resolveArgs = {
          stats,
          warnings: messages.warnings,
        }

        return resolve(resolveArgs)
      })
    })
  }

  const measureFileSizesBeforeBuild =
    FileSizeReporter.measureFileSizesBeforeBuild

  const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild

  // These sizes are pretty large. We'll warn for bundles exceeding them.
  const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024
  const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024
  ;(async () => {
    try {
      // First, read the current file sizes in build directory.
      // This lets us display how much they changed later.
      const previousFileSizes = await measureFileSizesBeforeBuild(paths.output)
      // Remove all content but keep the directory so that
      // if you're in it, you don't end up in Trash
      emptyDirSync(paths.output)
      // Merge with the public folder
      copyPublicFolder()
      // Start the webpack build
      const { stats, warnings } = await build()
      try {
        if (warnings.length) {
          console.log(chalk.yellow("Compiled with warnings.\n"))
          console.log(warnings.join("\n\n"))
          console.log(
            // eslint-disable-next-line prefer-template
            "\nSearch for the " +
              chalk.underline(chalk.yellow("keywords")) +
              " to learn more about each warning.",
          )
          console.log(
            // eslint-disable-next-line prefer-template
            "To ignore, add " +
              chalk.cyan("// eslint-disable-next-line") +
              " to the line before.\n",
          )
        } else {
          console.log(chalk.green("Compiled successfully.\n"))
        }

        console.log("File sizes after gzip:\n")
        printFileSizesAfterBuild(
          stats,
          previousFileSizes,
          paths.output,
          WARN_AFTER_BUNDLE_GZIP_SIZE,
          WARN_AFTER_CHUNK_GZIP_SIZE,
        )
        console.log()

        const appPackage = pkg
        const publicUrl = "/"
        const publicPath = (config.output as webpack.Output).publicPath
        const buildFolder = paths.output
        printHostingInstructions(
          appPackage,
          publicUrl,
          publicPath,
          buildFolder,
          false,
        )
        printBrowsers(appDirectory)
      } catch (err) {
        console.log(chalk.red("Failed to compile.\n"))
        printBuildError(err)
        process.exit(1)
        return
      }
    } catch (err) {
      if (err && err.message) {
        console.log(err.message)
      }
      process.exit(1)
      return
    }
    process.exit(0)
  })()
} else {
  const protocol = process.env.HTTPS === "true" ? "https" : "http"

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
    contentBase: paths.public,
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
}
