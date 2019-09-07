
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

        [0b0010, 0b0100, 0b0010, 0b0100],
        [0b0100, 0b0010, 0b0100, 0b0010],

        [0b1000, 0b0001, 0b1000, 0b0001],
        [0b0001, 0b1000, 0b0001, 0b1000],

        [0b0001, 0b1000, 0b0100, 0b0010],
        [0b1000, 0b0001, 0b0010, 0b0100],

        [0b0010, 0b0100, 0b1000, 0b0001],
        [0b0100, 0b0010, 0b0001, 0b1000],

        [0b0001, 0b0010, 0b1100, 0b0010],
        [0b1000, 0b0100, 0b0011, 0b0100],

        [0b0100, 0b0011, 0b1000, 0b0001],
        [0b0010, 0b1100, 0b0001, 0b1000],

        [0b1000, 0b0001, 0b0100, 0b0010],
        [0b0001, 0b1000, 0b0010, 0b0100],

        [0b0100, 0b0010, 0b1000, 0b0001],
        [0b0010, 0b0100, 0b0001, 0b1000],

        [0b0100, 0b0011, 0b1000, 0b0011],
        [0b0010, 0b1100, 0b0001, 0b1100],

        [0b0110, 0b0001, 0b1000, 0b0001],
        [0b0110, 0b1000, 0b0001, 0b1000],

        [0b0001, 0b0010, 0b0001, 0b1000],
        [0b1000, 0b0100, 0b1000, 0b0001],

        [0b0001, 0b0010, 0b0001, 0b0100],
        [0b1000, 0b0100, 0b1000, 0b0010],
      ],
    }
  }

  static sampleIndex(array){
    return Math.floor(Math.random() * array.length);
  }


  static generateNotes(){
    let notes = [];
    for (let i = 0; i < 75; ++i){
      notes = notes.concat(this.getRandomMeasure(notes));
      notes = notes.concat(this.getPatternedMeasure(notes));
    }
    return notes;
  }

  static getRandomMeasure(currentNotes){
    let measure = [];
    const notes = Object.values(this.constants().notes);
    const lastNote = currentNotes[currentNotes.length - 1] || 0;
    let availableNotes = notes.filter(x=> (lastNote & x) === 0);
    let ngNotes = notes.filter(x=> (lastNote & x) !== 0);
    const firstNoteIndex = this.sampleIndex(availableNotes);

    // 最初の1ノーツ
    measure.push(availableNotes.splice(firstNoteIndex, 1)[0]);

    // 最初の1ノーツ用に避けていたノーツを戻し
    availableNotes = availableNotes.concat(ngNotes);

    // なくなるまでランダムに設置
    while(availableNotes.length > 0){
      measure.push(availableNotes.splice(this.sampleIndex(availableNotes), 1)[0]);
    }

    return measure;
  }

  static getPatternedMeasure(currentNotes){
    const lastNote = currentNotes[currentNotes.length - 1] || 0;
    const availableNotePatterns = this.constants().notePatterns.filter(x=> (lastNote & x[0]) === 0);

    const rand = Math.floor(Math.random() * availableNotePatterns.length);
    const pattern = availableNotePatterns[rand];
    let measure = [];
    for(let note of pattern){
      measure.push(note);
    }
    return measure;
  }
}

export default DefaultNotePattern;