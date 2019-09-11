class Ball{
  id: Number;
  constructor(public x: Number, public y: Number){
    this.id = Math.floor(Math.random() * 10000000000);
  }
}
export default Ball;
