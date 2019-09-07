<template lang="pug">
  .note(:class='[noteBackground]' :style="{opacity: opacity}")
</template>

<script>
  export default {
    name: "note",
    props: [
      "note",
      "position",
      "index",
    ],
    computed: {
      active(){
        return (this.note.note & this.position) > 0;
      },
      noteBackground(){
        if(this.active){
          return this.note.bad ? "bad" : `color_${this.note.colorId}`;
        }
        if(this.note.heal){
          return "heal";
        }
        return "";
      },
      opacity(){
        if(!this.active && this.note.heal){
          return 0.4;
        }
        return 0.2 + (this.index * 0.05);
      }
    },
  }
</script>

<style lang='scss' scoped>
  @import "stylesheets/constants";
  .note {
      width: $note_width;
      height: $note_height;
    }

  .heal {
    mix-blend-mode: lighten;
    opacity: 0.2;
    background: linear-gradient(to bottom, #a1d6af 20%, #a7e9e6);
  }

  .bad {
    background: linear-gradient(to bottom, $negative_color 83%, $negative_shadow_color 85%);
  }

  $note_colors: (
          1:  (
                  color1: #c7dbe6,
                  color2: #5d6279,
          ),
          2:  (
                  color1: #d3e3d9,
                  color2: #48534c,
          ),
          3:  (
                  color1: #d9d3cf,
                  color2: #664c46,
          ),
          4:  (
                  color1: #d0ceca,
                  color2: #7f6b7c,
          ),
          5:  (
                  color1: #eaecf3,
                  color2: #363438,
          ),
          6:  (
                  color1: #494b4f,
                  color2: #c4cadc,
          ),
  );
  @each $idx, $property in $note_colors{
    .color_#{$idx} {
      background: linear-gradient(to bottom, map-get($property, color1) 83%, map-get($property, color2) 85%);
    }
  }
</style>
