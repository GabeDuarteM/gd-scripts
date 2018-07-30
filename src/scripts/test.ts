process.env.BABEL_ENV = "test"
process.env.NODE_ENV = "test"

import isCI from "is-ci"
import { hasPkgProp, hasFile } from "../utils"

const unnecessaryArgumentsCount = 2

const args = process.argv.slice(unnecessaryArgumentsCount)

const watch =
  !isCI &&
  !args.includes("--no-watch") &&
  !args.includes("--coverage") &&
  !args.includes("--updateSnapshot")
    ? ["--watch"]
    : []

const config =
  !args.includes("--config") &&
  !hasFile("jest.config.js") &&
  !hasPkgProp("jest")
    ? ["--config", JSON.stringify(require("../config/jest.config"))]
    : []

require("jest").run([...config, ...watch, ...args])
