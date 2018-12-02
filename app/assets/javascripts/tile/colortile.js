// ブロックのクラスも作る

// 床1マス
class Panel {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        if (Math.random() > 0.5) {
            this.block = true;
            this.colorId = Math.floor(Math.random() * 4);
        }
        else {
            this.block = false;
        }
    }

    erase() {
        this.block = false;
        console.log(this);
    }
}

// 概念 クリックされたところから上下左右に探したブロック4つ
class Cross {
    constructor(board, x, y) {
        this.board = board;
        this.x = x;
        this.y = y;
        this.up = this.findFirstBlock(this.upPanels());
        this.down = this.findFirstBlock(this.downPanels());
        this.left = this.findFirstBlock(this.leftPanels());
        this.right = this.findFirstBlock(this.rightPanels());
    }

    destruct() {
        var pairs = this.pairedBlocks()
        for (var paired of pairs) {
            paired.erase();
        }
    }

    // private

    pairedBlocks() {
        var pairBlocks = []
        for (var block of this.blocks()) {
            if (this.countColorInBlocks(block.colorId) >= 2) {
                pairBlocks.push(block);
            }
        }
        return pairBlocks;
    }

    blocks() {
        var availableBlocks = [];
        if (this.up) { availableBlocks.push(this.up) };
        if (this.down) { availableBlocks.push(this.down) };
        if (this.left) { availableBlocks.push(this.left) };
        if (this.right) { availableBlocks.push(this.right) };
        return availableBlocks;
    }

    countColorInBlocks(color_id) {
        var count = 0;
        for (var block of this.blocks()) {
            if (block.colorId === color_id) {
                count++;
            }
        }
        return count;
    }

    // x, y から上方向にあるパネルを返す
    upPanels() {
        var panels = [];
        for (var iy = this.y - 1; iy >= 0; iy--) {
            panels.push(this.board.panel(this.x, iy));
        }
        return panels
    }

    // x, y から下方向にあるパネルを返す
    downPanels() {
        var panels = [];
        for (var iy = this.y + 1; iy < this.board.h; iy++) {
            panels.push(this.board.panel(this.x, iy));
        }
        return panels
    }

    // x, y から左方向にあるパネルを返す
    leftPanels() {
        var panels = [];
        for (var ix = this.x - 1; ix >= 0; ix--) {
            panels.push(this.board.panel(ix, this.y));
        }
        return panels
    }

    // x, y から右方向にあるパネルを返す
    rightPanels() {
        var panels = [];
        for (var ix = this.x + 1; ix < this.board.w; ix++) {
            panels.push(this.board.panel(ix, this.y));
        }
        return panels
    }


    // 引数のパネルから最初にブロックのあるパネルを返す
    findFirstBlock(panels) {
        for (var panel of panels) {
            if (panel.block) {
                return panel
            }
        }
        return null;
    }
}

class Board {
    constructor(w, h) {
        this.w = w;
        this.h = h;
        this.initBoard(w, h);
    }

    panel(x, y) {
        return this.board[y][x];
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

g_tile = new ColorTile(new Board(15, 10));