<template>
  <nav>
    <router-link to="/">Home</router-link> 
    <router-link to="/about">About</router-link>
  </nav>
  <div id="merak-symbol">vue-cli app from merak</div>
  <p style="color:green">{{data}}</p>
  <router-view />
</template>

<script setup lang="ts">
const data=window.$Merak.props.data|| ''
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  --el-color-primary: red
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
