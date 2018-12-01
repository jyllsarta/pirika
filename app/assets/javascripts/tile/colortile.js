// ブロックのクラスも作る

// 床1マス
class Panel {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.block = true;
    }

    erase() {
        this.block = false;
        console.log(this);
    }
}

// ゲームロジック全般
class ColorTile {

    panel(x, y) {
        return this.board[y][x];
    }

    constructor(w, h) {
        this.w = w;
        this.h = h;
        this.initBoard(w, h);
    }

    click(x, y) {
        console.log(x, y);
        this.panel(x, y).erase();
    }

    // 以下 private (だということにする)
    // Rails の Model のつもりで書きます

    initBoard(w, h) {
        this.board = new Array(h);
        for (var y = 0; y < h; ++y) {
            this.board[y] = [];
            for (var x = 0; x < w; ++x) {
                this.board[y][x] = new Panel(x, y);
                console.log(this.board[y][x]);
            }
        }
    }
};

g_tile = new ColorTile(15, 10);