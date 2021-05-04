# vacslot

## <img src="./docs/assets/vacslotBanner.jpg" alt="vacslot">

---

<p align="center">
  <a href="https://github.com/regalstreak/vacslot/releases/">Download</a> •
  <a href="#screenshots">Screenshots</a> •
  <a href="#features">Features</a> •
  <a href="#building">Building</a> •
  <a href="#credits">Credits</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

## Screenshots

<img height="600" src="./docs/assets/screenLight.png" alt="vacslot">&nbsp;&nbsp;&nbsp;
<img height="600" src="./docs/assets/screenDark.png" alt="vacslot">

## Features

-   Vaccine slot local notifications
-   State and District selections
-   Hide results having minimum age of 45
-   Dark theme (if enabled on system)

## Building

To clone and run this app, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) installed on your computer,

### `yarn start`

Starts the react-native bundler.

### `yarn android`

Builds and runs the app for Android.

### `yarn ios`

Builds and runs the app for iOS.

### `yarn test`

Launches the test runner in the interactive watch mode.

## Credits

This app uses the following amazing open source packages:

-   [React Native](https://reactnative.dev/)
-   [React Native Paper](https://callstack.github.io/react-native-paper/)
-   [Codepush](https://github.com/microsoft/react-native-code-push)
-   [React Query](https://react-query.tanstack.com/)
-   [React Native Background Fetch](https://github.com/transistorsoft/react-native-background-fetch)

## Contributing

-   Clone
-   Create a `<type>-` prefixed branch where `<type>` is a type from the below list
-   Make a pull request

We follow the conventional commit message spec. It's recommended that you read more about it below or on [conventionalcommits.org](https://www.conventionalcommits.org/).

Basically, the commit messages should be of the following form:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types include and are limited to:
| Type | Version Bump | Description and used for |
| :----: | :---: |-----------------------|
| feat | minor | New features |
| fix | patch | Fixing bugs |
| revert | patch | Reverting commits |
| perf | patch | Performance improvements |
| refactor | patch | Refactoring code without changing functionality |
| build | patch | Build-system changes (deps, webpack, etc.) |
| chore | patch | General chores like version bump, merges, etc |
| ci | patch | CI/CD related changes |
| docs | none | Documentation |
| test | none | Adding/improving tests |
| style | none | Code-style, formatting, white-space, etc |

-   !: A commit that appends a `!` after the type/scope, introduces a breaking API change. A BREAKING CHANGE can be part of commits of any type and introduces a major version bump.
-   A scope of `norelease` with any commit message type will not bump a release version.

## License

MIT

---

> [Neil Agarwal](https://twitter.com/regalstreak) &nbsp;&middot;&nbsp;
> GitHub [@regalstreak](https://github.com/regalstreak) &nbsp;&middot;&nbsp;
> Twitter [@regalstreak](https://twitter.com/regalstreak) &nbsp;&middot;&nbsp;
> LinkedIn [@agarwal-neil](https://www.linkedin.com/in/agarwal-neil)
