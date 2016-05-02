/*GameModel.js*/
function GameModel() {

    if (arguments.callee._singletonInstance) {
        return arguments.callee._singletonInstance;
    }

    arguments.callee._singletonInstance = this;

    this.LastAnimationPin = 0;
    this.TimeOffset = 50;
    this.FullIconNum = 27;
    this.ServerBetResult = null;
    this.TickCounter = 0;
    this.Timer = 0;
    this.globalID = null;
    this.finalCounterHeader = 0;
    this.betTimerVal = 20;
    this.itemH = 110;
    this.MaxAPlayCount = 0;
    this.APlayCount = 0;
    this.APlayInterval = 0;

    /*POSSIBLE STATES*/
    this.IS_ANIM_STOPPED = true;
    this.IS_BUSY = false;
    this.IS_OPEN_FOR_BET = true;
    this.IS_BET_RESULT = false;
    this.IS_SPINNING = false;
    this.IS_STOP_ENTERED = false;
    this.IS_BOUNCING = false;
    this.IS_WAITING = false;



    this.ResetModel = function () {
        
        this.LastAnimationPin = 0;
        this.TimeOffset = 50;
        this.FullIconNum = 27;

        this.ServerBetResult = null;
        this.isResultGet = false;
        this.TickCounter = 0;
    }
}