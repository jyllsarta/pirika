<template lang="pug">
  .game_start_button(@click="$emit('resetGame')")
</template>

<script lang="ts">
  export default {
    name: "ResetButton",
  }
</script>

<style lang='scss' scoped>
  @import "stylesheets/constants";
  .game_start_button{
    transform: rotateZ(45deg);
    background-color: $accent-color;
    border-radius: $ball-size / 2;
    transition: 0.2s;
    &:hover{
      transform: scale(1.1);
      opacity: 0.3;
    }
  }
</style>
