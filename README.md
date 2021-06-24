# Atlassian DC Platform Renovate config

A collection of shared [Renovate config presets][renovate-config-presets] you can use in your project.

## Example usage in `renovate.json`

## Backend rules

The [backend preset](./backend.json) you can use in Maven and Java codebase:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:base",
    "github>atlassian-labs/server-platform-renovate-config:backend"
  ]
}
```

## Frontend rules

The [frontend preset](./frontend.json) you can use in JavaScript, TypeScript, and Node codebase:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:base",
    "github>atlassian-labs/server-platform-renovate-config:frontend"
  ]
}
```

You can combine as many Renovate presets as you want:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:base",
    "github>atlassian-labs/server-platform-renovate-config:backend",
    "github>atlassian-labs/server-platform-renovate-config:frontend",
    "packages:linters",
    "packages:jsTest"
  ]
}
```

## Development guide

This project requires Node v14. You can use [`nvm`][nvm] to install and select required Node version.

0. Run `nvm use`
1. Run `npm install`
2. Add changes to the `*.json` files
3. Run `npm test` to validate the changes

[renovate-config-presets]: https://docs.renovatebot.com/config-presets
[nvm]: https://github.com/nvm-sh/nvm
