module.exports = {
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  env: { node: true },
  parser: "typescript-eslint-parser",
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 6,
  },
  plugins: ["typescript"],
  rules: {
    /* Possible Errors */
    "no-undef": "off", // issues with Interfaces: https://github.com/nzakas/eslint-plugin-typescript/issues/110
    "no-console": "off",
    "no-template-curly-in-string": "error",

    /* Best Practices */
    "array-callback-return": "error",
    "block-scoped-var": "error",
    "consistent-return": "error",
    curly: "error",
    "default-case": "error",
    "dot-notation": "error",
    eqeqeq: "error",
    "max-classes-per-file": "error",
    "no-alert": "error",
    "no-caller": "error",
    "no-else-return": "error",
    "no-empty-function": "error",
    "no-eq-null": "error",
    "no-eval": "error", // Why isn't this part of the eslint:recommended? lol
    "no-implied-eval": "error", // I mean, why would you use eval nowadays?
    "no-extend-native": "error",
    "no-extra-bind": "error",
    "no-invalid-this": "error",
    "no-iterator": "error",
    "no-labels": "error",
    "no-loop-func": "error",
    "no-magic-numbers": ["error", { ignore: [0, 1] }],
    "no-multi-str": "error",
    "no-new-func": "error",
    "no-new-wrappers": "error",
    "no-octal-escape": "error",
    "no-param-reassign": "error",
    "no-proto": "error",
    "no-restricted-properties": [
      "error",
      {
        object: "arguments",
        property: "callee",
        message: "arguments.callee is deprecated",
      },
      {
        object: "global",
        property: "isFinite",
        message: "Please use Number.isFinite instead",
      },
      {
        object: "self",
        property: "isFinite",
        message: "Please use Number.isFinite instead",
      },
      {
        object: "window",
        property: "isFinite",
        message: "Please use Number.isFinite instead",
      },
      {
        object: "global",
        property: "isNaN", // The global isNaN coerces non-numbers to numbers, returning true for anything that coerces to NaN. If this behavior is desired, make it explicit.
        message: "Please use Number.isNaN instead",
      },
      {
        object: "self",
        property: "isNaN",
        message: "Please use Number.isNaN instead",
      },
      {
        object: "window",
        property: "isNaN",
        message: "Please use Number.isNaN instead",
      },
      {
        property: "__defineGetter__",
        message: "Please use Object.defineProperty instead.",
      },
      {
        property: "__defineSetter__",
        message: "Please use Object.defineProperty instead.",
      },
      {
        object: "Math",
        property: "pow",
        message: "Use the exponentiation operator (**) instead.",
      },
    ],
    "no-return-assign": "error",
    "no-return-await": "error",
    "no-script-url": "error",
    "no-self-compare": "error",
    "no-sequences": "error",
    "no-throw-literal": "error",
    "no-unmodified-loop-condition": "error",
    "no-unused-expressions": "error",
    "no-useless-call": "error",
    "no-useless-concat": "error",
    "no-void": "error",
    "no-with": "error",
    "prefer-promise-reject-errors": "error",
    radix: "error",
    "require-await": "error",

    /* Variables */
    "no-label-var": "error",
    "no-shadow": "error",
    "no-shadow-restricted-names": "error",
    "no-use-before-define": "error",

    /* Node.js and CommonJS */
    "callback-return": "error",
    "handle-callback-err": "error",
    "no-buffer-constructor": "error",
    "no-mixed-requires": "error",
    "no-new-require": "error",
    "no-path-concat": "error",

    /* Stylistic Issues */
    camelcase: "error",
    "func-names": "error",
    "lines-between-class-members": "error",
    "max-statements-per-line": "error",
    "new-cap": "error",
    "new-parens": "error",
    "no-bitwise": "error",
    "no-lonely-if": "error",
    "no-multi-assign": "error",
    "no-new-object": "error",
    "no-restricted-syntax": [
      "error",
      {
        selector: "ForInStatement",
        message:
          "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.",
      },
      {
        selector: "ForOfStatement",
        message:
          "iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations.",
      },
      {
        selector: "LabeledStatement",
        message:
          "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.",
      },
      {
        selector: "WithStatement",
        message:
          "`with` is disallowed in strict mode because it makes code impossible to predict and optimize.",
      },
    ],
    "no-unneeded-ternary": "error",
    "operator-assignment": "error",
    "spaced-comment": "error",

    /* ECMAScript 6 */
    "arrow-body-style": ["error", "as-needed"],
    "no-duplicate-imports": "error",
    "no-useless-computed-key": "error",
    "no-useless-constructor": "error",
    "no-useless-rename": "error",
    "no-var": "error",
    "object-shorthand": "error",
    "prefer-arrow-callback": "error",
    "prefer-const": "error",
    "prefer-numeric-literals": "error",
    "prefer-rest-params": "error",
    "prefer-spread": "error",
    "prefer-template": "error",
    "symbol-description": "error",

    /* Typescript plugin */
    "typescript/adjacent-overload-signatures": "error",
    "typescript/class-name-casing": "error",
    "typescript/interface-name-prefix": "error",
    "typescript/member-delimiter-style": ["error", { delimiter: "none" }],
    "typescript/no-angle-bracket-type-assertion": "error",
    "typescript/no-array-constructor": "error",
    "typescript/no-empty-interface": "error",
    "typescript/no-namespace": "error",
    "typescript/no-non-null-assertion": "error",
    "typescript/no-triple-slash-reference": "error",
    "typescript/no-unused-vars": "error",
    "typescript/no-use-before-define": "error",
  },
}
