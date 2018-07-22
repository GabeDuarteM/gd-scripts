import path from "path"
import spawn from "cross-spawn"
import rimraf from "rimraf"
import { hasPkgProp, fromRoot, resolveBin, hasFile } from "../../utils"
import paths from "../../paths"

const args = process.argv.slice(2)
const here = (p: string) => path.join(__dirname, p)

const useBuiltinConfig =
  !args.includes("--presets") && !hasFile(".babelrc") && !hasPkgProp("babel")
const config = useBuiltinConfig
  ? ["--presets", here("../../config/babelrc.js")]
  : []

const ignore = args.includes("--ignore")
  ? []
  : ["--ignore", "**/*.test.js,**/*.test.ts,**/*.test.tsx,**/*.test.jsx,__mocks__,**/@types"]

const copyFiles = args.includes("--no-copy-files") ? [] : ["--copy-files"]

const useSpecifiedOutDir = args.includes("--out-dir")
const outDir = useSpecifiedOutDir ? [] : ["--out-dir", paths.output]

const extensions = ["--extensions", ".ts,.tsx,.js,.jsx"]

const sourceMaps = "-s"

if (!useSpecifiedOutDir && !args.includes("--no-clean")) {
  rimraf.sync(fromRoot(paths.output))
  console.log("Cleaned the build dir.")
}

const babelArguments = [
  ...outDir,
  ...copyFiles,
  ...ignore,
  ...config,
  ...extensions,
  "src",
  sourceMaps,
  ...args
]

const resultBabel = spawn.sync(
  resolveBin("babel-cli", { executable: "babel" }),
  babelArguments,
  { stdio: "inherit" },
)

spawn.sync(
  resolveBin("typescript", { executable: "tsc" }),
  ['--emitDeclarationOnly'],
  { stdio: "inherit" },
)

if (ignore.length > 0) {
  const buildIgnore = ignore[1].split(',').map(x => `build/${x}`).join(",")

  rimraf.sync(`{${buildIgnore}}`);
}

process.exit(resultBabel.status)
