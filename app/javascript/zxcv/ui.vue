<template lang="pug">
  .ui
    .score(v-if='gameState === constants.gameStates.inGame || gameState === constants.gameStates.gameOver')
      | {{score}}
    transition(name="left-show-in")
      .result(v-if='gameState === constants.gameStates.cleared')
        .win
          | win!
        .hit_score.result_row
          span.index
            | HIT
          span.delimiter
            | :
          span.value
            | {{score}}
        .speed_score.result_row
          span.index
            | SPEED
          span.delimiter
            | :
          span.value
            | {{speedScore}}
        .total_score.result_row
          span.index
            | TOTAL
          span.delimiter
            | :
          span.value
            | {{totalScore}}
    transition(name="delay")
      .r_to_reset.delay(v-if='gameState === constants.gameStates.cleared || gameState === constants.gameStates.gameOver')
        | (r to reset)
    volume(
      v-if='gameState === constants.gameStates.title',
      v-bind:volume="volume",
      v-on:setVolume="setVolume",
    )
    .life(v-bind:class='[lifeState]', v-bind:style='{width: lifeLength}', v-if='gameState !== constants.gameStates.title')
    transition(name="left-show-in")
      .game_over(v-if='gameState === constants.gameStates.gameOver')
        | GAME OVER
    transition(name="bounce")
      .title(v-if='gameState === constants.gameStates.title && loadCompleted')
        | Z X C V
        | kick zxcv to start
    img.tweet(src="/images/zxcv/twitter.jpg", v-on:click="tweet", v-if='showingTweetButton')
    transition-group.minus-list(name="minus-list")
      .minus(v-for="minus in minuses" v-bind:key="minus.id")
        | -1
</template>

<script>
  import volume from './volume.vue'
  export default {
    components: {
      volume,
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
      "constants", // TODO: 全然関係ない別モジュールに切り出すのが正解かもしれない
      "volume",
      "minuses",
      "speedScore",
      "totalScore",
    ],
    mounted: function(){
      console.log("loaded ui!");
      this.loadCompleted = true;
    },
    computed: {
      lifeLength: function(){
        return (this.life / this.constants.maxLife * 100) + "%"
      },
      lifeState: function(){
        if(this.life >= this.constants.safeLine){
          return "max";
        }
        if(this.life >= this.constants.dangerLine){
          return "normal";
        }
        return "danger";
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
      }
    },
  }
</script>

<style lang='scss' scoped>
  @import "../stylesheets/constants";

  div{
    font-family: 'Kanit', sans-serif;
  }

  .life{
    height: 20px;
    transform: translateY(-100px);
    opacity: $transparent_pale;
  }

  .normal{
    background-color: $primary_color;
  }

  .danger{
    background-color: $negative_color;
  }

  .max{
    background-color: $accent_color;
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

  .win{
    position: absolute;
    left: 10%;
    bottom: 110%;
    width: 80%;
    opacity: $transparent_normal;
    font-size: $title_font_size;
    text-align: center;
    color: $primary_color;
  }

  .result{
    position: absolute;
    left: 20%;
    bottom: 30%;
    width: 60%;
    height: $title_font_size * 4;
    display: flex;
    flex-direction: column;
    .result_row{
      width: 100%;
      height: 1em;
      text-align: left;
      font-size: $title_font_size;
      span{
        display: inline-block;
      }
      .index{
        width: 28%;
      }
      .delimiter{
        width: 2%;
      }
      .value{
        width: 18%;
        text-align: right;
      }
    }
  }

  .left-show-in-enter-active {
    transition: all .3s;
  }
  .left-show-in-enter{
    transform: translateX(10px);
    opacity: 0;
  }

  .delay-enter-active {
    animation: delay 1.5s;
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
  }

  .minus-list{
    position: absolute;
    left: 25%;
    bottom: 30%;
    width: 60%;
    text-align: center;
    opacity: $transparent_normal;
    font-size: $title_font_size;
    color: $negative_color;

    &-leave-active{
      opacity: 0.4;
      transform: translateY(0);
      transition: {
        property       : transform, opacity;
        duration       : 0.3s;
        delay          : 0s;
      }
    }
    &-leave-to{
      opacity: 0;
      transform: translateY(-20px);
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
