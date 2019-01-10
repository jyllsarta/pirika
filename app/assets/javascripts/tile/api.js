//
// api.js railsのAPI叩く
//

import { log as log, warn as warn } from './logsystem';

class ColorTileAPI {
    static getNewBoard(callback) {
        $(function () {
            $.ajax({
                type: "GET",
                url: "http://" + location.host + "/tile/new",
                timeout: 10000,
            })
                .done(function (response, textStatus, jqXHR) {
                    log("request <getNewBoard> succeeded. response is:");
                    log(response);
                    callback(response);
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    log("だめ(盤面取得)")
                });
        });
    };
    static sendResult(callback, logjson, username) {
        log("sending result is");
        log(logjson);
        log("username is");
        log(username);
        $(function () {
            $.ajax({
                type: "POST",
                url: "http://" + location.host + "/tile/results/create",
                timeout: 10000,
                dataType: "json",
                data: {
                    authenticity_token: $("meta[name=csrf-token]").attr("content"),
                    playlog: logjson,
                    username: username,
                },
            })
                .done(function (response, textStatus, jqXHR) {
                    log("request <sendResult> succeeded. response is:");
                    log(response);
                    callback(response);
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    log("だめ(ランキング送信)")
                });
        });
    };
}
export default ColorTileAPI;