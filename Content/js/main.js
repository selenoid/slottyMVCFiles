/*
*
DEFINE PROPERTIES
*
*/
var observerController = null;
var slotEngine = null;
var gameEngine = null;
var mainController = null;
var animationController = null;
var gamblerController = null;
var vm = null;
var loadedAnimSprites = 0
var isGambleOn = false;
var timeStart = 0;
var timeEnd = 0;

vm = new GameModel();
$.vSprites = null;

function initApp(img) {
    resizeContent();
    disableGambleButton();
    $.test = getTest();
    var ua = getUserAgent();

    //add GameEvent listener to document
    document.addEventListener('gameEvent', onGameEvent, false);

    $("#gambleButton").click(function () {
        if (vm.IS_GAMBLE_BUTTON_ENABLED == false) return;

        $("#gamount").text(vm.gmodel.gAmount);
        $("#gwin").text(vm.gmodel.wAmount);
        $(".count").text(vm.gmodel.attemptCount);

        var notification = new Notification(
        Constants.$_SERVER_REQUEST, {
            action: Constants.$_SERVER_GAMBLE_REQUEST,
            data: {},
        }, Constants.$_GAME_ENGINE_NOTIFICATION);

        broadcaster.Notify(notification);
        disableGambleButton();
    });

    $("#credit").click(function () {
        $("#play").click();
    });

    $("#collectButton").click(function () {
        return;
    });

    $("#autoplayButton").click(function () {
        var notification = new Notification(Constants.$_AUTOPLAY, {
            action: Constants.$_START_AUTOPLAY,
            autoplayData: { count: 5, interval: 1 * 600, action: Constants.$_START_AUTOPLAY }
        }, "GameEngineNotification");
        broadcaster.Notify(notification);
    });

    $(document).on("keypress", function (e) {
        // use e.which
        console.timeEnd("pin");
        timeEnd = new Date().getTime();
        var timeInterval = timeEnd - timeStart;
        $("#interval").text(0);
        switch (e.which) {
            case 32:
                if (timeInterval < 100) return;
                //debug("time interval ok:" + timeInterval);
                if (parseInt($("#textInput").val()) < 10) {
                    return;
                }
                $("#interval").text(timeInterval);
                $("#play").click();
                break;
            default:
                break;
        }

        timeStart = new Date().getTime();
    });

    // define the game event handler.
    var onGameEvent = function (evt) {
        dlog("[GameEvent] message => " + evt.detail.message + " recieved in : " + evt.currentTarget.nodeName);
    }

    vm = new GameModel();
    vm.globalID = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    broadcaster = new ObserverController();             //instantiate broadcaster
    mainController = new MainController();              //init MainController
    gameEngine = new GameEngineController();            //init game engine
    gameEngine.setSprite(img, $.vSprites);
    slotEngine = new SlotEngineController();            //init slot engine
    animationController = new AnimationController();    //init animation controller
    gamblerController = new GamblerController();        //init animation controller

    //adding controllers to ObserverController

    broadcaster.AddObserver(mainController);
    broadcaster.AddObserver(gameEngine);
    broadcaster.AddObserver(slotEngine);
    broadcaster.AddObserver(animationController);
    broadcaster.AddObserver(gamblerController);

    initSocket();                                       //start socket connection
}

function getWebSocket() {
    debugger;
    return ws;
}

function getView() {
    return
}

function disableGambleButton() {
    $("#gambleButton").addClass("disabledButton");
    vm.IS_GAMBLE_BUTTON_ENABLED = false;
}

function enableGambleButton() {
    $("#gambleButton").removeClass("disabledButton");
    vm.IS_GAMBLE_BUTTON_ENABLED = true;
}

function resizeContent() {

    var zoom = 1;
    var gh = $("#gameContainer").height();

    var w = $(window).innerWidth();
    var h = $(window).innerHeight();

    if (w < h * 1.33) {

        debug("please use at landscape mode.");
        $("#infopanel").css("display", "none");
        $("#infopanel").fadeIn();
        $("#game-container").css("display", "none");
    }
    else {
        if (!vm.IS_GAME_INITED) return;
        $("#game-container").css("display", "block");
        $("#infopanel").css("display", "none");
    }

    if (w > h * 1.6) {
        zoom = h / 470;
    }
    else {
        zoom = w / 736;
    }

    var fZoom = zoom.toPrecision(2);

    //$("#zoomInd").text("zoom:" + fZoom);
    $('body').css("zoom", fZoom);
}

this.onImageLoaded = function (img) {
    $.addlog("on image load..." + img.src);
    loadedAnimSprites++;
    if (loadedAnimSprites == vm.numReelIcons) {
        loadGambleCards();
    }
}

