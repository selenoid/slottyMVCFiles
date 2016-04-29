/*
*
ObserverController
*
*/

var ObserverController = function () {

    //define observer array
    var observers = [];

    //add observer method
    this.AddObserver = function (observer) {
        observers[observers.length] = observer;
    }

    this.GetObservers = function () {
        return observers;
    }

    this.Notify = function (notification) {
        //dlog("notifying objects..." + notification.message);
        var stack = observers;

        for (var i = 0; i < stack.length; i++) {
            var observerItem = stack[i];
            observerItem.onNotification(notification);
        }
    }
}
