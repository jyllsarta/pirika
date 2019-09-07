<template lang="pug">
  transition-group.spark-list(name="spark-list")
    .spark(v-for="spark in sparks" v-bind:key="spark.id")
      | +1
</template>

<script>
  export default {
    name: "sparkList",
    props: [
      "sparks",
    ],
  }
</script>

<style lang='scss' scoped>
  @import "stylesheets/constants";

  .spark-list{
    position: absolute;
    left: 25%;
    bottom: 30%;
    width: 60%;
    text-align: center;
    opacity: $transparent_normal;
    font-size: $title_font_size;
    color: $primary_color;

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
