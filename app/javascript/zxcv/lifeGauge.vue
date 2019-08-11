<template lang="pug">
  .life(v-bind:class='[lifeState]', v-bind:style='{width: lifeLength}')
</template>

<script>
  export default {
    name: "lifeGauge",
    props: [
      "constants", // TODO: 全然関係ない別モジュールに切り出すのが正解かもしれない
      "life",
    ],
    computed: {
      lifeLength: function(){
        return (this.life / this.constants.maxLife * 100) + "%"
      },
      lifeState: function(){
        if(this.life >= this.constants.safeLine){
          return "max";
        }
        if(this.life >= this.constants.dangerLine){
          return "normal";
        }
        return "danger";
      },
    },
  }
</script>

<style lang='scss' scoped>
  @import "../stylesheets/constants";

  .life{
    height: 20px;
    transform: translateY(-100px);
    opacity: $transparent_pale;
  }

  .normal{
    background-color: $primary_color;
  }

  .danger{
    background-color: $negative_color;
  }

  .max{
    background-color: $accent_color;
  }
</style>
