
var isLogging = true;
$.togglep = true;

window.addImage = function(img) {
    $("#indie").append(img);
}
window.togglep = function () {

    if ($.togglep) {
        $("#indie").css("display", "block");
    }
    else {
        $("#indie").css("display", "none");
    }

    $.togglep = !$.togglep;

}

window.slog = function (params) {
    $("#indie").append("<p class='onscreen'> >&nbsp;" + params + "</p>");
}

window.dumpDatalog = function () {
    var datalog = utils.datalog
    var start = datalog[0].data;
    var retval = "<table>"
    for (var d = 0; d < datalog.length; d++) {
        var item = datalog[d];
        var date1 = item.data;
        var diff = date1 - start;
        retval += "<tr><td>" + item.label + "</td>";
        retval += "<td>" + diff + "</td></tr>";
        //debug(item.label + "\t\t\t\t\t\t\t\t\> " + diff);
    }

    retval += "</table>";
    debug(retval);
}

window.utils = {
    datalog: [],
    getTime: function () {
        return new Date().getTime();
    },
    pushLog: function (_label, _data) {
        this.datalog[this.datalog.length] = { "label": _label, "data": _data };
    }
}

window.pushLog = function (_label, _data) {
    window.utils.pushLog(_label, _data);
    //debug("[datalog length]" + utils.datalog.length);
}

window.dlog = function (params) {
    if (!isLogging) return;
    if (typeof params == "function") return;
    if (params && params.length > 0) {
        console.log(params.toString());
    }
}

window.debug = function (params) {

    if (typeof params == "function") return;
    if (params && params.length > 0) {
        console.debug(params.toString());
    }
}

window.info = function (params) {
    if (typeof params == "function") return;
    if (params && params.length > 0) {
        console.info(params.toString());
    }
}

window.getUserAgent = function () {
    var nua = navigator.userAgent;
    var is_android = (nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1);
    var iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
    var isBrowser = /(Safari|Mozilla|Chrome)/g.test(navigator.userAgent);
    //var androidApiNo = nua

    var size = { w: $(window).innerWidth(), h: $(window).innerHeight() }

    retval = { isAndroid: is_android, isiOS: iOS, nua: nua, isBrowser: isBrowser, size: size }


    return retval;
}