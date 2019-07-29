<template lang="pug">
#app
  h1
    | zxcv
  .window
    .frame_window
      transition-group.frames(name='notes', tag='div')
        .frame.notes-item(v-bind:key='note.id', v-for='note in recentNotes')
          .z.note(v-bind:class='{active: note.z, bad: note.bad && note.z, heal: note.heal}')
          .x.note(v-bind:class='{active: note.x, bad: note.bad && note.x, heal: note.heal}')
          .c.note(v-bind:class='{active: note.c, bad: note.bad && note.c, heal: note.heal}')
          .v.note(v-bind:class='{active: note.v, bad: note.bad && note.v, heal: note.heal}')
    .ui
      .score(v-if='gameState !== constants.gameStates.title')
        | {{score}}
      .life(v-bind:class='[lifeState]', v-bind:style='{width: lifeLength}', v-if='gameState !== constants.gameStates.title')
      .dead(v-if='gameState === constants.gameStates.gameOver')
        | GAME OVER (r to reset)
      .title(v-if='gameState === constants.gameStates.title')
        | Z X C V
        | kick zxcv to start
      .win(v-if='gameState === constants.gameStates.cleared')
        | WIN (r to reset)
</template>

<script>
  export default {
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
      };
    },
    created: function(){
      this.reset();
      this.invokeUpdate();
      this.loadSounds();
      this.mountKeyboardEvent();
    },
    computed: {
      recentNotes: function(){
        return this.notes.slice(0, this.constants.displayNotes).reverse();
      },
      lifeLength: function(){
        return (this.life / this.constants.maxLife * 100) + "%"
      },
      lifeState: function(){
        if(this.life >= this.constants.safeLine){
          return "max";
        }
        if(this.life >= this.constants.dangerLine){
          return "normal";
        }
        return "danger";
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
          this.gameState = this.constants.gameStates.gameOver;
          return;
        }

        const keyStatus = this.keyboardStatus();
        const lastKey = this.lastKey();

        // 「今」押されたキーが次のノーツと一切関係がなかったらBAD
        if((keyStatus & this.notes[0].note) === 0) {
          // ここで対応するbadの演出出せると良いなあ
          this.score -= 1;
          this.life -= this.constants.badDamage;
          this.notes[0].bad = true;
        }

        if((keyStatus & this.notes[0].note) === this.notes[0].note){
          // 現状の構造だとキーが押されているかどうかしか判定されないので
          this.sounds[lastKey].currentTime = 0;
          this.sounds[lastKey].play();
          this.score++;
          this.life += this.notes[0].heal ? this.constants.recoverPerHealNote : this.constants.recoverPerNote;
          this.life = Math.min(this.life, this.constants.maxLife);
          this.notes.shift();
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
  }
</script>

<style lang='scss' scoped>
  $note_width: 180px;
  $note_height: 30px;
  $note_count: 16;

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

  .score{
    position: absolute;
    left: 20%;
    bottom: 30%;
    width: 60%;
    text-align: center;
    opacity: 0.8;
    font-size: 40px;
  }

  .life{
    height: 20px;
    transform: translateY(-100px);
    opacity: 0.4;
  }

  .normal{
    background-color: #0b5daa;
  }

  .danger{
    background-color: #aa3a0d;
  }

  .max{
    background-color: #81aa00;
  }

  .dead{
    position: absolute;
    left: 20%;
    bottom: 40%;
    width: 60%;
    opacity: 0.8;
    font-size: 40px;
    text-align: center;
    color: #B00100;
  }

  .title{
    position: absolute;
    left: 10%;
    bottom: 40%;
    width: 80%;
    opacity: 0.8;
    font-size: 60px;
    text-align: center;
    color: #5169b0;
  }

  .win{
    position: absolute;
    left: 20%;
    bottom: 40%;
    width: 60%;
    opacity: 0.8;
    font-size: 40px;
    text-align: center;
    color: #5366e1;
  }

  .frame_window{
    z-index: 10;
    transform: scaleY(1.6) perspective(40px) rotateX(5deg);
    transform-origin: bottom center;
    width: $note_width * 4;
    height: $note_height * $note_count;
  }

  .notes-item{
    transition: all 0.3s;
  }
  .notes-enter, .notes-leave-to{
    opacity: 0;
    transform: scale(0.2);
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
      background-color: rgba(22, 176, 0, 0.38);
    }
    .active{
      background-color: rgba(5, 0, 255, 0.82);
    }
    .bad{
      background-color: #B00100;
    }
  }
</style>
