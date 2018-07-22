import path from "path"
import spawn from "cross-spawn"
import rimraf from "rimraf"
import { hasPkgProp, fromRoot, resolveBin, hasFile } from "../../utils"
import paths from "../paths"

const args = process.argv.slice(2)
const here = (p: string) => path.join(__dirname, p)

const useBuiltinConfig =
  !args.includes("--presets") && !hasFile(".babelrc") && !hasPkgProp("babel")
const config = useBuiltinConfig
  ? ["--presets", here("../../config/babelrc.js")]
  : []

const ignore = args.includes("--ignore")
  ? []
  : ["--ignore", "**/*.test.js,__mocks__,@types"]

const copyFiles = args.includes("--no-copy-files") ? [] : ["--copy-files"]

const useSpecifiedOutDir = args.includes("--out-dir")
const outDir = useSpecifiedOutDir ? [] : ["--out-dir", paths.output]

const ignoreTypeDef = ["--ignore", "**/@types"]

if (!useSpecifiedOutDir && !args.includes("--no-clean")) {
  rimraf.sync(fromRoot(paths.output))
  console.log("Cleaned the build dir.")
}

const result = spawn.sync(
  resolveBin("babel-cli", { executable: "babel" }),
  [
    ...outDir,
    ...copyFiles,
    ...ignore,
    ...config,
    ...ignoreTypeDef,
    "src",
  ].concat(args),
  { stdio: "inherit" },
)

process.exit(result.status)
