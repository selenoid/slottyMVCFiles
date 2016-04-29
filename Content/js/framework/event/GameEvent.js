var GameEvent = function (_message, _bubbles, _cancelable) {
    return new CustomEvent(
       "gameEvent", {
           detail: {
               message: _message,
               time: new Date(),
           },
           bubbles: _bubbles,
           cancelable: _cancelable
       }
    );
};