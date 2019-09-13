class Ball{
  id: number;
  constructor(public x: number, public y: number){
    this.id = Math.floor(Math.random() * 10000000000);
  }
}
export default Ball;
