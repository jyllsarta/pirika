<template lang="pug">
  .game_start_button(@mouseover="$emit('startGame')")
</template>

<script lang="ts">
  export default {
    name: "GameStartButton",
  }
</script>

<style lang='scss' scoped>
  @import "stylesheets/constants";
  .game_start_button{
    transform: rotateZ(45deg);
    background-color: #0d0d0d;
    border-radius: $ball-size / 2;
    &:hover{
      transform: scale(1.1);
      opacity: 0.3;
    }
  }
</style>
