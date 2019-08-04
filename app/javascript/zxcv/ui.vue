<template lang="pug">
  .ui
    .score(v-if='gameState !== constants.gameStates.title')
      | {{score}}
    .life(v-bind:class='[lifeState]', v-bind:style='{width: lifeLength}', v-if='gameState !== constants.gameStates.title')
    .dead(v-if='gameState === constants.gameStates.gameOver')
      | GAME OVER (r to reset)
    .title(v-if='gameState === constants.gameStates.title')
      | Z X C V
      | kick zxcv to start
    .win(v-if='gameState === constants.gameStates.cleared')
      | WIN (r to reset)
    img.tweet(src="/images/zxcv/twitter.jpg", v-on:click="tweet", v-if='showingTweetButton')
</template>

<script>
  export default {
    name: "ui",
    data: function(){
      return {
      };
    },
    props: [
      "gameState",
      "life",
      "score",
      "constants", // TODO: 全然関係ない別モジュールに切り出すのが正解かもしれない
    ],
    created: function(){
      console.log("loaded ui!");
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
        return `ZXCVで ${this.score}点取ったよ！`;
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
    },
  }
</script>

<style lang='scss' scoped>
  @import "../stylesheets/constants";

  .score{
    position: absolute;
    left: 20%;
    bottom: 30%;
    width: 60%;
    text-align: center;
    opacity: $transparent_normal;
    font-size: $title_font_size;
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

  .dead{
    position: absolute;
    left: 20%;
    bottom: 40%;
    width: 60%;
    opacity: $transparent_normal;
    font-size: $title_font_size;
    text-align: center;
    color: $negative_color;
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

  .win{
    position: absolute;
    left: 20%;
    bottom: 40%;
    width: 60%;
    opacity: $transparent_normal;
    font-size: $title_font_size;
    text-align: center;
    color: $primary_color;
  }

  .tweet{
    position: absolute;
    right: 10%;
    bottom: 10%;
  }
</style>
