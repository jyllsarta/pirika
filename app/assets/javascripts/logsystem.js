// console

const LogLevel = {
  DEBUG: Symbol('debug'), // allow to call more than per frame
  INFO: Symbol('info'), // call less than per event(click, changegamestate, ...)
  WARN: Symbol('warn'), // call any dangeroius info
};

const LOGLEVEL = LogLevel.INFO;

function debug() {
  if (LOGLEVEL == LogLevel.INFO) {
    return;
  }
  if (LOGLEVEL == LogLevel.WARN) {
    return;
  }
  console.log(...arguments)
}

function log() {
  if (LOGLEVEL == LogLevel.WARN) {
    return;
  }
  console.log(...arguments)
}

function warn() {
  console.log(...arguments)
}


export {
  debug
};
export {
  log
};
export {
  warn
};