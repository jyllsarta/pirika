<template lang="pug">
  #app
    h1
      | zxcv
    .window
      notes(v-bind:notes="recentNotes")
      ui(
        v-bind:life="life",
        v-bind:constants="constants",
        v-bind:gameState="gameState",
        v-bind:score="score",
        v-bind:volume="volume",
        v-bind:minuses="minuses",
        v-on:setVolume="setVolume"
        )
</template>

<script>
  import notes from './zxcv/notes.vue'
  import ui from './zxcv/ui.vue'
  export default {
    components: {
      notes,
      ui,
    },
    data: function(){
      return {
        notes: [],
        keyboard: [],
        score: 0,
        life: 0,
        gameState: 0,
        currentTime: 0,
        timeDelta: 0,
        sounds: {},
        volume: 1,
        minuses: [],
      };
    },
    created: function(){
      this.reset();
      this.invokeUpdate();
      this.loadSounds();
      this.mountKeyboardEvent();
      if (localStorage.volume) {
        this.volume = localStorage.volume;
      }
    },
    watch: {
      volume(altered) {
        localStorage.volume = altered;
      },
    },
    computed: {
      recentNotes: function(){
        return this.notes.slice(0, this.constants.displayNotes).reverse();
      },
      isDanger: function(){
        return this.life < this.constants.dangerLine;
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
          dangerLine: 3333,
          safeLine: 9950,
          minDamagePerLife: 10,
          recoverPerNote: 130,
          recoverPerHealNote: 4000,
          dangerDamageReduceRate: 0.60,
          damageIncreaseSpeed: 0.16,
          badDamage: 300,
          displayNotes: 16,
          initialNotes: 1000,
          gameStates: {
            title: 0,
            inGame: 1,
            gameOver: 2,
            cleared: 3,
          },
          healNotesInterval: 25,
          notePatterns: [
            [0b0001, 0b0010, 0b0100, 0b1000],
            [0b1000, 0b0100, 0b0010, 0b0001],
            //[0b1001, 0b0110, 0b1001, 0b0110],
            [0b1000, 0b0001, 0b1100, 0b0011],
            [0b0001, 0b0010, 0b0100, 0b1000],
            [0b0010, 0b0100, 0b0010, 0b0100],
            [0b0100, 0b0010, 0b0100, 0b0010],
            [0b1000, 0b0001, 0b1000, 0b0001],
            [0b0001, 0b1000, 0b0001, 0b1000],
            [0b0001, 0b1000, 0b0100, 0b0010],
            [0b1000, 0b0001, 0b0010, 0b0100],
            [0b0010, 0b0100, 0b1000, 0b0001],
            [0b0100, 0b0010, 0b0001, 0b1000],
            //[0b0001, 0b0010, 0b0100, 0b0111],
            //[0b1000, 0b0100, 0b0010, 0b1110],
          ],
        }
      },
    },
    methods: {
      // initializers
      initNotes: function () {
        // this.notes を埋める
        this.notes = this.generateNotes();
        // 40ノーツごとに回復ノーツにする
        for(let i = 0; i < this.notes.length - 1; i++){
          if(i % this.constants.healNotesInterval === 0){
            this.notes[i].heal = true;
          }
        }
      },
      initKeyboard: function () {
        for(let i = "a".charCodeAt(0); i <= "z".charCodeAt(0); i++) {
          this.keyboard[String.fromCharCode(i)] = 0;
        }
      },

      generateNotes: function(){
        let notes = [];
        for (let i = 0; i < 50; ++i){
          notes = notes.concat(this.getRandomMeasure());
          notes = notes.concat(this.getPatternedMeasure());
        }
        return notes;
      },

      getRandomMeasure: function(){
        let measure = [];
        const notes = Object.values(this.constants.notes);
        for(let i = notes.length - 1; i > 0; i--){
          let r = Math.floor(Math.random() * (i + 1));
          let tmp = notes[i];
          notes[i] = notes[r];
          notes[r] = tmp;
        }
        for(let note of notes){
          measure.push(this.newNote(note));
        }
        return measure;
      },

      getPatternedMeasure: function(){
        const rand = Math.floor(Math.random() * this.constants.notePatterns.length);
        const pattern = this.constants.notePatterns[rand];
        let measure = [];
        for(let note of pattern){
          measure.push(this.newNote(note));
        }
        return measure;
      },

      newNote: function(note){
        return {
          id: Math.floor(Math.random() * 100000000000),
          note: note,
          z: note & this.constants.notes.z,
          x: note & this.constants.notes.x,
          c: note & this.constants.notes.c,
          v: note & this.constants.notes.v,
          bad: false,
          heal: false,
        };
      },

      createMinusEffect: function(){
        this.minuses.push({
          id: Math.floor(Math.random() * 100000000000),
        });
      },

      flushMinusEffects: function(){
        this.minuses = [];
      },

      reset: function(){
        this.gameState = this.constants.gameStates.title;
        this.initNotes();
        this.initKeyboard();
        this.score = 0;
        this.life = this.constants.maxLife;
        this.currentTime = 0;
        this.timeDelta = 0;
      },

      loadSounds: function(){
        this.sounds.z = new Audio("/game/zxcv/sounds/z.wav");
        this.sounds.x = new Audio("/game/zxcv/sounds/x.wav");
        this.sounds.c = new Audio("/game/zxcv/sounds/c.wav");
        this.sounds.v = new Audio("/game/zxcv/sounds/v.wav");
        this.sounds.miss = new Audio("/game/zxcv/sounds/miss.wav");
        this.sounds.heal = new Audio("/game/zxcv/sounds/heal.wav");
        this.sounds.dead = new Audio("/game/zxcv/sounds/dead.wav");
        this.sounds.clear = new Audio("/game/zxcv/sounds/clear.wav");
        this.sounds.reset = new Audio("/game/zxcv/sounds/reset.wav");
      },

      playSound: function(soundId, interruptPreviousSound=true){
        if(interruptPreviousSound){
          this.sounds[soundId].currentTime = 0;
        }
        this.sounds[soundId].volume = this.volume;
        this.sounds[soundId].play();
      },

      mountKeyboardEvent: function(){
        document.onkeydown = function (e) {
          this.handleKeydown(e);
        }.bind(this);
        document.onkeyup = function (e) {
          this.handleKeyup(e);
        }.bind(this);
      },

      // handlers
      handleKeydown: function (e) {
        // keyboard は 押されたら1 押しっぱなしだとそれ以上 の値が入っている
        for (let key of this.keyboard.keys()) {
          if(this.keyboard[key]){
            this.keyboard[key] += 1;
          }
        }
        this.keyboard[e.key] = 1;
        this.triggerKeyboardEvents();
      },
      handleKeyup: function (e) {
        this.keyboard[e.key] = 0;
      },

      invokeUpdate: function(){
        this.updateTime();
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

      updateTime: function(){
        const prevTime = this.currentTime;
        const now = new Date().getTime();
        this.timeDelta = now - prevTime;
        this.currentTime = now;
      },

      updateInGame: function(){
        // 死亡判定
        if(!this.alive){
          this.playSound("dead", false);
          this.gameState = this.constants.gameStates.gameOver;
          return;
        }

        // 既存のマイナスエフェクトをすべて飛ばす
        this.flushMinusEffects();

        let damage = Math.max(this.score * this.constants.damageIncreaseSpeed, this.constants.minDamagePerLife);
        damage *= this.timeDelta / 17; // 1F=17msに合わせて補正する
        if(this.isDanger){
          damage *= (1 - this.constants.dangerDamageReduceRate);
        }
        this.life -= damage;
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
        let result = 0;
        for (let [key, value] of Object.entries(this.constants.notes)) {
          if(this.keyboard[key]){
            result += value;
          }
        }
        return result;
      },

      // zxcvと1248の相互変換がめんどいでござる
      lastKey: function(){
        for (let key of Object.keys(this.constants.notes)) {
          if(this.keyboard[key] === 1){
            return key;
          }
        }
        return "";
      },

      handleKeyTitle: function(){
        if(this.keyboardStatus()){
          this.gameState = this.constants.gameStates.inGame;
        }
      },

      handleKeyInGame: function(){
        // 死んでたらキーの処理をしない
        if(!this.alive){
          return;
        }

        const keyStatus = this.keyboardStatus();
        const lastKey = this.lastKey();

        // 「今」押されたキーが次のノーツと一切関係がなかったらBAD
        if((keyStatus & this.notes[0].note) === 0) {
          this.score -= 1;
          this.life -= this.constants.badDamage;
          this.notes[0].bad = true;
          this.playSound("miss");
          this.createMinusEffect();
        }

        if((keyStatus & this.notes[0].note) === this.notes[0].note){
          // 現状の構造だとキーが押されているかどうかしか判定されないので
          this.playSound(lastKey);
          this.score++;
          if(this.notes[0].heal){
            this.life += this.constants.recoverPerHealNote
            this.playSound("heal", false);
          }
          else{
            this.life += this.constants.recoverPerNote;
          }
          this.life = Math.min(this.life, this.constants.maxLife);
          this.notes.shift();
        }

        // クリア判定
        if(this.notes.length === 0){
          this.playSound("clear", false);
          this.gameState = this.constants.gameStates.cleared;
        }
      },

      handleKeyGameOver: function(){
        if(this.keyboard["r"]){
          this.playSound("reset", false);
          this.reset();
        }
      },

      handleKeyCleared: function(){
        if(this.keyboard["r"]){
          this.playSound("reset", false);
          this.reset();
        }
      },

      setVolume: function(vol){
        this.volume = vol;
      },
    }
  }
</script>

<style lang='scss' scoped>
  @import "stylesheets/constants";
  .menu_item{
    font-size: 100px;
  }

  .window{
    display: block;
    position: relative;
    width: $note_width * 4 + 50;
    height: $note_height * $note_count + 50;
    padding: 0 25px 50px 25px;
    margin: auto;
  }

  .ui{
    z-index: 100;
  }

</style>
