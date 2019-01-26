//
// view.js modelとviewを頑張ってつなぐ係
// (このファイルがこんなに苦しいならフロントのライブラリを使うべきでは...?)
//

import ColorTile from './colortile';
import { log as log, warn as warn } from './logsystem';

// qiitaのanimate謎拡張
// https://qiita.com/waterada/items/bb73f3850f05d854dc6e
$.fn.animate2 = function (properties, duration, ease) {
    ease = ease || 'ease';
    var $this = this;
    var cssOrig = { transition: $this.css('transition') };
    return $this.queue(next => {
        properties['transition'] = 'all ' + duration + 'ms ' + ease;
        $this.css(properties);
        setTimeout(function () {
            $this.css(cssOrig);
            next();
        }, duration);
    });
};

class View {
    // init
    constructor() {
        log("document.ready invoked.");
        this.addEvent();
        this.hitSFX = new Audio("/game/tile/sounds/sfx/hit.wav");
        this.hitSFX2 = new Audio("/game/tile/sounds/sfx/hit2.wav");
        this.setDefaultUsername();
        this.defaultUsername = "ななしろこ";
    }

    addEvent() {
        // this地獄すぎるこの関数
        var self = this;
        log("add events")
        $(".panel").each(function () {
            $(this).mousedown(self.clickPanelHandler.bind(self));
        });

        $(".click_to_start").mousedown(function () {
            const difficulty = $(this).attr("id");
            const difficultyIds = {
                easy: 1,
                normal: 2,
                hard: 3,
            }
            self.requestStartHandler(difficultyIds[difficulty]);
        });
        $(".restart").mousedown(function () {
            this.requestReStartHandler();
        }.bind(this));
        $(".back_to_title").mousedown(function () {
            this.backToTitleHandler();
        }.bind(this));
        $(".change_username").click(function () {
            this.showChangeUsernameField();
        }.bind(this));
        $(".username").blur(function () {
            this.checkUsername();
            this.hideChangeUsernameField();
        }.bind(this));
        $(".username").focus(function () {
            this.onFocusUsername();
        }.bind(this));
    }

    to_trip(tr) {
        var shaObj = new jsSHA("SHA-256", "TEXT");
        shaObj.update(tr);
        return shaObj.getHash("B64").slice(0, 10);
    }

    trip(rawUsername) {
        const splitted = rawUsername.replace(/📛/g, "").split("#");
        const displayName = splitted[0];
        if (splitted.length == 1) {
            return displayName;
        }
        const tripped = this.to_trip(splitted.slice(1).join(""));
        return `${displayName}📛${tripped}`;
    }

    setDefaultUsername() {
        const rawUsername = $.cookie("username") || this.defaultUsername;
        $(".username").val(rawUsername);
        this.setUsername();
    }

    setUsername() {
        const rawUsername = $(".username").val();
        const trippedUsername = this.trip(rawUsername);
        $(".text_username").text(trippedUsername);
        g_tile.setUsername(trippedUsername);
        $.cookie("username", rawUsername, { expires: 10000 });
    }

    //textareaに入力されたユーザ名をステートに反映
    checkUsername() {
        const username = $(".username").val();
        if (!username || username == this.defaultUsername) {
            $(".username").val(this.defaultUsername);
            $(".username").addClass("emphasise_name");
            return;
        }
        else {
            this.setUsername();
            $(".username").removeClass("emphasise_name");
        }
    }

    onFocusUsername() {
        if ($(".username").val() == this.defaultUsername) {
            $(".username").val("");
        }
    }

    showChangeUsernameField() {
        $(".username").removeClass("hidden").focus();
        $(".fixed_username").addClass("hidden");
    }

    hideChangeUsernameField() {
        $(".username").addClass("hidden");
        $(".fixed_username").removeClass("hidden");
    }

    updateHighScore(score) {
        $(".highscore").text(score);
    }

