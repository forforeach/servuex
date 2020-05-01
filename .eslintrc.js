module.exports = {
  env: {
    es6: true,
    node: true,
    browser: true,
    jest: true,
  },

  extends: [
    'airbnb-base'
  ],

  parser: 'babel-eslint',

  rules: {
    semi: [1, 'never'],
    'max-len': ['error', { code: 200 }],
    'import/prefer-default-export': 'off',
    'import/no-named-as-default': 'off',
    'import/extensions': 'off',
    'prefer-destructuring': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-return-assign': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-vars': ['error', { "argsIgnorePattern": "^_" }],
    'default-case': 'off',
    'object-curly-newline': ['error', {
      ObjectExpression: { multiline: true, minProperties: 5 },
      ObjectPattern: { multiline: true },
      ImportDeclaration: 'never',
      ExportDeclaration: { multiline: true, minProperties: 5 },
    }],
  },
}