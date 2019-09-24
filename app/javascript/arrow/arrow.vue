<template lang="pug">
  #app
    h1
      | ふーん
    .game(:class="{remove_cursor: isInGameScene}")
      .background(@mousemove="updatePointerPosition")
      transition-group(class="balls" name="delay")
        Ball(
          v-for="ball in logic.balls" v-bind:key="ball.id",
          :x="Math.floor(ball.x * 600)",
          :y="Math.floor(ball.y * 600)",
        )
      Pointer(
        :x= "Math.floor(logic.pointer.x * 600)",
        :y= "Math.floor(logic.pointer.y * 600)",
        :hpRate="logic.hpRate()",
        :hp="logic.hp",
        :initialHp="logic.initialHp",
        :energy="logic.energy",
        :charge="logic.charge",
        v-if="isInGameScene",
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
        prevFrameMouseMoveEvent: null,
      };
    },
    created(){
      console.log("loaded arrow!");
      this.logic = new ArrowLogic();
      this.registerEvents();
    },
    methods: {
      registerEvents(){
        window.onmousedown= this.onMouseDown;
        window.onmouseup= this.onMouseUp;
        this.update();
      },
      update(){
        // TODO: constantsに定義を逃がす
        let e = this.latestMouseMoveEvent;
        if(e !== this.prevFrameMouseMoveEvent){
          this.logic.setPointerPosition(e.offsetX / 600.0, e.offsetY / 600.0);
          this.logic.resetCharge(); // 動いたらチャージはリセットされる ... はロジックに書くべきかなあ
          this.prevFrameMouseMoveEvent = e;
        }
        this.logic.update();
        requestAnimationFrame(() => {this.update();});
      },
      updatePointerPosition(e: MouseEvent){
        this.latestMouseMoveEvent = e;
      },
      startGame(){
        this.logic.startGame();
      },
      onMouseDown(){
        this.logic.onMouseDown();
      },
      onMouseUp(){
        this.logic.onMouseUp();
      },
    },
    computed: {
      isTitleScene(){
        return this.logic.gameState === GameState.Title;
      },
      isInGameScene(){
        return this.logic.gameState === GameState.InGame;
      },
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
    overflow: hidden;
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
  .remove_cursor{
    cursor: none;
  }
  .delay-enter-active {
    animation: delay 1.5s;
  }
  .delay-leave-active {
    animation: delay 0.6s reverse;
  }
  @keyframes delay {
    0% {
      background-color: #87c3e1;
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
</style>
