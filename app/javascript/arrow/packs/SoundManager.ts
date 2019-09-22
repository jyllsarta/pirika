class SoundManager{
  sounds: {};
  volume: number;

  constructor(){
    console.log("instantiated sound!");
    this.sounds = {};
    this.volume = 1;
  }

  public register(name: string, path: string, magnifier:number=1){
    this.sounds[name] = {audio:new Audio(path), magnifier: magnifier};
  }

  public play(soundName: string, interruptPreviousSound=true){
    if(interruptPreviousSound){
      this.sounds[soundName].audio.currentTime = 0;
    }
    this.sounds[soundName].audio.volume = this.volume * this.sounds[soundName].magnifier;
    this.sounds[soundName].audio.play();
  }
}

export default SoundManager;