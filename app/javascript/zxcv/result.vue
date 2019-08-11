<template lang="pug">
  .result
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
</template>

<script>
  export default {
    name: "result",
    props: [
      "score",
      "constants", // TODO: 全然関係ない別モジュールに切り出すのが正解かもしれない
      "speedScore",
      "totalScore",
    ],
  }
</script>

<style lang='scss' scoped>
  @import "../stylesheets/constants";

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
</style>