function loadGambleCards() {
    $.addlog("loadGambleCards");
    resizeContent();
    //load initial aces image
    $.gCards = new Image();
    $.gCards.id = "aces";
    $.gCards.addEventListener("load", loadGambleMiniCards, false);
    $.gCards.src = '/Content/img/assets/cards.png';
}

function loadGambleMiniCards() {
    $.addlog("loadGambleMiniCards");
    resizeContent();
    //load initial aces image
    $.gMiniCards = new Image();
    $.gMiniCards.id = "miniaces";
    $.gMiniCards.addEventListener("load", loadAssets, false);
    $.gMiniCards.src = '/Content/img/assets/cardsmini.png';
}

//LOAD ANIMATION ASSETS
function loadAnimationAssets() {
    $.addlog("loadAnimationAssets...");

    setUpTestScreen();
    $("#preloader").css("display", "block");
    resizeContent
    var self = this;
    var numReelIcons = vm.numReelIcons;
    var counter = 0;
    var animAsset = new Image();
    var self = this;

    for (var n = 0; n <= vm.numReelIcons; n++) {
        var img = new Image();
        img.addEventListener('load',
            function (e) {
                onImageLoaded(e.target);
            });
        $.addlog("load image..." + '/Content/img/anima/sprite' + n + '.jpg');
        img.src = '/Content/img/anima/sprite' + n + '.jpg';
        vm.animAssets["anim" + n] = img;
    }
}

function loadAssets() {
    $.addlog("loadAssets");
    loadGambleMiniCards
    $("#preloader").css("display", "block");
    resizeContent();
    var self = this;
    //load initial sprite image
    $.vSprites = new Image();
    $.vSprites.id = "vertical";
    $.vSprites.addEventListener("load", loadBaseAssets, false);
    $.vSprites.src = '/Content/img/ui/dickhey.png';

}

function loadBaseAssets() {
    $.addlog("loadBaseAssets");
    //load initial sprite image
    this.sprites = new Image();
    this.sprites.id = "terminator";
    this.sprites.addEventListener("load", function () { //init spinners after the sprites image loaded..
        $.addlog("initApp");
        initApp(this);
    }, false);

    this.sprites.src = '/Content/img/ui/sprites.png';
}

function getIconNames(matrix) {
    var names = ["\n"];
    var namesArr = ["lemon", "star", "cherry", "wmelon", "grape", "seven", "plum", "orange"];
    for (var i = 0; i < matrix.length; i++) {
        names[names.length] = namesArr[matrix[i]];
        if ((i % 3) == 2) {
            names[names.length] = "\n";
        }
    }

    return names;
}

function setUpTestScreen() {
    $(".close").click(function () {
        $("#control-panel").fadeOut();
    });
    $("#exitButton").click(function () {
        $("#control-panel").fadeIn();
    });
    $(".paylineSet").click(function (e) {
        if (e.currentTarget.id == "p0") return;
        var id = parseInt(e.target.id.slice(1));
        $.pay(id);
    });

    $.pay = function (id) {
        $.vm.customData = $.vm.getSlotData(id);
        $.vm.pData = $.vm.getDataPay(id);

        //$(e.target).css("opacity", 0.5);
        //$(e.target).animate({ opacity: 1 });
        $("#control-panel").fadeOut();
        doTimer(300, 300, null, function () {
            //dlog('Game sequence ended ..opening click.');
            $("#play").click();
        });
    }
}

function preInit() {
    window.onresize = function () {
        resizeContent();
    }

    loadAnimationAssets();
}

function onStep() {
    debug("timer::onStep");
}

function onCompleteNull() {
    debug("timer::onComplete");
}

function GetFinalRollsNull() {
    dlog("getting final rolls..");
}

this.NotifyObservers = function (notification) {
    broadcaster.Notify(notification);
}

function getTest() {
    var url = window.location.hostname;
    var retval = (url == "localhost");
    return retval;
}

$.kill = function () {
    cancelAnimationFrame(vm.globalID);
}

$.setTimer = function () {
    doTimer(2000, 20, onStep, onComplete);
}

/*$.gamble = function () {
    var notification = new Notification(
        Constants.$_SERVER_REQUEST, {
            action: Constants.$_SERVER_GAMBLE_REQUEST,
            data: {},
        }, Constants.$_GAME_ENGINE_NOTIFICATION);

    broadcaster.Notify(notification);
    return;
} */

$.addlog = function (str) {
    $("#preloader").append("<div class='minitype'>" + str + "</div>");
}


$(document).on("ready", preInit);
