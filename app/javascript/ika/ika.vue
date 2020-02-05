<template lang="pug">
  #app
    h1
      | ふーん
</template>

<script lang="ts">
    export default {
    data(){
      return {
      };
    },
    created(){
      console.log("loaded ika!");
      this.init();
    },
    methods: {
      init(){
        this.update();
      },
      update(){
        console.log("on update")
        requestAnimationFrame(() => {this.update();});
      },

    },
    computed: {
    }
  }
</script>

<style lang='scss' scoped>

</style>
