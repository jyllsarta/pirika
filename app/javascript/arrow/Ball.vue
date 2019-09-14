<template lang="pug">
  // この文字列結合でtranslateするのもうちょいスマートにやりたいなあ
  .ball(
    :style="{ transform: 'translate(' + screenX + 'px,' + screenY + 'px)' }"
  )
</template>

<script lang="ts">
  export default {
    name: "Ball",
    props: [
      "x",
      "y",
    ],
    created(){
      console.log("created ball!");
    },
    computed: {
      screenX(){
        // TODO: CSSのウィンドウサイズとまた結合が生まれちゃったのでなんとかする
        return Math.floor(this.x * 600);
      },
      screenY(){
        return Math.floor(this.y * 600);
      },
    },
  }
</script>

<style lang='scss' scoped>
  @import "stylesheets/constants";
  .ball{
    position: absolute;
    background-color: #0d0d0d;
    width: $ball-size;
    height: $ball-size;
    border-radius: $ball-size / 2;
    top: -$ball-size / 2;
    left: -$ball-size / 2;
  }
</style>
