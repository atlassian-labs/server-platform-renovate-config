# Atlassian DC Platform Renovate config

Shared [Renovate config presets](https://docs.renovatebot.com/config-presets/) for Atlassian DC platform / product repositories.

## Usage

### Backend (Maven / Java)

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "github>atlassian-labs/server-platform-renovate-config:backend"
  ]
}
```

### Frontend (JavaScript / TypeScript / Node)

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "github>atlassian-labs/server-platform-renovate-config:frontend"
  ]
}
```

Presets combine with each other and with Renovate's built-in presets:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "github>atlassian-labs/server-platform-renovate-config:frontend",
    "github>atlassian-labs/server-platform-renovate-config:npm-automerge",
    "packages:linters",
    "packages:jsTest"
  ]
}
```

## Presets

| Preset | Purpose |
|---|---|
| `backend` | `common` + node and maven rules, major updates disabled |
| `frontend` | `common` + node and maven rules, branch prefix `issue/renovate-` |
| `common` | `config:base`, weekend schedule, patch grouping, OSV summary on the dependency dashboard |
| `package-rules-maven` | version allow and deny lists for Maven artifacts (Atlassian forks, off-flavour qualifiers) |
| `package-rules-node` | groups lint, test, Babel, webpack/Rspack bundler and rollup packages; includes `frontend-atlaskit-react` |
| `frontend-atlaskit-react` | Atlaskit and React upgrade rules per branch type |
| `npm-automerge` | marks npm bumps for renovate-automerger, keeps a human only on the "Common across DC" cases |

## Development

Node 24 (`nvm use`).

The bot version is set by [`RENOVATE_VERSION` in renovate-bot's `scripts/settings.sh`](https://bitbucket.org/atlassian/renovate-bot/src/HEAD/scripts/settings.sh#lines-3). Stash and Bitbucket Cloud use the same version but run on different runners. Pull requests and local tests use the Renovate npm package pinned in `package.json`.

1. `npm install`
2. Edit the `*.json` presets
3. `npm test` validates every preset with the production Renovate version and checks regexes against RE2
