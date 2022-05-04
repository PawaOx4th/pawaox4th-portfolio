/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
// @ts-nocheck
// jest.config.js

const nextJest = require("next/jest")

function makeModuleNameMapper(srcPath, tsconfigPath) {
  // Get paths from tsconfig
  const { paths } = require(tsconfigPath).compilerOptions

  const aliases = {}

  // Iterate over paths and convert them into moduleNameMapper format
  Object.keys(paths).forEach((item) => {
    const key = item.replace("/*", "/(.*)")
    const path = paths[item][0].replace("/*", "/$1")
    aliases[key] = `${srcPath}/${path}`
  })
  return aliases
}

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./"
})

const TS_CONFIG_PATH = "./tsconfig.json"
const MAIN_PATH = "<rootDir>/"
// Add any custom config to be passed to Jest
const customJestConfig = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom",
  clearMocks: true,
  moduleNameMapper: makeModuleNameMapper(MAIN_PATH, TS_CONFIG_PATH)
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
