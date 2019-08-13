<template lang="pug">
  #app
    h1
      | zxcv
    .window
      notes(v-bind:notes="recentNotes")
      ui(
        v-bind:life="life",
        v-bind:gameState="gameState",
        v-bind:score="score",
        v-bind:volume="volume",
        v-bind:minuses="minuses",
        v-bind:sparks="sparks",
        v-bind:speedScore="speedScore",
        v-bind:totalScore="totalScore",
        v-bind:highScore="highScore",
        v-on:setVolume="setVolume"
        v-on:setName="setName"
        v-on:inputStateChanged="(state)=>{this.inputtingName = state}"
        )
</template>

<script>
  import notes from './zxcv/notes.vue'
  import ui from './zxcv/ui.vue'
  import DefaultNotePattern from './packs/defaultNotePattern.js'
  import RandaNotePattern from './packs/randaNotePattern.js'
  import Constants from './packs/constants.js'
  import axios from 'axios'
  export default {
    components: {
      notes,
      ui,
    },
    data: function(){
      return {
        notes: [],
        keyboard: [],
        username: "",
        highScore: 0,
        score: 0,
        life: 0,
        gameState: 0,
        startedTime: 0,
        clearedTime: 0,
        currentTime: 0,
        timeDelta: 0,
        sounds: {},
        volume: 1,
        minuses: [],
        sparks: [],
        initialNoteCount: 0,
        inputtingName: false,
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
    mounted: function(){
      this.getHighScore();
    },
    watch: {
      volume(altered) {
        localStorage.volume = altered;
      },
    },
    computed: {
      recentNotes: function(){
        return this.notes.slice(0, Constants.displayNotes).reverse();
      },
      isDanger: function(){
        return this.life < Constants.dangerLine;
      },
      alive: function() {
        return this.life > 0;
      },
      bpm: function(){
        return Math.floor(this.initialNoteCount / (this.clearedTime - this.startedTime) * 60 * 1000);
      },
      speedScore: function(){
        return Math.floor(this.bpm /10) || 0;
      },
      totalScore: function(){
        let score = this.score;
        if(this.gameState === Constants.gameStates.cleared){
          score += this.speedScore;
        }
        return score;
      },
    },
    methods: {
      // initializers
      initNotes: function () {
        // ノーツ列を取得
        const notePattern = DefaultNotePattern.generateNotes();
        this.notes = [];
        for(let note of notePattern){
          this.notes.push(this.newNote(note));
        }
        // 40ノーツごとに回復ノーツにする
        for(let i = 0; i < this.notes.length - 1; i++){
          if(i % Constants.healNotesInterval === 0){
            this.notes[i].heal = true;
          }
        }
        this.initialNoteCount = this.notes.length;
      },

      newNote: function(note){
        return {
          id: Math.floor(Math.random() * 100000000000),
          note: note,
          z: note & Constants.notes.z,
          x: note & Constants.notes.x,
          c: note & Constants.notes.c,
          v: note & Constants.notes.v,
          bad: false,
          heal: false,
        };
      },

      createMinusEffect: function(){
        this.minuses.push({
          id: Math.floor(Math.random() * 100000000000),
        });
      },

      createSparkEffect: function(){
        this.sparks.push({
          id: Math.floor(Math.random() * 100000000000),
        });
      },

      flushMinusEffects: function(){
        this.minuses = [];
      },

      flushSparkEffects: function(){
        this.sparks = [];
      },

      reset: function(){
        this.gameState = Constants.gameStates.title;
        this.initNotes();
        this.initKeyboard();
        this.score = 0;
        this.life = Constants.maxLife;
        this.currentTime = 0;
        this.timeDelta = 0;
        this.startedTime = 0;
        this.clearedTime = 0;
        this.flushMinusEffects();
        this.flushSparkEffects();
        this.getHighScore();
        this.inputtingName = false;
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

      initKeyboard: function () {
        for(let i = "a".charCodeAt(0); i <= "z".charCodeAt(0); i++) {
          this.keyboard[String.fromCharCode(i)] = 0;
        }
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
          case Constants.gameStates.title:
            break;
          case Constants.gameStates.inGame:
            this.updateInGame();
            break;
          case Constants.gameStates.gameOver:
            break;
          case Constants.gameStates.cleared:
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
        // 既存のエフェクトをすべて飛ばす
        this.flushMinusEffects();
        this.flushSparkEffects();

        // 死亡判定
        if(!this.alive){
          this.playSound("dead", false);
          this.sendResult();
          this.gameState = Constants.gameStates.gameOver;
          return;
        }

        let damage = Math.max(this.score * Constants.damageIncreaseSpeed, Constants.minDamagePerLife);
        damage *= this.timeDelta / 17; // 1F=17msに合わせて補正する
        if(this.isDanger){
          damage *= (1 - Constants.dangerDamageReduceRate);
        }
        this.life -= damage;
      },

      triggerKeyboardEvents: function(){
        switch (this.gameState) {
          case Constants.gameStates.title:
            this.handleKeyTitle();
            break;
          case Constants.gameStates.inGame:
            this.handleKeyInGame();
            break;
          case Constants.gameStates.gameOver:
            this.handleKeyGameOver();
            break;
          case Constants.gameStates.cleared:
            this.handleKeyCleared();
            break;
          default:
            console.error(`undefined game mode set: ${this.gameState} on trigger Key Event`);
            break;
        }
      },

      keyboardStatus: function(){
        let result = 0;
        for (let [key, value] of Object.entries(Constants.notes)) {
          if(this.keyboard[key]){
            result += value;
          }
        }
        return result;
      },

      // zxcvと1248の相互変換がめんどいでござる
      lastKey: function(){
        for (let key of Object.keys(Constants.notes)) {
          if(this.keyboard[key] === 1){
            return key;
          }
        }
        return "";
      },

      handleKeyTitle: function(){
        if(this.keyboardStatus() && !this.inputtingName){
          this.startedTime = new Date().getTime();
          this.gameState = Constants.gameStates.inGame;
        }
      },

      handleKeyInGame: function(){
        // 死んでたらキーの処理をしない
        if(!this.alive){
          return;
        }

        // rでいつでもリトライ可能(でもプレイログ送信はする)
        if(this.keyboard["r"]){
          this.playSound("reset", false);
          this.sendResult();
          this.reset();
          return;
        }

        const keyStatus = this.keyboardStatus();
        const lastKey = this.lastKey();

        // 「今」押されたキーが次のノーツと一切関係がなかったらBAD
        if((keyStatus & this.notes[0].note) === 0) {
          this.score -= 1;
          this.life -= Constants.badDamage;
          this.notes[0].bad = true;
          this.playSound("miss");
          this.createMinusEffect();
        }

        if((keyStatus & this.notes[0].note) === this.notes[0].note){
          // 現状の構造だとキーが押されているかどうかしか判定されないので
          this.playSound(lastKey);
          this.score++;
          if(this.notes[0].heal){
            this.life += Constants.recoverPerHealNote;
            this.playSound("heal", false);
          }
          else{
            this.life += Constants.recoverPerNote;
          }
          this.life = Math.min(this.life, Constants.maxLife);
          this.createSparkEffect();
          this.notes.shift();
        }

        // クリア判定
        if(this.notes.length === 0){
          this.playSound("clear", false);
          this.clearedTime = new Date().getTime();
          this.gameState = Constants.gameStates.cleared;
          this.sendResult();
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

      sendResult: function(){
        axios.post(location.href,
          {
            authenticity_token: $("meta[name=csrf-token]").attr("content"),
            username: this.username,
            speed_score: this.speedScore,
            score: this.score,
            total_score: this.totalScore,
          }
        ).then((results) => {
          // TODO: ハイスコア更新とかがここで処理される
          console.log(results);
          console.log("OK");
        }).catch((results) => {
          console.warn(results);
          console.warn("NG");
        })
      },

      getHighScore: function(){
        axios.get(location.href + `/high_score?username=${this.username}`
        ).then((results) => {
          window.res = results;
          console.log(results);
          this.highScore = results.data.high_score;
          console.log("OK");
        }).catch((results) => {
          console.warn(results);
          console.warn("NG");
        })
      },

      setVolume: function(vol){
        this.volume = vol;
        this.playSound("z");
      },
      setName: function(name){
        this.username = name;
        console.log("name set!");
        this.getHighScore();
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
