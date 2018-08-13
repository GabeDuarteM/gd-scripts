import { ensureDirSync } from "fs-extra"

import { tmpdir } from "os"
import { join } from "path"

import chalk from "chalk"

import {
  cloneOrPull,
  getRepoName,
  runYarnCi,
  runYarnAddGdScripts,
} from "./utils"
import { logMessage } from "../utils"

ensureDirSync(join(tmpdir(), "gd-scripts", "fixtures"))

const repos = [
  "https://github.com/GabrielDuarteM/youtube-autoclose-ads.git",
  "https://github.com/GabrielDuarteM/copy-paste-component.git",
  "https://github.com/GabrielDuarteM/copy-paste-component-vscode.git",
  "https://github.com/GabrielDuarteM/pipe-now.git",
]

const statuses: number[] = []

const runFuncOnEveryRepo = async (
  func: (repo: string) => any,
  message: string,
  currStep: number,
  totalSteps: number,
  afterFunc?: Function,
) => {
  for (let i = 0; i < repos.length; i++) {
    const repo = repos[i]
    const repoName = getRepoName(repo)
    logMessage(
      `[${repoName} | ${i + 1}/${
        repos.length
      } | Step ${currStep}/${totalSteps}] ${message}`,
    )

    const result = await func(repo)
    if (afterFunc) {
      afterFunc(result)
    }
  }
}

const logStatus = (repoName: string, status: number, spaceLength: number) => {
  console.log(
    `${repoName}${" ".repeat(spaceLength)}${
      status === 0 ? chalk.green("SUCCESS") : chalk.red("ERROR")
    }`,
  )
}

const test = async () => {
  const totalSteps = 3
  let currStep = 0
  // await runFuncOnEveryRepo(
  //   cloneOrPull,
  //   "Cloning repo",
  //   (currStep += 1),
  //   totalSteps,
  // )
  // await runFuncOnEveryRepo(
  //   runYarnAddGdScripts,
  //   "Installing the new version of gd-scripts",
  //   (currStep += 1),
  //   totalSteps,
  // )
  await runFuncOnEveryRepo(
    runYarnCi,
    "Running CI Script",
    (currStep += 1),
    totalSteps,
    (result: any) => {
      statuses.push(result.status)
    },
  )

  const results = statuses.reduce(
    (acc: Array<{ repoName: string; status: number }>, item, index) => [
      ...acc,
      { repoName: getRepoName(repos[index]), status: item },
    ],
    [],
  )

  const longestNameLength = results.reduce(
    (acc, item) => (acc >= item.repoName.length ? acc : item.repoName.length),
    0,
  )

  console.log(`\n${chalk.cyan("TEST RESULTS:")}`)

  console.log()
  results.forEach(result => {
    logStatus(
      result.repoName,
      result.status,
      longestNameLength - result.repoName.length + 2,
    )
  })
  console.log()

  const finalStatus = statuses.some(x => x === 1) ? 1 : 0

  process.exit(finalStatus)
}

export default test
