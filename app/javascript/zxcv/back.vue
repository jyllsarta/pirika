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
  @import "../stylesheets/constants";
  // 素直にnoteと同じ宣言にしたほうが行儀良かったかもなあ
  $colors       : #565f71 #5f7170 #707141 #71515e #597148 #8c8a93;
  $shadow_colors: #3c3c4a #31444a #403b22 #332a33 #182f30 #686269;

  @for $i from 1 through length($colors) {
    .color_#{$i} {
      background: linear-gradient(to bottom, nth($colors, $i) 60%, nth($shadow_colors, $i));
    }
  }

  .back{
    position: absolute;
    width: 100%;
    height: $note_height * $note_count + 100;
  }

</style>
