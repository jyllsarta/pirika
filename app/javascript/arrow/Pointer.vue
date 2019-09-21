<template functional lang="pug">
  .pointer(
    :style="{ transform: 'translate(' + props.x + 'px,' + props.y + 'px) scale('+ props.hpRate +')' }"
  )
</template>

<script lang="ts">
  export default {
    name: "Pointer",
    props: [
      "x",
      "y",
      "hpRate",
    ],
  }
</script>

<style lang='scss' scoped>
  @import "stylesheets/constants";
  .pointer{
    pointer-events: none;
    will-change: transform;
    position: absolute;
    background-color: #0d0d0d;
    width: $pointer-size;
    height: $pointer-size;
    border-radius: $pointer-size / 2;
    top: -$pointer-size / 2;
    left: -$pointer-size / 2;
  }
</style>