    startRemoveAnimation(panelObject, score) {
        panelObject.animate2({
            transform: 'rotate(30deg) scale(1.5)',
            opacity: 0,
        }, 250, "linear");
        var score_flash = $(`<div class="score_effect score_${score}">+${score}</div>`).appendTo($("#effects"));
        var offset = panelObject.offset();
        offset.top -= 15;
        offset.left += 8;
        score_flash.offset(offset);
        score_flash.animate2({
            opacity: 0.8,
            transform: "translateY(-5px) scale(1.3)",
        }, 200, "linear")
            .animate2({
                opacity: 0,
                transform: "translateY(-10px) scale(1.7)",
            }, 200, "linear")
            .queue(function () {
                $(this).remove();
            });
    }

    resetPanel() {
        $(".block").css({
            transform: "none",
            opacity: 1,
        })
    }

    clickPanelHandler(model) {
        const x = parseInt(model.currentTarget.attributes.x.value);
        const y = parseInt(model.currentTarget.attributes.y.value);
        log(`clicked ${x}, ${y}`)
        g_tile.click(x, y);
        this.syncViewOnlyDirty();
    }

    backToTitleHandler() {
        log("back to title")
        this.hideResult();
        this.showTitle();
        g_tile.backToTitle();
    }

    showTitle() {
        $(".start").removeClass("removed");
        $(".start").css({
            opacity: 1,
            transform: "translateY(0px)",
        });
    }

    requestStartHandler(difficulty) {
        log("start requested...");
        g_tile.setDifficulty(difficulty);
        g_tile.startGame();
    }

    requestReStartHandler(model) {
        log("start requested...");
        g_tile.startGame();
    }

    startGameHandler(model) {
        log("start");
        this.hideResult();
        $(".start")
            .animate2({
                opacity: 0,
                transform: "translateY(-100px)",
            }, 150, "linear")
            .queue(function () {
                $(this).addClass("removed");
                $(this).dequeue();
            });
        this.syncView();
        this.resetPanel();
        this.setUsername();
    }

    paintPanel(panelObject, colorId) {
        if (colorId) {
            var color = $(`.color_sample${colorId}`).css("background");
            $(panelObject).find(".block").css("background", color);
            $(panelObject).find(".block").removeClass("hidden");
        }
        else {
            $(panelObject).find(".block").addClass("hidden");
        }
    }

    syncView() {
        var self = this;
        $(".panel").each(function () {
            const x = parseInt(this.attributes.x.value);
            const y = parseInt(this.attributes.y.value);
            self.paintPanel(this, g_tile.board.panel(x, y).colorId);
        })
    }

    syncViewOnlyDirty() {
        var dirtyPanels = g_tile.board.panels().filter(x => x.dirty);
        log("remove dirty panels.");
        log(dirtyPanels);
        for (var dirtyPanel of dirtyPanels) {
            var panelObject = $(`.panel[x=${dirtyPanel.x}][y=${dirtyPanel.y}] .block`);
            this.startRemoveAnimation(panelObject, dirtyPanels.length ** 2 * 2 * g_tile.difficultyScoreRate() / dirtyPanels.length);
            dirtyPanel.resetDirtyFlag(); // ここでmodelを触りに行くのはたぶん規約違反だけど高速化のために許容
        }
        if (dirtyPanels.length > 2) {
            log("play sound hit 2")
            this.hitSFX2.currentTime = 0;
            this.hitSFX2.play();
        }
        else if (dirtyPanels.length === 2) {
            log("play sound hit")
            this.hitSFX.currentTime = 0;
            this.hitSFX.play();
        }
        this.updateScore();
    }

    updateTimeBar() {
        // 横幅に結合あるの悔しい 起動時に取るほうが健全かも
        $(".time").css("width", 300 * g_tile.timeLeftRatio());
    }

    updateScore() {
        $(".score").numerator({
            easing: 'linear',
            duration: 400,
            rounding: 0,
            toValue: g_tile.getCurrentScore(),
        });
    }

    finish() {
        log("finish");
        $(".end").removeClass("hidden");
        $(".final_score").text(g_tile.getCurrentScore());
    }

    hideResult() {
        $(".end").addClass("hidden");
    }

    update() {
        g_tile.update();
        if (g_tile.isPlaying()) {
            this.updateTimeBar();
        }
    }

    flashSavedTicker() {
        log("ランキング保存したよ！");
    }
};

var g_tile = new ColorTile(100);
var g_view = new View();
g_tile.setView(g_view);

function update() {
    g_view.update();
    window.requestAnimationFrame(update);
}
window.requestAnimationFrame(update);
