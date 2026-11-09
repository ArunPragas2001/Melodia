const { defineConfig } = require('eslint/config');
const expo = require('eslint-config-expo/flat');
const globals = require('globals');
module.exports = defineConfig([
  expo,
  { ignores: ['dist/**', '.expo/**'] },
  { files: ['scripts/*.cjs'], languageOptions: { globals: globals.node } },
  { files: ['scripts/browser-smoke.cjs'], languageOptions: { globals: globals.browser } },
]);
