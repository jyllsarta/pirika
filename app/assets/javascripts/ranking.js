//
// ranking.js ランキングページで読み込む
// cookieから自分のユーザ名を取ってきて、それを光らせる
//

function to_trip(tr) {
    var shaObj = new jsSHA("SHA-256", "TEXT");
    shaObj.update(tr);
    return shaObj.getHash("B64").slice(0, 10);
}

function trip(rawUsername) {
    const splitted = rawUsername.replace(/📛/g, "").split("#");
    const displayName = splitted[0];
    if (splitted.length == 1) {
        return displayName;
    }
    const tripped = this.to_trip(splitted.slice(1).join(""));
    return `${displayName}📛${tripped}`;
}

$(function () {
    const username = $.cookie("username");
    const tripped = trip(username);
    for (var r of $(".rank")) {
        if ($(r).find(".name").text() == tripped) {
            $(r).css("background-color", "#ffe8cc").css("border-radius", "20px");
        }
    }
});