// init
$(function () {
    console.log("pi!");
    addClickEvent();
});

function addClickEvent() {
    $(".panel").each(function () {
        $(this).click(clickPanelHnadler);
    })
}

function clickPanelHnadler(model) {
    const x = parseInt(model.target.attributes.x.value)
    const y = parseInt(model.target.attributes.y.value)
    console.log(x, y);
}