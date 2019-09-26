<template lang="pug">
  #app
    h1
      | ふーん
    .game(
      :class="{remove_cursor: isInGameScene}"
      @click.right.prevent
      )
      .background(@mousemove="updatePointerPosition")
      transition-group(class="balls" name="delay")
        Ball(
          v-for="ball in logic.balls" v-bind:key="ball.id",
          :x="Math.floor(ball.x * gameWindowWidth)",
          :y="Math.floor(ball.y * gameWindowHeight)",
        )
      Pointer(
        :x= "Math.floor(logic.pointer.x * gameWindowWidth)",
        :y= "Math.floor(logic.pointer.y * gameWindowHeight)",
        :hpRate="logic.hpRate()",
        :hp="logic.hp",
        :initialHp="logic.initialHp",
        :energy="logic.energy",
        :charge="logic.charge",
        :isCharging="logic.isCharging",
        :chargeRate="logic.chargeRate()",
        v-if="isInGameScene",
      )
      GameStartButton(
        @startGame="startGame",
        v-if="isTitleScene"
      )
      ResetButton(
        @resetGame="resetGame",
        v-if="isGameOverScene"
      )
</template>

<script lang="ts">
    import ArrowLogic from "./packs/ArrowLogic";
    import GameState from "./packs/GameState";
    import Ball from "./Ball.vue";
    import Pointer from "./Pointer.vue";
    import GameStartButton from "./GameStartButton.vue";
    import ResetButton from "./ResetButton.vue";
    import Constants from "./packs/Constants"

    export default {
    components: {
      Ball,
      Pointer,
      GameStartButton,
      ResetButton,
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
        let e = this.latestMouseMoveEvent;
        if(e !== this.prevFrameMouseMoveEvent){
          this.logic.setPointerPosition(e.offsetX / Constants.gameWindowPixelSizeX, e.offsetY / Constants.gameWindowPixelSizeY);
          this.logic.onMoved();
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
      resetGame(){
        this.logic.onClickResetButton();
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
      isGameOverScene(){
        return this.logic.gameState === GameState.GameOver      },
      gameWindowWidth(){
        return Constants.gameWindowPixelSizeX;
      },
      gameWindowHeight(){
        return Constants.gameWindowPixelSizeY;
      },
    }
  }
</script>

<style lang='scss' scoped>
  @import "stylesheets/constants";

  .game{
    user-select: none;
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
