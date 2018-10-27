function loadIllusts() {
    var count = 3
    for (var i = count; i > 0; --i) {
        $("#illustBox").append(`<a href="images/rakugaki/${i}.png"><div class="thumb"></div>`)
        $(".thumb:last").css("background-image", `url("images/rakugaki/${i}.png")`)
    }
}

$(
    loadIllusts()
);