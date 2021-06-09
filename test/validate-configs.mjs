import chalk from 'chalk';
import { $ } from 'zx';

import { configFiles } from './util.mjs';

// be quiet!
$.verbose = false;

let failed = false;
for await (const file of await configFiles()) {
    try {
        await $`RENOVATE_CONFIG_FILE=${file} node_modules/.bin/renovate-config-validator`;
        console.log(`✅ "${file}" validated!`);
    } catch (e) {
        console.log(`❌ Checking "${file}" failed:\n`, chalk.red(e.stdout.split('ERROR:')[1]));
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