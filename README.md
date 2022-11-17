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
yarn nx generate @nrwl/react:component Button --project=ui-kit --directory=components --export --no-interactive
```
