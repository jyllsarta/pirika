var app = new Vue({
    el: '#app',
    data: {
        player:{
            blur: 50,
            brightness: 50,
            saturate: 50,
            hueRotate: 50,
        },
        target:{
            blur: 50,
            brightness: 50,
            saturate: 50,
            hueRotate: 50,
        },
        showingAnswer: false
    },
    created: function(){
        this.target.blur = parseInt(Math.random() * 100);
        this.target.brightness = parseInt( 10 + Math.random() * 90); // br < 10 は人間にはみえない
        this.target.saturate = parseInt(Math.random() * 100);
        this.target.hueRotate = parseInt(Math.random() * 100);
    },
    computed: {
        playerFilter: function(){
            return `blur(${this.player.blur /10}px) brightness(${this.player.brightness / 50}) saturate(${this.player.saturate / 50}) hue-rotate(${this.player.hueRotate / 100 * 360 + 180}deg)`;
        },
        targetFilter: function(){
            return `blur(${this.target.blur /10}px) brightness(${this.target.brightness / 50}) saturate(${this.target.saturate / 50}) hue-rotate(${this.target.hueRotate / 100 * 360 + 180}deg)`;
        },
        score: function(){
            let diffs = 0;
            for (const key of Object.keys(this.player)){
                diffs += Math.abs(this.target[key] - this.player[key])
            }
            return 100 - diffs;
        },
        tweetingMessage: function(){
            return `CSSのfilterプロパティ ${this.score}%理解した`;
        }
    },
    methods: {
        showAnswer: function () {
            this.showingAnswer = true;
        },
        grade: function(attributeName){
            const diff = Math.abs(this.player[attributeName] - this.target[attributeName]);
            if (diff <= 1){
                return "◎";
            }
            if (diff <= 5){
                return "○";
            }
            if (diff <= 15){
                return "△";
            }
            return "×";
        },
        reload: function(){
            location.reload();
        },
        tweet: function(){
            const tweetContent = encodeURI(this.tweetingMessage);
            const url = encodeURI("http://jyllsarta.net/match_illusts/index");
            const fullurl = `https://twitter.com/intent/tweet?url=${url}&text=${tweetContent}`;
            window.open(fullurl);
        },
    }
});
