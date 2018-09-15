import webpack, { Stats } from "webpack"
import WebpackDevServer from "webpack-dev-server"
import { join } from "path"
import { emptyDirSync, copySync, writeFile } from "fs-extra"
import chalk from "chalk"
import formatWebpackMessages from "react-dev-utils/formatWebpackMessages"
import printHostingInstructions from "react-dev-utils/printHostingInstructions"
import FileSizeReporter from "react-dev-utils/FileSizeReporter"
import printBuildError from "react-dev-utils/printBuildError"
import { printBrowsers, checkBrowsers } from "react-dev-utils/browsersHelper"
import {
  choosePort,
  createCompiler,
  prepareProxy,
  prepareUrls,
} from "react-dev-utils/WebpackDevServerUtils"
import clearConsole from "react-dev-utils/clearConsole"

import webpackConfigDev from "../../config/webpack.config.dev"
import webpackConfigProd from "../../config/webpack.config.prod"
import createDevServerConfig from "../../config/webpackDevServer.config"
import {
  checkRequiredFiles,
  RequiredFilesFailed,
  pkg,
  appDirectory,
} from "../../utils"
import paths from "../../paths"

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
// Process CLI arguments
const argv = process.argv.slice(2)
const writeStatsJson = argv.indexOf("--stats") !== -1

const config =
  process.env.NODE_ENV === "production" ? webpackConfigProd : webpackConfigDev

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

  const createBundleStats = (bundleStats: string) =>
    new Promise((resolve, reject) => {
      writeFile(join(paths.output, "bundle-stats.json"), bundleStats, err => {
        if (err) {
          reject(err)
          return
        }

        resolve()
        return
      })
    })

  const build = (): Promise<BuildReturn> => {
    console.log("Creating an optimized production build...")
    console.log()

    return new Promise((resolve, reject) => {
      const compiler = webpack(config)
      compiler.run(async (err, stats) => {
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

        if (writeStatsJson) {
          await createBundleStats(JSON.stringify(stats.toJson()))
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
  ;(async () => {
    try {
      const DEFAULT_PORT = parseInt(process.env.PORT as any, 10) || 3000
      const HOST = process.env.HOST || "0.0.0.0"

      const isInteractive =
        process.env.NO_INTERACTIVE === "true" ? false : process.stdout.isTTY

      await checkBrowsers(appDirectory)
      const port = await choosePort("0.0.0.0", DEFAULT_PORT)
      if (port === null) {
        // We have not found a port.
        return
      }

      const protocol = process.env.HTTPS === "true" ? "https" : "http"
      const appName = pkg.name
      const urls = prepareUrls(protocol, HOST, port)
      const compiler = createCompiler(webpack, config, appName, urls, false)

      // Load proxy config
      const proxySetting = pkg.proxy
      const proxyConfig = prepareProxy(proxySetting, paths.public)
      // Serve webpack assets generated by the compiler over a web server.
      const serverConfig = createDevServerConfig(
        proxyConfig,
        urls.lanUrlForConfig,
      )

      const devServer = new WebpackDevServer(compiler, serverConfig)
      // Launch WebpackDevServer.
      devServer.listen(port, HOST, err => {
        if (err) {
          console.log(err)
          return
        }
        if (isInteractive) {
          clearConsole()
        }
        console.log(chalk.cyan("Starting the development server...\n"))
      })
      ;["SIGINT", "SIGTERM"].forEach(sig => {
        process.on(sig as any, () => {
          devServer.close()
          process.exit()
        })
      })
    } catch (err) {
      if (err && err.message) {
        console.log(err.message)
      }
      process.exit(1)
    }
  })()
}
