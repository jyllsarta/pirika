<template lang="pug">
  #app
    h1
      | ふーん
</template>

<script lang="ts">
  import ArrowLogic from "./packs/ArrowLogic";
  import Input from "./packs/Input";
  export default {
    data(){
      return {
        logic: {},
        input: {},
      };
    },
    mounted(){
      console.log("loaded arrow!");
      this.logic = new ArrowLogic();
      this.input = new Input();
      this.logic.update();
    },
  }
</script>

<style lang='scss' scoped>
  @import "stylesheets/constants";
</style>
