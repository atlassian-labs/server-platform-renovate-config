import chalk from 'chalk';
import { $ } from 'zx';

import { configFiles } from './util.mjs';

let failed = false;
for await (const file of await configFiles()) {
    try {
        const result = await $`RENOVATE_CONFIG_FILE=${file} node_modules/.bin/renovate-config-validator`;
    } catch (e) {
        failed = true;
    }
}

if (failed) {
    console.log(chalk.inverse.red('FAIL'), 'renovate-config-validator found issues with the config(s).');
    process.exit(1);
} else {
    console.log(chalk.inverse.green('SUCCESS'), 'All configs appear valid! ✅');
    process.exit(0);
}