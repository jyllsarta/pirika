<template lang="pug">
  .ui
    .score(v-if='gameState !== constants.gameStates.title')
      | {{score}}
    .volume_area(v-if='gameState === constants.gameStates.title')
      img.volume_icon(src="/images/zxcv/volume.png")
      input.volume(type="range" v-model.number="localVolume" min="0" max="1" step="any")
    .life(v-bind:class='[lifeState]', v-bind:style='{width: lifeLength}', v-if='gameState !== constants.gameStates.title')
    .dead(v-if='gameState === constants.gameStates.gameOver')
      | GAME OVER (r to reset)
    .title(v-if='gameState === constants.gameStates.title')
      | Z X C V
      | kick zxcv to start
    .win(v-if='gameState === constants.gameStates.cleared')
      | WIN (r to reset)
    img.tweet(src="/images/zxcv/twitter.jpg", v-on:click="tweet", v-if='showingTweetButton')
    transition-group.minus-list(name="minus-list")
      .minus(v-for="minus in minuses" v-bind:key="minus.id")
        | -1
</template>

<script>
  export default {
    name: "ui",
    data: function(){
      return {
        localVolume: 1,
      };
    },
    props: [
      "gameState",
      "life",
      "score",
      "constants", // TODO: 全然関係ない別モジュールに切り出すのが正解かもしれない
      "volume",
      "minuses",
    ],
    watch: {
      localVolume: function() {
        this.$emit("setVolume", this.localVolume);
      },
    },
    mounted: function(){
      console.log("loaded ui!");
      this.localVolume = this.volume;
      console.log(this.volume);
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
    bottom: 44%;
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

  .volume_area{
    position: absolute;
    top: 10%;
    left: 0;
    width: 50%;
    display: flex;
    .volume_icon{
      width: 48px;
      height: 48px;
      padding: 10px;
    }
    .volume {
      padding: 10px;
    }

    input[type=range] {
      -webkit-appearance: none;
      width: 100%;
      margin: 0px 0;
    }
    input[type=range]:focus {
      outline: none;
    }
    input[type=range]::-webkit-slider-runnable-track {
      width: 100%;
      height: 16px;
      cursor: pointer;
      box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
      background: $primary_color;
      border-radius: 1.3px;
      border: 0.2px solid #010101;
    }
    input[type=range]::-webkit-slider-thumb {
      box-shadow: 1px 1px 1px rgba(0, 0, 0, 0), 0px 0px 1px rgba(13, 13, 13, 0);
      border: 0px solid rgba(0, 0, 0, 0);
      height: 16px;
      width: 32px;
      border-radius: 0px;
      background: #f4f4f4;
      cursor: pointer;
      -webkit-appearance: none;
      margin-top: -0.2px;
    }
    input[type=range]:focus::-webkit-slider-runnable-track {
      background: #b9b8cb;
    }
    input[type=range]::-moz-range-track {
      width: 100%;
      height: 16px;
      cursor: pointer;
      box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
      background: $primary_color;
      border-radius: 1.3px;
      border: 0.2px solid #010101;
    }
    input[type=range]::-moz-range-thumb {
      box-shadow: 1px 1px 1px rgba(0, 0, 0, 0), 0px 0px 1px rgba(13, 13, 13, 0);
      border: 0px solid rgba(0, 0, 0, 0);
      height: 16px;
      width: 32px;
      border-radius: 0px;
      background: #f4f4f4;
      cursor: pointer;
    }
    input[type=range]::-ms-track {
      width: 100%;
      height: 16px;
      cursor: pointer;
      background: transparent;
      border-color: transparent;
      color: transparent;
    }
    input[type=range]::-ms-fill-lower {
      background: #605f82;
      border: 0.2px solid #010101;
      border-radius: 2.6px;
      box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    }
    input[type=range]::-ms-fill-upper {
      background: $primary_color;
      border: 0.2px solid #010101;
      border-radius: 2.6px;
      box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    }
    input[type=range]::-ms-thumb {
      box-shadow: 1px 1px 1px rgba(0, 0, 0, 0), 0px 0px 1px rgba(13, 13, 13, 0);
      border: 0px solid rgba(0, 0, 0, 0);
      width: 32px;
      border-radius: 0px;
      background: #f4f4f4;
      cursor: pointer;
      height: 16px;
    }
    input[type=range]:focus::-ms-fill-lower {
      background: $primary_color;
    }
    input[type=range]:focus::-ms-fill-upper {
      background: #b9b8cb;
    }
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
</style>
