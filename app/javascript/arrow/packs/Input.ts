class Input{
  callbacks: {
    update: (() => void)[],
  };

  constructor(){
    console.log("instantiated input!");
    this.callbacks = {
      update: [],
    };
    this.update(); // 最初の一回
  }

  update(){
    console.log("input update called");
    for(let fn of this.callbacks.update){
      fn();
    }
    requestAnimationFrame(()=>{this.update();});
  }

  mount(){

  }
}
export default Input;