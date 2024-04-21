const MagicString = require('magic-string')
const magicString = new MagicString('var a = 1;')
const variableIndex = 4 // 假设数字 1 的位置是变量位置
magicString.prependRight(0, 'const ') // 在代码开头添加了 'const '
magicString.overwrite(variableIndex, variableIndex + 1, 'b') // 将变量名从 'a' 改为 'b'

// 现在您知道数字 1 的位置是变量位置，但是在对magicString进行了一系列操作后，变量位置可能发生了变化
// 您可以使用`original`方法来获取更新后的位置
// const updatedVariableIndex = magicString.original(variableIndex)

console.log(magicString.original) // 输出更新后的位置
