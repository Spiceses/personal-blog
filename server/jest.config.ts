// jest.config.ts
import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  moduleFileExtensions: ["js", "ts", "json", "node"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        // 关键：指定使用哪个 tsconfig 文件
        tsconfig: "tsconfig.jest.json",
        useESM: true,
      },
    ],
  },
  // 这个配置项告诉 Jest 如何处理模块导入路径
  moduleNameMapper: {
    // 这条规则使用正则表达式匹配所有以 '.js' 结尾的相对导入
    // 然后将 '.js' 替换掉，让 ts-jest 能够找到并处理对应的 '.ts' 源文件
    // 例如，它会将 './my-module.js' 的导入请求映射到 './my-module.ts'
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};

export default config;
