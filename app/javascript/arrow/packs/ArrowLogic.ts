import Ball from "./Ball"
import Pointer from "./Pointer"
import GameState from "./GameState"


class ArrowLogic{

  balls: Ball[];
  pointer: Pointer;
  gameState: GameState;

  constructor(){
    console.log("instantiated logic!");
    this.balls = [];
    this.pointer = new Pointer(0.0, 0.0);
    this.gameState = GameState.Title;
    // サンプル とりあえず50個ランダムにコロコロさせておく
    for(let i=0; i< 50; ++i){
      this.createRandomBall();
    }
  }

  // update だけは受信する回数が他と比べて圧倒的に多いはずなので、ログに載る sendMessage から実行しない
  public update(){
    switch (this.gameState) {
      case GameState.Title:

        break;
      case GameState.InGame:
        this.moveBall();
        break;
      case GameState.GameOver:
        break;
    }
  }

  public setPointerPosition(x: number, y: number){
    this.pointer.setPosition(x, y);
  }

  public startGame(){
    console.log("changed gamestate!")
    this.gameState = GameState.InGame;
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
    this.balls.push(new Ball(Math.random(), Math.random(), Math.random() * 0.004 - 0.002, Math.random() * 0.008 - 0.004));
  }

  private onLeftClick(){
    console.log("left clicked!");
  }
}

export default ArrowLogic;