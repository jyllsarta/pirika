// global constants
const G_NOTES = {
  0: "z",
  1: "x",
  2: "c",
  3: "v",
};

const G_MAX_LIFE = 10000;
const G_DAMAGE_PER_FRAME = 10;
const G_RECOVER_PER_NOTE = 100;
const G_DISPLAY_NOTES = 16;
const G_INITIAL_NOTES = 100;

var app = new Vue({
    el: '#app',
    data: {
      notes: [],
      keyboard: [],
      score: 0,
      life: 0,
    },
    created: function(){
        this.initNotes();
        this.initKeyboard();
        this.life = G_MAX_LIFE;
        this.invokeUpdate();
    },
    computed: {
      recentNotes: function(){
        return this.notes.slice(0, G_DISPLAY_NOTES);
      },
      lifeLength: function(){
        return (this.life / G_MAX_LIFE * 100) + "%"
      },
      alive: function(){
        return this.life > 0;
      }
    },
    methods: {
      // initializers
      initNotes: function () {
        for (let i = 0; i < G_INITIAL_NOTES; ++i){
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
      invokeUpdate: function(){
        // TODO: ライフの減算量をフレームレート非依存にする
        this.life -= G_INITIAL_NOTES - this.notes.length;
        requestAnimationFrame(this.invokeUpdate);
      },

      updateNotes: function(){
        // 死んでたらキーの処理をしない
        if(!this.alive){
          return;
        }

        if(this.keyboard[G_NOTES[this.notes[0].note]]){
          console.log(this.notes[0]);
          this.notes.shift();
          this.score++;
          this.life += G_RECOVER_PER_NOTE;
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
