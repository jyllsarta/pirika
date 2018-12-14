
import Board from './board';
import GameMode from './gamemodes';
import { log as log, warn as warn } from './logsystem';

// ゲームロジック全般
class ColorTile {

    constructor(board, playTimeLengthSecond) {
        this.board = board;
        this.playTimeLengthSecond = playTimeLengthSecond;
        this.score = 0;
        this.gameMode = GameMode.TITLE;
    }

    reset(board) {
        if (!board) {
            log("creating new board");
            this.board = new Board(15, 10);
        }
        else {
            this.board = board;
        }
        // this.playTimeLengthSecond は更新されない
        // this.startedTimePointは開始時の時刻を参照するので更新不要
        // mutable なものは別クラスに飛ばしたほうがいいかもなぁと思い始めました
        this.gameMode = GameMode.TITLE;
        this.score = 0;
    }

    click(x, y) {
        if (this.gameMode !== GameMode.PLAYING) {
            log("ゲーム中でないので処理しません");
            return;
        }
        this.score += this.board.scoreByClick(x, y);
        this.board.click(x, y);
    }

    update() {
        switch (this.gameMode) {
            case GameMode.TITLE:
                break;
            case GameMode.PLAYING:
                if (this.timeLeft() < 0) {
                    this.gameMode = GameMode.FINISHING;
                }
                break;
            case GameMode.FINISHING:
                this.gameMode = GameMode.RESULT;
                break;
            case GameMode.RESULT:
                break;
        }
    }

    isPlaying() {
        return this.gameMode == GameMode.PLAYING;
    }

    isFinishing() {
        return this.gameMode == GameMode.FINISHING;
    }

    startGame() {
        this.gameMode = GameMode.PLAYING;
        this.startedTimePoint = Date.now();
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

let g_tile = new ColorTile(new Board(15, 10), 3);
export default g_tile; // ここだけグローバル変数として公開してしまう