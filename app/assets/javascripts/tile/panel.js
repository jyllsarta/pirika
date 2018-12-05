// 床1マス
class Panel {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dirty = false;
        if (Math.random() > 0.5) {
            this.block = true;
            this.colorId = Math.floor(Math.random() * 6);
        }
        else {
            this.block = false;
        }
    }

    erase() {
        this.block = false;
        this.dirty = true;
        console.log(this);
    }

    resetDirtyFlag() {
        this.dirty = false;
    }
}
export default Panel;