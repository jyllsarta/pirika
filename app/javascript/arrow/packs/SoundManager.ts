class SoundManager{
  sounds: {};
  volume: number;

  constructor(){
    console.log("instantiated sound!");
    this.sounds = {};
    this.volume = 1;
  }

  public register(name: string, path: string){
    this.sounds[name] = new Audio(path);
  }

  public play(soundName: string, interruptPreviousSound=true){
    if(interruptPreviousSound){
      this.sounds[soundName].currentTime = 0;
    }
    this.sounds[soundName].volume = this.volume;
    this.sounds[soundName].play();
  }
}

export default SoundManager;