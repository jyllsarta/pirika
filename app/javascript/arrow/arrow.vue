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
        logic: null,
        input: null,
      };
    },
    mounted(){
      console.log("loaded arrow!");
      this.logic = new ArrowLogic();
      this.input = new Input();
      this.input.registerUpdateEvent(this.logic.update);
      this.input.registerLeftClickEvent(this.logic.onLeftClick);
    },
  }
</script>

<style lang='scss' scoped>
  @import "stylesheets/constants";
</style>
