<template functional lang="pug">
  .pointer(
      :style="{ transform: 'translate(' + props.x + 'px,' + props.y + 'px)' }"
    )
    .player(
      :style="{ transform: 'scale('+ props.hpRate +')' }"
    )
    .hp_area
      span.max_hp
        | {{props.hp}}
      span.sep
        | /
      span.initial_hp
        | {{props.initialHp}}
</template>

<script lang="ts">
  export default {
    name: "Pointer",
    props: [
      "x",
      "y",
      "hpRate",
      "hp",
      "initialHp",
    ],
  }
</script>

<style lang='scss' scoped>
  @import "stylesheets/constants";
  .pointer{
    pointer-events: none;
    will-change: transform;
    position: absolute;
    .player{
      will-change: transform;
      background-color: #0d0d0d;
      width: $pointer-size;
      height: $pointer-size;
      border-radius: $pointer-size / 2;
      top: -$pointer-size / 2;
      left: -$pointer-size / 2;
    }
    .hp_area{
      position: absolute;
      top: -$pointer-size / 2;
      left: $pointer-size / 2;
    }
  }
</style>
