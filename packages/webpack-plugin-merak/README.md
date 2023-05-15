# webpack-plugin-merak

```ts
const { Merak, merakPostCss } = require('webpack-plugin-merak')

module.exports = {
  devtool: 'source-map',
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': '*',
    },
  },

  plugins: [new Merak(id, [...globals])],
}
```