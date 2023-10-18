# 性能监视
这个主要是给监控系统使用的,用于性能判断
```ts
getInstance(id).perf.on('load', (time: number) => {
  console.log(time)
})
```

默认只有两个事件：`load`/`bootstrap`,分别对应`html`加载和`js` 执行的时长