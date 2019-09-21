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
    box-shadow: 0px 6px 4px -2px rgba(0, 0, 0, 0.4);
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
