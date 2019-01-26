import {
  log as log,
  warn as warn
} from './logsystem';


// パネル1マス
class Panel {
  constructor(x, y, colorId) {
    this.x = x;
    this.y = y;
    this.dirty = false;
    this.colorId = colorId;
    this.block = !!this.colorId;
  }

  erase() {
    this.block = false;
    this.dirty = true;
  }

  resetDirtyFlag() {
    this.dirty = false;
  }
}
export default Panel;