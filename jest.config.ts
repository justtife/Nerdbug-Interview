import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["./"],
  testMatch: ["**/__tests__/**/*.+(js|ts)", "**/?(*.)+(spec|test).+(js|ts)"],
  moduleFileExtensions: ["js", "json", "ts", "node"],
};

export default config;
