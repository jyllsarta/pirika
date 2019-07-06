// global constants
const G_NOTES = {
  0: "z",
  1: "x",
  2: "c",
  3: "v",
}


var app = new Vue({
    el: '#app',
    data: {
      notes: [],
      keyboard: [],
      score: 0,
    },
    created: function(){
        console.log("pong!");
        this.initNotes();
        this.initKeyboard();
    },
    computed: {
      recentNotes: function(){
        return this.notes.slice(0,16);
      }
    },
    methods: {
      // initializers
      initNotes: function () {
        for (let i = 0; i < 100; ++i){
          this.notes.push(
            {
              id: i,
              note: parseInt(Math.random() * 4),
            }
          );
        }
      },
      initKeyboard: function () {
        for(let i = "a".charCodeAt(0); i <= "z".charCodeAt(0); i++) {
          this.keyboard[String.fromCharCode(i)] = 0;
        }
      },

      // handlers
      handleKeydown: function (e) {
        this.keyboard[e.key] = 1;
        this.updateNotes();
      },
      handleKeyup: function (e) {
        this.keyboard[e.key] = 0;
      },

      // logic
      updateNotes: function(){
        if(this.keyboard[G_NOTES[this.notes[0].note]]){
          console.log(this.notes[0]);
          this.notes.shift();
          this.score++;
        }
      },
    }
});

// init global key event
$(function(){
  document.onkeydown = function(e){
    app.handleKeydown(e);
  };
  document.onkeyup = function(e){
    app.handleKeyup(e);
  };
});

