# ESTree-CPP

ESTree-CPP is a C++ code generator from ESTree AST (de-facto a standard of ECMAScript AST).

## Disclaimer

This tool does *not* do any type analysis in order to transform dynamic-typed JavaScript code to static-typed C++ code. Instead, it relies on **Universal Dynamic Wrapper** (UDW) - the class that can contain any value type and do type conversion in runtime.

## Example

```js
const ast = 
{
	type: "CallExpression",
	callee: {
		type: "Identifier",
		name: "setInterval"
	},
	arguments: [
		{
			type: "Identifier",
			name: "doSomething"
		},
		{
			type: "BinaryExpression",
			left: {
				type: "Literal",
				value: 60
			},
			operator: "*",
			right: {
				type: "Literal",
				value: 1000
			}
		}
	]
}
estreecpp.usage(ast, {
	wrapperClass: 'NJS::VAR', // a UDW class, required
	globalNamespace: 'NJS', // will be derived from `wrapperClass` by default
	indent: '\t',
	compact: false,
	classOverride: {
		// `Math` and other built-ins is treated as global variables by default.
		// However, you can override this by providing static classes/methods.
		// (Make sure you won't override methods in runtime
		// - otherwise it'll fallback to default and overrides will be ignored)
		Math: 'CustomMathMethods', // Will map everything to `CustomMathMethods::`
		window: {
			// Will map only methods specified here
			prompt: 'StaticWrapper::getline'
			close: 'StaticWrapper::exit'
		}
	}
});
```
Will output to:
```cpp
setInterval(doSomething, 60 * 1000);
```
