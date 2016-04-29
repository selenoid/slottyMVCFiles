//Create MyClass by extending Class.
var BaseController = Class.extend(function () {

    this.id = "baseController";
    $.MainController = this;

    //Classes can have constructors
    this.constructor = function () {
        //...
    };

    this.onNotification = function (notification) {
        switch (notification.message) {
            case "someMethod":
                //
                break;
            default:
                //
                break;
        }
    }

});