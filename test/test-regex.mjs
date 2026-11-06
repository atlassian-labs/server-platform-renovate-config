import fs from 'fs';
import chalk from 'chalk';
import RE2 from 're2';

import { configFiles } from './util.mjs';

const isConfigRegex = (value) => {
    return ["/", "!/"].some(prefix => value.startsWith(prefix)) && value.endsWith("/");
}

const toArray = (arrOrStringOrVoid) => {
    if (!arrOrStringOrVoid) {
        return [];
    }

    if (!Array.isArray(arrOrStringOrVoid)) {
        return [arrOrStringOrVoid];
    }

    return arrOrStringOrVoid;
}

const stripRegexDelimiters = (value) => value.replace(/^!?\//, '').replace(/\/$/, '');

const checkRegexPatterns = (input) => {
    const inputArr = toArray(input);

    let errors = [];
    inputArr.forEach(regexp => {
        try {
            new RE2(stripRegexDelimiters(regexp))
        } catch(e) {
            errors.push(`Checking regex "${chalk.red(regexp)}" failed with: ${chalk.red(e.message)}`);
        }
    });

    return errors;
}

// Renovate only treats /.../ and !/.../ values as regex, the rest are exact names or globs.
const checkConfigRegexPatterns = (input) => {
    const inputArr = toArray(input);
    
    return checkRegexPatterns(inputArr.filter(isConfigRegex));
}

const formatRuleError = (rule, allowErrors, packageErrors) => {
    if (allowErrors.length === 0 && packageErrors.length === 0) {
        return undefined;
    }

    let error = `An error was found with rule:
${chalk.yellow(JSON.stringify(rule, null, 4))}

`;
    if (allowErrors.length > 0) {
        error += `${chalk.bold('rule.allowedVersions')} has the following issues:

  - ${allowErrors.join('\n  - ')}`
    }

    if (packageErrors.length > 0) {
        error += `${chalk.bold('rule.matchPackageNames')} has the following issues:
  - ${packageErrors.join('\n  - ')}`
    }

    return error;
}

const errorReport = [];
const jsonFileNamesExtPackage = await configFiles();
for await (const fileName of jsonFileNamesExtPackage) {
    const content = JSON.parse(await fs.promises.readFile(fileName));
    if (!content.packageRules) {
        console.log(`No package rules found in "${fileName}". Skipping…`);
        continue;
    }

    const errors = content.packageRules.map(rule => {
        const allowErrors = checkConfigRegexPatterns(rule.allowedVersions);
        const packageErrors = checkConfigRegexPatterns(rule.matchPackageNames);
        return formatRuleError(rule, allowErrors, packageErrors);
    }).filter(Boolean);

    if (errors.length) {
        errorReport.push(`
--------------FILE ${chalk.bold(fileName)}-------------------
${errors.join('\n\n')}
--------------END FILE ${fileName}-------------------
`)
    } else {
        console.log(`✅ All regex patterns in file "${fileName}" passed!`);
    }
}

if (errorReport.length > 0) {
    console.error(errorReport.join('\n'));
    console.error(chalk.red.inverse("FAIL"))
    process.exit(1)
} else {
    console.log(chalk.inverse.green('SUCCESS'), 'All regex used in "allowedVersions" and "matchPackageNames" look valid! ✅');
    process.exit(0)
}



