<template lang="pug">
  #app
    h1
      | ふーん
    .game
      .balls
        // 関数型コンポーネントにすると明確に軽くなるので x, y は本来子側の computed で展開して計算したかったけど
        // こちら側で渡すタイミングの時点で計算を完了させておく
        Ball(
          v-for="ball in logic.balls" v-bind:key="ball.id",
          :x="Math.floor(ball.x * 600)",
          :y="Math.floor(ball.y * 600)",
        )
</template>

<script lang="ts">
  import ArrowLogic from "./packs/ArrowLogic";
  import Ball from "./Ball.vue";
  export default {
    components: {
        Ball,
    },
    data(){
      return {
        logic: null,
      };
    },
    created(){
      console.log("loaded arrow!");
      this.logic = new ArrowLogic();
      this.registerEvents();
    },
    methods: {
      registerEvents(){
        this.update();
      },
      update(){
        this.logic.update();
        requestAnimationFrame(() => {this.update();});
      }
    },
  }
</script>

<style lang='scss' scoped>
  @import "stylesheets/constants";

  .game{
    width: $field-width;
    height: $field-height;
    margin: 50px auto 50px auto;
    background-color: #ededf5;
    position: relative;
    top: 0;
    left: 0;
    .balls{
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }
</style>
