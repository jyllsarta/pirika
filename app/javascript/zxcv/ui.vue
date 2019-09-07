<template lang="pug">
  .ui
    .score(
      v-if='gameState === constants.gameStates.inGame || gameState === constants.gameStates.gameOver',
      v-bind:class="[isHighScoreUpdated ? 'high_score_updated' : '']",
      )
      | {{score}}
    transition(name="left-show-in")
      .high_score_text(v-if="isHighScoreUpdated && gameState === constants.gameStates.gameOver")
        | high score!
    transition(name="left-show-in")
      result(
        v-if='gameState === constants.gameStates.cleared'
        v-bind:score="score",
        v-bind:speedScore="speedScore",
        v-bind:isHighScoreUpdated="isHighScoreUpdated",
        v-bind:totalScore="totalScore",
      )
    transition(name="delay")
      .r_to_reset.delay(v-if='gameState === constants.gameStates.cleared || gameState === constants.gameStates.gameOver')
        | (r to reset)
    life-gauge(
      v-if='gameState !== constants.gameStates.title',
      v-bind:life="life",
    )
    transition(name="left-show-in")
      .game_over(v-if='gameState === constants.gameStates.gameOver')
        | GAME OVER
    transition(name="bounce")
      .title(v-if='gameState === constants.gameStates.title && loadCompleted')
        | Z X C V
        | kick zxcv to start
    transition(name="bounce")
      img.tweet(src="/images/zxcv/twitter.png", v-on:click="tweet", v-if='showingTweetButton')
    transition(name="left-show-in")
      .ui_background_panel(
        v-if='gameState === constants.gameStates.title'
      )
    transition(name="left-show-in")
      volume(
        v-if='gameState === constants.gameStates.title',
        v-bind:volume="volume",
        v-on:setVolume="setVolume",
      )
    transition(name="left-show-in")
      name-input-area(
        v-if='gameState === constants.gameStates.title',
        v-bind:volume="volume",
        @setName="setName",
        @inputStateChanged="(state)=>{this.$emit('inputStateChanged', state)}",
      )
    transition(name="left-show-in")
      .high_score(v-if='gameState === constants.gameStates.title')
        | ハイスコア： {{highScore}}
    transition(name="left-show-in")
      ranking(v-if='showingRanking', v-bind:ranking="ranking")
    .hide_ranking_area(v-if='showingRanking', @click="$emit('hideRanking')")
    transition(name="left-show-in")
      img.show_ranking_button(
        v-if='gameState === constants.gameStates.title && !showingRanking',
        @click="$emit('showRanking')",
        src="/images/zxcv/ranking.png"
      )
    minus-list(v-bind:minuses="minuses")
    spark-list(v-bind:sparks="sparks")
</template>

<script>
  import Constants from './packs/constants.js'
  import volume from './volume.vue'
  import result from './result.vue'
  import ranking from './ranking.vue'
  import lifeGauge from './lifeGauge.vue'
  import minusList from './minusList.vue'
  import sparkList from './sparkList.vue'
  import nameInputArea from './nameInputArea.vue'
  export default {
    components: {
      volume,
      result,
      ranking,
      lifeGauge,
      minusList,
      sparkList,
      nameInputArea,
    },
    data: function(){
      return {
        loadCompleted: false,
      };
    },
    name: "ui",
    props: [
      "gameState",
      "life",
      "score",
      "volume",
      "minuses",
      "sparks",
      "speedScore",
      "totalScore",
      "highScore",
      "isHighScoreUpdated",
      "showingRanking",
      "ranking",
    ],
    mounted: function(){
      console.log("loaded ui!");
      this.loadCompleted = true;
    },
    computed: {
      constants: function(){
        return Constants;
      },
      tweetingMessage: function(){
        return `ZXCVで ${this.totalScore}点取ったよ！`;
      },
      showingTweetButton: function(){
        return [this.constants.gameStates.cleared , this.constants.gameStates.gameOver].includes(this.gameState);
      }
    },
    methods: {
      tweet: function(){
        const tweetContent = encodeURI(this.tweetingMessage);
        const url = encodeURI("http://jyllsarta.net/zxcvs");
        const fullUrl = `https://twitter.com/intent/tweet?url=${url}&text=${tweetContent}`;
        window.open(fullUrl);
      },
      setVolume: function(v){
        // 最上位のzxcvにvolumeをリレーする
        this.$emit("setVolume", v);
      },
      setName: function(n){
        // 最上位のzxcvにnameをリレーする
        this.$emit("setName", n);
      },
    },
  }
</script>

<style lang='scss' scoped>
  @import "stylesheets/constants";

  div{
    font-family: 'Kanit', sans-serif;
  }

  .title{
    white-space: pre;
    position: absolute;
    left: 10%;
    bottom: 40%;
    width: 80%;
    opacity: $transparent_normal;
    font-size: $title_font_size;
    text-align: center;
    color: $black;
  }

  .game_over{
    position: absolute;
    left: 20%;
    bottom: 44%;
    width: 60%;
    opacity: $transparent_normal;
    font-size: $title_font_size;
    text-align: center;
    color: $negative_color;
  }

  .score{
    position: absolute;
    left: 20%;
    bottom: 30%;
    width: 60%;
    text-align: center;
    opacity: $transparent_normal;
    font-size: $title_font_size;
  }

  .r_to_reset{
    position: absolute;
    left: 20%;
    bottom: 15%;
    width: 60%;
    text-align: center;
    opacity: $transparent_normal;
    font-size: $title_font_size;
  }

  .tweet{
    position: absolute;
    right: 10%;
    bottom: 10%;
    width: 64px;
    height: 64px;
  }

  .show_ranking_button{
    position: absolute;
    top: 30%;
    left: -1%;
    width: 64px;
    height: 64px;
    padding: 10px;
    opacity: $transparent_normal;
    background-color: $black;
    border-radius: 8px;
  }

  .ranking{
    position: absolute;
    top: 35%;
    left: 10%;
    width: 80%;
    height: 60%;
    color: $white;
    background-color: $black;
    opacity: $transparent_normal;
    border-radius: 8px;
  }

  .hide_ranking_area{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  .high_score{
    color: $white;
    position: absolute;
    top: 24%;
    left: 0;
    width: 50%;
  }

  .high_score_updated{
    color: $primary_color;
  }

  .high_score_text{
    position: absolute;
    left: 30%;
    bottom: 28%;
    width: 60%;
    text-align: center;
    opacity: $transparent_normal;
    font-size: $title_font_size / 2;
    color: $primary_color;
  }

  .ui_background_panel{
    position: absolute;
    top: 10%;
    left: -1%;
    width: 52%;
    height: 19%;
    background-color: $black;
    opacity: $transparent_normal;
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

  .delay-enter-active {
    animation: delay 1.5s;
  }
  .delay-leave-active {
    animation: delay 1.5s reverse;
  }
  @keyframes delay {
    0% {
      transform: translateX(0px);
      opacity: 0;
    }
    90% {
      transform: translateX(10px);
      opacity: 0;
    }
    100% {
      transform: translateX(0px);
      opacity: $transparent_normal;
    }
  }

  .bounce-enter-active{
    animation: bounce 0.5s;
  }
  @keyframes bounce {
    0% {
      transform: scale(1);
    }
    10% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }

</style>
