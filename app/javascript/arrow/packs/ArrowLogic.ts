import Ball from "./Ball"
import Pointer from "./Pointer"
import GameState from "./GameState"
import SoundManager from "./SoundManager"


class ArrowLogic{

  balls: Ball[];
  pointer: Pointer;
  gameState: GameState;
  soundManager: SoundManager;
  hp: number;
  initialHp: number;
  frame: number;

  constructor(){
    console.log("instantiated logic!");
    this.balls = [];
    this.pointer = new Pointer(0.0, 0.0);
    this.gameState = GameState.Title;
    this.hp = 50; // TODO: constants化
    this.initialHp = this.hp;
    this.frame = 0;
    this.soundManager = new SoundManager();
    this.loadSounds();
    // サンプル とりあえず5個ランダムにコロコロさせておく
    for(let i=0; i< 20; ++i){
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
        this.spawnNewBall();
        if(this.frame % 60 === 0){
          this.heal(1);
        }
        this.frame ++;
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
        this.soundManager.play("damage");
      }
    }

    if(this.hp <= 0){
      console.log("死んだ");
      this.gameState = GameState.GameOver;
    }
  }

  private heal(value: number){
    // すでに全快のときには音を鳴らさない
    if(this.hp >= this.initialHp){
      return;
    }

    this.hp += value;
    if(this.hp > this.initialHp){
      this.hp = this.initialHp;
    }
    // sound の登録数と依存あるけどまあいいかな...
    const rand = Math.floor(Math.random() * 5) + 1;
    this.soundManager.play("heal" + rand);
  }

  private spawnNewBall(){
    if(this.frame % 60 == 0){ // TODO: constants
      this.soundManager.play("spawn");
      this.createRandomBall();
    }
  }

  private createRandomBall(): void{
    // TODO: constants化
    this.balls.push(new Ball(Math.random(), 0, Math.random() * 0.004 - 0.002, Math.random() * 0.008 - 0.004));
  }

  private onLeftClick(){
    console.log("left clicked!");
  }

  private loadSounds(){
    this.soundManager.register("spawn", "/game/arrow/sounds/spawn.wav");
    this.soundManager.register("damage", "/game/arrow/sounds/damage.wav");
    this.soundManager.register("heal1", "/game/arrow/sounds/heal1.wav");
    this.soundManager.register("heal2", "/game/arrow/sounds/heal2.wav");
    this.soundManager.register("heal3", "/game/arrow/sounds/heal3.wav");
    this.soundManager.register("heal4", "/game/arrow/sounds/heal4.wav");
    this.soundManager.register("heal5", "/game/arrow/sounds/heal5.wav");
  }
}

export default ArrowLogic;