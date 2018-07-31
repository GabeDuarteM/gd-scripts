import isCI from "is-ci"
import { hasPkgProp, hasFile, logScriptMessage } from "../utils"

process.env.BABEL_ENV = "test"
process.env.NODE_ENV = "test"

const unnecessaryArgumentsCount = 2

const args = process.argv.slice(unnecessaryArgumentsCount)
const isCiScript = process.env.SCRIPT_CI === "true"

const watch =
  !isCI &&
  !isCiScript &&
  !args.includes("--no-watch") &&
  !args.includes("--coverage") &&
  !args.includes("--updateSnapshot")
    ? ["--watch"]
    : []

const coverage = isCiScript ? ["--coverage"] : []

const config =
  !args.includes("--config") &&
  !hasFile("jest.config.js") &&
  !hasPkgProp("jest")
    ? ["--config", JSON.stringify(require("../config/jest.config"))]
    : []

logScriptMessage("TEST")

require("jest").run([...config, ...watch, ...coverage, ...args])
