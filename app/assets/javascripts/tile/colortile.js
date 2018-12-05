
import Board from './board';

// ゲームロジック全般
class ColorTile {
    constructor(board) {
        this.board = board;
    }

    click(x, y) {
        this.board.click(x, y);
    }
};

let g_tile = new ColorTile(new Board(15, 10));
export default g_tile; // ここだけグローバル変数として公開してしまう