import { pathExistsSync } from "fs-extra"
import git from "simple-git"
import spawn from "cross-spawn"
import { join } from "path"
import { tmpdir } from "os"

import { fromRoot } from "../utils"

const fixturePath = join(tmpdir(), "gd-scripts", "fixtures")

export const getRepoName = (repo: string) => {
  const rgxRepoName = /.*github.com\/.*?\/(.*?).git/

  const match = rgxRepoName.exec(repo)

  if (!match) {
    throw new Error("Repo name not found.")
  }

  const repoName = match[1]

  return repoName
}

const getFixtureRepoPath = (repo: string) => {
  const repoName = getRepoName(repo)

  const fixturesRepoPath = join(fixturePath, repoName)

  return fixturesRepoPath
}

const checkoutLatestTag = (fixturesRepoPath: string) =>
  new Promise(resolve => {
    git()
      .cwd(fixturesRepoPath)
      .checkoutLatestTag(resolve)
  })

const clone = (repo: string) =>
  new Promise(resolve => {
    git()
      .cwd(fixturePath)
      .clone(repo, resolve)
  })

export const cloneOrPull = async (repo: string) => {
  const fixturesRepoPath = getFixtureRepoPath(repo)

  if (!pathExistsSync(fixturesRepoPath)) {
    await clone(repo)
  }

  await checkoutLatestTag(fixturesRepoPath)
}

export const runYarnInstall = (repo: string) =>
  spawn.sync("yarn", ["install"], {
    stdio: "inherit",
    cwd: getFixtureRepoPath(repo),
  })

export const runYarnCi = (repo: string) =>
  spawn.sync("yarn", ["ci"], {
    stdio: "inherit",
    cwd: getFixtureRepoPath(repo),
  })

export const runYarnAddGdScripts = (repo: string) =>
  spawn.sync("yarn", ["add", `file:${fromRoot(".")}`, "-D"], {
    stdio: "inherit",
    cwd: getFixtureRepoPath(repo),
  })
