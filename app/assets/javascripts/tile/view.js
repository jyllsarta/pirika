//
// view.js modelとviewを頑張ってつなぐ係
// (このファイルがこんなに苦しいならフロントのライブラリを使うべきでは...?)
//

import g_colors from './colors';
import g_tile from './colortile';

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

// init
$(function () {
    console.log("pi!");
    addClickEvent();
    syncView();
});

function addClickEvent() {
    $(".panel").each(function () {
        $(this).click(clickPanelHandler);
    });

    $(".start").click(function () {
        $(this).click(startGameHandler);
    });
}

function startRemoveAnimation(panelObject) {
    panelObject
        .animate2({
            transform: 'rotate(30deg) scale(1.3)',
            opacity: 0,
        }, 200, "linear")
}

function clickPanelHandler(model) {
    const x = parseInt(model.currentTarget.attributes.x.value);
    const y = parseInt(model.currentTarget.attributes.y.value);
    g_tile.click(x, y);
    syncViewOnlyDirty();
}

function startGameHandler(model) {
    $(".start")
        .animate2({
            opacity: 0,
            transform: "translateY(-100px)",
        }, 150, "linear")
        .queue(function () {
            $(this).addClass("removed")
        })
    g_tile.startGame();
}

function paintPanel(panelObject, panelModel) {
    if (panelModel) {
        var color = g_colors[panelModel.colorId];
        $(panelObject).find(".block").css("background", color);
        $(panelObject).find(".block").removeClass("hidden");
    }
    else {
        $(panelObject).find(".block").addClass("hidden");
    }
}

function syncView() {
    $(".panel").each(function () {
        const x = parseInt(this.attributes.x.value);
        const y = parseInt(this.attributes.y.value);
        // fill square if block exists
        if (g_tile.board.panel(x, y).block) {
            paintPanel(this, g_tile.board.panel(x, y));
        }
        // else blank
        else {
            paintPanel(this, null);
        }
    })
}

function syncViewOnlyDirty() {
    var dirtyPanels = g_tile.board.panels().filter(x => x.dirty);
    for (var dirtyPanel of dirtyPanels) {
        var panelObject = $(`.panel[x=${dirtyPanel.x}][y=${dirtyPanel.y}]`);
        startRemoveAnimation(panelObject);
        dirtyPanel.resetDirtyFlag(); // ここでmodelを触りに行くのはたぶん規約違反だけど高速化のために許容
    }
}