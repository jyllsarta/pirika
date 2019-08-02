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
    },
    methods: {
    },
  }
</script>

<style lang='scss' scoped>
    // TODO: この定数定義の完全コピペは絶対回避法があると思うので探す
    $note_width: 180px;
    $note_height: 30px;
    $note_count: 16;

    $primary_color: #91a1d7;
    $negative_color: #d75d42;
    $accent_color: #cee7d8;
    $black: #2a2c28;
    $white: #f4f5ec;
    $gray: #babbbe;

    $transparent_normal: 0.8;
    $transparent_pale: 0.4;

    $title_font_size: 40px;


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
</style>
