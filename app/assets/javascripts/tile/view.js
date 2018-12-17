//
// view.js modelとviewを頑張ってつなぐ係
// (このファイルがこんなに苦しいならフロントのライブラリを使うべきでは...?)
//

import g_colors from './colors';
import g_tile from './colortile';
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
        this.addClickEvent();
    }

    addClickEvent() {
        // this地獄すぎるこの関数
        var self = this;
        log("add click event")
        $(".panel").each(function () {
            $(this).click(self.clickPanelHandler.bind(self));
        });

        $(".start").click(function () {
            this.requestStartHandler();
        }.bind(this));
        $(".restart").click(function () {
            this.requestStartHandler();
        }.bind(this));
        $(".back_to_title").click(function () {
            this.backToTitleHandler();
        }.bind(this));
    }

    startRemoveAnimation(panelObject) {
        panelObject.animate2({
            transform: 'rotate(30deg) scale(1.3)',
            opacity: 0,
        }, 200, "linear")
    }

    resetPanel() {
        $(".panel").css({
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
        g_tile.requestStart();
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
            })
        this.syncView();
        this.resetPanel();
    }

    paintPanel(panelObject, panelModel) {
        if (panelModel) {
            var color = g_colors[panelModel.colorId];
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
        log("remove dirty panels.");
        log(dirtyPanels);
        for (var dirtyPanel of dirtyPanels) {
            var panelObject = $(`.panel[x=${dirtyPanel.x}][y=${dirtyPanel.y}]`);
            this.startRemoveAnimation(panelObject);
            dirtyPanel.resetDirtyFlag(); // ここでmodelを触りに行くのはたぶん規約違反だけど高速化のために許容
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
};

var g_view = new View();
g_tile.setView(g_view);

function update() {
    g_view.update();
    window.requestAnimationFrame(update);
}
window.requestAnimationFrame(update);
