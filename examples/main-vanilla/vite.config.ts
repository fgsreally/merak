export default {
  define: {
    __DEV__: !process.env.CI,
  },
  server: {
    port: 5002,
  },
}
