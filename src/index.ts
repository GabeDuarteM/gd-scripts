#!/usr/bin/env node

const resolutions = require(`${process.cwd()}/package.json`).resolutions

if (!resolutions || resolutions["babel-core"] !== "^7.0.0-bridge.0") {
  console.warn(`
[gd-scripts]: babel-core should be set to bridge mode to avoid errors. To do that, add the following code to your package.json:

"resolutions": {
  "babel-core": "^7.0.0-bridge.0"
},

`)
}

require("./run-script")
