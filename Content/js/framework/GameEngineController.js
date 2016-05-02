/* GameEngine.js*/
var GameEngineController = BaseController.extend(function () {

    vm.fullIconNum;
    this.Sprite = null;
    this.VSprite = null;
    this.self = null;
    this.constructor = function () {
        this.id = "gameEngine";
        this.self = this;
    };

    this.setSprite = function (_sprite1, _sprite2) {
        this.Sprite = _sprite1
        this.VSprite = _sprite2;
    }

    this.onServerResultComplete = function (notification) {
        var serverdata = notification.data;
        //debug("notification:" + notification.gameMatrix);
    }


    this.onNotification = function (notification) {
        var that = this;
        switch (notification.message) {
            case "no-message":
                break;
            case "stopImmediate":
                slotEngine.StopSpinImmediate();
                vm.IS_STOP_IMMEDIATE = true;
                break;
            case "serverResponse":
                var serverdata = notification.notificationData;
                if (serverdata.action == Constants.$_SERVER_CONNECTED) {
                    //dlog(this.id + " :: [server response] message <= " + notification.message);
                    /*
                    dlog(this.id + " :: [server response] message <= " + notification.message +
                        "\n\t\taction:" + serverdata.action +
                        "\n\t\tgameMatrix:" + serverdata.data +
                        "\n\t\tprofit:" + serverdata.profit);*/

                    this.prepareGameData({ gameMatrix: serverdata.data });
                }
                else if (serverdata.action == Constants.$_SERVER_BET_RESULT) {
                    console.timeEnd('start-notification');

                    vm.ServerBetResult = { gameMatrix: serverdata.data };
                    var that = this;

                    vm.IS_BET_RESULT = true;
                    vm.IS_BUSY = false;
                    vm.IS_TIMER = true;

                    $("#resultInd").css("background", "#ee0000"); //red
                    $("#timer").css("color", "red");
                    that.prepareBetData(vm.ServerBetResult);

                    //
                    return;
                    /*doTimer(5, 1, null, function () {
                        vm.IS_BET_RESULT = true;
                        vm.IS_BUSY = false;
                        vm.IS_TIMER = true;

                        //[***DEBUG******]
                        
                        
                        //[***DEBUG******]

                        //debug("IS_BET_RESULT:" + vm.IS_BET_RESULT);
                        //debug("vm.IS_BUSY:" + vm.IS_BUSY);
                        that.prepareBetData(vm.ServerBetResult);
                        //slotEngine.InitFinalSpinners(vm.ServerBetResult);
                    });*/
                }

                break;
            case Constants.$_AUTOPLAY:
                var notification = notification.notificationData;
                if (notification.action = Constants.$_START_AUTOPLAY) {

                    vm.MaxAPlayCount = notification.autoplayData.count;
                    vm.APlayInterval = notification.autoplayData.interval;

                    if (vm.MaxAPlayCount > 0) {
                        this.InvokeAPlay();
                    }

                } else {
                    //
                }
                break;
            case Constants.$_FINAL_IMG_READY:
                var data = notification.notificationData;
                slotEngine.InitFinalSpinners(data.slotData);
                break;
            case Constants.$_GAME_READY:
                var data = notification.notificationData;
                slotEngine.InitSpinners(data.slotData);
                break;
            case Constants.$_GAME_READY:
                var data = notification.notificationData;
                slotEngine.InitSpinners(data.slotData);
                break;
            case Constants.$_UPDATE_REELS:
                var data = notification.notificationData;
                slotEngine.UpdateSpinners(data.slotData);
                break;
            case Constants.$_SPIN_REELS:
                var data = notification.notificationData;
                vm.IS_ANIM_STOPPED = false
                slotEngine.StartSpin(data.slotData);
                vm.IS_SPINNING = true;
                vm.IS_WAITING = false;
                break;
            case Constants.$_STOP_REELS:
                var eventData = notification.notificationData;
                slotEngine.StopSpin(eventData.data.async);
                break;
            case Constants.$_ANIMATION_COMPLETE:
                var data = notification.notificationData;

                if (data.action == Constants.$_ALL_REELS_FROZEN) {
                    this.onAllReelsStopComplete();
                }
                else if (data.action == Constants.$_ALL_ANIMATIONS_COMPLETE) {
                    this.onAllAnimationsComplete();
                }
                break;

            case Constants.$_CLIENT_PLACE_BET:
                //PLACE BET
                $("#textInput").val("");
                var event = notification.notificationData.data.event;
                $(".isActive").removeClass("isActive");
                $(event.currentTarget).addClass("isActive");

                doTimer(100, 100, null, function () {
                    $("#textInput").val(parseInt(event.currentTarget.text));
                    $("#textInput").fadeIn();
                });

                break;

            default:
                //dlog("[notification] | no action mapped..." + this.id);
                break;
        }
    }

    this.InvokeAPlay = function () {
        $("#play").click();
    }



    this.ResetAllParams = function () {
        // open click for another bet  
        vm.IS_ANIM_STOPPED = true;
        vm.IS_SPINNING = false;
        vm.IS_BET_RESULT = false;
        vm.IS_OPEN_FOR_BET = true;
        vm.IS_BUSY = false;
        vm.IS_STOP_ENTERED = false;
        vm.IS_STOP_IMMEDIATE = false;
        vm.Timer = 0;
        vm.IS_TIMER;


        slotEngine.ResetReels();

        $("#timer").css("color", "inherit");
    };

    this.onAllAnimationsComplete = function () {
        debug("all animations complete...");
    }

    this.onAllReelsStopComplete = function (value) {
        vm.IS_WAITING = true;
        vm.Timer = 0;
        $("#timer").text(vm.Timer);
        $("#resultInd").css("background", "none");
        var self = this;
        var callback =  self.onAnimationsComplete//resetAllParams;

        doTimer(100, 100, null, function () {
            //dlog('Game sequence ended ..opening click.');
            $("#resultInd").css("background", "none");
            callback.call();
        });
    };

    this.onAnimationsComplete = function () {

        this.ResetAllParams();
        var self = this;

        if (vm.APlayCount < vm.MaxAPlayCount) {
            doTimer(vm.APlayInterval, 200, null, function () {
                self.InvokeAPlay();
                vm.APlayCount++;
            })
        }
        else {
            vm.APlayCount = 0;
            debugger
        }
    }

    this.prepareGameData = function (serverGameData) {
        var self = this;
        slotEngine.setDelegate(self);

        getExtendedGameData(serverGameData, function (baseGameData) {
            var reelsData = self.getReelsDataObjects(baseGameData)
            var notification = new Notification(Constants.$_GAME_READY, {
                action: Constants.$_LOAD_SPRITE,
                slotData: { reels: reelsData, sprite: self.Sprite },
            }, Constants.$_GAME_ENGINE_NOTIFICATION);

            broadcaster.Notify(notification);
        });
    }

    this.prepareBetData = function (serverBetData) {
        var self = this;
        slotEngine.setDelegate(self);
        getFinalExtendedGameData(serverBetData, function (baseGameData) {
            var reelsData = self.getReelsDataObjects(baseGameData);
            var notification = new Notification(Constants.$_FINAL_IMG_READY, {
                action: Constants.$_PREPARE_FINAL_IMG,
                slotData: { reels: reelsData, sprite: self.VSprite },
            }, Constants.$_GAME_ENGINE_NOTIFICATION);
            broadcaster.Notify(notification);
        });
    }

    this.onAnimationUpdate = function () {
        var that = this;
        if (vm.IS_TIMER && vm.IS_BET_RESULT) {
            $("#timer").text("timer:" + vm.Timer);
            vm.Timer++;
            if (vm.Timer > vm.betTimerVal) {
                vm.IS_TIMER = false;
                $("#play").click();
            }

            $("#timer").text(vm.Timer);
        }
    }

    this.onGameDataReady = function (gameDataObject) {
        //debug(gameDataObject);
    }

    this.getReelsDataObjects = function (reelsData) {
        var reels = [];
        for (var i = 0; i < reelsData.length; i++) {    // get reel icons data array / from icon data arrray index @ index [i]
            var reel = [];
            for (var n = 0; n < reelsData[i].length; n++) {
                reel[reel.length] = bg_sprites[reelsData[i][n]];    // get reel icons data item / from reel icons data array @ index [n]
            }
            reels[reels.length] = reel;
        }
        checkItems(reelsData, reels);
        return reels;
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    function getFinalGameData() {
        var randArr = [];
        while (randArr.length < 15) {
            var subarr = [];
            while (subarr.length < 3) {
                var num = Math.floor(Math.random() * 8);
                if (num == 5 || num == 1) {
                    if (subarr.indexOf(1) > -1 || subarr.indexOf(5) > -1) {
                    }
                    else {
                        subarr.push(num);
                    }
                } else {
                    subarr.push(num);
                }
            }
            for (var i = 0; i < subarr.length; i++) {
                randArr[randArr.length] = subarr[i];
            }
        }
        return randArr;
    }

    function _getFinalGameData(gameData) {

        var canvasArr = $(".cItem");
        var gameMatrixArr = gameData.gameMatrix.split(","); //incoming final reel data
        var reelsData = [];

        while (reelsData.length < canvasArr.length) { // loop if reel length is lower than canvasArr.length ([5] in this case)

            var tempRandSeed = [];
            for (var r = 0; r < 0; r++) { // fill reel seeding data with ordered integers
                tempRandSeed[tempRandSeed.length] = "" + (r % 8);
            }

            var tempRand = [];
            while (tempRandSeed.length > 0) {// fill reel data with randomized integers taken from seeding
                tempRand[tempRand.length] = tempRandSeed.splice(getRandomInt(tempRandSeed.length), 1)[0]; //  remove randomly selected item from seed array and add to randomized array
            }

            var headOn = gameMatrixArr.splice(0, 3);
            var final = headOn.concat(tempRand.concat());

            reelsData[reelsData.length] = final;
        }
        return reelsData;
    }

    function getExtendedGameData(serverGameData, onComplete) {
        var onReelsRetrieved = function (pReelData) {
            var canvasArr = $(".cItem");
            var gameMatrixArr = serverGameData.gameMatrix.split(","); //incoming final reel data
            var reelsData = [];
            while (reelsData.length < canvasArr.length) { // loop if reel length is lower than canvasArr.length ([5] in this case)
                var tempRand = pReelData[reelsData.length];
                var headOn = tempRand.slice(0, 3);
                var final = tempRand.concat(headOn);
                reelsData[reelsData.length] = final;
            }
            onComplete(reelsData);
        }
        var reelGenerator = new ReelGenerator();
        reelGenerator.setDelegate(onReelsRetrieved);
        reelGenerator.GetReels();
    }

    function getFinalExtendedGameData(serverGameData, onComplete) {
        var canvasArr = $(".cItem");
        var gameMatrixArr = serverGameData.gameMatrix.split(","); //incoming final reel data
        gameMatrixArr = getFinalGameData();
        var reelsData = [];
        while (reelsData.length < canvasArr.length) { // loop if reel length is lower than canvasArr.length ([5] in this case)
            var tempRand = [];
            var headOn = gameMatrixArr.splice(0, 3).concat();
            var final = tempRand.concat(headOn);
            final[final.length] = getRandomInt(7);
            reelsData[reelsData.length] = final;
        }

        onComplete(reelsData);

    }

    function checkItems(arr, objArr) {
        for (var i = 0; i < arr.length; i++) {
            for (var n = 0; n < arr[i].length; n++) {
                var index = arr[i][n];
                var obj = objArr[i][n];
                if (index == obj.id) {

                }
                else {
                    log("we have a problem...")
                    throw new Error("we have a problem in [" + i + "][" + n + "]");
                }
            }
        }
    }

});