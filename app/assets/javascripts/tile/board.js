import Cross from './cross';
import Panel from './panel';
import { log as log, warn as warn } from './logsystem';

class Board {
    constructor(w, h) {
        this.w = w;
        this.h = h;
        this.initBoard(w, h);
    }

    panel(x, y) {
        return this.board[y][x];
    }

    // クリックを実行したら得られるスコアを返す
    scoreByClick(x, y) {
        // don't fire event if there are block
        if (this.panel(x, y).block) {
            return 0;
        }
        var cross = new Cross(this, x, y);
        return cross.score();
    }

    click(x, y) {
        // don't fire event if there are block
        if (this.panel(x, y).block) {
            return
        }
        var cross = new Cross(this, x, y);
        cross.destruct();
    }

    panels() {
        return this.board.reduce((x, y) => (x.concat(y)));
    }

    // 以下 private (だということにする)
    // Rails の Model のつもりで書きます

    initBoard(w, h) {
        this.board = new Array(h);
        for (var y = 0; y < h; ++y) {
            this.board[y] = [];
            for (var x = 0; x < w; ++x) {
                this.board[y][x] = new Panel(x, y);
            }
        }
    }
}
export default Board;