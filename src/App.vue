<template>
  <div id="app">
    <Curriculum msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import Curriculum from './components/Curriculum'

export default {
  name: 'App',
  components: {
    Curriculum
  }
}
</script>

<style>
html{
  height: 100%;
  background: hsla(0,0%,82%,.3);
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>./components/Curriculum.vue
