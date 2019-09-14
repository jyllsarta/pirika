import Ball from "./Ball"

class ArrowLogic{

  _balls: Ball[];

  constructor(){
    console.log("instantiated logic!");
    this._balls = [];
    // サンプル とりあえず5個ランダムにコロコロさせておく
    for(let i=0; i< 50; ++i){
      this.createRandomBall();
    }
  }

  // 今この時代こんなgetter書くの!? みたいな気持ちもあるけど、まあ一旦お手本通りに書いてみる
  // C# っぽくかけると嬉しいところですねこれ
  get balls(){
    return this._balls;
  }

  // update だけは受信する回数が他と比べて圧倒的に多いはずなので、ログに載る sendMessage から実行しない
  update(){
    this.moveBall();
  }

  // -- private --

  private moveBall(){
    for(let ball of this._balls){
      ball.x += ball.vx;
      ball.y += ball.vy;
      ball.reflect();
    }
  }

  private createRandomBall(){
    this._balls.push(new Ball(Math.random(), Math.random(), Math.random() * 0.003, Math.random() * 0.008));
  }

  private onLeftClick(){
    console.log("left clicked!");
  }
}
export default ArrowLogic;