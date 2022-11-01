module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'prettier',
    'airbnb-base',
    'plugin:import/recommended',
  ],

  plugins: ['prettier', 'import'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'implicit-arrow-linebreak': 'off',
    'prettier/prettier': 'error',
    'class-methods-use-this': 'off',
    'no-param-reassign': 'off',
    camelcase: 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
    'import/prefer-default-export': 'off',
    'import/no-import-module-exports': 'off',
    'comma-dangle': 'off',
    'no-console': 'off',
    'no-underscore-dangle': 'off',
    'object-curly-newline': 'off',
    'consistent-return': 'off',
    'operator-linebreak': 'off',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@test', './src/__tests__'],
          ['@config', './src/config'],
          ['@routes', './core/routes'],
          ['@router', './router'],
          ['@models', './core/models'],
          ['@controllers', './core/controllers'],
          ['@middlewares', './core/middlewares'],
          ['@utils', './src/utils'],
          ['@shared', './src/shared'],
          ['@constants', './src/shared/constants'],
        ],
        extensions: ['.js', '.json'],
      },
    },
  },
};
