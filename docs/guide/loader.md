# 加载器
加载器负责获得`html`并进行处理


## `CompileLoader`(默认使用)
编译端将子应用中`script`,`link`标签位置标明，并添加到一个新标签上

`CompileLoader`拿到`html`，读取标签信息并修改`html`,返回给`merak`

## `SSRLoader`
直接从主应用`html`中获取对应的子应用模板，返回给`merak`