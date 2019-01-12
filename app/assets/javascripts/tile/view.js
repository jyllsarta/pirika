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
    }

    addEvent() {
        // this地獄すぎるこの関数
        var self = this;
        log("add events")
        $(".panel").each(function () {
            $(this).mousedown(self.clickPanelHandler.bind(self));
        });

        $(".click_to_start").mousedown(function () {
            this.requestStartHandler();
        }.bind(this));
        $(".restart").mousedown(function () {
            this.requestStartHandler();
        }.bind(this));
        $(".back_to_title").mousedown(function () {
            this.backToTitleHandler();
        }.bind(this));
        $(".username").blur(function () {
            this.checkUsername();
        }.bind(this));
        $(".username").focus(function () {
            this.onFocusUsername();
        }.bind(this));
    }

    setDefaultUsername() {
        const username = $.cookie("username");
        if (username) {
            $(".username").val(username);
            this.setUsername();
        }
    }

    setUsername() {
        const username = $(".username").val();
        g_tile.setUsername(username);
        $.cookie("username", username, { expires: 10000 });
    }

    //textareaに入力されたユーザ名をステートに反映
    checkUsername() {
        const username = $(".username").val().slice(0, 6)
        const defaultUserName = "ななしろこ";
        if (!username || username == defaultUserName) {
            //log("ユーザ名が空")
            $(".username").val(defaultUserName)
            $(".username").addClass("emphasise_name")
            return
        }
        else {
            this.setUsername();
            $(".username").removeClass("emphasise_name")
        }
    }

    onFocusUsername() {
        $(".username").val("")
    }

    startRemoveAnimation(panelObject) {
        panelObject.animate2({
            transform: 'rotate(30deg) scale(1.3)',
            opacity: 0,
        }, 200, "linear")
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

    requestStartHandler(model) {
        log("start requested...")
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

    paintPanel(panelObject, panelModel) {
        if (panelModel) {
            var color = $(`.color_sample${panelModel.colorId}`).css("background");
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
            // fill square if block exists
            if (g_tile.board.panel(x, y).block) {
                self.paintPanel(this, g_tile.board.panel(x, y));
            }
            // else blank
            else {
                self.paintPanel(this, null);
            }
        })
    }

    syncViewOnlyDirty() {
        var dirtyPanels = g_tile.board.panels().filter(x => x.dirty);
        var panelsRemoved = 0;
        log("remove dirty panels.");
        log(dirtyPanels);
        for (var dirtyPanel of dirtyPanels) {
            var panelObject = $(`.panel[x=${dirtyPanel.x}][y=${dirtyPanel.y}] .block`);
            this.startRemoveAnimation(panelObject);
            panelsRemoved++;
            dirtyPanel.resetDirtyFlag(); // ここでmodelを触りに行くのはたぶん規約違反だけど高速化のために許容
        }
        if (panelsRemoved > 2) {
            log("play sound hit 2")
            this.hitSFX2.currentTime = 0;
            this.hitSFX2.play();
        }
        else if (panelsRemoved === 2) {
            log("play sound hit")
            this.hitSFX.currentTime = 0;
            this.hitSFX.play();
        }
    }

    updateTimeBar() {
        // 横幅に結合あるの悔しい 起動時に取るほうが健全かも
        $(".time").css("width", 300 * g_tile.timeLeftRatio());
    }

    updateScore() {
        $(".time").text(g_tile.getCurrentScore());
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
            this.updateScore();
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
