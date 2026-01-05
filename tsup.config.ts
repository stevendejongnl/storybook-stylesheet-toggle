import { defineConfig, type Options } from "tsup";
import { readFile } from "fs/promises";

// Storybook 10 minimum Node version
const NODE_TARGET: Options["target"] = "node20.19";

type BundlerConfig = {
  bundler?: {
    managerEntries?: string[];
    previewEntries?: string[];
    nodeEntries?: string[];
  };
};

export default defineConfig(async (options) => {
  const packageJson = await readFile("./package.json", "utf8").then(JSON.parse) as BundlerConfig;
  const {
    bundler: {
      managerEntries = ["./src/manager.tsx"],
      previewEntries = ["./src/preview.ts", "./src/index.ts"],
      nodeEntries = ["./src/preset.ts"]
    } = {}
  } = packageJson;

  const commonConfig: Options = {
    splitting: true,
    minify: !options.watch,
    treeshake: true,
    sourcemap: true,
    clean: true
  };

  // Packages provided by Storybook - must be externalized
  const externalPackages = [
    "react",
    "react-dom",
    "@storybook/icons",
  ];

  const configs: Options[] = [];

  // Manager entries - Storybook toolbar UI
  if (managerEntries.length) {
    configs.push({
      ...commonConfig,
      entry: managerEntries,
      format: ["esm"],
      target: "esnext",
      platform: "browser",
      external: externalPackages
    });
  }

  // Preview entries - decorators and exports
  if (previewEntries.length) {
    configs.push({
      ...commonConfig,
      entry: previewEntries,
      dts: {
        resolve: true
      },
      format: ["esm"],
      target: "esnext",
      platform: "browser",
      external: externalPackages
    });
  }

  // Node entries - presets
  if (nodeEntries.length) {
    configs.push({
      ...commonConfig,
      entry: nodeEntries,
      format: ["esm"],
      target: NODE_TARGET,
      platform: "node"
    });
  }

  return configs;
});
