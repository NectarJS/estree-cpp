# ESTree-CPP

Transpile your ECMAScript to NectarCPP using ESTree AST.

### Current supported ECMAScript version: **ES5**


## Disclaimer

This tool does *not* do proper type analysis in order to transform dynamic-typed JavaScript code to static-typed C++ code. Instead, it relies on **Universal Dynamic Wrapper** (UDW) - the class that can contain any JS value type and do type conversion in runtime (but can do some in compile-time).

## Usage

CLI:
```sh
$ estree-cpp example.js > example.cpp
$ estree-cpp - < example.js
```

Code:
```js
const code = `setInterval(() => console.log('Hello world!'), 60 * 1000)`
estreecpp(code, {
	stack: {
		// C++ native namespaces
		namespace: 'NectarCore::',
		globalNamespace: `NectarCore::Global::`,
		classNamespace: `NectarCore::Class::`,
		// Supplied non-builtin global variables
		globalsUsed: []
	},
	parser: {
		// Options passed to Acorn
	}
})
```
