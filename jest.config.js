const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
 setupFiles: ["<rootDir>/test/setup-tests.ts"],
 testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
};
