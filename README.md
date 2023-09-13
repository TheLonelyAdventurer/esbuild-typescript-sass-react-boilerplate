# esbuild-typescript-sass-react-yarn-boilerplate

This boilerplate provides an environment with yarn3, esbuild, typescript, sass and React. Sass import modules are supported as well[^1].

This boilerplate uses Node Modules.

## Default Packages

| Name                                         | Version      | Context | Usage
|----------------------------------------------|--------------|---------|-----------------
| react                                        | ^18.2.0      | Runtime | Main framework
| react-bootstrap                              | ^2.7.4       | Runtime | Demo
| react-dom                                    | ^18.2.0      | Runtime | Main framework
| @squirrelnetwork/esbuild-sass-modules-plugin | ^1.0.9       | Builder | Import SASS in js/ts sources
| @types/react                                 | ^18.2.9      | Coding  | Type declarations
| @types/react-dom                             | ^18.2.4      | Coding  | Type declarations
| @yarnpkg/fslib                               | ^3.0.0-rc.45 | Builder | ZipFS lookup
| @yarnpkg/libzip                              | ^3.0.0-rc.45 | Builder | ZipFS lookup
| dotenv-safe                                  | ^8.2.0       | Builder | Build configuration
| esbuild                                      | ^0.17.19     | Builder | JS/TS Compiler/Bundler
| gulp                                         | ^4.0.2       | Builder | Task Runner[^2]
| path                                         | ^0.12.7      | Builder | Path resolution
| pnpapi                                       | ^0.0.0       | Builder | Yarn module resolution
| postcss                                      | ^8.4.24      | Builder | Demo
| sass                                         | ^1.63.4[^3]  | Builder | SASS/SCSS sources
| typescript                                   | ^5.1.3       | Coding  | Type checking[^4]
| url                                          | ^0.11.1      | Builder | Path resolution

### Project structure
| Path               | Description
|--------------------|------------------------------
| /                  | Configuration files and utils
| dist/              | Built files and index.html
| importers/         | Custom ESBuild plugins[^5]
| src/               | The actual sources of your app
| .env.example       | The example of a .env (see paragraph *Configuration*)
| builder.js         | The code that runs the builder and defines the tasks
| builder.utils.js   | Utils used for plugins like the custom ZipFS SASS module lookup
| Gulpfile.js        | An example Gulpfile which defines build tasks for Gulp
| LICENSE            | This repository is licensed under the MIT license
| package.json       | Project dependencies
| README.md          | This file
| simple-importer.js | The plugin used to load the custom JSON & js importers[^5]
| tsconfig.json      | Used by `esbuild` for building and by `typescript` for editors[^4]

### Build chain
#### Launch
You can launch the building process either by calling the `build()` procedure inside [builder.js](./builder.js) or with the example Gulp task `build`.

#### Configuration
Configuration is handled with environment variables (see [dotenv-safe](https://www.npmjs.com/package/dotenv-safe)).

#### Build process
The project is built by esbuild, which in the pre-compilation phase delegates specific modules to plugins, such as the SASS one I use in this example, according to their filters.
The npm package `typescript` is *not* involved in this process[^4].

### Post-build actions
There are no post-build actions in this project (except for the `serve` task, which is provided by esbuild).

## Other frameworks
### TODO
1. Vue
2. Angular
3. ...

---

[^1]: Via importers (check the wiki)
[^2]: You can use any Task Runner with this configuration.
  I just chose Gulp because it's simple enough to configure a demo.
[^3]: Warning: versions 1.63.0<1.63.4 have a [bug (sass/dart-sass#1995)](https://github.com/Squirrel-Network/esbuild-sass-modules-plugin#:~:text=1.63.0%20because%20of-,sass/dart%2Dsass%231995,-The%20issue%20has) which causes SASS to be unable to be imported.
[^4]: TypeScript is not actually used in the build process because esbuild can build typescript by itself.
  You don't actually need it, but some editors will complain if it is not installed.
[^5]: Custom plugins are already handled by esbuild, but I provide a way to also load them as JSON for simple loaders, especially with such cases like SASS import urls whose modules do not resolve in the Yarn context (esbuild only handles this for direct dependencies).
  You might want to look at the wiki of this project for how to implement path resolvers.
  I provide an example loader [bootstrap-icons.json](/importers/bootstrap-icons.json).
