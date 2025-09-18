# yargs-parser@22 problem when webpack'd

## What is this repo about?

This is a minimal reproduction of a problem we faced when webpack'ing a project that relies on yargs-parser@22.

## The problem

yargs-parser@22 when webpack'd, with node_modules, generates the yargs-parser's require bound to the file path resolving to `/path/to/project/node_modules/yargs-parser/build/lib/index.js` using node's createRequire. The problem is that the path being statically coded in the final dist does not account for the fact that the project could run on different OS where the path from one OS won't necessarily be valid for another OS.

In our case, we were running webpack on ubuntu and the final output is supposed to be used on macOS / Linux / Windows and it fails immediately on Windows with error:

```
TypeError: The argument 'filename' must be a file URL object, file URL string, or absolute path string. Received 'file:///path/to/project/where/webpack/ran/node_modules/yargs-parser/build/lib/index.js'
```

The identified source of the problem from the stack trace is [this line](https://github.com/yargs/yargs-parser/blob/60f2db5dacde1e94f960ce0941a717f3f422f865/lib/index.ts#L34C7-L34C14).

## Steps to reproduce

1. Clone this repo on a macos / linux host
2. Run `npm run build` in terminal
3. Copy the dist to a windows machine and run `node dist/args-parser.js`

## Expected result

console.log output to be shown

## Actual result

An error on stderr

```
node:internal/modules/cjs/loader:1906
      throw new ERR_INVALID_ARG_VALUE('filename', filename,
      ^

TypeError [ERR_INVALID_ARG_VALUE]: The argument 'filename' must be a file URL object, file URL string, or absolute path string. Received 'file:///Users/some-user/path/to/yargs-parser-webpack-issue-repro/node_modules/yargs-parser/build/lib/index.js'
    at createRequire (node:internal/modules/cjs/loader:1906:13)
    at 657 (C:\path\to\args-parser.js:2:1633)
    at n (C:\path\to\args-parser.js:2:15714)
    at 814 (C:\path\to\args-parser.js:2:15526)
    at n (C:\path\to\args-parser.js:2:15714)
    at C:\path\to\args-parser.js:2:16081
    at Object.<anonymous> (C:\path\to\args-parser.js:2:16106)
    at Module._compile (node:internal/modules/cjs/loader:1706:14)
    at Object..js (node:internal/modules/cjs/loader:1839:10)
    at Module.load (node:internal/modules/cjs/loader:1441:32) {
  code: 'ERR_INVALID_ARG_VALUE'
}
```
