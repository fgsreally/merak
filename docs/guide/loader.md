# 加载器
加载器负责获得`html`并进行处理


## `CompileLoader`(默认使用)
编译端将子应用中`script`,`link`标签位置标明，并添加到一个新标签上

`CompileLoader`拿到`html`，读取标签信息并修改`html`,返回给`merak`

> 当编译端设置`output`时，会将信息写入一个`json`,设置`loaderOptions`为文件的`url`，其就会从`json`中读取信息，而不用新标签了

## `SSRLoader`

直接从主应用`html`中获取对应的子应用模板，后续流程和`CompileLoader`一致

## `RuntimeLoader`
> 当编译端`loader`为`runtime`时使用

在浏览器中通过正则处理`script/link`的路径问题