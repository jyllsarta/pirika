<template functional lang="pug">
  // この文字列結合でtranslateするのもうちょいスマートにやりたいなあ
  .ball(
    :style="{ transform: 'translate(' + props.x + 'px,' + props.y + 'px)' }"
  )
</template>

<script lang="ts">
  export default {
    name: "Ball",
    props: [
      "x",
      "y",
    ],
  }
</script>

<style lang='scss' scoped>
  @import "stylesheets/constants";
  .ball{
    will-change: transform;
    position: absolute;
    background-color: #0d0d0d;
    width: $ball-size;
    height: $ball-size;
    border-radius: $ball-size / 2;
    top: -$ball-size / 2;
    left: -$ball-size / 2;
  }
</style>
