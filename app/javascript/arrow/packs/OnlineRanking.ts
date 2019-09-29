import axios from "axios"

class OnlineRanking{
  constructor(private scoreSubmitUrl: string,
              private rankingUrl: string,
              private myScoreUrl: string){
  }

  public submit(username, score, remove_score, time_score , callback ){
    axios.post(this.scoreSubmitUrl,{
          authenticity_token: document.querySelector("meta[name=csrf-token]").attributes["content"].textContent,
          username: username,
          score: score,
          remove_score: remove_score,
          time_score: time_score,
        }
    )
        .then((results) => {
          callback.call();
          console.log(results);
          console.log("OK");
        })
        .catch((results) => {
          console.warn(results);
          console.warn("NG");
        })
  }

  public getHighScore(username, callback ){
    axios.get(this.myScoreUrl+`?username=${username}`)
        .then((results) => {
          callback.call();
          console.log(results);
          console.log("OK");
        })
        .catch((results) => {
          console.warn(results);
          console.warn("NG");
        })
  }

  public getRanking(callback ){
    axios.get(this.rankingUrl)
        .then((results) => {
          callback.call();
          console.log(results);
          console.log("OK");
        })
        .catch((results) => {
          console.warn(results);
          console.warn("NG");
        })
  }
}
export default OnlineRanking;
