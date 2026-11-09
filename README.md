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
| `package-rules-node` | groups lint, test, babel, webpack and rollup packages; includes `frontend-atlaskit-react` |
| `frontend-atlaskit-react` | Atlaskit and React upgrade rules per branch type |
| `npm-automerge` | marks npm bumps for renovate-automerger, keeps a human only on the "Common across DC" cases |

## Development

Node 24 (`nvm use`).

The bots currently run Renovate 43.181.2. That can change, so check [`RENOVATE_VERSION` in renovate-bot's `scripts/settings.sh`](https://bitbucket.org/atlassian/renovate-bot/src/HEAD/scripts/settings.sh#lines-3) for the live version. Stash and Bitbucket Cloud use the same version but run on different runners. `npm test` validates with Renovate 44, so check that any new option already exists in the bot version. Splunk alerts to Slack will notify us in case of any breaking changes. Heads up: In DCA11Y-4239 we're going to  validate configs against the exact renovate-bot and Stash bot versions in the renovate config validator skill.

1. `npm install`
2. Edit the `*.json` presets
3. `npm test` validates every preset and checks regexes against RE2
