import { directory } from 'tempy'
import { copy, remove, readdirSync, statSync } from 'fs-extra'
import { join } from 'path'
import isCi from 'is-ci'
import execa from 'execa'

import { logMessage } from '../src/utils'

const [, , ...opts] = process.argv

let noTeardown
let specificTests

opts.forEach((opt) => {
  if (opt === '--no-teardown' || opt === '-nt') {
    noTeardown = true
  } else {
    specificTests = opt.split(',')
  }
})

const createTestEnvironment = (templateDirectory) => {
  let testDirectory

  const teardown = async () => {
    if (testDirectory) {
      if (noTeardown) {
        console.log(
          `"No teardown" flag detected. The test directory is ${testDirectory}`,
        )
        return
      }

      try {
        await remove(testDirectory)
      } catch (ex) {
        if (!isCi) {
          throw ex
        } else {
          // In CI, don't worry if the test directory was not able to be deleted
        }
      }
    }

    testDirectory = null
  }

  const setup = async () => {
    await teardown()
    testDirectory = directory()
    await copy(templateDirectory, testDirectory)

    await execa('yalc', ['add', 'gd-scripts'], {
      cwd: testDirectory,
    })

    await execa('yarnpkg', ['install', '--mutex', 'network'], {
      cwd: testDirectory,
    })
  }

  const test = async () => {
    try {
      await setup()
      const { exitCode } = await execa('yarnpkg', ['run', 'ci'], {
        cwd: testDirectory,
        stdio: 'inherit',
      })

      return exitCode
    } catch (err) {
      logMessage(`There was an error running ${templateDirectory}`)

      console.error(err)

      return err.code
    } finally {
      await teardown()
    }
  }

  return test
}

const runTests = async () => {
  const dirs = readdirSync(__dirname)
    .filter((item) => statSync(join(__dirname, item)).isDirectory())
    .filter((item) => {
      return specificTests ? specificTests.includes(item) : true
    })

  const results = await Promise.all(
    dirs.map((dir) => {
      const test = createTestEnvironment(join(__dirname, dir))

      return test()
    }),
  )

  const highestCode = Math.max(...results)

  process.exit(highestCode)
}

runTests()

