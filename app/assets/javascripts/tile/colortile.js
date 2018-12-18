
import Board from './board';
import GameMode from './gamemodes';
import ColorTileAPI from './api';
import { log as log, warn as warn } from './logsystem';

// ゲームロジック全般
class ColorTile {

    constructor(playTimeLengthSecond) {
        this.playTimeLengthSecond = playTimeLengthSecond;
        this.gameMode = GameMode.TITLE;
    }

    setView(view) {
        this.view = view;
    }

    click(x, y) {
        if (this.gameMode !== GameMode.PLAYING) {
            log("ゲーム中でないので処理しません");
            return;
        }
        log("recieve click")
        this.score += this.board.scoreByClick(x, y);
        this.board.click(x, y);
    }

    update() {
        switch (this.gameMode) {
            case GameMode.TITLE:
                break;
            case GameMode.PLAYING:
                if (this.timeLeft() < 0) {
                    this.view.finish();
                    this.gameMode = GameMode.RESULT;
                }
                break;
            case GameMode.RESULT:
                break;
        }
    }

    isPlaying() {
        return this.gameMode == GameMode.PLAYING;
    }

    requestStart() {
        log("start requested")
        ColorTileAPI.getNewBoard(this.startGame.bind(this));
    }

    startGame(boardJSON) {
        this.board = new Board(boardJSON);
        this.score = 0;
        this.gameMode = GameMode.PLAYING;
        this.startedTimePoint = Date.now();
        this.view.startGameHandler();
    }

    backToTitle() {
        this.gameMode = GameMode.TITLE;
    }

    // 「残り時間」を表すクラスがあったほうがいいのかも
    timeLeft() {
        if (!this.gameMode == GameMode.PLAYING) {
            return this.playTimeLengthSecond;
        }
        return this.playTimeLengthSecond - Math.floor((Date.now() - this.startedTimePoint) / 1000);
    }

    timeLeftRatio() {
        return this.timeLeft() / this.playTimeLengthSecond;
    }

    getCurrentScore() {
        return this.score;
    }

    finish() {
        this.gameMode = GameMode.RESULT;
    }
};

let g_tile = new ColorTile(180);
export default g_tile; // ここだけグローバル変数として公開してしまう