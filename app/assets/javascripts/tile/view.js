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

function syncView() {
    $(".panel").each(function () {
        const x = parseInt(this.attributes.x.value)
        const y = parseInt(this.attributes.y.value)
        // fill square if block exists
        if (g_tile.panel(x, y).block) {
            $(this).addClass("filled");
        }
        // else blank
        else {
            $(this).removeClass("filled");
        }
    })
}