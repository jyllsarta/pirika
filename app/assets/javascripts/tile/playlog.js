import {
  log as glog,
  warn as warn
} from './logsystem';

// ゲームロジック全般
class PlayLog {

  constructor(board) {
    this.messages = {};
    this.w = board.w;
    this.h = board.h;
    this.seed = board.seed;
    this.colors = board.colors;
    this.pairs = board.pairs;
  }

  log(eventType, message) {
    if (!this.messages[eventType]) {
      this.messages[eventType] = [];
    }
    this.messages[eventType].push({
      "message": message,
      "time": this.now(),
    })
    glog(eventType, message);
  }

  now() {
    return new Date().toLocaleString()
  }
};

export default PlayLog;