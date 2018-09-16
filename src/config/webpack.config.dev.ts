import {
  Configuration,
  DefinePlugin,
  HotModuleReplacementPlugin,
} from "webpack"
import { join, resolve } from "path"
import HtmlWebpackPlugin from "html-webpack-plugin"
import CaseSensitivePathsPlugin from "case-sensitive-paths-webpack-plugin"
import ModuleScopePlugin from "react-dev-utils/ModuleScopePlugin"
import ManifestPlugin from "webpack-manifest-plugin"

import createBabelConfig from "./babelrc"
import { hasFile, fromRoot, appDirectory } from "../utils"

const useBuiltinConfig = !hasFile(".babelrc")
const babelConfig = useBuiltinConfig && createBabelConfig()

const entry = hasFile("src", "index.tsx")
  ? fromRoot(join("src", "index.tsx"))
  : fromRoot(join("src", "index.js"))

const env = process.env.BABEL_ENV || process.env.NODE_ENV
const isEnvDevelopment = env === "development"
const isEnvProduction = env === "production"
const isEnvTest = env === "test"
if (!env || (!isEnvDevelopment && !isEnvProduction && !isEnvTest)) {
  throw new Error(
    // eslint-disable-next-line prefer-template
    "Using `gd-scripts` requires that you specify `NODE_ENV` or " +
      '`BABEL_ENV` environment variables. Valid values are "development", ' +
      '"test", and "production". Instead, received: ' +
      JSON.stringify(env) +
      ".",
  )
}

const publicPath = "/"

const config: Configuration = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: [
    // Include an alternative client for WebpackDevServer. A client's job is to
    // connect to WebpackDevServer by a socket and get notified about changes.
    // When you save a file, the client will either apply hot updates (in case
    // of CSS changes), or refresh the page (in case of JS changes). When you
    // make a syntax error, this client will display a syntax error overlay.
    // Note: instead of the default WebpackDevServer client, we use a custom one
    // to bring better experience for Create React App users. You can replace
    // the line below with these two lines if you prefer the stock client:
    // require.resolve('webpack-dev-server/client') + '?/',
    // require.resolve('webpack/hot/dev-server'),
    require.resolve("react-dev-utils/webpackHotDevClient"),
    entry,
  ],
  output: {
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
    // This does not produce a real file. It's just the virtual path that is
    // served by WebpackDevServer in development. This is the JS bundle
    // containing code from all our entry points, and the Webpack runtime.
    filename: "static/js/bundle.js",
    // There are also additional JS chunk files if you use code splitting.
    chunkFilename: "static/js/[name].chunk.js",
    // This is the URL that app is served from. We use "/" in development.
    publicPath,
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info =>
      resolve(info.absoluteResourcePath).replace(/\\/g, "/"),
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      name: "vendors",
    },
    runtimeChunk: true,
  },
  resolve: {
    extensions: [".web.js", ".mjs", ".js", ".json", ".web.jsx", ".ts", ".tsx"],
    plugins: [
      // Prevents users from importing files from outside of src/ (or node_modules/).
      // This often causes confusion because we only process files within src/ with babel.
      // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
      // please link the files into your node_modules/ and let module-resolution kick in.
      // Make sure your source files are compiled, as they will not be processed in any way.
      new ModuleScopePlugin(appDirectory, [join(appDirectory, "package.json")]),
    ],
  },
  module: {
    // Makes missing exports an error instead of warning
    strictExportPresence: true,
    rules: [
      // Disable require.ensure as it's not a standard language feature.
      { parser: { requireEnsure: false } },
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          // "url" loader works like "file" loader except that it embeds assets
          // smaller than specified limit in bytes as data URLs to avoid requests.
          // A missing `test` is equivalent to a match.
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve("url-loader"),
            options: {
              limit: 10000,
              name: "static/media/[name].[hash:8].[ext]",
            },
          },
          {
            test: /\.((j|t)sx?|mjs)$/,
            include: fromRoot("src"),
            exclude: [/[/\\\\]node_modules[/\\\\]/],
            use: [
              // This loader parallelizes code compilation, it is optional but
              // improves compile time on larger projects
              {
                loader: require.resolve("thread-loader"),
                options: {
                  poolTimeout: Infinity, // keep workers alive for more effective watch mode
                },
              },
              {
                loader: require.resolve("babel-loader"),
                options: {
                  ...babelConfig,
                  cacheDirectory: true,
                  highlightCode: true,
                },
              },
            ],
          },
          // Process any JS outside of the app with Babel.
          // Unlike the application JS, we only compile the standard ES features.
          {
            test: /\.js$/,
            use: [
              {
                loader: require.resolve("babel-loader"),
                options: {
                  babelrc: false,
                  compact: false,
                  presets: [
                    isEnvTest && [
                      // ES features necessary for user's Node version
                      require("@babel/preset-env").default,
                      {
                        targets: {
                          node: "current",
                        },
                        // Do not transform modules to CJS
                        modules: false,
                      },
                    ],
                    (isEnvProduction || isEnvDevelopment) && [
                      // Latest stable ECMAScript features
                      require("@babel/preset-env").default,
                      {
                        // Do not transform modules to CJS
                        modules: false,
                      },
                    ],
                  ].filter(Boolean),
                  cacheDirectory: true,
                  highlightCode: true,
                },
              },
            ],
          },
          // "file" loader makes sure those assets get served by WebpackDevServer.
          // When you `import` an asset, you get its (virtual) filename.
          // In production, they would get copied to the `build` folder.
          // This loader doesn't use a "test" so it will catch all modules
          // that fall through the other loaders.
          {
            // Exclude `js` files to keep "css" loader working as it injects
            // its runtime that would otherwise be processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.((j|t)sx?|mjs)$/, /\.html$/, /\.json$/],
            loader: require.resolve("file-loader"),
            options: {
              name: "static/media/[name].[hash:8].[ext]",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: fromRoot(join("public", "index.html")),
    }),
    new DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(env),
      },
    }),
    new HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    // Generate a manifest file which contains a mapping of all asset filenames
    // to their corresponding output file so that tools can pick it up without
    // having to parse `index.html`.
    new ManifestPlugin({
      fileName: "asset-manifest.json",
      publicPath,
    }),
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    dgram: "empty",
    fs: "empty",
    net: "empty",
    tls: "empty",
    // eslint-disable-next-line camelcase
    child_process: "empty",
  },
}

export default config
