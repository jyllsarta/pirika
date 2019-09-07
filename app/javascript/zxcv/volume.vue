<template lang="pug">
  .volume_area
      img.volume_icon(v-bind:src="currentImage")
      input.volume(type="range" v-model.number="localVolume" min="0" max="1" step="any", @change="setVolume")
</template>

<script>
  export default {
    name: "volume",
    data: function(){
      return {
        localVolume: 1,
      };
    },
    props: [
      "volume",
    ],
    mounted: function(){
      console.log("loaded volume!!");
      this.localVolume = this.volume;
    },
    computed: {
      currentImage: function () {
        if(0.5 < this.localVolume){
          return "/images/zxcv/volume.png";
        }
        if(0 < this.localVolume){
          return "/images/zxcv/volume_low.png";
        }
        return "/images/zxcv/volume_muted.png";
      },
    },
    methods: {
      setVolume: function(){
        this.$emit("setVolume", this.localVolume);
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import "stylesheets/constants";
  .volume_area{
    position: absolute;
    top: 10%;
    left: 0;
    width: 50%;
    display: flex;
    .volume_icon{
      width: 32px;
      height: 32px;
      margin-right: 20px;
    }

    input[type=range] {
      width: 100%;
      margin: 0;
    }
    input[type=range]:focus {
      outline: none;
    }
    input[type=range]::-webkit-slider-runnable-track {
      width: 100%;
      height: 21px;
      cursor: pointer;
      box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
      background: $primary_color;
      border-radius: 1.3px;
      border: 0.2px solid #010101;
    }
    input[type=range]::-webkit-slider-thumb {
      box-shadow: 1px 1px 1px rgba(0, 0, 0, 0), 0px 0px 1px rgba(13, 13, 13, 0);
      border: 0px solid rgba(0, 0, 0, 0);
      height: 16px;
      width: 32px;
      border-radius: 0px;
      cursor: pointer;
      -webkit-appearance: none;
      margin-top: -0.2px;
    }
    input[type=range]:focus::-webkit-slider-runnable-track {
      background: #b9b8cb;
    }
    input[type=range]::-moz-range-track {
      width: 100%;
      height: 21px;
      cursor: pointer;
      box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
      background: $primary_color;
      border-radius: 1.3px;
      border: 0.2px solid #010101;
    }
    input[type=range]::-moz-range-thumb {
      box-shadow: 1px 1px 1px rgba(0, 0, 0, 0), 0px 0px 1px rgba(13, 13, 13, 0);
      border: 0px solid rgba(0, 0, 0, 0);
      height: 21px;
      width: 32px;
      border-radius: 0px;
      cursor: pointer;
    }
    input[type=range]::-ms-track {
      width: 100%;
      height: 21px;
      cursor: pointer;
      background: transparent;
      border-color: transparent;
      color: transparent;
    }
    input[type=range]::-ms-fill-lower {
      background: #605f82;
      border: 0.2px solid #010101;
      border-radius: 2.6px;
      box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    }
    input[type=range]::-ms-fill-upper {
      background: $primary_color;
      border: 0.2px solid #010101;
      border-radius: 2.6px;
      box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    }
    input[type=range]::-ms-thumb {
      box-shadow: 1px 1px 1px rgba(0, 0, 0, 0), 0px 0px 1px rgba(13, 13, 13, 0);
      border: 0px solid rgba(0, 0, 0, 0);
      width: 32px;
      border-radius: 0px;
      cursor: pointer;
      height: 21px;
    }
    input[type=range]:focus::-ms-fill-lower {
      background: $primary_color;
    }
    input[type=range]:focus::-ms-fill-upper {
      background: #b9b8cb;
    }
  }
</style>
