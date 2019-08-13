<template lang="pug">
  .ui
    .score(v-if='gameState === constants.gameStates.inGame || gameState === constants.gameStates.gameOver')
      | {{score}}
    transition(name="left-show-in")
      result(
        v-if='gameState === constants.gameStates.cleared'
        v-bind:score="score",
        v-bind:speedScore="speedScore",
        v-bind:totalScore="totalScore",
      )
    transition(name="delay")
      .r_to_reset.delay(v-if='gameState === constants.gameStates.cleared || gameState === constants.gameStates.gameOver')
        | (r to reset)
    transition(name="left-show-in")
      volume(
        v-if='gameState === constants.gameStates.title',
        v-bind:volume="volume",
        v-on:setVolume="setVolume",
      )
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
      name-input-area(
        v-if='gameState === constants.gameStates.title',
        v-bind:volume="volume",
        @setName="setName",
      )
    transition(name="left-show-in")
      .high_score(v-if='gameState === constants.gameStates.title')
        | ハイスコア： {{highScore}}
    minus-list(v-bind:minuses="minuses")
    spark-list(v-bind:sparks="sparks")
</template>

<script>
  import Constants from '../packs/constants.js'
  import volume from './volume.vue'
  import result from './result.vue'
  import lifeGauge from './lifeGauge.vue'
  import minusList from './minusList.vue'
  import sparkList from './sparkList.vue'
  import nameInputArea from './nameInputArea.vue'
  export default {
    components: {
      volume,
      result,
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
  @import "../stylesheets/constants";

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

  .high_score{
    position: absolute;
    top: 25%;
    left: 0;
    width: 50%;
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
