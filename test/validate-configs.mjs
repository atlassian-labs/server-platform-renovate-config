import chalk from 'chalk';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { $ } from 'zx';

import { configFiles } from './util.mjs';

// be quiet!
$.verbose = false;

const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'renovate-presets-'));

// Presets can't know the consumer's base branches, so the validator would warn on every matchBaseBranches.
const withBaseBranchStub = async (file) => {
    const config = JSON.parse(await fs.promises.readFile(file, 'utf8'));
    const usesMatchBaseBranches = (config.packageRules ?? []).some(rule => rule.matchBaseBranches);
    if (!usesMatchBaseBranches || config.baseBranchPatterns) {
        return file;
    }
    const stubFile = path.join(tmpDir, file);
    await fs.promises.writeFile(stubFile, JSON.stringify({ ...config, baseBranchPatterns: ['$default'] }));
    return stubFile;
}

let failed = false;
for await (const file of await configFiles()) {
    try {
        const configFile = await withBaseBranchStub(file);
        await $`RENOVATE_CONFIG_FILE=${configFile} node_modules/.bin/renovate-config-validator`;
        console.log(`✅ "${file}" validated!`);
    } catch (e) {
        console.log(`❌ Checking "${file}" failed:\n`, chalk.red(e.stdout));
        failed = true;
    }
}

await fs.promises.rm(tmpDir, { recursive: true, force: true });

if (failed) {
    console.log(chalk.inverse.red('FAIL'), 'renovate-config-validator found issues with the config(s).');
    process.exit(1);
} else {
    console.log(chalk.inverse.green('SUCCESS'), 'All configs appear valid! ✅');
    process.exit(0);
}
