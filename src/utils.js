const fs = require('fs')
const path = require('path')
const arrify = require('arrify')
const has = require('lodash.has')
const readPkgUp = require('read-pkg-up')
const which = require('which')
const glob = require('glob')
const chalk = require('chalk').default

const { testMatch, testIgnores } = require('gd-configs/jest/jest.patterns')

const { pkg, path: pkgPath } = readPkgUp.sync({
  cwd: fs.realpathSync(process.cwd()),
})
const appDirectory = path.dirname(pkgPath)

const isGdScripts = () => pkg.name === 'gd-scripts'

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
    const binPath = typeof bin === 'string' ? bin : bin[executable]
    const fullPathToBin = path.join(modPkgDir, binPath)
    if (fullPathToBin === pathFromWhich) {
      return executable
    }
    return fullPathToBin.replace(cwd, '.')
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
const hasPkgProp = (props) => arrify(props).some((prop) => has(pkg, prop))

const hasPkgSubProp = (pkgProp) => (props) =>
  hasPkgProp(arrify(props).map((p) => `${pkgProp}.${p}`))

const hasPeerDep = hasPkgSubProp('peerDependencies')
const hasDep = hasPkgSubProp('dependencies')
const hasDevDep = hasPkgSubProp('devDependencies')
const hasAnyDep = (args) =>
  [hasDep, hasDevDep, hasPeerDep].some((fn) => fn(args))

const ifAnyDep = (deps, ifTrue, ifFalse) =>
  hasAnyDep(arrify(deps)) ? ifTrue : ifFalse

const envIsSet = (name) =>
  process.env.hasOwnProperty(name) &&
  process.env[name] &&
  process.env[name] !== 'undefined'

const parseEnv = (name, defaultValue) => {
  if (envIsSet(name)) {
    try {
      return JSON.parse(process.env[name])
    } catch (err) {
      return process.env[name]
    }
  }
  return defaultValue
}

const hasTests = () => {
  const testPatterns = testMatch.join(',')
  const ignorePatterns = testIgnores.map(
    (x) => `${x}${x.endsWith('/') ? '' : '/'}**/*`,
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
const logMessage = (message) => {
  console.log(`${chalk.bgCyan(chalk.black('[gd-scripts]'))} ${message}\n`)
}

/**
 * @param {string} script
 */
const logScriptMessage = (script) => {
  const scriptMessage = `Running ${chalk.cyan(script.toUpperCase())} script.`
  logMessage(scriptMessage)
}

const checkRequiredFiles = (...files) => {
  let currentFilePath
  let currentDirName
  let currentFileName
  try {
    files.forEach((filePath) => {
      currentFilePath = filePath
      currentDirName = path.dirname(currentFilePath)
      currentFileName = path.basename(currentFilePath)
      fs.accessSync(filePath, fs.constants.F_OK)
    })
    return {
      success: true,
      fileName: currentFileName,
      dirName: currentDirName,
    }
  } catch (err) {
    const message = `
${chalk.red('Could not find a required file.')}
${chalk.red('  Name: ') + chalk.cyan(currentFileName)}
${chalk.red('  Searched in: ') + chalk.cyan(currentDirName)}
    `.trim()
    return {
      success: false,
      fileName: currentFileName,
      dirName: currentDirName,
      message,
    }
  }
}

const isTypescript = () => hasFile('tsconfig.json')
const isWeb = () => hasDep('react')
const getEslintConfigPath = () => {
  const subDir = isTypescript() ? '/ts' : ''
  const file = isWeb() ? '/web.js' : '/index.js'

  return `gd-configs/eslint${subDir}${file}`
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
  parseEnv,
  ifAnyDep,
  appDirectory,
  pkg,
  checkRequiredFiles,
  isTypescript,
  isWeb,
  getEslintConfigPath,
}
