const FFI_INCLUDE = '!_ffi_include '
const FFI_USING = '!_ffi_use '

export function ExpressionStatement (leaf, toString) {
  if (leaf.directive) {
    if (leaf.directive === 'use strict') {
      toString.useStrict = true
      return '/*use strict*/'
    }
    if (leaf.directive.startsWith(FFI_INCLUDE)) {
      return `\n#include "${leaf.directive.substring(FFI_INCLUDE.length)}"\n`
    }
    if (leaf.directive.startsWith(FFI_USING)) {
      return `using "${leaf.directive.substring(FFI_USING.length)}`
    }
  }
  return toString(leaf.expression) + ';'
}
