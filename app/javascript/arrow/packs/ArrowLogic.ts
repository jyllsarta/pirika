import Ball from "./Ball"
import Pointer from "./Pointer"

class ArrowLogic{

  balls: Ball[];
  pointer: Pointer;

  constructor(){
    console.log("instantiated logic!");
    this.balls = [];
    this.pointer = new Pointer(0.0, 0.0);
    // サンプル とりあえず50個ランダムにコロコロさせておく
    for(let i=0; i< 50; ++i){
      this.createRandomBall();
    }
  }

  // update だけは受信する回数が他と比べて圧倒的に多いはずなので、ログに載る sendMessage から実行しない
  public update(){
    this.moveBall();
  }

  public setPointerPosition(x: number, y: number){
    this.pointer.setPosition(x, y);
  }

  // -- private --

  private moveBall(){
    for(let ball of this.balls){
      ball.x += ball.vx;
      ball.y += ball.vy;
      ball.reflect();
    }
  }

  private createRandomBall(){
    this.balls.push(new Ball(Math.random(), Math.random(), Math.random() * 0.003, Math.random() * 0.008));
  }

  private onLeftClick(){
    console.log("left clicked!");
  }
}
export default ArrowLogic;