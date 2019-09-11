import Ball from "./Ball"

class ArrowLogic{

  _messageReceivers: {};
  _balls: Ball[];

  constructor(){
    console.log("instantiated logic!");
    this._messageReceivers = {};
    this.registerMethods();
    this._balls = [new Ball(Math.random(), Math.random())];
  }

  // 今この時代こんなgetter書くの!? みたいな気持ちもあるけど、まあ一旦お手本通りに書いてみる
  // C# っぽくかけると嬉しいところですねこれ
  get balls(){
    return this._balls;
  }

  // update だけは受信する回数が他と比べて圧倒的に多いはずなので、ログに載る sendMessage から実行しない
  update(){
    //console.log("update called");
  }

  public sendMessage(message: string){
    console.log(`got message: ${message}`);
    if(this._messageReceivers[message] === undefined){
      console.warn(`undefined message "${message}" has been received!`);
      return;
    }
    this._messageReceivers[message].call();
  }

  private stubAction(){
    console.log("stub action called!")
  }

  private onLeftClick(){
    console.log("left clicked!");
  }

  private registerMethods(){
    // これの登録を自動化したいけどどうやってもうまく行かないので一旦このまま受け取るメッセージ一覧を作ろうと思う...
    this._messageReceivers["stubAction"] = this.stubAction;
    this._messageReceivers["onLeftClick"] = this.onLeftClick;
  }
}
export default ArrowLogic;