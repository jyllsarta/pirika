
import { log as glog, warn as warn } from './logsystem';

// ゲームロジック全般
class PlayLog {

    constructor(){
        this.messages = {};
    }

    log(eventType, message){
        if(!this.messages[eventType]){
            this.messages[eventType] = [];
        }
        this.messages[eventType].push({
            "message": message,
            "time": this.now(),
        })
        glog(eventType, message);
    }

    now(){
        return new Date().toLocaleString()
    }
};

export default PlayLog;