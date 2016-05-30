/*MainController.js*/
var MainController = BaseController.extend(function () {

    this.constructor = function () {
        this.id = "main";
        initBetButtonListeners();
        //debug("ON MAIN_CONTROLLER INIT..." + this.id);
    };

    this.onNotification = function (notification) {
        switch (notification.message) {
            case "serverResponse":
                //dlog(this.id + " [processing  notification] " + notification.message);
                break;
            default:
                //dlog("[notification] | no action mapped..." + this.id);
                break;
        }
    }

    //BET BUTTON CLICK
    function initBetButtonListeners() {
        $(".betButton").on("mousedown press", function (e) {
            //$(".isActive").removeClass("isActive");
            //$(e.currentTarget).addClass("isActive");

            var nData = { action: Constants.$_CLIENT_PLACE_BET, data: e }

            var notification = new Notification(Constants.$_CLIENT_PLACE_BET, {
                action: Constants.$_CLIENT_PLACE_BET_CHANGED,
                data: { event:e },
            }, Constants.$_GAME_ENGINE_NOTIFICATION);

            broadcaster.Notify(notification);
        })
    }

});