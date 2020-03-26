module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['airbnb-base'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': 'warn',
    'no-shadow': 'warn',
    'no-param-reassign': 'warn',
    'arrow-body-style': 'off',
    'object-curly-newline': 'off',
    'prefer-destructuring': 'off',
    'import/prefer-default-export': 'off',
  },
};
