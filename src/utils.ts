import fs from "fs"
import path from "path"
import arrify from "arrify"
import has from "lodash.has"
import readPkgUp from "read-pkg-up"
import which from "which"

const { pkg, path: pkgPath } = readPkgUp.sync({
  cwd: fs.realpathSync(process.cwd()),
})
export const appDirectory = path.dirname(pkgPath)

export const resolveBin = (
  modName: string,
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

export const fromRoot = (...p: string[]) => path.join(appDirectory, ...p)
export const hasFile = (...p: string[]) => fs.existsSync(fromRoot(...p))

export const hasPkgProp = (props: any) =>
  arrify(props).some(prop => has(pkg, prop))

const hasPkgSubProp = (pkgProp: string) => (props: any) =>
  hasPkgProp(arrify(props).map(p => `${pkgProp}.${p}`))

const hasPeerDep = hasPkgSubProp("peerDependencies")
const hasDep = hasPkgSubProp("dependencies")
const hasDevDep = hasPkgSubProp("devDependencies")
const hasAnyDep = (args: any) =>
  [hasDep, hasDevDep, hasPeerDep].some(fn => fn(args))

export const ifAnyDep = (deps: any, t: any, f?: any) =>
  hasAnyDep(arrify(deps)) ? t : f

export const parseEnv = (name: string, def: any) => {
  if (envIsSet(name)) {
    try {
      return JSON.parse(process.env[name] as any)
    } catch (err) {
      return process.env[name]
    }
  }
  return def
}

export const envIsSet = (name: string) => {
  return (
    process.env.hasOwnProperty(name) &&
    process.env[name] &&
    process.env[name] !== "undefined"
  )
}
