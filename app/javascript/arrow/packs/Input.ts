class Input{
  callbacks: {
    update: (() => void)[],
    leftClick: (() => void)[],
  };

  constructor(){
    console.log("instantiated input!");
    this.resetAllCallbacks();
    this.mountToWindow();
  }

  update(){
    //console.log("input update called");
    for(let fn of this.callbacks.update){
      fn();
    }
    requestAnimationFrame(() => {this.update();});
  }

  registerUpdateEvent(callback: () => void){
    this.callbacks.update.push(callback);
  }

  registerLeftClickEvent(callback: () => void){
    this.callbacks.leftClick.push(callback);
  }

  // -- private --

  private resetAllCallbacks(){
    this.callbacks = {
      update: [],
      leftClick: [],
    };
  }

  private mountToWindow(){
    // 最初の一回を実行(すると次回以降requestAnimationFrameで回り続ける)
    this.update();

    // 左クリックのイベントをウィンドウに登録
    window.onclick = () => {this.onLeftClick()};
  }

  private onLeftClick(){
    for(let fn of this.callbacks.leftClick){
      fn();
    }
  }
}
export default Input;
