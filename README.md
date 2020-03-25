# 🪂 Eject dependencies

If you have dependencies in your `node_modules` folder, this package copies them to your source directory and changes all import references. It's like create-react-app's `eject` function but for all or some dependencies.

[![Node CI](https://img.shields.io/github/workflow/status/AnandChowdhary/eject-dependencies/Node%20CI?label=GitHub%20CI&logo=github)](https://github.com/AnandChowdhary/eject-dependencies/actions)
[![Travis CI](https://img.shields.io/travis/AnandChowdhary/eject-dependencies?label=Travis%20CI&logo=travis%20ci&logoColor=%23fff)](https://travis-ci.org/AnandChowdhary/eject-dependencies)
[![Coverage](https://coveralls.io/repos/github/AnandChowdhary/eject-dependencies/badge.svg?branch=master&v=2)](https://coveralls.io/github/AnandChowdhary/eject-dependencies?branch=master)
[![Dependencies](https://img.shields.io/librariesio/release/npm/eject-dependencies)](https://libraries.io/npm/eject-dependencies)
[![License](https://img.shields.io/npm/l/eject-dependencies)](https://github.com/AnandChowdhary/eject-dependencies/blob/master/LICENSE)
[![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/eject-dependencies.svg)](https://snyk.io/test/npm/eject-dependencies)
[![Based on Node.ts](https://img.shields.io/badge/based%20on-node.ts-brightgreen)](https://github.com/AnandChowdhary/eject-dependencies)
[![npm type definitions](https://img.shields.io/npm/types/eject-dependencies.svg)](https://unpkg.com/browse/eject-dependencies/dist/index.d.ts)
[![npm package](https://img.shields.io/npm/v/eject-dependencies.svg)](https://www.npmjs.com/package/node.ts)
[![npm downloads](https://img.shields.io/npm/dw/eject-dependencies)](https://www.npmjs.com/package/node.ts)
[![Contributors](https://img.shields.io/github/contributors/AnandChowdhary/eject-dependencies)](https://github.com/AnandChowdhary/eject-dependencies/graphs/contributors)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[![npm](https://nodei.co/npm/eject-dependencies.png)](https://www.npmjs.com/package/eject-dependencies)

## 💡 Usage

Install the package globally from [npm](https://www.npmjs.com/package/eject-dependencies):

```bash
npm install --save-global eject-dependencies
```

Use the CLI:

```bash
eject-dependencies

# With configuration (see options below)
eject-dependencies --source-dir './node_modules'
```

Or, use without installation using `npx`:

```bash
npx eject-dependencies
```

Or, use programmatically with the API:

```ts
import { eject } from "eject-dependencies";

// Default
eject();

// With configuration
eject({ sourceDir: "./node_modules" });
```

## Configuration

| Option                  | Description                               | Example value                  |
| ----------------------- | ----------------------------------------- | ------------------------------ |
| `sourceDir`             | `string` with dependencies dir            | `"./node_modules"`             |
| `destDir`               | `string` with dir to copy in              | `"./ejected"`                  |
| `codeFiles`             | `string[]` with glob files                | `["src/**/*.{js,jsx"]`         |
| `updateTestFiles`       | `boolean` to also update specfiles        | `true`                         |
| `dependenciesFilter` 📦 | `Function` to filter dependencies (`Set`) | `dependencies => dependencies` |

_📦 → This option is only supported by the API, not the CLI_

## 👩‍💻 Development

Build TypeScript:

```bash
npm run build
```

Run unit tests and view coverage:

```bash
npm run test-without-reporting
```

## 📄 License

[MIT](./LICENSE) © [Anand Chowdhary](https://anandchowdhary.com)
