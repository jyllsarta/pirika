import GameState from "./packs/GameState";
<template lang="pug">
  #app
    h1
      | ふーん
    .game
      .background(@mousemove="updatePointerPosition")
      .balls
        // 関数型コンポーネントにすると明確に軽くなるので x, y は本来子側の computed で展開して計算したかったけど
        // こちら側で渡すタイミングの時点で計算を完了させておく
        Ball(
          v-for="ball in logic.balls" v-bind:key="ball.id",
          :x="Math.floor(ball.x * 600)",
          :y="Math.floor(ball.y * 600)",
        )
      Pointer(
        :x="Math.floor(logic.pointer.x * 600)",
        :y="Math.floor(logic.pointer.y * 600)",
      )
      GameStartButton(
        @startGame="startGame",
        v-if="isTitleScene"
      )
</template>

<script lang="ts">
    import ArrowLogic from "./packs/ArrowLogic";
    import GameState from "./packs/GameState";
    import Ball from "./Ball.vue";
    import Pointer from "./Pointer.vue";
    import GameStartButton from "./GameStartButton.vue";

    export default {
    components: {
        Ball,
        Pointer,
        GameStartButton,
    },
    data(){
      return {
        logic: null,
        latestMouseMoveEvent: null,
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
        // TODO: constantsに定義を逃がす
        let e = this.latestMouseMoveEvent;
        if(e !== null){
          this.logic.setPointerPosition(e.offsetX / 600.0, e.offsetY / 600.0);
        }
        this.logic.update();
        requestAnimationFrame(() => {this.update();});
      },
      updatePointerPosition(e: MouseEvent){
          console.log(e);
          this.latestMouseMoveEvent = e;
      },
      startGame(){
        this.logic.startGame();
      },
    },
    computed: {
      isTitleScene(){
        return this.logic.gameState === GameState.Title;
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import "stylesheets/constants";

  .game{
    width: $field-width;
    height: $field-height;
    margin: 50px auto 50px auto;
    position: relative;
    top: 0;
    left: 0;
    .background{
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: #ededf5;
    }
    .balls{
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    .game_start_button{
      position: absolute;
      width: 10%;
      height: 10%;
      left: 45%;
      top: 45%;
    }
  }
</style>
