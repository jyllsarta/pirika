<template lang="pug">
  #app
    h1
      | ふーん
    .game
      .balls
        Ball(
          v-for="ball in logic.balls" v-bind:key="ball.id",
          :x="ball.x",
          :y="ball.y",
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
