import { isConfigRegex } from 'renovate/dist/util/regex.js';
import fs from 'fs';
import { extname } from 'path';
import chalk from 'chalk';
import RE2 from 're2';

const dirEntries = await fs.promises.readdir('.', { withFileTypes: true });
const dirFiles = dirEntries.filter(dirent => dirent.isFile());
const jsonFileNamesExtPackage = dirFiles
    .filter(dirent => extname(dirent.name) === ".json")
    .map(dirent => dirent.name)
    .filter(name => name !== "package.json" && name !== "package-lock.json");


const toArray = (arrOrStringOrVoid) => {
    if (!arrOrStringOrVoid) {
        return [];
    }

    if (!Array.isArray(arrOrStringOrVoid)) {
        return [arrOrStringOrVoid];
    }

    return arrOrStringOrVoid;
}

const checkRegexPatterns = (input) => {
    const inputArr = toArray(input);

    let errors = [];
    inputArr.forEach(regexp => {
        try {
            new RE2(regexp)
        } catch(e) {
            errors.push(`Checking regex "${chalk.red(regexp)}" failed with: ${chalk.red(e.message)}`);
        }
    });

    return errors;
}

const checkAllowPatterns = (input) => {
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
        error += `${chalk.bold('rule.matchPackagePatterns')} has the following issues:
  - ${packageErrors.join('\n  - ')}`
    }

    return error;
}

const errorReport = [];
for await (const fileName of jsonFileNamesExtPackage) {
    const content = JSON.parse(await fs.promises.readFile(fileName));
    if (!content.packageRules) {
        console.log(`No package rules found in "${fileName}". Skipping…`);
        continue;
    }

    const errors = content.packageRules.map(rule => {
        // allowedVersions are checked for regex via util method "isConfigRegex"
        const allowErrors = checkAllowPatterns(rule.allowedVersions);
        // matchPackagePatterns are all treated as potential regexp and need a different check mechanism
        const packageErrors = checkRegexPatterns(rule.matchPackagePatterns);
        return formatRuleError(rule, allowErrors, packageErrors);
    }).filter(Boolean);

    if (errors.length) {
        errorReport.push(`
--------------FILE ${chalk.bold(fileName)}-------------------
${errors.join('\n\n')}
--------------END FILE ${fileName}-------------------
`)
    }
}

if (errorReport.length > 0) {
    console.error(errorReport.join('\n'));
    console.error(chalk.red.inverse("FAIL"))
    process.exit(1)
} else {
    console.log('All Regex look used in "allowedVersions" and "matchPackagePatterns" look valid. ✅');
    process.exit(0)
}



