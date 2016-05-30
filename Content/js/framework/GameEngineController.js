/* GameEngine.js*/
var GameEngineController = BaseController.extend(function () {

    vm.fullIconNum;
    this.Sprite = null;
    this.VSprite = null;
    this.self = null;
    this.modal = null;

    this.constructor = function () {
        this.id = "gameEngine";
        this.self = this;
        this.init();
    };

    this.init = function () {
        this.modal = $("#modal");
        $(this.modal).css("display", "none");
    }

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
                debug("STOP IMMEDIATE")
                slotEngine.StopSpinImmediate();
                vm.IS_STOP_IMMEDIATE = true;
                break;
            case "serverResponse":
                var serverdata = notification.notificationData;
                if (serverdata.action == Constants.$_SERVER_CONNECTED) {

                    //dlog(this.id + " :: [server response] message <= " + notification.message);
                    /*dlog(this.id + " :: [server response] message <= " + notification.message +
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

                    //$("#resultInd").css("background", "#ee0000"); //red
                    //$("#timer").css("color", "red");
                    that.prepareBetData(vm.ServerBetResult);

                    //
                    return;
                }
                else if (serverdata.action == Constants.$_SERVER_BET_RESULT_WIN) {
                    debug("WIN!.." + serverdata.data);
                    vm.gameCheckModel = serverdata.data;
                }

                break;
            case Constants.$_AUTOPLAY:
                var notification = notification.notificationData;
                if (notification.action = Constants.$_START_AUTOPLAY) {

                    vm.MaxAPlayCount = notification.autoplayData.count;
                    vm.APlayInterval = notification.autoplayData.interval;
                    $("#spinLeft").text("spins: " + parseInt((vm.MaxAPlayCount - vm.APlayCount)));
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
            case Constants.$_GAME_INITED:
                var data = notification.notificationData;
                this.InitGame();
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
                slotEngine.StopSpins(eventData.data.async);
                break;
            case Constants.$_REEL_ANIMATIONS_COMPLETE:

                var data = notification.notificationData;

                if (data.action == Constants.$_ALL_REELS_FROZEN) {
                    //debug("from notification...");
                    this.onAllReelsStopComplete();
                }
                else if (data.action == Constants.$_ALL_ANIMATIONS_COMPLETE) {
                    //debug("all animations complete notification...");
                    this.onAllAnimationsComplete();
                }
                break;
            case Constants.$_ALL_ANIMATIONS_COMPLETE:
                //END OF ANN ANIMATIONS.. BET SESSION TERMINATOR NOTIFICATION
                var data = notification.notificationData;
                if (data.action == Constants.$_PAYLINE_ANIMATION_COMPLETE) {
                    //debug("payline animation complete: action => " + data.action);
                }

                //debug("all animations complete notification...");
                this.onAllAnimationsComplete();
                break;

            case Constants.$_CLIENT_PLACE_BET:
                //PLACE BET
                if (vm.IS_OPEN_FOR_BET) {

                    if (vm.IS_GAMBLE_ON) {
                        vm.IS_GAMBLE_ON = false;
                        debug("suspicious act..");
                        $("#modal").fadeOut();
                        $("#gamble-layer").fadeOut();
                    }

                    $("#textInput").val("");
                    var event = notification.notificationData.data.event;
                    $(".isActive").removeClass("isActive");
                    $(event.currentTarget).addClass("isActive");
                    $("#textInput").val(parseInt(event.currentTarget.text));
                    $("#textInput").fadeIn();
                }
                
                vm.IS_GAMBLE_ON = false;
                debug("closing gamble2...");
                $("#modal").fadeOut();
                $("#gamble-layer").fadeOut();


                $("#play").click();

                break;
            case Constants.$_GAMBLER_NOTIFICATION:
                var data = notification.notificationData;
                if (data.action == Constants.$_CLOSE_GAMBLE);
                {
                    vm.IS_GAMBLE_ON = false;
                    debug("closing gamble2...");
                    $("#modal").fadeOut();
                    $("#gamble-layer").fadeOut();
                }

                break;

            default:
                //dlog("[notification] | no action mapped..." + this.id);
                break;
        }
    }

    this.InvokeAPlay = function () {
        $("#play").click();
    }


    //CLEAR AND RESET ALL VARIABLES FOR A NEW BET SESSION
    this.ResetAllParams = function () {
        // open click for another bet  
        vm.IS_ANIM_STOPPED = true;
        vm.IS_SPINNING = false;
        vm.IS_BET_RESULT = false;
        vm.IS_OPEN_FOR_BET = true;
        vm.IS_BUSY = false;
        vm.IS_STOP_ENTERED = false;
        vm.IS_STOP_IMMEDIATE = false;
        vm.IS_ANIMATION_FRAME_ON = false;
        vm.Timer = 0;
        vm.IS_TIMER;
        vm.pData = vm.dataPay0;
        vm.gameCheckModel = null;

        slotEngine.ResetReels();

        //$("#timer").css("color", "inherit");
        $(".betButton").removeClass("isActive");
    };

    this.onAllAnimationsComplete = function () {
        //debug("all animations complete... \n RESET SLOT MACHINE FOR A NEW BET SESSION...");
        this.ResetAllParams();
        var testobj = { top: -55 }
        var self = this;

        if (vm.APlayCount < vm.MaxAPlayCount) {
            doTimer(vm.APlayInterval, 200, null, function () {
                self.InvokeAPlay();
                vm.APlayCount++;

                $("#spinLeft").text("spins: " + parseInt((vm.MaxAPlayCount - vm.APlayCount)));
            })
        }
        else {
            //end autoplay
            vm.MaxAPlayCount = 0;
            vm.APlayCount = 0;
            vm.APlayInterval = 0;
        }
    }


    //INITING ON END OF ALL ACTIONS
    this.onAllReelsStopComplete = function (value) {
        debug("All reels stop");
        vm.IS_WAITING = true;
        vm.Timer = 0;
        //$("#timer").text(vm.Timer);
        //$("#resultInd").css("background", "#00DD00");
        var self = this;
        var callback = self.onAnimationsComplete//resetAllParams;

        doTimer(100, 100, null, function () {
            self.CheckBetResult();
        });
    };

    //CHECK FEEDBACK FOR BET RESULTS
    this.CheckBetResult = function () {
        //TODO: get win dada from json
        debug("Checking bet result...", vm.gameCheckModel);
        var paylines = [];

        if (vm.gameCheckModel == null) {
            debug("_vm.gameCheckModel is null", +vm.gameCheckModel);
        } else {
            verifyModel();
            paylines = vm.gameCheckModel.PayLineModels;
            debug("paylines1 ", paylines);
        }

        function verifyModel() {
            debug("verifying model..");
            var retval = null;
            var lineArr = vm.gameCheckModel.PayLineModels;

            debug("old length:" + lineArr);

            if (lineArr && lineArr.length > 1) {
                for (var i = 0; i < lineArr.length; i++) {
                    var lineId = lineArr[i].Line;
                    debug("lineId ", vm.gameCheckModel.PayLineModels);
                    if (lineId == 4) {
                        vm.gameCheckModel.PayLineModels.splice(i, 1);
                        debug("changed line ", vm.gameCheckModel.PayLineModels);
                    } else if (lineId == 6) {
                        vm.gameCheckModel.PayLineModels[i].Line = 4;
                        debug("changed line ", vm.gameCheckModel.PayLineModels);
                    } else if (lineId == 7) {
                        vm.gameCheckModel.PayLineModels[i].Line = 5;
                        debug("changed line ", vm.gameCheckModel.PayLineModels);
                    }
                }
            }

            debug("new length:" + vm.gameCheckModel.PayLineModels);
        }

        if (paylines && paylines.length > 0) {

            debug("Notify animation controller..." + vm.gameCheckModel.PayLineModels.length);
            $("#spanProfit").text(" Win! " + vm.gameMoneyModel.Profit + " $ ");
            
            var notification = new Notification(Constants.$_START_ANIMATION, {
                action: Constants.$_START_WIN_ANIMATION,
                data: {
                    //animCode: vm.datapay
                    animCode: vm.gameCheckModel
                },
            }, Constants.$_ANIMATION_CONTROLLER_NOTIFICATION);

            broadcaster.Notify(notification);
        }
        else {
            var notification = new Notification(Constants.$_ALL_ANIMATIONS_COMPLETE, {
                action: Constants.$_PAYLINE_ANIMATION_COMPLETE,
                data: {},
            }, Constants.$_ANIMATION_CONTROLLER_NOTIFICATION);

            broadcaster.Notify(notification);
        }
    }


    //RESET ON AIMATIONS COMPLETE
    this.onAnimationsComplete = function () {
        //
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
            //$("#timer").text("timer:" + vm.Timer);
            vm.Timer++;
            if (vm.Timer > vm.betTimerVal) {
                vm.IS_TIMER = false;
                $("#play").click();
            }

           // $("#timer").text(vm.Timer);
        }
    }

    this.onGameDataReady = function (gameDataObject) {
        //debug(gameDataObject);
    }

    this.InitGame = function () {
        $("#game-container").fadeOut();

        vm.IS_GAME_INITED = true;
        $("#preloader").animate({
            opacity: 0
        }, {
            duration: 250,
            step: function (now, fx) {
                // debug("now:" +  now );
            },
            complete: function () {
                $("#preloader").remove();
                var ua = getUserAgent();

                if ((ua.size.w) > ua.size.h * 1.3) {
                    resizeContent();
                    $("#game-container").fadeIn();
                }
            }
        });
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
        var gameMatrixArr = gameData.gameMatrix; //incoming final reel data
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
            var gameMatrixArr = serverGameData.gameMatrix; //incoming final reel data
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
        var gameMatrixArr = serverGameData.gameMatrix; //incoming final reel data
        //gameMatrixArr = getFinalGameData();
        var reelsData = [];
        while (reelsData.length < canvasArr.length) { // loop if reel length is lower than canvasArr.length ([5] in this case)
            var tempRand = [1];
            var headOn = gameMatrixArr.splice(0, 3).concat();
            var final = tempRand.concat(headOn);
            //final[final.length] = getRandomInt(7);

            final[final.length] = 1
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
