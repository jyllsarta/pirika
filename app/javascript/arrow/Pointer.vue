<template functional lang="pug">
  .pointer(
      :style="{ transform: 'translate(' + props.x + 'px,' + props.y + 'px)', pointerEvents: 'none'}"
    )
    .player(
      :style="{ transform: 'scale('+ props.hpRate +')' }"
    )
    .discharge_circle.effective(
      v-if="props.isCharging"
    )
    .discharge_circle.current(
      v-if="props.isCharging",
      :style="{ transform: 'scale('+ props.chargeRate +')' }"
    )
    .hp_area
      span.max_hp
        | {{props.hp}}
      span.sep
        | /
      span.energy
        | {{props.energy}}%
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
      "energy",
      "charge",
      "isCharging",
      "chargeRate",
    ],
  }
</script>

<style lang='scss' scoped>
  @import "stylesheets/constants";
  .pointer{
    pointer-events: none;
    will-change: transform;
    position: absolute;
    top: -$pointer-size / 2;
    left: -$pointer-size / 2;
    .player{
      position: absolute;
      will-change: transform;
      background-color: $accent-color;
      top: -$pointer-size / 2;
      left: -$pointer-size / 2;
      width: $pointer-size;
      height: $pointer-size;
      border-radius: $pointer-size / 2;
      box-shadow: 0px 6px 4px -2px rgba(0, 0, 0, 0.4);
    }
    .hp_area{
      position: absolute;
      font-family: 'Cute Font', cursive;
      font-size: 20px;
      top: -20px;
      left: $pointer-size / 2;
    }
    .discharge_circle{
      border-radius: 10000px;
      position: absolute;
      top: -80;
      left: -80;
      width: 160px;
      height: 160px; // TODO: サイズを計算して出す
    }
    .effective{
      z-index: 1;
      border: 2px solid $blight;
    }
    .current{
      z-index: 2;
      border: 2px solid $accent-color;
    }
  }
</style>
