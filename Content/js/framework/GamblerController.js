/* GamblerController.js*/
var GamblerController = BaseController.extend(function () {

    vm.fullIconNum;
    this.Sprite = null;
    this.VSprite = null;
    this.self = null;
    this.view = null;
    this.isCardVisible = true;
    this.animCounter = 0;
    this.gamblePlaced = false;
    this.history = [];

    var globalGambleAnimId;

    this.constructor = function () {
        this.id = "gambler";
        this.self = this;
        this.init();
    };

    this.init = function () {
        this.gamblePlaced = false;
        this.view = $("#gamble-layer");
        $(this.view).css("display", "none");
        var that = this;

        $("#gamble-layer .gambleButton").click(function () {
            that.onButtonClicked(this);
        });
    }

    this.closeGamble = function (result) {

        this.updateResultInfo();
        var notification = new Notification(Constants.$_GAMBLER_NOTIFICATION, {
            action: Constants.$_CLOSE_GAMBLE,
            data: { result: result },
        }, Constants.$_GAMBLER_NOTIFICATION);

        broadcaster.Notify(notification);
    }

    this.onNotification = function (notification) {
        var that = this;
        switch (notification.message) {
            case Constants.$_SERVER_REQUEST:
                //SEND SERVER A REQUEST FOR LATEST PRIZE WON. AND THE WIN AMOUNT IF THE GAMBLE SUCCEED.
                var notificationData = notification.notificationData;
                if (notificationData.action == Constants.$_SERVER_GAMBLE_REQUEST) {
                    this.SendGambleRequestToServer();
                }
                break
            case Constants.$_SHOW_GAMBLE:
                vm.IS_GAMBLE_ON = !vm.IS_GAMBLE_ON;
                if (vm.IS_GAMBLE_ON) {
                    $("#spanProfit").text("");
                    $("#cardSwap").attr("class", "");
                    this.gamblePlaced = false;
                    var data = notification.notificationData.data;

                    $("#modal").fadeIn("fast");
                    console.timeEnd("clicked gamble time");
                    that.updateResultInfo();
                    that.start(true);
                    $(this.view).fadeIn("fast", function () {
                        debug("zoraki...");
                    });
                } else {
                    console.error("an error occured. (200)");
                }
                break;
            case Constants.$_SERVER_RESPONSE:
                var action = notification.notificationData.action;
                if (action == Constants.$_GAMBLE_RESULT_RECIEVED) {
                    var gResult = notification.notificationData.data.result;
                    that.processGambleResult(gResult);
                }
                break;
            default:
                //dlog("[notification] | no action mapped..." + this.id);
                break;
        }
    }




    this.SendGambleRequestToServer = function () {
        var that = this;
        doTimer(100, 100, null, function () {
            that.OnServerGambleRequestResponse();
        });

    }

    this.OnServerGambleRequestResponse = function () {
        var notification = new Notification(
        Constants.$_SHOW_GAMBLE, {
            action: "",
            data: {},
        }, Constants.$_GAME_ENGINE_NOTIFICATION);
        broadcaster.Notify(notification);
    }

    this.start = function (val) {
        if (val == true) {
            $("#cardSwap").attr("class", "");
            this.updateResultInfo();
            this.gamblePlaced = false;
            this.startShaker();
        }
        else {
            debug("no chance!...");
        }
    }

    this.startShaker = function () {
        debug("starting shaker...");
        globalGambleAnimId = requestAnimationFrame(this.updateAnimation);
    }

    this.dismiss = function () {
        debug("dismiss gambler..");
    }

    //GAMBLE
    this.onButtonClicked = function (target) {
        var i = (target.id == "redButton") ? 0 : 1;
        this.setGamble(i);
    }

    this.updateViews = function (gRes) {
        $(this.view).find("#gamount").text(gRes.GambleModel.GAmount);
        $(this.view).find("#gwin").text(gRes.GambleModel.WAmount);
        $(this.view).find(".count").text(gRes.GambleModel.Attempt);
    }

    this.setGamble = function (sel) {
        this.gamblePlaced = true;
        debug("sending to socket : " + sel);
        $.gDataSend(sel);
    }

    this.processGambleResult = function (gRes) {
        var daWin = (gRes.Win == true) ? "WIN!" : "LOSE..";
        var daClass = "card_" + gRes.CardType;

        $("#cardSwap").addClass(daClass);
        $("#cardSwap").css("display", "block");

        //add current card to history
        this.history[this.history] = this.getNewHistoryCard(gRes.CardType);
        var that = this;
        this.updateViews(gRes);
        that.showResult(gRes);


        //re-try if attempts left...
        doTimer(2000, 100, null, function () {
            if (gRes.Win == true && gRes.GambleModel.Attempt > 0) {
                that.start(true);
            } else {
                //debugger
                if (gRes.Win == false) {
                    $("#spanProfit").text("Place your bet.");
                } else {
                    //debugger
                    $("#spanProfit").text("You Win " + gRes.GambleModel.GAmount+". Place Your Bet");
                } 
                debug("closing gamble 1...");
                that.closeGamble(gRes);
            }

        });
    }

    this.updateResultInfo = function () {
        debug("updating reult info panel...");
        $("#gamble-result-info").fadeOut("fast", function () {
            $("#gamble-result-info").attr("class", "");
            $("#gamble-result-info").text("");
            $("#gamble-result-info").addClass("round bigFont ");
        });
    }

    this.showResult = function (_res) {

        var daClass = (_res.Win == true) ? "win" : "lose";
        var daMsg = (_res.Win == true) ? "YOU WIN!" : "YOU LOSE.";

        $("#gamble-result-info").attr("class", "");
        $("#gamble-result-info").text(daMsg);
        $("#gamble-result-info").addClass("round bigFont " + daClass + "");
        $("#gamble-result-info").fadeIn();

    }

    this.onGambleComplete = function (msg) {
        debug("on msg complete:" + msg);
    }

    this.onServerReturn = function (result) {
        var notification = new Notification(Constants.$_SERVER_RESPONSE, {
            action: Constants.$_GAMBLE_RESULT_RECIEVED,
            data: { result: result },
        }, Constants.$_ANIMATION_CONTROLLER_NOTIFICATION);

        broadcaster.Notify(notification);
    }


    //DUMMY SERVER PROCESS RETURNING DUMMY RESULT

    this.getFakeServerResult = function (sel) {
        //SERVER GETS THE LAST PRIZE WON FROM THE LATEST SPIN.
        //server takes user selection [sel]
        //creates a random number between 0 - 4
        var rand = parseInt(Math.random() * 4);

        //checks the selected card[red or black / 0 or 1] is complying with the generated random number
        //which can be any integer between 0 and 4
        var w = false;
        if ((rand == 0 || rand == 2) && sel == 0) {
            w = true;
            // if the user selection is [red] and the random number is 0 or 2 
            //user wins 
            //the bet user gambled is doubled, and returned to the vault again to be gambled or collected.

        } else if ((rand == 1 || rand == 3) && sel == 1) {
            w = true;
            // if the user selection is [black] and the random number is 0 or 2 
            //user wins 
            //the bet user gambled is doubled, and returned to the vault again to be gambled or collected.
        } else {
            //any other case will fail and the amount the user has bet would be removed from balance.
            w = false;
        }
        //returns 
        return result = { w: w, sel: rand };;
    }

    this.addToBalance = function (winAmount) {
        debug("adding to balance:  " + winAmount);
    }

    this.updateAnimation = function () {

        this.animCounter++;
       // $("#indicator2").text(this.animCounter);
        var card = $(".cardSwap");

        if ((this.animCounter % 3) == 0) {
            this.isCardVisible = !this.isCardVisible;
            var visible = (this.isCardVisible) ? "block" : "none";
            $("#cardSwap").css("display", visible);
        }

        if (this.gamblePlaced) {

            debug("card vis 1: " + $("#cardSwap").css("display"));
            $("#cardSwap").css("display", "block");
            debug("card vis 2: " + $("#cardSwap").css("display"));

            while ($("#cardSwap").css("display") !== "block") {
                $("#cardSwap").css("display", "block");
            }

            return;
        }

        if (!vm.IS_GAMBLE_ON) {
            debug("closing gamble animation... returning..");
            return;
        }

        globalGambleAnimId = requestAnimationFrame(this.updateAnimation);
    }

    this.getNewHistoryCard = function (index) {
        if ($("#cardsholder").children().length > 5) {
            $("#cardsholder").children().eq(0).remove();
        }
        var daClass = "cardmini_" + index;
        var imgHolder = document.createElement("div");

        $(imgHolder).addClass("imgHolder");
        $(imgHolder).addClass(daClass);
        $("#cardsholder").append(imgHolder);
    }
});
