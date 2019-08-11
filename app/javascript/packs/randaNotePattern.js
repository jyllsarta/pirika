import Constants from './constants.js'

class RandaNotePattern{
  static generateNotes(){
    let notes = Object.values(Constants.notes);
    let pattern = [];
    let prevNote = 0;
    for (let i = 0; i < 400; ++i){
      let availableNotes = notes.filter((x)=>x !== prevNote);
      let note = availableNotes[Math.floor(Math.random() * availableNotes.length)];
      prevNote = note;
      pattern.push(note);
    }
    return pattern;
  }
}

export default RandaNotePattern;