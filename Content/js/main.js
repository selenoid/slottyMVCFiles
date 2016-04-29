/*
*
DEFINE PROPERTIES
*
*/
var observerController = null;
var slotEngine = null;
var gameEngine = null;
var mainController = null;
var vm = null;
$.vSprites = null;


$.kill = function () {
    cancelAnimationFrame(vm.globalID);
}

$.setTimer = function () {
    doTimer(2000, 20, onStep, onComplete);
}

function onStep() {
    debug("timer::onStep");
}

function onComplete() {
    debug("timer::onComplete");
}

function onRecieveData() {
    dlog("on recieve data...");
}

function GetFinalRolls() {
    dlog("getting final rolls..");
}

this.NotifyObservers = function (notification) {
    broadcaster.Notify(notification);
}

/*this.startSpin = function () {
    debugger
    slotEngine.startSpinning();
}*/

function getTest() {
    var url = window.location.hostname;
    var retval = (url == "localhost");
    return retval;
}

function initApp(img) {
    slog("image loaded...");
    $("#indie").append(img);
    resizeContent();
    $.test = getTest();
    var ua = getUserAgent();

    //add GameEvent listener to document
    document.addEventListener('gameEvent', onGameEvent, false);

    $(document).on("keypress", function (e) {
        // use e.which
        switch (e.which) {
            case 32:
                $("#play").click();
                break;
            default:
                break;
        }
    });

    $("#gambleButton").click(function () {
        $("#play").click();
    })

    // define the game event handler.
    var onGameEvent = function (evt) {
        dlog("[GameEvent] message => " + evt.detail.message + " recieved in : " + evt.currentTarget.nodeName);
    }

    vm = new GameModel();
    vm.globalID = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    //instantiate broadcaster
    broadcaster = new ObserverController();

    //init MainController
    mainController = new MainController();

    //init game engine
    gameEngine = new GameEngineController();
    gameEngine.setSprite(img, $.vSprites);

    //init slot engine
    slotEngine = new SlotEngineController();


    //adding controllers to ObserverController
    broadcaster.AddObserver(mainController);
    broadcaster.AddObserver(gameEngine);
    broadcaster.AddObserver(slotEngine);

    //start socket connection
    initSocket();
}

function resizeContent() {
    var zoom = 1;
    var w = $(window).innerWidth();
    var h = $(window).innerHeight();
    
    if (w > h) {
        //landscape
        zoom = h / 460;
    }else {
        zoom = w / 735;
    }

    var fZoom = zoom.toPrecision(2);
    $("#zoomInd").text("zoom:" + fZoom);
    $('body').css("zoom", fZoom);
}

function onVSpritesLoaded(img) {

    loadBaseAssets();
}

function loadAssets() {
    var self = this;
    onWindowResize();

    //load initial sprite image
    $.vSprites = new Image();
    $.vSprites.id = "vertical";
    $.vSprites.addEventListener("load", function (img) { //init spinners after the sprites image loaded..
        //initApp(this);
        slog("dickhey loaded..");
        onVSpritesLoaded($.vSprites);
    }, false);

    $.vSprites.src = '/Content/img/ui/dickhey.png';

}

function loadBaseAssets() {
    onWindowResize();
    //load initial sprite image
    this.sprites = new Image();
    this.sprites.id = "terminator";
    this.sprites.addEventListener("load", function () { //init spinners after the sprites image loaded..
        initApp(this);
    }, false);

    this.sprites.src = '/Content/img/ui/sprites.png';
}

function onWindowResize() {
    var zoom = $('body').css("zoom");
    dlog("on window resize..");
}

$(document).on("ready", loadAssets);

/*
var notification = new Notification("gameReady", {
            action: "loadSprite",
            reelsData: reelsData
        }, "GameEngineNotification");

        broadcaster.Notify(notification);
*/

/*
    init GameEngine
    initGameEngine();
    var el = document.getElementsByTagName("body")[0];
    var event = new GameEvent("gameInited", true, true);
    el.dispatchEvent(event);
*/