
var app = new Vue({
  el: '#app',
  data: {
    notes: [],
    keyboard: [],
    score: 0,
    life: 0,
    gameState: 0,
    sounds: {},
  },
  created: function(){
    this.reset();
    this.invokeUpdate();
    this.loadSounds();
  },
  computed: {
    recentNotes: function(){
      return this.notes.slice(0, this.constants.displayNotes).reverse();
    },
    lifeLength: function(){
      return (this.life / this.constants.maxLife * 100) + "%"
    },
    alive: function() {
      return this.life > 0;
    },
    constants: function(){
      return {
        notes: {
          "z": 0b0001,
          "x": 0b0010,
          "c": 0b0100,
          "v": 0b1000,
        },

        maxLife: 10000,
        minDamagePerLife: 10,
        recoverPerNote: 100,
        displayNotes: 16,
        initialNotes: 1000,
        gameStates: {
          title: 0,
          inGame: 1,
          gameOver: 2,
          cleared: 3,
        },
      }
    },
  },
  methods: {
    // initializers
    initNotes: function () {
      this.notes = [];
      for (let i = 0; i < this.constants.initialNotes; ++i){
        this.notes.push(
          {
            id: i,
            note: parseInt(Math.random() * 16),
          }
        );
      }
    },
    initKeyboard: function () {
      for(let i = "a".charCodeAt(0); i <= "z".charCodeAt(0); i++) {
        this.keyboard[String.fromCharCode(i)] = 0;
      }
    },

    reset: function(){
      this.gameState = this.constants.gameStates.title;
      this.initNotes();
      this.initKeyboard();
      this.score = 0;
      this.life = this.constants.maxLife;
    },

    loadSounds: function(){
      this.sounds.z = new Audio("/game/zxcv/sounds/z.wav");
      this.sounds.x = new Audio("/game/zxcv/sounds/x.wav");
      this.sounds.c = new Audio("/game/zxcv/sounds/c.wav");
      this.sounds.v = new Audio("/game/zxcv/sounds/v.wav");
    },

    // handlers
    handleKeydown: function (e) {
      this.keyboard[e.key] = 1;
      this.triggerKeyboardEvents();
    },
    handleKeyup: function (e) {
      this.keyboard[e.key] = 0;
    },

    invokeUpdate: function(){
      switch (this.gameState) {
        case this.constants.gameStates.title:
          break;
        case this.constants.gameStates.inGame:
          this.updateInGame();
          break;
        case this.constants.gameStates.gameOver:
          break;
        case this.constants.gameStates.cleared:
          break;
        default:
          console.error(`undefined game mode set: ${this.gameState} on update`);
          break;
      }
      requestAnimationFrame(this.invokeUpdate);
    },

    updateInGame: function(){
      // TODO: ライフの減算量をフレームレート非依存にする
      this.life -= Math.max((this.constants.initialNotes - this.notes.length) / 10, this.constants.minDamagePerLife);
    },

    triggerKeyboardEvents: function(){
      switch (this.gameState) {
        case this.constants.gameStates.title:
          this.handleKeyTitle();
          break;
        case this.constants.gameStates.inGame:
          this.handleKeyInGame();
          break;
        case this.constants.gameStates.gameOver:
          this.handleKeyGameOver();
          break;
        case this.constants.gameStates.cleared:
          this.handleKeyCleared();
          break;
        default:
          console.error(`undefined game mode set: ${this.gameState} on trigger Key Event`);
          break;
      }
    },

    keyboardStatus: function(){
      result = 0;
      for (let [key, value] of Object.entries(this.constants.notes)) {
        if(this.keyboard[key]){
          result += value;
        }
      }
      return result;
    },

    handleKeyTitle: function(){
      if(this.keyboardStatus()){
        this.gameState = this.constants.gameStates.inGame;
      }
    },

    handleKeyInGame: function(){
      // 死んでたらキーの処理をしない
      if(!this.alive){
        this.gameState = this.constants.gameStates.gameOver;
        return;
      }

      const key = this.keyboardStatus();
      if((key & this.notes[0].note) == this.notes[0].note){
        // 現状の構造だとキーが押されているかどうかしか判定されないので
        //this.sounds[hitKey].currentTime = 0;
        //this.sounds[hitKey].play();
        this.notes.shift();
        this.score++;
        this.life += this.constants.recoverPerNote;
      }

      // クリア判定
      if(this.notes.length === 0){
        this.gameState = this.constants.gameStates.cleared;
      }
    },

    handleKeyGameOver: function(){
      if(this.keyboard["r"]){
        this.reset();
      }
    },

    handleKeyCleared: function(){
      if(this.keyboard["r"]){
        this.reset();
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
