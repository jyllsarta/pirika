
class DefaultNotePattern{
  static constants(){
    return {
      notes: {
        "z": 0b0001,
        "x": 0b0010,
        "c": 0b0100,
        "v": 0b1000,
      },
      notePatterns: [
        [0b0001, 0b0010, 0b0100, 0b1000],
        [0b1000, 0b0100, 0b0010, 0b0001],
        //[0b1001, 0b0110, 0b1001, 0b0110],
        [0b1000, 0b0001, 0b1100, 0b0011],
        [0b0001, 0b0010, 0b0100, 0b1000],
        [0b0010, 0b0100, 0b0010, 0b0100],
        [0b0100, 0b0010, 0b0100, 0b0010],
        [0b1000, 0b0001, 0b1000, 0b0001],
        [0b0001, 0b1000, 0b0001, 0b1000],
        [0b0001, 0b1000, 0b0100, 0b0010],
        [0b1000, 0b0001, 0b0010, 0b0100],
        [0b0010, 0b0100, 0b1000, 0b0001],
        [0b0100, 0b0010, 0b0001, 0b1000],
        //[0b0001, 0b0010, 0b0100, 0b0111],
        //[0b1000, 0b0100, 0b0010, 0b1110],
      ],
    }
  }

  static generateNotes(){
    let notes = [];
    for (let i = 0; i < 50; ++i){
      notes = notes.concat(this.getRandomMeasure());
      notes = notes.concat(this.getPatternedMeasure());
    }
    return notes;
  }

  static getRandomMeasure(){
    let measure = [];
    const notes = Object.values(this.constants().notes);
    for(let i = notes.length - 1; i > 0; i--){
      let r = Math.floor(Math.random() * (i + 1));
      let tmp = notes[i];
      notes[i] = notes[r];
      notes[r] = tmp;
    }
    for(let note of notes){
      measure.push(note);
    }
    return measure;
  }

  static getPatternedMeasure(){
    const rand = Math.floor(Math.random() * this.constants().notePatterns.length);
    const pattern = this.constants().notePatterns[rand];
    let measure = [];
    for(let note of pattern){
      measure.push(note);
    }
    return measure;
  }
}

export default DefaultNotePattern;