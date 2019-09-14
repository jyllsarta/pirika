class Pointer{
  id: number;
  constructor(public x: number,
              public y: number,
              ){
    this.id = Math.floor(Math.random() * 10000000000);
  }

  public setPosition(x: number, y: number){
    this.x = x;
    this.y = y;
  }
}
export default Pointer;
