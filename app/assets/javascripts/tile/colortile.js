
import Board from './board';

// ゲームロジック全般
class ColorTile {
    constructor(board, playTimeLengthSecond) {
        this.board = board;
        this.playTimeLengthSecond = playTimeLengthSecond;
        this.isPlaying = false;
    }

    click(x, y) {
        this.board.click(x, y);
    }

    frame() {
        if (!this.isPlaying) {
            return;
        }

    }

    startGame() {
        this.isPlaying = true;
        this.startedTimePoint = Time.now();
    }
};

let g_tile = new ColorTile(new Board(15, 10));
export default g_tile; // ここだけグローバル変数として公開してしまう