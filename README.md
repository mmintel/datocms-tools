# Vanilla JS Module Starter
This just creates a super minimal JS file that is importable as a module.

* adds very basic webpack config to compile and minify modern js code
* defines alias to directly import from `./lib` using `@/your/path` => `lib/your/path`
* adds common files to .gitignore
* configures babel
* adds eslint
* adds editorconfig
* adds nvmrc (maybe you should update)
* adds simple tests for Gitlab CI
* adds jest
* runs lint, test and build script before commit
* includes `/dist/` folder so it can be installed directly