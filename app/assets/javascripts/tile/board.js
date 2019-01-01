import Cross from './cross';
import Panel from './panel';
import { log as log, warn as warn } from './logsystem';

class Board {
    constructor(boardJSON) {
        this.initBoard(boardJSON);
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
            log("it was block...");
            return;
        }
        var cross = new Cross(this, x, y);
        log("created cross");
        log(cross);
        cross.destruct();
        log(this);
    }

    panels() {
        return this.board.reduce((x, y) => (x.concat(y)));
    }

    noMoreErase() {
        return this.panels().every(panel => this.scoreByClick(panel.x, panel.y) == 0)
    }

    // 以下 private (だということにする)
    // Rails の Model のつもりで書きます

    initBoard(boardJSON) {
        this.w = boardJSON["row"];
        this.h = boardJSON["column"];
        this.board = new Array(this.h);
        for (var y = 0; y < this.h; ++y) {
            this.board[y] = [];
            for (var x = 0; x < this.w; ++x) {
                this.board[y][x] = new Panel(x, y, boardJSON["board"] !== null ? boardJSON["board"][y][x]["color_id"] : 0);
            }
        }
    }
}
export default Board;