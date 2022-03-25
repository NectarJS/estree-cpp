export function FunctionExpression (leaf, toString) {
  let str = 'new NectarCore::Type::function_t([&](NectarCore::VAR __Nectar_THIS,NectarCore::VAR* __Nectar_VARARGS,int __Nectar_VARLENGTH)->NectarCore::VAR{'
  str += 'NectarCore::VAR arguments=NectarCore::Class::Array(__Nectar_VARARGS,__Nectar_VARARGS+__Nectar_VARLENGTH);'
  for (let i = 0; i < leaf.params.length; i++) {
    str += `auto ${toString(leaf.params[i])}=arguments[${i}];`
  }
  str += toString(leaf.body)
  str += '})'
  return str
}
