<template>
  <div id="app">
    <hello></hello>
    <map></map>
  </div>
</template>
<script>
  import Hello from './components/Hello'
  import map from './components/Map'
  export default {
    components: {
      Hello,
      map
    }
  }
</script>
<style>
  html {
    height: 100%;
    margin:0;
    padding:0;
  }

  body {
    padding:0;
    margin:0;
    display: flex;
    height: 100%;
  }

</style>
