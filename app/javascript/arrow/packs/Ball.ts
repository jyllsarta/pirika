class Ball{
  id: number;
  constructor(public x: number,
              public y: number,
              public vx: number,
              public vy: number,
              public colorId: number){
    this.id = Math.floor(Math.random() * 10000000000);
  }

  public reflect(){
    if(this.x < 0){
      this.vx *= -1;
      this.x = 0;
    }
    if(this.x > 1){
      this.vx *= -1;
      this.x = 1;
    }
    if(this.y < 0){
      this.vy *= -1;
      this.y = 0;
    }
    if(this.y > 1){
      this.y = 0;
    }
  }
}
export default Ball;
