<template functional lang="pug">
  .pointer(
      :style="{ transform: 'translate(' + props.x + 'px,' + props.y + 'px)' }"
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
      span.initial_hp
        | {{props.initialHp}}
      span.sep
        | /
      span.energy
        | {{props.energy}}
      span.sep
        | /
      span.charge
        | {{props.charge}}
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
      will-change: transform;
      background-color: #0d0d0d;
      width: $pointer-size;
      height: $pointer-size;
      border-radius: $pointer-size / 2;
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
      top: -75 + $pointer-size / 2;
      left: -75 + $pointer-size / 2;
      width: 150px;
      height: 150px; // TODO: サイズを計算して出す
    }
    .effective{
      z-index: 1;
      border: 1px solid #00bfff; // TODO: 仮
    }
    .current{
      z-index: 2;
      border: 1px solid #ff7332; // TODO: 仮
    }
  }
</style>
