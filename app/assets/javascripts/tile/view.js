//
// view.js modelとviewを頑張ってつなぐ係
// (このファイルがこんなに苦しいならフロントのライブラリを使うべきでは...?)
//

// init
$(function () {
    console.log("pi!");
    addClickEvent();
    syncView();
});

function addClickEvent() {
    $(".panel").each(function () {
        $(this).click(clickPanelHnadler);
    })
}

function clickPanelHnadler(model) {
    const x = parseInt(model.target.attributes.x.value)
    const y = parseInt(model.target.attributes.y.value)
    g_tile.click(x, y);
    syncView();
}

function paintPanel(panelObject, colorId) {
    var color = g_colors[colorId] || "#FFFFFF";
    $(panelObject).css("background-color", color);
}

function syncView() {
    $(".panel").each(function () {
        const x = parseInt(this.attributes.x.value)
        const y = parseInt(this.attributes.y.value)
        // fill square if block exists
        if (g_tile.board.panel(x, y).block) {
            paintPanel(this, g_tile.board.panel(x, y).colorId);
        }
        // else blank
        else {
            paintPanel(this, -1);
        }
    })
}