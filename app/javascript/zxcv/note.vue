<template lang="pug">
  .note(v-bind:class='[noteBackground]')
</template>

<script>
  export default {
    name: "note",
    props: [
      "note",
      "position",
    ],
    computed: {
      noteBackground(){
        if((this.note.note & this.position) > 0){
          return this.note.bad ? "bad" : `color_${this.note.colorId}`;
        }
        if(this.note.heal){
          return "heal";
        }
        return "";
      },
    },
  }
</script>

<style lang='scss' scoped>
  @import "../stylesheets/constants";
  .note {
      width: $note_width;
      height: $note_height;
    }

  .heal {
    background: linear-gradient(to bottom, $accent_color 20%, $accent_shadow_color);
  }

  .active {
    background: linear-gradient(to bottom, $primary_color 70%, $primary_shadow_color);
  }

  .bad {
    background: linear-gradient(to bottom, $negative_color 70%, $negative_shadow_color);
  }

  $note_colors: (
          1:  (
                  color1: #81aed3,
                  color2: #5261c1,
                  color3: #1964d4,
                  color4: #d6d3ec,
          ),
          2:  (
                  color1: #6ed6d1,
                  color2: #17a229,
                  color3: #07c126,
                  color4: #71f9af,
          ),
          3:  (
                  color1: #f6adff,
                  color2: #e820d7,
                  color3: #fc6aff,
                  color4: #ffdeee,
          ),
          4:  (
                  color1: #ffe6ad,
                  color2: #f79c10,
                  color3: #e8be21,
                  color4: #fdf4d9,
          ),
          5:  (
                  color1: #e682f7,
                  color2: #b72caa,
                  color3: #ad1cb7,
                  color4: #e9e6e1,
          ),
          6:  (
                  color1: #615f64,
                  color2: #737683,
                  color3: #7a7f88,
                  color4: #4f5153,
          ),
  );
  @each $idx, $property in $note_colors{
    .color_#{$idx} {
      background: linear-gradient(to bottom, map-get($property, color1) 0%, map-get($property, color2) 63%, map-get($property, color3) 75%, map-get($property, color4) 100%);
    }
  }
</style>
