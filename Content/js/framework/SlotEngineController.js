/*SlotEngine*/

var SlotEngineController = BaseController.extend(function () {
    this.reelItems = [];
    this.ispushed = false;
    var self = null;
    var delegate = null;
    this.inc = 96;
    this.cacheCtx = null;
    this.cacheCanvas = null;
    this.itemh = 110;
    this.autoplayCounter = 0;
    this.isCancelFrame = false;
    this.spinId = 0;
    this.stopTimer = 0;
    this.isStopping = false;
    this.CurrentReelId = 0;
    this.orgStopInterval = 25;
    this.stopInterval = this.orgStopInterval;

    //this.isCancelFrame = false;

    $.finalImageData = null;

    this.onReelBounceStart = function (item) {
        if (item.lastItem) {
            //this.isCancelFrame = true;
        }
    }

    /*this.onBounceComplete = function (item) {
        if (item.lastItem) {
            debug("last item....");
            var notification = new Notification(Constants.$_REEL_ANIMATIONS_COMPLETE, {
                action: Constants.$_ALL_REELS_FROZEN,
                reelData: {},
            }, Constants.$_SLOT_ENGINE_NOTIFICATION);

            broadcaster.Notify(notification);
        }
    }*/

    this.createFinalBaseCanvas = function () {

        dlog("[Create FinalBaseImage]" + " @" + new Date().getTime());
        var self = this;

        cacheCanvas = document.createElement('canvas'); //create in-memory cache canvas for copying.

        cacheCanvas.setAttribute('width', self.itemh);
        cacheCanvas.setAttribute('height', (self.itemh * 8));
        cacheCanvas.setAttribute('id', 'finalCanvas');

        cacheCtx = cacheCanvas.getContext('2d');

        //cache canvas variables
        var cw = cacheCanvas.width;
        var ch = cacheCanvas.height;

        try {
            //create reel sprites for icon templates
            for (var i = 0; i < 8; i++) {
                cacheCtx.drawImage($.vSprites, 0, this.itemh * i, cw, this.itemh, 0, this.itemh * i, cw, this.itemh);
            }

        } catch (err) {
            debug("error:" + err);
        }

        $.finalImageData = cacheCtx.getImageData(0, 0, cw, ch);
    }

    this.constructor = function () {
        this.createFinalBaseCanvas();
        $.finalizer = new Finalizer();
        this.id = "slotEngine";
        self = this;
        this.canvasArr = document.getElementsByClassName("cItem");
    }

    this.setDelegate = function (_delegate) {
        delegate = _delegate;
    }

    this.ResetReels = function () {

        for (var i = 0; i < self.reelItems.length; i++) {
            var reelController = self.reelItems[i];
            reelController.ResetReel();
        }

        this.isStopping = false;
    }

    this.initAnimationParams = function (callback) {
        debug("init animation..." + this.spinId);
        vm.globalID = 0;
        self.isCancelFrame = false;
        self.ResetReels();
        vm.TickCounter = 0;
        this.spinId++;
        this.stopTimer = 0;
        this.stopInterval = this.orgStopInterval;
        this.CurrentReelId = 0;
        callback.call();
        vm.IS_ANIMATION_FRAME_ON = true;
        vm.Timer = 0;
       // $("#timer").text(vm.Timer);
    }

    this.onNotification = function (notification) {
        var that = this;
        switch (notification.message) {
            case Constants.$_START_ANIMATION:
                var data = notification.notificationData;

                if (data.action == Constants.$_START_WIN_ANIMATION) {
                    //CANCEL ANIMATION FRAME IF WIN ANIMATION STARTS...
                    this.isCancelFrame = true;
                }

                break;
            default:
                //dlog("[notification] | no action mapped..." + this.id);
                break;
        }
    }

    //START Sequence
    this.StartSpin = function () {
        if (vm.IS_SPINNING) {
            dlog("we have a frame animation...returning...");
            return;
        }

        if (vm.IS_ANIMATION_FRAME_ON) {
            console.info("****************\NANIMATION FRAME IS ON...\n****************");
            return;
        }

        console.clear();
        vm.indie = 0;
        console.time("spin interval");

        this.initAnimationParams(this.Animate);
    }

    //STOP Sequence
    this.StopSpinImmediate = function () {
        var self = this;
        
         for (var i = 0; i < this.reelItems.length; i++) {
            //get nth reel from array
            var reel = this.reelItems[i];
            reel.StopSpin(); 
         }
         this.stopInterval = 0;
    }

    this.StopSpins = function (async) {
        debug("async:" + async);

        vm.IS_STOP_ENTERED = true;
        if (async == true) {
            this.stopInterval = 1;
        }

        this.isStopping = true;
        return;

        /*
        //.timeEnd("spin interval");
        var interval = (async) ? 0 : 300;
        vm.IS_STOP_ENTERED = true;

        //iterate through reels array
        var self = this;
        for (var i = 0; i < this.reelItems.length; i++) {

            //get nth reel from array
            var reel = this.reelItems[i];

            if (i == this.reelItems.length - 1) {
                //
            }

            debug("sending stop with spin id..." + this.spinId);
            reel.StopSpin((i * (interval + 10)));
        }

        //dlog("cancelling animation..");
        vm.TickCounter = 0;*/
    }

    this.Animate = function () {
        this.updateAnimation();

        if (vm.IS_ANIM_STOPPED) {
            cancelAnimationFrame(vm.globalID);
            return;
        }

        if (this.isCancelFrame) {
            return;
        } else {
            vm.globalID = requestAnimationFrame(this.Animate);
        }
    }

    this.stopCurrentReel = function () {
        //debug("stopping..." + this.stopTimer);
        var currentReel = this.reelItems[this.CurrentReelId];

        if (this.CurrentReelId < 5) {
            currentReel.StopSpin();
            this.CurrentReelId++;
        }

        //debug("Current Reel: " + this.CurrentReelId);
    }

    this.updateAnimation = function () {
        if (this.isStopping) {
            this.stopTimer++;

            if ((this.stopTimer % this.stopInterval) == 0) {
                this.stopCurrentReel();
            }
        }

        //$("#indicator2").text(" fr: " + vm.globalID + "");
        if (vm.IS_WAITING) {
            return;
        } else {

            var allReelsCompleted = []; //isSpinComplete

            for (var i = 0; i < this.reelItems.length; i++) {
                var reelController = this.reelItems[i];
                allReelsCompleted[allReelsCompleted.length] = reelController.isSpinComplete;
                reelController.AnimateReel(this.spinId);
            }

            //debug(allReelsCompleted.toString());
            if (allReelsCompleted.indexOf(false) == -1) {
                //debug("all reels stopped spinning....");
                var notification = new Notification(Constants.$_REEL_ANIMATIONS_COMPLETE, {
                    action: Constants.$_ALL_REELS_FROZEN,
                    reelData: {},
                }, Constants.$_SLOT_ENGINE_NOTIFICATION);

                broadcaster.Notify(notification);
            }


            if (delegate != null) delegate.onAnimationUpdate();
        }
    }


    //INIT FINAL
    this.InitFinalSpinners = function (reelData) {
        $(".finalImage").remove();
        var itemNum = 5;
        for (var i = 0; i < this.reelItems.length; i++) {
            var canvas = self.canvasArr[i];
            var nuCtx = canvas.getContext('2d');
            var size = { w: this.itemh, h: this.itemh * itemNum, length: itemNum };
            var delay = i * 50;
            $.finalizer.CreateSpriteCanvas(this.reelItems[i], nuCtx, $.finalImageData, reelData.sprite, reelData.reels[i], size, delay);
        }

        return;
    }


    //init reels
    this.InitSpinners = function (reelData) {
        var start = new Date().getTime();
        var index = 0;

        while (this.reelItems.length < 5) {
            var reelController = new ReelController(this);
            reelController.id = "reel_" + index;
            broadcaster.AddObserver(reelController);
            this.reelItems[this.reelItems.length] = reelController;
            var reelItemData = {
                reelItems: reelData.reels[index],
                sprite: reelData.sprite,
                canvas: this.canvasArr[index]
            };

            reelController.InitReel(reelItemData);
            if (index == 4) reelController.lastItem = true;

            index++;
        }

        var end = new Date().getTime();
        dlog("total time:" + (end - start));
        var observers = broadcaster.GetObservers();

    };

    this.UpdateSpinners = function (reelData) {
        var start = new Date().getTime();
        var index = 0;

        for (var i = 0; i < this.reelItems.length; i++) {
            var reelController = this.reelItems[i];
            var reelItemData = {
                reelItems: reelData.reels[index],
                sprite: reelData.sprite,
                canvas: this.canvasArr[index]
            };

            reelController.updateReel(reelItemData);
            index++;
        }
        return;
    };
});
