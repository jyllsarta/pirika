<template lang="pug">
  transition(name="show-long")
    .remove_score( :style="{ transform: 'translate(' + x + 'px,' + y + 'px)'}")
      | +{{value}}
</template>

<script lang="ts">
  export default {
    name: "RemoveScore",
    props: [
      "x",
      "y",
      "value",
    ]
  }
</script>

<style lang='scss' scoped>
  @import "stylesheets/constants";
  .remove_score{
    pointer-events: none;
    z-index: 11;
    position: absolute;
    width: 20%;
    height: 10%;
    left: -10%;
    top: -5%;
    text-align: center;
    font-family: 'Cute Font', cursive;
    font-size: $main-font-size;
    color: $accent-color;
  }
  .show-long-enter-active {
    transition: all 0.1s;
  }
  .show-long-leave-active {
    transition: all 1s;
  }
  .show-long-enter{
    opacity: 0;
  }
  .show-long-leave-to{
    opacity: 0;
  }

</style>
