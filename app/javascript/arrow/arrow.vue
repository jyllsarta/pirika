<template lang="pug">
  #app
    h1
      | ふーん
    .game(
      :class="{remove_cursor: isInGameScene}"
      @click.right.prevent
      )
      transition(name="left-show-in")
        .title(v-if="isTitleScene")
          | ICE BREAK
      transition(name="left-show-in")
        .game_over(v-if="isGameOverScene")
          | GAME OVER
      transition(name="left-show-in")
        .high_score_updated(v-if="logic.isHighScore")
          | HIGH SCORE!
      transition(name="left-show-in")
        .score(
          v-if="!isTitleScene"
          :class="{is_high_score: logic.isHighScore}"
          )
          | {{logic.score()}}
      transition(name="left-show-in")
        .high_score(v-if="isTitleScene")
          | MAX: {{logic.highScore}}
      .background(@mousemove="updatePointerPosition")
      transition-group(class="balls" name="delay")
        Ball(
          v-for="ball in logic.balls" v-bind:key="ball.id",
          :x="Math.floor(ball.x * gameWindowWidth)",
          :y="Math.floor(ball.y * gameWindowHeight)",
          :colorId="ball.colorId",
        )
      Pointer(
        :x= "Math.floor(logic.pointer.x * gameWindowWidth)",
        :y= "Math.floor(logic.pointer.y * gameWindowHeight)",
        :hpRate="logic.hpRate()",
        :hp="Math.floor(logic.hp)",
        :initialHp="logic.initialHp",
        :energy="Math.min(Math.floor(logic.energy), 100)",
        :charge="Math.floor(logic.charge * 100)",
        :isCharging="logic.isCharging",
        :chargeRate="logic.chargeRate()",
        v-if="isInGameScene",
      )
      transition(name="left-show-in")
        GameStartButton(
          @startGame="startGame",
          v-if="isTitleScene"
        )
      transition(name="left-show-in")
        ResetButton(
          @resetGame="resetGame",
          v-if="isGameOverScene"
        )
      transition(name="left-show-in")
        NameInputArea(
          @setName="setName",
          v-if='isTitleScene',
        )
      RemoveScore(
        v-if="logic.isThisFrameDischargeReleased",
        :value="logic.lastRemoveResult",
        :x= "Math.floor(logic.lastRemovedPositionX * gameWindowWidth)",
        :y= "Math.floor(logic.lastRemovedPositionY * gameWindowHeight)",
      )
      .ranking_area(v-if="isTitleScene")
        transition(name="left-show-in")
          Ranking(
              v-if='showingRanking',
              :ranking="logic.ranking"
            )
      .ranking_button(v-if="isTitleScene")
        transition(name="left-show-in")
          .hide_ranking_area(v-if='showingRanking', @click="hideRanking")
          img.show_ranking_button(
            v-if='!showingRanking',
            @click="showRanking",
            src="/images/arrow/ranking.png"
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
    import RemoveScore from "./RemoveScore.vue";
    import Ranking from "./Ranking.vue";

    export default {
    components: {
      Ball,
      Pointer,
      GameStartButton,
      ResetButton,
      NameInputArea,
      RemoveScore,
      Ranking,
    },
    data(){
      return {
        logic: null,
        latestMouseMoveEvent: null,
        prevFrameMouseMoveEvent: null,
        timer: null,
        showingRanking: false,
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
        this.showingRanking = false;
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
      },
      showRanking(){
        // ロジックのサウンドマネージャに直接命令するのはだいぶ横着なので良くない...
        this.logic.soundManager.play("discharge_available");
        this.logic.fetchRanking();
        this.showingRanking = true;
      },
      hideRanking(){
        this.logic.soundManager.play("phew");
        this.showingRanking = false;
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
    color: $main-color;
    .background{
      z-index: 0;
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: $light-gray;
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
    .title, .game_over{
      pointer-events: none;
      z-index: 10;
      position: absolute;
      top: 10%;
      left: 20%;
      width: 60%;
      text-align: center;
      font-family: 'Cute Font', cursive;
      font-size: $main-font-size;
    }
    .score, .high_score{
      pointer-events: none;
      z-index: 10;
      position: absolute;
      top: 17.5%;
      left: 20%;
      width: 60%;
      text-align: center;
      font-family: 'Cute Font', cursive;
      font-size: $main-font-size;
    }
    // ui text 共通の指定が結構あるからまとめたいかも
    .high_score_updated{
      pointer-events: none;
      z-index: 10;
      position: absolute;
      top: 22%;
      left: 53%;
      width: 30%;
      text-align: center;
      font-family: 'Cute Font', cursive;
      font-size: $main-font-size / 2;
      color: $accent-color;
    }
    .is_high_score{
      color: $accent-color;
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
      background-color: $blight;
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
  .ranking{
    position: absolute;
    top: 2%;
    left: 10%;
    width: 80%;
    height: 96%;
    color: $light-gray;
    background-color: $main-color;
    border-radius: 8px;
    padding: 10px;
    z-index: 100;
  }
  .hide_ranking_area{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  .show_ranking_button{
    position: absolute;
    bottom: 5%;
    left: 5%;
    width: 64px;
    height: 64px;
    padding: 10px;
    background-color: $main-color;
    border-radius: 8px;
  }

  .left-show-in-enter-active {
    transition: all .3s;
  }
  .left-show-in-leave-active {
    transition: all .3s;
  }
  .left-show-in-enter{
    transform: translateX(10px);
    opacity: 0;
  }
  .left-show-in-leave-to{
    transform: translateX(-10px);
    opacity: 0;
  }

</style>
