// @ts-check

const fs = require("fs")
const path = require("path")
const arrify = require("arrify")
const has = require("lodash.has")
const readPkgUp = require("read-pkg-up")
const which = require("which")
const glob = require("glob")
const chalk = require("chalk").default

const { testMatch, testIgnores } = require("./config/jest.patterns")

const { pkg, path: pkgPath } = readPkgUp.sync({
  cwd: fs.realpathSync(process.cwd()),
})
const appDirectory = path.dirname(pkgPath)

const isGdScripts = () => pkg.name === "gd-scripts"

/**
 * @param {string} modName
 * @param {{ executable?: string, cwd?: string }} options
 */
const resolveBin = (
  modName,
  { executable = modName, cwd = process.cwd() } = {},
) => {
  let pathFromWhich
  try {
    pathFromWhich = fs.realpathSync(which.sync(executable))
  } catch (_error) {
    // ignore _error
  }
  try {
    const modPkgPath = require.resolve(`${modName}/package.json`)
    const modPkgDir = path.dirname(modPkgPath)
    const { bin } = require(modPkgPath)
    const binPath = typeof bin === "string" ? bin : bin[executable]
    const fullPathToBin = path.join(modPkgDir, binPath)
    if (fullPathToBin === pathFromWhich) {
      return executable
    }
    return fullPathToBin.replace(cwd, ".")
  } catch (error) {
    if (pathFromWhich) {
      return executable
    }
    throw error
  }
}

/**
 * @param {string[]} p
 */
const fromRoot = (...p) => path.join(appDirectory, ...p)
/**
 * @param {string[]} p
 */
const hasFile = (...p) => fs.existsSync(fromRoot(...p))

/**
 * @param {any} props
 */
const hasPkgProp = props => arrify(props).some(prop => has(pkg, prop))

const hasTests = () => {
  const testPatterns = testMatch.join(",")
  const ignorePatterns = testIgnores.map(
    x => `${x}${x.endsWith("/") ? "" : "/"}**/*`,
  )
  const globStr = `{${testPatterns}}`
  const testList = glob.sync(globStr, {
    ignore: ignorePatterns,
  })

  return testList.length > 0
}

/**
 * @param {string} message
 */
const logMessage = message => {
  console.log(`${chalk.bgCyan(chalk.black("[gd-scripts]"))} ${message}\n`)
}

/**
 * @param {string} script
 */
const logScriptMessage = script => {
  const scriptMessage = `Running ${chalk.cyan(script.toUpperCase())} script.`
  logMessage(scriptMessage)
}

module.exports = {
  resolveBin,
  fromRoot,
  hasFile,
  hasPkgProp,
  isGdScripts,
  hasTests,
  logMessage,
  logScriptMessage,
}
