import Ball from "./Ball"
import Pointer from "./Pointer"
import GameState from "./GameState"
import SoundManager from "./SoundManager"
import Constants from "./Constants"
import OnlineRanking from "./OnlineRanking"


class ArrowLogic{

  balls: Ball[];
  pointer: Pointer;
  gameState: GameState;
  soundManager: SoundManager;
  onlineRanking: OnlineRanking;
  hp: number;
  initialHp: number;
  energy: number;
  charge: number;
  isCharging: boolean;
  timeScore: number;
  removeScore: number;
  username: string;
  highScore: number;
  playtime: number;

  // タイマー類
  healEventTimer: number;
  spawnNewBallTimer: number;

  constructor(){
    console.log("instantiated logic!");
    this.soundManager = new SoundManager();
    this.onlineRanking = new OnlineRanking(location.href, location.href + "/ranking", location.href + "/high_score")
    this.highScore = 0;
    this.loadSounds();
    this.reset();
  }

  public score(){
    return Math.floor(this.timeScore + this.removeScore);
  }

  public update(timeDelta: number): void{
    switch (this.gameState) {
      case GameState.Title:
        break;
      case GameState.InGame:
        this.checkDamage(timeDelta);
        this.moveBall(timeDelta);
        this.proceedTimerAndFireEvent(timeDelta);
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

  public onClickResetButton(){
    this.soundManager.play("reset");
    this.reset();
  }

  public setName(name: string){
    this.username = name;
    this.fetchHighScore();
  }

  // -- private --

  // このフレームにちょうどタイマーが発動したかどうか
  // = 前のフレームではthreshold以下、現在のフレームではthreshold以上である
  private isThisFrameTimerReached(timeDelta: number, timePiled: number, threshold: number){
    return timePiled - timeDelta <= threshold && threshold < timePiled;
  }

  // タイマーによって発動するイベントの処理
  // なーんかちょっとあまりにも愚直なので、いつか registerTimerEvent(callback, everyXSeconds) みたいなインターフェースで登録できるようにしてみたいな
  private proceedTimerAndFireEvent(timeDelta: number){

    this.playtime += timeDelta;
    if(this.isCharging){
      this.charge += timeDelta;
    }
    if(this.isThisFrameTimerReached(timeDelta, this.charge, Constants.chargeMax)){
      this.soundManager.play("charge_complete");
    }

    this.spawnNewBallTimer += timeDelta;
    let interval = this.currentBallSpawnInterval();
    if(interval < this.spawnNewBallTimer){
      this.spawnNewBallTimer -= interval;
      this.soundManager.play("spawn");
      this.createRandomBall();
    }
    this.timeScore += timeDelta;
    this.healEventTimer += timeDelta;

    if(this.isThisFrameTimerReached(timeDelta, this.healEventTimer, Constants.healIntervalTimeSeconds)){
      this.healEventTimer -= Constants.healIntervalTimeSeconds;
      this.heal(Constants.healAmountPerEvent);
      const energyRecovered = Constants.addEnergyAmountPerEvent * this.hpRate();
      this.energy += energyRecovered;
      // いま energy最大になった場合 音を鳴らす
      if(this.isThisFrameTimerReached(energyRecovered, this.energy, Constants.energyMax)){
        this.soundManager.play("discharge_available");
      }
    }
  }

  private currentBallSpawnInterval(){
    let prevInterval = null;
    for(let [seconds, interval] of Constants.spawnBallIntervalTimes){
      if (this.playtime < seconds){
        return prevInterval;
      }
      prevInterval = interval;
    }
    return prevInterval;
  }

  private moveBall(timeDelta: number): void{
    for(let ball of this.balls){
      ball.x += ball.vx * timeDelta;
      ball.y += ball.vy * timeDelta;
      ball.reflect();
    }
  }

  private checkDamage(timeDelta: number): void{
    // 全部の弾と当たり判定チェックするのは普通にO(n)なんで遅い
    // パフォーマンスによる問題が出たら枝刈りを頑張る
    // 時刻ベースにしたらここもダメージ量をTimeDeltaに比例させること
    for(let ball of this.balls){
      let distance = this.distance(this.pointer.x, this.pointer.y, ball.x, ball.y);
      if(distance < Constants.shaveDamageRadius * (this.hpRate() * Constants.ratioOfHpRateToHitBox + Constants.minimumHitBoxSizeRate)){
        this.hp -= Constants.shaveDamageRate * timeDelta;
        this.soundManager.play("damage");
      }
      if(distance < Constants.hitDamageRadius * (this.hpRate() * Constants.ratioOfHpRateToHitBox + Constants.minimumHitBoxSizeRate)){
        this.hp -= Constants.hitDamageRate  * timeDelta;
        this.soundManager.play("damage2");
      }
    }

    if(this.hp <= 0){
      console.log("死んだ");
      this.soundManager.play("dead");
      this.onlineRanking.submit(this.username, this.score(), this.removeScore, this.timeScore, () =>{console.log("send success!")});
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
    this.removeScore += this.balls.length - not_removed.length;
    this.balls = not_removed;
  }

  private reset(){
    this.balls = [];
    this.pointer = new Pointer(0.0, 0.0);
    this.gameState = GameState.Title;
    this.hp = Constants.initialHp;
    this.initialHp = Constants.initialHp;
    this.energy = 0;
    this.charge = 0;
    this.isCharging = false;
    this.spawnNewBallTimer = 0;
    this.healEventTimer = 0;
    this.timeScore = 0;
    this.removeScore = 0;
    this.playtime = 0;

    for(let i=0; i< Constants.initialBallCount; ++i){
      this.createRandomBall();
    }

    this.fetchHighScore();
    this.onlineRanking.getRanking(()=>{console.log("get ranking done")})
  }

  private fetchHighScore(){
    this.onlineRanking.getHighScore(this.username, (results)=>{this.highScore = results.data.high_score});
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