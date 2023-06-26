<div align="center">
  <img src="apps/website/assets/images/logo.svg" alt="Logo" width="80" height="80">

  <h2 align="center">HAQQ Frontend Monorepo</h2>

  <p align="center">
    Home of all HAQQ frontend apps
    <br />
    ⭐ Star us on GitHub — it motivates us a lot!
    <br />
    <br />
    <a href="https://github.com/haqq-network/frontend/issues/new">Report Bug</a>
    ·
    <a href="https://github.com/haqq-network/frontend/issues/new">Request Feature</a>
  </p>
</div>

## Applications and websites

| Description          | Domain                          | Source code             |
| -------------------- | ------------------------------- | ----------------------- |
| Homepage             | https://haqq.hetwork            | [Open](apps/website)    |
| Shell app            | https://shell.haqq.network      | [Open](apps/shell)      |
| Staking app          | https://staking.haqq.network    | [Open](apps/staking)    |
| Governance app       | https://governance.haqq.network | [Open](apps/governance) |
| TestEdge2 Faucet app | https://testedge2.haqq.network  | [Open](apps/faucet)     |
| Vesting app          | https://vesting.haqq.network    | [Open](apps/vesting)    |

## Development guide

<details>
  <summary>Must read docs</summary>
  <ol>
    <li>
      <a href="https://www.conventionalcommits.org/en/v1.0.0">Conventional commits</a>
    </li>
    <li><a target="_blank" rel="noopener noreferrer" href="https://reactjs.org">React</a></li>
    <li><a target="_blank" rel="noopener noreferrer" href="https://jestjs.io">Jest</a></li>
    <li><a target="_blank" rel="noopener noreferrer" href="https://testing-library.com">Testing library</a></li>
    <li><a target="_blank" rel="noopener noreferrer" href="https://docs.cypress.io">Cypress</a></li>
    <li><a target="_blank" rel="noopener noreferrer" href="https://storybook.js.org">Storybook</a></li>
    <li><a target="_blank" rel="noopener noreferrer" href="https://postcss.org">PostCSS</a></li>
    <li><a target="_blank" rel="noopener noreferrer" href="https://tailwindcss.com/docs">Tailwind</a></li>
    <li><a target="_blank" rel="noopener noreferrer" href="https://nx.dev">NX</a></li>
  </ol>
</details>

### Usable commands

`@haqq/staking-app`

```shell
# start app
yarn nx serve staking
# build app
yarn nx build staking
# run tests
yarn nx test staking
# run e2e tests
yarn nx e2e staking-e2e
# start storybook
yarn nx storybook staking
```

`@haqq/ui-kit`

```shell
# run tests
yarn nx test ui-kit
# start storybook
yarn nx storybook ui-kit
```

To create new `Button` component `ui-kit` package

```shell
yarn nx generate @nx/react:component Button --project=ui-kit --directory=components --export --no-interactive
```
