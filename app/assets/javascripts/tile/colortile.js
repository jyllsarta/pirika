// ブロックのクラスも作る

// 床1マス
class Panel {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.block = Math.random() > 0.5;
    }

    erase() {
        this.block = false;
        console.log(this);
    }
}

// 概念 クリックされたところから上下左右に探したブロック4つ
class Cross {
    constructor(board, x, y) {
        this.up = board.panel(x, y - 1);
        this.down = board.panel(x, y + 1);
        this.left = board.panel(x - 1, y);
        this.right = board.panel(x + 1, y);
        this.destruct();
    }

    destruct() {
        this.up.erase();
        this.down.erase();
        this.left.erase();
        this.right.erase();
    }
}

class Board {
    constructor(w, h) {
        this.w = w;
        this.h = h;
        this.initBoard(w, h);
    }

    panel(x, y) {
        return this.board[x][y];
    }

    click(x, y) {
        var cross = new Cross(this, x, y);
        cross.destruct();
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

// ゲームロジック全般
class ColorTile {
    constructor(board) {
        this.board = board;
    }

    click(x, y) {
        this.board.click(x, y);
    }
};

g_tile = new ColorTile(new Board(10, 15));