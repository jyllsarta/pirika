<template lang="pug">
  #app
    h1
      | ふーん
    .game(
      :class="{remove_cursor: isInGameScene}"
      @click.right.prevent
      )
      .title(v-if="isTitleScene")
        | ICE BREAK
      .game_over(v-if="isGameOverScene")
        | GAME OVER
      .score(v-if="isInGameScene")
        | {{logic.score()}}
      .high_score()
        | MAX: {{logic.highScore}}
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
        :hp="Math.floor(logic.hp)",
        :initialHp="logic.initialHp",
        :energy="Math.floor(logic.energy)",
        :charge="Math.floor(logic.charge * 100)",
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
      NameInputArea(
        @setName="setName",
        v-if='isTitleScene',
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
    import Timer from "./packs/Timer"
    import NameInputArea from "./NameInputArea.vue";

    export default {
    components: {
      Ball,
      Pointer,
      GameStartButton,
      ResetButton,
      NameInputArea,
    },
    data(){
      return {
        logic: null,
        latestMouseMoveEvent: null,
        prevFrameMouseMoveEvent: null,
        timer: null,
      };
    },
    created(){
      console.log("loaded arrow!");
      this.logic = new ArrowLogic();
      this.timer = new Timer();
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

        const timeDelta = this.timer.timeDelta();
        this.timer.commit();

        this.logic.update(timeDelta);
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
      setName(name: string){
        this.logic.setName(name);
      }
    },
    computed: {
      isTitleScene(){
        return this.logic.gameState === GameState.Title;
      },
      isInGameScene(){
        return this.logic.gameState === GameState.InGame;
      },
      isGameOverScene(){
        return this.logic.gameState === GameState.GameOver
      },
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
      z-index: 0;
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
    .title, .game_over, .score{
      pointer-events: none;
      z-index: 10;
      position: absolute;
      top: 20%;
      left: 20%;
      width: 60%;
      text-align: center;
      font-family: 'Cute Font', cursive;
      font-size: 60px;
    }
    .high_score{
      pointer-events: none;
      z-index: 10;
      position: absolute;
      top: 27%;
      left: 20%;
      width: 60%;
      text-align: center;
      font-family: 'Cute Font', cursive;
      font-size: 60px;
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
