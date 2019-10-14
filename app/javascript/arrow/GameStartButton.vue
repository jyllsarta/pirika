<template lang="pug">
  .game_start_button(@click="$emit('startGame')")
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
    background-color: $main-color;
    border-radius: $ball-size / 2;
    transition: 0.2s;
    &:hover{
      transform: scale(1.1);
      opacity: 0.3;
    }
  }
</style>
