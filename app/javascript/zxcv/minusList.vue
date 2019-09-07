<template lang="pug">
  transition-group.minus-list(name="minus-list")
    .minus(v-for="minus in minuses" v-bind:key="minus.id")
      | -1
</template>

<script>
  export default {
    name: "minusList",
    props: [
      "minuses",
    ],
  }
</script>

<style lang='scss' scoped>
  @import "stylesheets/constants";

  .minus-list{
    position: absolute;
    left: 25%;
    bottom: 30%;
    width: 60%;
    text-align: center;
    opacity: $transparent_normal;
    font-size: $title_font_size;
    color: $negative_color;

    &-leave-active{
      opacity: 0.4;
      transform: translateY(0);
      transition: {
        property       : transform, opacity;
        duration       : 0.3s;
        delay          : 0s;
      }
    }
    &-leave-to{
      opacity: 0;
      transform: translateY(-20px);
    }
  }

</style>
