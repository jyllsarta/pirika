<template lang="pug">
  .back(:class="noteBackground")
</template>

<script>
  export default {
    name: "back",
    props: [
      "notes",
      "initialNoteCount",
    ],
    computed: {
      noteBackground(){
        return `color_${Math.floor((this.initialNoteCount - this.notes.length) / 100) + 1}`;
      },
    },
  }
</script>

<style lang='scss' scoped>
  @import "stylesheets/constants";
  // 素直にnoteと同じ宣言にしたほうが行儀良かったかもなあ
  $colors       : #414755 #324136 #555447 #554e53 #292a2d #e6e4ee;
  $shadow_colors: #2a2a34 #233134 #2b2616 #282128 #0b0b0c #7d7a81;

  @for $i from 1 through length($colors) {
    .color_#{$i} {
      background: linear-gradient(to bottom, nth($colors, $i) 66%, nth($shadow_colors, $i));
    }
  }

  .back{
    position: absolute;
    width: 100%;
    height: $note_height * $note_count + 150;
  }

</style>
