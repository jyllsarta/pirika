import Ball from "./Ball"
import Pointer from "./Pointer"
import GameState from "./GameState"


class ArrowLogic{

  balls: Ball[];
  pointer: Pointer;
  gameState: GameState;
  hp: number;
  initialHp: number;

  constructor(){
    console.log("instantiated logic!");
    this.balls = [];
    this.pointer = new Pointer(0.0, 0.0);
    this.gameState = GameState.Title;
    this.hp = 50; // TODO: constants化
    this.initialHp = this.hp;
    // サンプル とりあえず5個ランダムにコロコロさせておく
    for(let i=0; i< 5; ++i){
      this.createRandomBall();
    }
  }

  // update だけは受信する回数が他と比べて圧倒的に多いはずなので、ログに載る sendMessage から実行しない
  public update(): void{
    switch (this.gameState) {
      case GameState.Title:

        break;
      case GameState.InGame:
        this.checkDamage();
        this.moveBall();
        break;
      case GameState.GameOver:
        break;
    }
  }

  public setPointerPosition(x: number, y: number): void{
    this.pointer.setPosition(x, y);
  }

  public startGame(): void{
    console.log("changed gamestate!");
    this.gameState = GameState.InGame;
  }

  public hpRate(): number{
    return this.hp / this.initialHp;
  }

  // -- private --

  private moveBall(): void{
    for(let ball of this.balls){
      ball.x += ball.vx;
      ball.y += ball.vy;
      ball.reflect();
    }
  }

  private checkDamage(): void{
    // 全部の弾と当たり判定チェックするのは普通にO(n)なんで遅い
    // パフォーマンスによる問題が出たら枝刈りを頑張る
    for(let ball of this.balls){
      let distance = Math.sqrt((this.pointer.x - ball.x) ** 2 + (this.pointer.y - ball.y) ** 2);
      if(distance < 0.08){ // TODO: 当たり判定サイズの検討とconstants化
        this.hp -= 1;
      }
    }

    if(this.hp <= 0){
      console.log("死んだ");
      this.gameState = GameState.GameOver;
    }
  }

  private createRandomBall(): void{
    // TODO: constants化
    this.balls.push(new Ball(Math.random(), Math.random(), Math.random() * 0.004 - 0.002, Math.random() * 0.008 - 0.004));
  }

  private onLeftClick(){
    console.log("left clicked!");
  }
}

export default ArrowLogic;