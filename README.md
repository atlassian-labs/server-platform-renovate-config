# Atlassian Server/DC Platform Renovate config

Shared [Renovate config presets](https://docs.renovatebot.com/config-presets/) for Atlassian Server/DC platform repositories.

The Bitbucket repository `atlassian/dc-platform-renovate-config` is being archived, do not extend it. 

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
| `backend-reviewers-bbs` | reviewer list for Bitbucket Server repositories |

## Development

Node 22 (`nvm use`).

1. `npm install`
2. Edit the `*.json` presets
3. `npm test` validates every preset and checks regexes against RE2
