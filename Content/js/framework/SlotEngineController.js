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
    $.finalImageData = null;


    this.onBounceComplete = function (item) {
        if (item.lastItem) {
            
            var notification = new Notification(Constants.$_ANIMATION_COMPLETE, {
                action: Constants.$_ALL_REELS_FROZEN,
                reelData: {},
            }, Constants.$_SLOT_ENGINE_NOTIFICATION);

            broadcaster.Notify(notification);
        }
    }

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

        //create reel sprites for icon templates
        for (var i = 0; i < 8; i++) {
            cacheCtx.drawImage($.vSprites, 0, this.itemh * i, cw, this.itemh, 0, this.itemh * i, cw, this.itemh);
        }

        //set  final base imagedata 
        final = cacheCtx.getImageData(0, 0, cw, ch);
        var holder = cacheCtx.canvas;


        $.finalImageData = cacheCtx.getImageData(0, 0, cw, ch);
    }

    this.constructor = function () {
        this.createFinalBaseCanvas();
        $.finalizer = new Finalizer();
        this.id = "slotEngine";
        self = this;
        this.inc = 96;
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
    }

    function initAnimationParams(callback) {
        // $("#indicator2").text(" frames: " + vm.globalID + "");
        self.ResetReels();
        vm.TickCounter = 0;
        callback.call();
        vm.Timer = 0;
        $("#timer").text(vm.Timer);
        this.inc = 96;
    }

    this.onNotification = function (notification) {
        var that = this;
        switch (notification.message) {
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

        initAnimationParams(this.Animate);
    }

    //STOP Sequence

    this.StopSpin = function (async) {

        var interval = (async) ? 0 : 200;
        vm.IS_STOP_ENTERED = true;

        //iterate through reels array
        var self = this;
        for (var i = 0; i < this.reelItems.length; i++) {

            //get nth reel from array
            var reel = this.reelItems[i];

            if (i == this.reelItems.length - 1) {
                //check if the reel is the last one in the array, add callback on stopping animation complete if so.
                //reel.StopSpin(i * 300);
            }

            reel.StopSpin(i * interval);
        }

        //dlog("cancelling animation..");
        vm.TickCounter = 0;
    }

    this.Animate = function () {
        if (vm.globalID % 1 == 0) {
            this.updateAnimation();
        }

        if (vm.IS_ANIM_STOPPED) {
            cancelAnimationFrame(vm.globalID);
            return;
        }

        vm.globalID = requestAnimationFrame(this.Animate);
    }

    this.updateAnimation = function () {

        $("#indicator2").text(" frames: " + vm.globalID + "");
        if (vm.IS_WAITING) return;

        this.inc--;

        if (this.inc < 0) {
            this.inc = 96;
        }

        for (var i = 0; i < this.reelItems.length; i++) {
            var reelController = this.reelItems[i];
            reelController.AnimateReel(this.inc);
        }

        if (delegate != null) delegate.onAnimationUpdate();
    }


    //INIT FINAL
    this.InitFinalSpinners = function (reelData) {
        for (var i = 0; i < this.reelItems.length; i++) {

            var canvas = self.canvasArr[i];
            var nuCtx = canvas.getContext('2d');
            var size = { w: this.itemh, h: this.itemh * 4 };
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