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
estreecpp(ast)
```
Will output to:
```cpp
setInterval(doSomething, 60 * 1000);
```
