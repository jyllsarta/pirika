
class Timer{
  _timer: number;
  constructor(){
    this.commit();
  }

  // フレーム終わり
  public commit(){
    this._timer = new Date().getTime();
  }

  // 前フレームから経った秒数を返す
  public timeDelta(): number{
    return (new Date().getTime() - this._timer) / 1000;
  }
}

export default Timer;