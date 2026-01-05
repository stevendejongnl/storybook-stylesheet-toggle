#!/usr/bin/env zx

import boxen from "boxen";
import dedent from "dedent";
import { readFile } from 'fs/promises';

const packageJson = await readFile('./package.json', 'utf8').then(JSON.parse);

const name = packageJson.name;
const displayName = packageJson.storybook.displayName;

let exitCode = 0;
$.verbose = false;

/**
 * Check that meta data has been updated
 */
if (name.includes("addon-kit") || displayName.includes("Addon Kit")) {
  console.error(
    boxen(
      dedent`
      ${chalk.red.bold("Missing metadata")}

      ${chalk.red(dedent`Your package name and/or displayName includes default values from the Addon Kit.
      The addon gallery filters out all such addons.

      Please configure appropriate metadata before publishing your addon. For more info, see:
      https://storybook.js.org/docs/react/addons/addon-catalog#addon-metadata`)}`,
      { padding: 1, borderColor: "red" }
    )
  );

  exitCode = 1;
}

/**
 * Check that README has been updated
 */
const readmeTestStrings =
  "# Storybook Addon Kit|Click the \\*\\*Use this template\\*\\* button to get started.|https://user-images.githubusercontent.com/42671/106809879-35b32000-663a-11eb-9cdc-89f178b5273f.gif";

if ((await $`cat README.md | grep -E ${readmeTestStrings}`.exitCode) == 0) {
  console.error(
    boxen(
      dedent`
        ${chalk.red.bold("README not updated")}

        ${chalk.red(dedent`You are using the default README.md file that comes with the addon kit.
        Please update it to provide info on what your addon does and how to use it.`)}
      `,
      { padding: 1, borderColor: "red" }
    )
  );

  exitCode = 1;
}

/**
 * Check that globalized packages are not incorrectly listed as peer dependencies
 * Note: Skipped for Storybook 10+ as @storybook/manager and @storybook/preview no longer exist
 */
// In Storybook 10+, the global packages check is not applicable as the architecture changed
// The addon only has 'storybook' as a peer dependency, which is correct

process.exit(exitCode);