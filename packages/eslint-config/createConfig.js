module.exports = (isTypescript, isWeb) => {
  const extend = [
    'eslint:recommended',
    isTypescript && 'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    isTypescript && 'prettier/@typescript-eslint',
  ].filter(Boolean)

  const plugins = [
    isTypescript && '@typescript-eslint',
    'import',
    'babel',
    isWeb && 'react',
    isWeb && 'jsx-a11y',
    isWeb && 'react-hooks',
  ].filter(Boolean)

  const parserOptions = {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: isWeb,
    },
  }

  const settings = {
    'import/resolver': {
      node: {
        extensions: [
          '.mjs',
          '.js',
          '.json',
          isTypescript && '.ts',
          isTypescript && isWeb && '.tsx',
        ].filter(Boolean),
      },
    },
    'import/extensions': [
      '.js',
      '.mjs',
      isTypescript && '.ts',
      isTypescript && isWeb && '.tsx',
    ].filter(Boolean),
    react: isWeb && {
      pragma: 'React',
      version: 'detect',
    },
    'import/core-modules': [],
    'import/ignore': [
      'node_modules',
      '\\.(coffee|scss|css|less|hbs|svg|json)$',
    ],
  }

  const possibleErrors = {
    // for 'no-undef' on typescript, it is better to rely on ts to avoid issues with Interfaces:
    // https://github.com/nzakas/eslint-plugin-typescript/issues/110
    // https://github.com/eslint/typescript-eslint-parser/issues/437
    'no-undef': isTypescript ? 'off' : 'error',
    'no-console': 'off',
    'no-template-curly-in-string': 'error',
  }

  const bestPractices = {
    'array-callback-return': 'error',
    'block-scoped-var': 'error',
    'consistent-return': 'error',
    curly: 'error',
    'default-case': 'error',
    'dot-notation': 'error',
    eqeqeq: 'error',
    'max-classes-per-file': 'error',
    'no-alert': 'error',
    'no-caller': 'error',
    'no-else-return': 'error',
    'no-empty-function': 'error',
    'no-eq-null': 'error',
    'no-eval': 'error', // Why isn't this part of the eslint:recommended? lol
    'no-implied-eval': 'error', // I mean, why would you use eval nowadays?
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'babel/no-invalid-this': 'error',
    'no-iterator': 'error',
    'no-labels': 'error',
    'no-loop-func': 'error',
    'no-multi-str': 'error',
    'no-new-func': 'error',
    'no-new-wrappers': 'error',
    'no-octal-escape': 'error',
    'no-param-reassign': 'error',
    'no-proto': 'error',
    'no-restricted-properties': [
      'error',
      {
        object: 'arguments',
        property: 'callee',
        message: 'arguments.callee is deprecated',
      },
      {
        object: 'global',
        property: 'isFinite',
        message: 'Please use Number.isFinite instead',
      },
      {
        object: 'self',
        property: 'isFinite',
        message: 'Please use Number.isFinite instead',
      },
      {
        object: 'window',
        property: 'isFinite',
        message: 'Please use Number.isFinite instead',
      },
      {
        object: 'global',
        property: 'isNaN', // The global isNaN coerces non-numbers to numbers, returning true for anything that coerces to NaN. If this behavior is desired, make it explicit.
        message: 'Please use Number.isNaN instead',
      },
      {
        object: 'self',
        property: 'isNaN',
        message: 'Please use Number.isNaN instead',
      },
      {
        object: 'window',
        property: 'isNaN',
        message: 'Please use Number.isNaN instead',
      },
      {
        property: '__defineGetter__',
        message: 'Please use Object.defineProperty instead.',
      },
      {
        property: '__defineSetter__',
        message: 'Please use Object.defineProperty instead.',
      },
      {
        object: 'Math',
        property: 'pow',
        message: 'Use the exponentiation operator (**) instead.',
      },
    ],
    'no-return-assign': 'error',
    'no-return-await': 'error',
    'no-script-url': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-throw-literal': 'error',
    'no-unmodified-loop-condition': 'error',
    'babel/no-unused-expressions': 'error',
    'no-useless-call': 'error',
    'no-useless-concat': 'error',
    'no-void': 'error',
    'no-with': 'error',
    'prefer-promise-reject-errors': 'error',
    radix: 'error',
    'require-await': 'error',
  }

  const variables = {
    'no-label-var': 'error',
    'no-shadow': 'error',
    'no-shadow-restricted-names': 'error',
    'no-use-before-define': 'error',
  }

  const nodeAndCommonJs = {
    'callback-return': 'error',
    'handle-callback-err': 'error',
    'no-buffer-constructor': 'error',
    'no-mixed-requires': 'error',
    'no-new-require': 'error',
    'no-path-concat': 'error',
  }

  const styleIssues = {
    camelcase: 'error',
    'func-names': 'error',
    'lines-between-class-members': 'error',
    'max-statements-per-line': 'error',
    'babel/new-cap': 'error',
    'new-parens': 'error',
    'no-bitwise': 'error',
    'no-lonely-if': 'error',
    'no-multi-assign': 'error',
    'no-new-object': 'error',
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message:
          'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'ForOfStatement',
        message:
          'iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations.',
      },
      {
        selector: 'LabeledStatement',
        message:
          'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message:
          '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],
    'no-unneeded-ternary': 'error',
    'operator-assignment': 'error',
    'spaced-comment': 'error',
  }

  const es6 = {
    'no-duplicate-imports': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-constructor': 'error',
    'no-useless-rename': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',
    'prefer-numeric-literals': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'symbol-description': 'error',
  }

  const importPlugin = {
    'import/default': 'error',
    'import/no-absolute-path': 'error',
    'import/no-webpack-loader-syntax': 'error',
    'import/no-self-import': 'error',
    'import/no-cycle': ['error', { maxDepth: Infinity }],
    'import/no-useless-path-segments': 'error',
    'import/export': 'error',
    'import/no-named-as-default': 'error',
    'import/no-named-as-default-member': 'error',
    'import/no-extraneous-dependencies': 'error',
    'import/no-mutable-exports': 'error',
    'import/no-amd': 'error',
    'import/first': 'error',
    'import/no-duplicates': 'error',
    'import/order': [
      'error',
      { groups: [['builtin', 'external', 'internal']] },
    ],
    'import/newline-after-import': 'error',
    'import/no-named-default': 'error',
    'import/no-anonymous-default-export': 'error',
  }

  const typescriptPlugin = isTypescript && {
    /* Typescript plugin */
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'none',
          requireLast: true,
        },
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
  }

  const reactPlugin = isWeb && {
    'react/button-has-type': [
      'error',
      {
        button: true,
        submit: true,
        reset: false,
      },
    ],
    'react/default-props-match-prop-types': [
      'error',
      { allowRequiredDefaults: false },
    ],
    'react/forbid-prop-types': [
      'error',
      {
        forbid: ['any', 'array', 'object'],
        checkContextTypes: true,
        checkChildContextTypes: true,
      },
    ],
    'react/no-access-state-in-setstate': 'error',
    'react/no-array-index-key': 'error',
    'react/no-children-prop': 'error',
    'react/no-danger': 'error',
    'react/no-danger-with-children': 'error',
    'react/no-deprecated': 'error',
    'react/no-did-update-set-state': 'error',
    'react/no-direct-mutation-state': 'error',
    'react/no-find-dom-node': 'error',
    'react/no-is-mounted': 'error',
    'react/no-multi-comp': ['error', { ignoreStateless: true }],
    'react/no-redundant-should-component-update': 'error',
    'react/no-render-return-value': 'error',
    'react/no-typos': 'error',
    'react/no-string-refs': 'error',
    'react/no-this-in-sfc': 'error',
    'react/no-unescaped-entities': 'error',
    'react/no-unknown-property': 'error',
    'react/no-unsafe': 'error',
    'react/no-unused-prop-types': [
      'error',
      {
        skipShapeProps: true,
      },
    ],
    'react/no-unused-state': 'error',
    'react/no-will-update-set-state': 'error',
    'react/prefer-es6-class': 'error',
    'react/prefer-stateless-function': [
      'error',
      { ignorePureComponents: true },
    ],
    'react/react-in-jsx-scope': 'error',
    'react/require-render-return': 'error',
    'react/style-prop-object': 'error',
    'react/void-dom-elements-no-children': 'error',
    'react/jsx-boolean-value': 'error',
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.tsx'] }],
    'react/jsx-key': 'error',
    'react/jsx-no-comment-textnodes': 'error',
    'react/jsx-no-duplicate-props': ['error', { ignoreCase: true }],
    'react/jsx-no-target-blank': 'error',
    'react/jsx-no-undef': 'error',
    'react/jsx-curly-brace-presence': [
      'error',
      { props: 'never', children: 'never' },
    ],
    'react/jsx-pascal-case': [
      'error',
      {
        allowAllCaps: true,
      },
    ],
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
  }

  const a11yPlugin = isWeb && {
    'jsx-a11y/accessible-emoji': 'error',
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/anchor-has-content': 'error',
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to'],
      },
    ],
    'jsx-a11y/aria-activedescendant-has-tabindex': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-proptypes': 'error',
    'jsx-a11y/aria-role': ['error', { ignoreNonDom: false }],
    'jsx-a11y/aria-unsupported-elements': 'error',
    'jsx-a11y/click-events-have-key-events': 'error',
    'jsx-a11y/heading-has-content': 'error',
    'jsx-a11y/html-has-lang': 'error',
    'jsx-a11y/iframe-has-title': 'error',
    'jsx-a11y/img-redundant-alt': 'error',
    'jsx-a11y/interactive-supports-focus': 'error',
    'jsx-a11y/lang': 'error',
    'jsx-a11y/media-has-caption': 'error',
    'jsx-a11y/mouse-events-have-key-events': 'error',
    'jsx-a11y/no-access-key': 'error',
    'jsx-a11y/no-autofocus': ['error', { ignoreNonDOM: true }],
    'jsx-a11y/no-distracting-elements': 'error',
    'jsx-a11y/no-interactive-element-to-noninteractive-role': [
      'error',
      {
        tr: ['none', 'presentation'],
      },
    ],
    'jsx-a11y/no-noninteractive-element-interactions': [
      'error',
      {
        handlers: [
          'onClick',
          'onMouseDown',
          'onMouseUp',
          'onKeyPress',
          'onKeyDown',
          'onKeyUp',
        ],
      },
    ],
    'jsx-a11y/no-noninteractive-element-to-interactive-role': [
      'error',
      {
        ul: [
          'listbox',
          'menu',
          'menubar',
          'radiogroup',
          'tablist',
          'tree',
          'treegrid',
        ],
        ol: [
          'listbox',
          'menu',
          'menubar',
          'radiogroup',
          'tablist',
          'tree',
          'treegrid',
        ],
        li: ['menuitem', 'option', 'row', 'tab', 'treeitem'],
        table: ['grid'],
        td: ['gridcell'],
      },
    ],
    'jsx-a11y/no-noninteractive-tabindex': [
      'error',
      {
        tags: [],
        roles: ['tabpanel'],
      },
    ],
    'jsx-a11y/no-redundant-roles': 'error',
    'jsx-a11y/no-static-element-interactions': [
      'error',
      {
        handlers: [
          'onClick',
          'onMouseDown',
          'onMouseUp',
          'onKeyPress',
          'onKeyDown',
          'onKeyUp',
        ],
      },
    ],
    'jsx-a11y/role-has-required-aria-props': 'error',
    'jsx-a11y/role-supports-aria-props': 'error',
    'jsx-a11y/scope': 'error',
    'jsx-a11y/tabindex-no-positive': 'error',
  }

  const reactHooksPlugin = isWeb && {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  }

  const rules = {
    ...possibleErrors,
    ...bestPractices,
    ...variables,
    ...nodeAndCommonJs,
    ...styleIssues,
    ...es6,
    ...importPlugin,
    ...typescriptPlugin,
    ...reactPlugin,
    ...reactHooksPlugin,
    ...a11yPlugin,
  }

  const config = {
    extends: extend,
    env: { node: !isWeb, jest: true, browser: isWeb, es6: true },
    parser: isTypescript ? '@typescript-eslint/parser' : 'babel-eslint',
    parserOptions,
    plugins,
    settings,
    rules,
  }

  return config
}
