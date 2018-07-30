import spawn from "cross-spawn"
import chalk from "chalk"

import { hasTests, isGdScripts, resolveBin, logScriptMessage } from "../utils"

process.env.SCRIPT_CI = "true"

const unnecessaryArgumentsCount = 2

const args = process.argv.slice(unnecessaryArgumentsCount)

const gdScripts = isGdScripts()
const executor = gdScripts ? "ts-node" : "gd-scripts"
const getArgsSpawn = (script: string) =>
  gdScripts ? ["src", script, ...args] : [script, ...args]

logScriptMessage("CI")

const resultLint = spawn.sync(resolveBin(executor), [...getArgsSpawn("lint")], {
  stdio: "inherit",
})

const packageHasTests = hasTests()
let resultTest = { status: 0 }
if (packageHasTests) {
  resultTest = spawn.sync(resolveBin(executor), [...getArgsSpawn("test")], {
    stdio: "inherit",
  })
}
const resultBuild = spawn.sync(
  resolveBin(executor),
  [...getArgsSpawn("build")],
  {
    stdio: "inherit",
  },
)

const finalResult = [
  resultLint.status,
  resultBuild.status,
  resultTest.status,
].some(x => x === 1)
  ? 1
  : 0

console.log(`\n${chalk.cyan("CI RESULTS:")}`)

const logStatus = (script: string, status: number) => {
  console.log(
    `${script}:\t${status === 0 ? chalk.green("SUCCESS") : chalk.red("ERROR")}`,
  )
}

console.log()
logStatus("Lint", resultLint.status)
if (packageHasTests) {
  logStatus("Test", resultTest.status)
}
logStatus("Build", resultBuild.status)
console.log()

process.exit(finalResult)
