
class Keyboard {
    constructor(){
        this.keyboard = [];
        for(let i = "a".charCodeAt(0); i <= "z".charCodeAt(0); i++) {
            this.keyboard[String.fromCharCode(i)] = 0;
        }
        this.events = {
            // 今後 keyUpとかもつかうことになるかもしれない...
            keyDown: [],
        };
    }

    addKeyboardEvent(func){
        this.events.keyDown.push(func);
    }

    mount(){
        document.onkeydown = (e) => {
            this.handleKeydown(e);
        };
        document.onkeyup = (e) => {
            this.handleKeyup(e);
        };
    }

    get(key){
        return this.keyboard[key];
    }

    triggerKeyDownEvents(){
        for(let event of this.events.keyDown){
            event();
        }
    }

    // handlers
    handleKeydown(e) {
        // keyboard は 押されたら1 押しっぱなしだとそれ以上 の値が入っている
        for (let key of this.keyboard.keys()) {
            if(this.keyboard[key]){
                this.keyboard[key] += 1;
            }
        }
        this.keyboard[e.key] = 1;
        this.triggerKeyDownEvents();
    }

    handleKeyup(e) {
        this.keyboard[e.key] = 0;
    }
}

export default Keyboard;