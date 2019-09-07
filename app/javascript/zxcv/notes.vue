<template lang="pug">
  .frame_window
    transition-group.frames(name='notes', tag='div')
      .frame.notes-item(v-bind:key='note.id', v-for='note in notes')
        note(v-bind:note='note', :position='0b0001', :index='notes.indexOf(note)')
        note(v-bind:note='note', :position='0b0010', :index='notes.indexOf(note)')
        note(v-bind:note='note', :position='0b0100', :index='notes.indexOf(note)')
        note(v-bind:note='note', :position='0b1000', :index='notes.indexOf(note)')
</template>

<script>
  import note from "./note.vue";
  export default {
    name: "notes",
    components: {
      note,
    },
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
  @import "stylesheets/constants";

  .notes-item{
    transition: all 0.2s;
  }
  .notes-enter, .notes-leave-to{
    opacity: 0;
    transform: scale(0.1) translateY(-20px);
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
    background: radial-gradient(farthest-corner at 50% 100%, $background_light_gray 40%, rgba(0,0,0,0) 70%);
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
  }
</style>
