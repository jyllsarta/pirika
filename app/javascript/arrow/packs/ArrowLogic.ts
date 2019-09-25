import Ball from "./Ball"
import Pointer from "./Pointer"
import GameState from "./GameState"
import SoundManager from "./SoundManager"
import Constants from "./Constants"


class ArrowLogic{

  balls: Ball[];
  pointer: Pointer;
  gameState: GameState;
  soundManager: SoundManager;
  hp: number;
  initialHp: number;
  energy: number;
  charge: number;
  isCharging: boolean;
  frame: number;

  constructor(){
    console.log("instantiated logic!");
    this.balls = [];
    this.pointer = new Pointer(0.0, 0.0);
    this.gameState = GameState.Title;
    this.hp = Constants.initialHp;
    this.initialHp = Constants.initialHp;
    this.frame = 0;
    this.soundManager = new SoundManager();
    this.energy = 0;
    this.charge = 0;
    this.isCharging = false;
    this.loadSounds();

    for(let i=0; i< Constants.initialBallCount; ++i){
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
        if(this.isCharging){
          this.charge += Constants.chargeAmountPerEvent;
          // いま energy最大になった場合
          if(Constants.chargeMax <= this.charge && this.charge < Constants.chargeMax + Constants.chargeAmountPerEvent){
            this.soundManager.play("charge_complete");
          }
        }
        if(this.frame % Constants.healIntervalFrameCount === 0){
          this.heal(Constants.healAmountPerEvent);
          this.energy += Constants.addEnergyAmountPerEvent;
          // いま energy最大になった場合
          if(Constants.energyMax <= this.energy && this.energy < Constants.energyMax + Constants.addEnergyAmountPerEvent){
            this.soundManager.play("discharge_available");
          }
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
    this.soundManager.play("start");
    this.gameState = GameState.InGame;
  }

  public hpRate(): number{
    return this.hp / this.initialHp;
  }

  public chargeRate(): number{
    console.log(this.charge / Constants.chargeMax);
    return Math.min(this.charge / Constants.chargeMax, 1);
  }

  public resetCharge(){
    this.charge = 0;
    this.isCharging = false;
  }

  public onMouseDown(){
    // 必殺ゲージ溜め
    this.resetCharge();
    if(this.hasSufficientEnergy()){
      this.isCharging = true;
    }
  }

  public onMouseUp(){
    if(this.isChargeFull() && this.hasSufficientEnergy()){
      this.discharge(this.pointer.x, this.pointer.y, Constants.dischargeRadius);
      this.energy = 0;
      this.soundManager.play("discharge");
    }
    this.isCharging = false;
  }

  public onMoved(){
    if(this.hasSufficientEnergy() && this.charge > 0){
      this.soundManager.play("phew");
    }
    this.resetCharge();
  }
  public isChargeFull(){
    return this.charge > Constants.chargeMax;
  }

  public hasSufficientEnergy(){
    return this.energy > Constants.energyMax;
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
    // 時刻ベースにしたらここもダメージ量をTimeDeltaに比例させること
    for(let ball of this.balls){
      let distance = this.distance(this.pointer.x, this.pointer.y, ball.x, ball.y);
      if(distance < Constants.shaveDamageRadius * (this.hpRate() * Constants.ratioOfHpRateToHitBox + Constants.minimumHitBoxSizeRate)){
        this.hp -= Constants.shaveDamageRate;
        this.soundManager.play("damage");
      }
      if(distance < Constants.hitDamageRadius * (this.hpRate() * Constants.ratioOfHpRateToHitBox + Constants.minimumHitBoxSizeRate)){
        this.hp -= Constants.hitDamageRate;
        this.soundManager.play("damage2");
      }
    }

    if(this.hp <= 0){
      console.log("死んだ");
      this.soundManager.play("dead");
      this.gameState = GameState.GameOver;
    }
  }

  private distance(x1:number, y1:number ,x2:number ,y2:number){
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
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
    // TODO: timedeltaベースにする
    if(this.frame % Constants.spawnBallIntervalFrameCount == 0){
      this.soundManager.play("spawn");
      this.createRandomBall();
    }
  }

  private createRandomBall(): void{
    const vx = Math.random() * Constants.maxBallVelocityX - Constants.maxBallVelocityX / 2;
    const vy = Math.random() * Constants.maxBallVelocityY - Constants.maxBallVelocityY / 2;
    this.balls.push(new Ball(Math.random(), 0, vx, vy));
  }

  private discharge(x: number,y: number,r: number){
    let not_removed = [];
    for(let ball of this.balls){
      let distance = this.distance(x, y, ball.x, ball.y);
      if(distance > r){
        not_removed.push(ball);
      }
    }
    this.balls = not_removed;
  }

  private loadSounds(){
    this.soundManager.register("spawn", "/game/arrow/sounds/spawn.wav", 0.04);
    this.soundManager.register("damage", "/game/arrow/sounds/damage.wav", 0.05);
    this.soundManager.register("damage2", "/game/arrow/sounds/damage.wav");
    this.soundManager.register("heal1", "/game/arrow/sounds/heal1.wav",0.1);
    this.soundManager.register("heal2", "/game/arrow/sounds/heal2.wav",0.1);
    this.soundManager.register("heal3", "/game/arrow/sounds/heal3.wav",0.1);
    this.soundManager.register("heal4", "/game/arrow/sounds/heal4.wav",0.1);
    this.soundManager.register("heal5", "/game/arrow/sounds/heal5.wav",0.1);
    this.soundManager.register("reset", "/game/arrow/sounds/reset.wav");
    this.soundManager.register("start", "/game/arrow/sounds/start.wav");
    this.soundManager.register("dead", "/game/arrow/sounds/dead.wav");
    this.soundManager.register("phew", "/game/arrow/sounds/phew.wav", 0.3);
    this.soundManager.register("discharge", "/game/arrow/sounds/discharge.wav");
    this.soundManager.register("discharge_available", "/game/arrow/sounds/discharge_available.wav");
    this.soundManager.register("charge_start", "/game/arrow/sounds/charge_start.wav");
    this.soundManager.register("charge_complete", "/game/arrow/sounds/charge_complete.wav");
  }
}

export default ArrowLogic;