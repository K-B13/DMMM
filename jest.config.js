const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  preset: 'ts-jest',
  testMatch: ['**/tests/**/*.test.ts'],
  transform: {
    ...tsJestTransformCfg,
  },
};