const path = require('path');

module.exports = {
  preset: '@vue/cli-plugin-unit-jest',

  moduleFileExtensions: ["js", "vue"],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.mjs$': 'babel-jest',
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!vuetify)',
  ],
  rootDir: path.resolve(__dirname, './'),
  testMatch: [
    "**/tests/**/*.spec.[jt]s?(x)",
    "**/__tests__/*.[jt]s?(x)"
  ],
};
