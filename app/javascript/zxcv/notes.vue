<template lang="pug">
  .frame_window
    .whiteout_cover
    transition-group.frames(name='notes', tag='div')
      .frame.notes-item(v-bind:key='note.id', v-for='note in notes')
        .z.note(v-bind:class='{active: note.z, bad: note.bad && note.z, heal: note.heal}')
        .x.note(v-bind:class='{active: note.x, bad: note.bad && note.x, heal: note.heal}')
        .c.note(v-bind:class='{active: note.c, bad: note.bad && note.c, heal: note.heal}')
        .v.note(v-bind:class='{active: note.v, bad: note.bad && note.v, heal: note.heal}')
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
  .frame{
    display: flex;
    flex-direction: row;
    width: $note_width * 4;
    height: $note_height;
    .note{
      width: $note_width;
      height: $note_height;
    }
    .heal{
      background: linear-gradient(to bottom, $accent_color 20%, $accent_shadow_color);
    }
    .active{
      background: linear-gradient(to bottom, $primary_color 70%, $primary_shadow_color);
    }
    .bad{
      background: linear-gradient(to bottom, $negative_color 70%, $negative_shadow_color);
    }
  }
</style>
