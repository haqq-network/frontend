# @haqq/frontend

## MUST READ DOCS

- [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [React](https://reactjs.org/)
- [Jest](https://jestjs.io/)
- [Testing library](https://testing-library.com/)
- [Cypress](https://docs.cypress.io/)
- [Storybook](https://storybook.js.org/)
- [PostCSS](https://postcss.org/)
- [Emotion](https://emotion.sh/)
- [Tailwind](https://tailwindcss.com/docs/)
- [NX](https://nx.dev)

## Stack

- React
- @emotion
- Jest
- Cypress
- Web3
- Tailwind CSS

## Development guide

### Usable commands

`@haqq/staking-app`

```bash
# start app
yarn nx staking:serve
# build app
yarn nx staking:build
# run tests
yarn nx staking:test
# run e2e tests
yarn nx staking-e2e:e2e
# start storybook
yarn nx staking:storybook
```

`@haqq/ui-kit`

```bash
# run tests
yarn nx ui-kit:test
# start storybook
yarn nx ui-kit:storybook
```

To create new `Button` component `ui-kit` package

```shell
yarn nx generate @nrwl/react:component Button --project=ui-kit --directory=components --export --pascalCaseDirectory --pascalCaseFiles --no-interactive
```
