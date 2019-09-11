<template lang="pug">
  #app
    h1
      | ふーん
    .game
      .balls(v-for="ball in logic.balls" v-bind:key="ball.id")
        Ball(
          :x="ball.x",
          :y="ball.y",
        )
</template>

<script lang="ts">
  import ArrowLogic from "./packs/ArrowLogic";
  import Input from "./packs/Input";
  import Ball from "./Ball.vue";
  export default {
    components: {
        Ball,
    },
    data(){
      return {
        logic: null,
        input: null,
      };
    },
    created(){
      console.log("loaded arrow!");
      this.logic = new ArrowLogic();
      this.input = new Input();
      this.input.registerUpdateEvent(this.logic.update);
      this.input.registerLeftClickEvent(() => {this.logic.sendMessage("onLeftClick")});
    },
  }
</script>

<style lang='scss' scoped>
  @import "stylesheets/constants";

  .game{
    // TODO: 600px 決め打ちをconstantsかなんかにずらす
    width: 600px;
    height: 600px;
    margin: 0 auto;
    background-color: #ededf5;
    position: relative;
    top: 0;
    left: 0;
    .balls{
      width: 100%;
      height: 100%;
    }
  }
</style>
