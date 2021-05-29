# Introduction

Bootstrap and package your project with Angular 11 and Electron 12 (Typescript + SASS + Hot Reload) for creating Desktop applications.

Currently runs with:

- Angular v11.2.8
- Electron v12.0.2
- Electron Builder v22.10.5

With this sample, you can:

## How to Build

### Preinstallation

- git bash
- node
- npm
- Angular/CLI


### Build
```
1. Install dependencies with npm in the project folder:

``` bash
npm install
```
2. Build

``` bash
npm run electron:build
```

## Included Commands

|Command|Description|
|--|--|
|`npm run ng:serve`| Execute the app in the browser |
|`npm run build`| Build the app. Your built files are in the /dist folder. |
|`npm run build:prod`| Build the app with Angular aot. Your built files are in the /dist folder. |
|`npm run electron:local`| Builds your application and start electron
|`npm run electron:build`| Builds your application and creates an app consumable based on your operating system |
