<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'LayoutDefault',

  components: {

  },

  data () {
    return {

    }
  }
}
</script>

<style >
  html,
  body,
  #app{
    height: 100%;
    margin: 0;
    padding: 0;
  }
  @import "./assets/css/main.css";
</style>
