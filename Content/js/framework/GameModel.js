/*GameModel.js*/
function GameModel() {

    if (arguments.callee._singletonInstance) {
        return arguments.callee._singletonInstance;
    }

    $.vm = this;

    if (this.modelInited == true) {
        throw new Error("model already initiated...");
        debugger;
    }

    this.modelInited = true;

    debug("****creating istance..");
    arguments.callee._singletonInstance = this;

    this.animCoords = [ // animation map for map of 16
        { x: 0, y: 0 }, { x: 256, y: 0 }, { x: 512, y: 0 }, { x: 768, y: 0 },
        { x: 0, y: 256 }, { x: 256, y: 256 }, { x: 512, y: 256 }, { x: 768, y: 256 },
        { x: 0, y: 512 }, { x: 256, y: 512 }, { x: 512, y: 512 }, { x: 768, y: 512 },
        { x: 0, y: 768 }, { x: 256, y: 768 }, { x: 512, y: 768 }, { x: 768, y: 768 }
    ];

    this.payline1 = [
        { x: 0, y: 0, w: 110, h: 110 },
        { x: 0, y: 0, w: 110, h: 110 },
        { x: 0, y: 0, w: 110, h: 110 },
        { x: 0, y: 0, w: 110, h: 110 },
        { x: 0, y: 0, w: 110, h: 110 }
    ];

    this.payline2 = [
        { x: 0, y: 110, w: 110, h: 110 },
        { x: 0, y: 110, w: 110, h: 110 },
        { x: 0, y: 110, w: 110, h: 110 },
        { x: 0, y: 110, w: 110, h: 110 },
        { x: 0, y: 110, w: 110, h: 110 }
    ];


    this._payline2 = [
       { x: 0, y: 0, w: 110, h: 110 },
       { x: 0, y: 0, w: 110, h: 110 },
       { x: 0, y: 110, w: 110, h: 110 },
       { x: 0, y: 220, w: 110, h: 110 },
       { x: 0, y: 220, w: 110, h: 110 }
    ];

    this.payline3 = [
        { x: 0, y: 220, w: 110, h: 110 },
        { x: 0, y: 220, w: 110, h: 110 },
        { x: 0, y: 220, w: 110, h: 110 },
        { x: 0, y: 220, w: 110, h: 110 },
        { x: 0, y: 220, w: 110, h: 110 }
    ];

    this._payline3 = [
       { x: 0, y: 220, w: 110, h: 110 },
       { x: 0, y: 220, w: 110, h: 110 },
       { x: 0, y: 110, w: 110, h: 110 },
       { x: 0, y: 0, w: 110, h: 110 },
       { x: 0, y: 0, w: 110, h: 110 }
    ];

    this.payline4 = [
        { x: 0, y: 0, w: 110, h: 110 },
        { x: 0, y: 110, w: 110, h: 110 },
        { x: 0, y: 220, w: 110, h: 110 },
        { x: 0, y: 110, w: 110, h: 110 },
        { x: 0, y: 0, w: 110, h: 110 }
    ];

    this.payline5 = [
        { x: 0, y: 220, w: 110, h: 110 },
        { x: 0, y: 110, w: 110, h: 110 },
        { x: 0, y: 0, w: 110, h: 110 },
        { x: 0, y: 110, w: 110, h: 110 },
        { x: 0, y: 220, w: 110, h: 110 }
    ];

    this.payline7 = [
        { x: 0, y: 220, w: 110, h: 110 },
        { x: 0, y: 110, w: 110, h: 110 },
        { x: 0, y: 0, w: 110, h: 110 },
        { x: 0, y: 110, w: 110, h: 110 },
        { x: 0, y: 220, w: 110, h: 110 }
    ];

    this.payline99 = [
    ];



    //payline 1
    this.slotData1 = [
       2, 3, 6,
       2, 3, 4,
       2, 4, 5,
       2, 6, 3,
       2, 4, 3
    ];

    //payline 11
    this.slotData2 = [
       6, 0, 3,
       2, 0, 0,
       5, 0, 4,
       3, 2, 6,
       3, 0, 1
    ];

    //payline 12
    this.slotData3 = [
       3, 6, 4,
       3, 4, 4,
       4, 5, 4,
       6, 3, 4,
       4, 3, 6
    ];


    //payline 2
    this.slotData_2 = [
        3, 2, 6,
        3, 1, 4,
        4, 3, 5,
        6, 2, 3,
        4, 2, 3
    ];

    //payline 3
    this.slotData_3 = [
        6, 2, 6,
        4, 2, 6,
        4, 6, 5,
        6, 2, 4,
        6, 2, 1
    ];

    //payline 4
    this.slotData4 = [
        6, 2, 1,
        1, 6, 4,
        5, 2, 6,
        7, 6, 0,
        6, 4, 4
    ];

    //payline 5
    this.slotData5 = [
        1, 2, 0,
        1, 0, 4,
        0, 2, 5,
        7, 0, 0,
        4, 6, 0
    ];

    //payline 99
    this.slotData99 = [
        1, 2, 0,
        5, 0, 4,
        0, 2, 1,
        7, 3, 0,
        4, 1, 0
    ];

    this.getSlotData = function (index) {
        var str = "slotData" + index + "";
        var curData = this[str];
        var retval = curData.slice();
        return retval;

    }

    this.getDataPay = function (index) {
        var retval = new Object();

        var str = "dataPay" + index + "";
        var curData = this[str];

        retval["line"] = curData.line;
        retval["icons"] = curData.icons;
        retval["jackpot"] = curData.jackpot;

        return retval;
    }

    //line dataPay 
    this.dataPay0 = { line: [], icons: [], jackpot: false }
    this.dataPay1 = { line: [1], icons: [2, 2, 2, 2, 2], jackpot: false }
    this.dataPay2 = { line: [2], icons: [0, 0, 0], jackpot: false }
    this.dataPay3 = { line: [3], icons: [4, 4, 4, 4], jackpot: false }
    this.dataPay4 = { line: [4], icons: [6, 6, 6, 6, 6], jackpot: false }
    this.dataPay5 = { line: [5], icons: [0, 0, 0, 0, 0], jackpot: false }

    this.gameCheckModel = null;
    this.gameMoneyModel = null;
    this.dataPay_2 = { line: [2], icons: [3, 3, 3, 3, 3], jackpot: false }
    this.dataPay_3 = { line: [3], icons: [6, 6, 6, 6, 6], jackpot: false }

    //scatter dataPay
    this.dataPay99 = { line: [99, [0, -1, 2, -1, 1]], icons: [1, -1, 1, -1, 1], jackpot: false }

    this.LastAnimationPin = 0;
    this.TimeOffset = 50;
    this.FullIconNum = 27;
    this.ServerBetResult = null;
    this.TickCounter = 0;
    this.Timer = 0;
    this.globalID = null;
    this.finalCounterHeader = 0;
    this.betTimerVal = 30;
    this.itemH = 110;
    this.MaxAPlayCount = 0;
    this.APlayCount = 0;
    this.APlayInterval = 0;
    this.animAssets = [];
    this.numReelIcons = 7;
    this.customData = "";
    this.ScatterId = 1;
    this.isAnimationFrameOn = false;
    this.scatterImagePath = Constants.$_DIR.Payline + "scatter.png";
    this.indie = 0;
    this.PaylineModels = [];


    /*POSSIBLE STATES*/
    this.IS_GAME_INITED = false;
    this.IS_GAMBLE_ON = false;
    this.IS_ANIM_STOPPED = true;
    this.IS_BUSY = false;
    this.IS_OPEN_FOR_BET = true;
    this.IS_BET_RESULT = false;
    this.IS_SPINNING = false;
    this.IS_STOP_ENTERED = false;
    this.IS_BOUNCING = false;
    this.IS_WAITING = false;
    this.IS_ANIMATION_FRAME_ON = false;
    this.IS_GAMBLE_BUTTON_ENABLED = false;

    this.ResetModel = function () {
        this.LastAnimationPin = 0;
        this.TimeOffset = 50;
        this.FullIconNum = 27;

        this.ServerBetResult = null;
        this.isResultGet = false;
        this.TickCounter = 0;
    }

    this.getPosArrPayline = function (id) {
        var payline = this["payline" + id + ""];
        return payline;
    }

    this.gmodel = {
        attemptCount: "",
        gAmount: "",
        wAmount: ""
    };
}
