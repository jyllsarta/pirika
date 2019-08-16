<template lang="pug">
  .frame_window
    .whiteout_cover
    transition-group.frames(name='notes', tag='div')
      .frame.notes-item(v-bind:key='note.id', v-for='note in notes')
        .z.note(v-bind:class='[noteBackground(note, 0b0001)]')
        .x.note(v-bind:class='[noteBackground(note, 0b0010)]')
        .c.note(v-bind:class='[noteBackground(note, 0b0100)]')
        .v.note(v-bind:class='[noteBackground(note, 0b1000)]')
</template>

<script>
  export default {
    name: "notes",
    data: function(){
      return {
      };
    },
    props: [
      "notes",
    ],
    created: function(){
      console.log("loaded notes!");
    },
    computed: {
    },
    methods: {
      // noteをコンポーネントに切り出してcomputedにねじこみたい
      noteBackground(note, position){
        if((note.note & position) > 0){
          return note.bad ? "bad" : `color_${note.colorId}`;
        }
        if(note.heal){
          return "heal";
        }
        return "";
      },
    },
  }
</script>

<style lang='scss' scoped>
  @import "../stylesheets/constants";

  .notes-item{
    transition: all 0.3s;
  }
  .notes-enter, .notes-leave-to{
    opacity: 0;
    transform: scale(0.2);
  }

  .whiteout_cover{
    position: absolute;
    z-index: 100;
    background: linear-gradient(to bottom, white 0%, rgba(0, 0, 0, 0) 60%);
    width: $note_width * 4;
    height: $note_height * $note_count;
  }

  .frame_window{
    z-index: 10;
    transform: scaleY(1.6) perspective(40px) rotateX(5deg);
    transform-origin: bottom center;
    width: $note_width * 4;
    height: $note_height * $note_count;
    background: radial-gradient(farthest-corner at 50% 100%, $background_light_gray 40%, #FFFFFF 70%);
  }

  .frames{
    display: flex;
    flex-direction: column;
    width: $note_width * 4;
    height: $note_height * $note_count;
  }
  .frame {
    display: flex;
    flex-direction: row;
    width: $note_width * 4;
    height: $note_height;

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
  }
  $note_colors: (
          1: (
                  main_color:   #123123,
                  shadow_color: #000000,
          ),
          2: (
                  main_color:   #216c20,
                  shadow_color: #c36c2b,
          ),
          3: (
                  main_color:   #123123,
                  shadow_color: #000000,
          ),
          4: (
                  main_color:   #123123,
                  shadow_color: #000000,
          ),
          5: (
                  main_color:   #123123,
                  shadow_color: #000000,
          ),
          6: (
                  main_color:   #123123,
                  shadow_color: #000000,
          ),
  );
  @each $idx, $property in $note_colors{
    .color_#{$idx} {
      background: linear-gradient(to bottom, map-get($property, main_color) 70%, map-get($property, shadow_color));
    }
  }
</style>
