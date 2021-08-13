# ESTree-CPP

Transpile your ECMAScript to NectarCPP using ESTree AST.

### Current supported ECMAScript version: **ES5**


## Disclaimer

This tool does *not* do any type analysis in order to transform dynamic-typed JavaScript code to static-typed C++ code. Instead, it relies on **Universal Dynamic Wrapper** (UDW) - the class that can contain any value type and do type conversion in runtime.

## Usage

CLI:
```sh
$ estree-cpp example.js > example.cpp
$ estree-cpp - < example.js
```

Code:
```js
const code = `setInterval(() => console.log('Hello world!'), 60 * 1000)`
estreecpp(code)
```
