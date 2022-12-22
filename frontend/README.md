# Frontend
The frontend was created from scratch (i.e. without create-react-app) to keep things minimal and more customisable.
We also avoid [issues](https://stackoverflow.com/questions/65893787/create-react-app-with-typescript-and-npm-link-enums-causing-module-parse-failed) with npm workspaces by creating it manually

## JS
The frontend uses react with react query for all communication to the server.

## Testing
To run tests use `npm test`.
We use jest for tests, [it has limited esm support atm](https://jestjs.io/docs/ecmascript-modules) but most of this is handled by using ts-jest which transpiles it the same way the rest of the code is. For jest we need to add cross-fetch to polyfill the fetch command (as jest is run in node which doesn't have a native fetch).
We have a tsconfig.build.json as we don't want to transpile the test files but we also want the vs-code ts language service to be aware of jsx. We set the default tsconfig.json to be for the ide, and the tsconfig.build.json is the file actually used to transpile everything.

## CSS
The site is designed as mobile first. This was decided for the normal reasons
i.e. mobile will be used most, easier to adjust up than down in size with css-queries