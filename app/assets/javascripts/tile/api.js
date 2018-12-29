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
                    log("request succeeded. response is:");
                    log(response);
                    callback(response);
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    log("だめ")
                });
        });
    };
}
export default ColorTileAPI;