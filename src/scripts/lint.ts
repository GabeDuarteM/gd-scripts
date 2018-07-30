import path from "path"
import spawn from "cross-spawn"
import yargsParser from "yargs-parser"

import { hasPkgProp, resolveBin, hasFile, logScriptMessage } from "../utils"

const unnecessaryArgumentsCount = 2

let args = process.argv.slice(unnecessaryArgumentsCount)
const here = (p: string) => path.join(__dirname, p)
const hereRelative = (p: string) => here(p).replace(process.cwd(), ".")
const parsedArgs = yargsParser(args)

const useBuiltinConfig =
  !args.includes("--config") &&
  !hasFile(".eslintrc") &&
  !hasFile(".eslintrc.js") &&
  !hasPkgProp("eslintConfig")

const config = useBuiltinConfig
  ? ["--config", hereRelative("../config/eslintrc.js")]
  : []

const cache = args.includes("--no-cache") ? [] : ["--cache"]

const filesGiven = parsedArgs._.length > 0

const filesToApply = filesGiven ? [] : ["."]

const extensions = ["--ext", ".js,.jsx,.ts,.tsx"]

const cacheLocation = ["--cache-location", "node_modules/.cache/.eslintcache"]

const isLintable = (file: string) =>
  file.endsWith(".js") ||
  file.endsWith(".ts") ||
  file.endsWith(".jsx") ||
  file.endsWith(".tsx")

if (filesGiven) {
  // we need to take all the flag-less arguments (the files that should be linted)
  // and filter out the ones that aren't js files. Otherwise json or css files
  // may be passed through
  args = args.filter(a => !parsedArgs._.includes(a) || isLintable(a))
}

const lintArguments = [
  ...config,
  ...extensions,
  ...cacheLocation,
  ...cache,
  ...args,
  ...filesToApply,
]

logScriptMessage("LINT")

const result = spawn.sync(resolveBin("eslint"), lintArguments, {
  stdio: "inherit",
})

process.exit(result.status)
