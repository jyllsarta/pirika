import Board from './board';
import GameMode from './gamemodes';
import PlayLog from './playlog';
import ColorTileAPI from './api';
import {
  log as log,
  warn as warn
} from './logsystem';

// ゲームロジック全般
class ColorTile {

  constructor(playTimeLengthSecond) {
    log("creating ColotTile object")
    this.playTimeLengthSecond = playTimeLengthSecond;
    this.gameMode = GameMode.TITLE;
    this.requestNextBoard();
  }

  setView(view) {
    this.view = view;
  }

  setDifficulty(difficulty) {
    log(`set difficulty to ${difficulty}`);
    this.difficulty = difficulty;
  }

  difficultyScoreRate() {
    const rates = {
      1: 1.0,
      2: 1.5,
      3: 2.0,
    }
    return rates[this.difficulty];
  }

  setUsername(username) {
    log(`set username to ${username}`);
    this.username = username;
    this.updateHighScore();
  }

  updateHighScore() {
    ColorTileAPI.getHighScore(function (response) {
      this.onRecieveHighScore(response)
    }.bind(this), this.username);
  }

  onRecieveHighScore(response) {
    this.view.updateHighScore(response);
  }

  click(x, y) {
    if (this.gameMode !== GameMode.PLAYING) {
      log("ゲーム中でないので処理しません");
      return;
    }
    log("recieve click")
    this.score += this.board.scoreByClick(x, y) * this.difficultyScoreRate();
    this.board.click(x, y);
    this.checkEndGame();
    this.playlog.log("click", `${x},${y}`);
  }

  checkEndGame() {
    if (this.board.noMoreErase()) {
      log("おしまい");
      this.finish();
      return;
    }
    log("まだ終わってない");
  }

  update() {
    switch (this.gameMode) {
      case GameMode.TITLE:
        break;
      case GameMode.PLAYING:
        if (this.timeLeft() <= 0) {
          this.finish();
        }
        break;
      case GameMode.RESULT:
        break;
    }
  }

  isPlaying() {
    return this.gameMode == GameMode.PLAYING;
  }

  requestNextBoard() {
    log("start requested");
    ColorTileAPI.getNewBoard(this.storeNextBoard.bind(this));
  }

  storeNextBoard(boardJSON) {
    log("received new board");
    this.nextBoard = new Board(boardJSON);
    this.nextBoard.isPlayed = false;
  }

  startGame() {
    if (!this.nextBoard) {
      log("まだ盤面ロード前なのよ");
      return;
    }
    if (this.nextBoard.isPlayed) {
      log("もう使ったあとのボードなのよこれ");
      return;
    }
    this.nextBoard.isPlayed = true;
    this.requestNextBoard();
    this.board = this.nextBoard;
    this.board.applyDifficulty(this.difficulty);
    this.score = 0;
    this.gameMode = GameMode.PLAYING;
    this.startedTimePoint = Date.now();
    this.view.startGameHandler();
    this.playlog = new PlayLog(this.board);
    this.clearTime = 0;
  }

  backToTitle() {
    this.gameMode = GameMode.TITLE;
  }

  // 「残り時間」を表すクラスがあったほうがいいのかも
  timeLeft(floor = true) {
    if (!this.gameMode == GameMode.PLAYING) {
      return this.playTimeLengthSecond;
    }
    if (floor) {
      return this.playTimeLengthSecond - Math.floor((Date.now() - this.startedTimePoint) / 1000);
    }
    return this.playTimeLengthSecond - (Date.now() - this.startedTimePoint) / 1000;
  }

  timeLeftRatio() {
    return this.timeLeft() / this.playTimeLengthSecond;
  }

  getCurrentScore() {
    return this.score;
  }

  finish() {
    this.view.finish();
    this.clearTime = this.timeLeft(false);
    this.gameMode = GameMode.RESULT;
    log(this.playlog.messages);
    ColorTileAPI.sendResult(this.view.onReceiveResult.bind(this), this.playlog, this.username, this.difficulty, this.timeLeft(false));
  }
};

export default ColorTile;