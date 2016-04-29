var Notification = function (_notificationMessage, _notificationData, _notificationType) {

    this.message            = _notificationMessage;
    this.notificationData   = _notificationData;
    this.type               = _notificationType;

    this.dump = function () {
        /* dlog(
            "[notification]\n" + "\t\tmessage => " + this.message + "data => " + this.data + "type => " + this.type);*/
    }
}
