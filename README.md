# Your project name

## Prepare steps:

1. Replace all `TODO_PROJECT_NAME` strings in all `.yaml` files under `.github/workflows/`
2. If project contains Rest API - provide it's description in `open-api/api.yaml`
3. Provide `TODO_GIT_URL` and `TODO_PROJECT_NAME` in `package.json`

## Tests

**Jest** is used for testing. Unit tests are placed under `/test` and must follow the naming convention
`<test_name>.test.ts` to be detectable by the framework. To run them use:

```
npm run test
```

You can run the tests directly from **Intellij** as well, to create a configuration:

*Edit configurations...* -> *Add new configuration* -> *Jest*

For more details, click <a href="https://www.jetbrains.com/help/idea/running-unit-tests-on-jest.html">**here**</a>.

## Linting and formatting

This project uses [Prettier](https://prettier.io/) and [ESLint](https://typescript-eslint.io/). Code **must** be
formatted and without any lint warnings/errors for all jobs to succeed.

There is no hook that automatically fix linting nor format issues, we don't want it to silently change developer's code
without his knowledge. **It is highly recommended** to integrate Prettier and ESLint into your IDE (for Intellij, there
are plugins for both tools: [Prettier plugin](https://www.jetbrains.com/help/idea/prettier.html),
[ESLint plugin](https://www.jetbrains.com/help/idea/eslint.html)) and integrate it on your own way.

However, you can manually fix all the issues as well by running

- `npm run format`
- `npm run lint-fix`

## Docker

```
docker build -t block42/TODO_PROJECT_NAME .
docker run -p 3000:3000 -d block42/TODO_PROJECT_NAME
```
