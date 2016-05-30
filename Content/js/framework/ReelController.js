/*ReelController test branch*/
var ReelController = BaseController.extend(function () {

    this.reelItems = null;
    this.parentController = null;
    this.canvasArr = [];
    this.canvas = null;
    this.reelAssets = [];
    this.reelItemData = null;
    this.finalReelItemData = null;
    this.id = "";
    this.canvas = null;
    this.sprites = null;
    this.ctx = null;
    this.yoffset = 0;
    this.stagedIconNum = 3;
    this.fullIconNum = 0;
    this.posy = 0;
    this.iconNum = this.stagedIconNum;
    this.self = null;
    this.reelAnimationBitmapCanvas = null;
    this.reelAnimBitmap = null;
    this.reelFinalAnimBitmap = null;
    this.reelBitmap = null;
    this.reelFinalBitmap = null;
    this.isStopped = false;
    this.lastItem = false;
    this.isFastStopped = false;


    //initing SlotEngine
    this.constructor = function (_parentController) {
        this.vm = new GameModel();
        this.id = "reel";
        this.parentController = _parentController;
        this.fullIconNum = vm.FullIconNum;
        this.self = this;
        this.reelFinalBitmap = new Image();             // reel bitmap image -to be used as a source for actual context in actual canvas-
        this.reelFinalBitmap.setAttribute("class", "finalImage");
    };

    this.ResetReel = function () {
        this.isStopped = false;
        this.isSpinComplete = false;
        this.posy = 0;
        this.isStopInited = false;
        this.isFastStopped = false;
        this.Timer = null;
    }

    this.InitReel = function (reelItemData) {
        this.UpdateReel(reelItemData);
    };

    this.InitFinalReel = function (finalBitmap) {
        this.UpdateReelFinal(finalBitmap);
    }


    this.onNotification = function (notification) {
        switch (notification.message) {
            case Constants.$_SERVER_RESPONSE:
                //
                break;
            case Constants.$_REEL_COMMAND: u
                dlog(this.id + " [processing  notification] " + notification.message);
                break;
            default:
                //dlog("[notification] | no action mapped..." + this.id);
                break;
        }
    }

    //UPDATE REEL
    this.UpdateReel = function (_reelItemData) {
        this.reelItemData = _reelItemData

        this.canvas = this.reelItemData.canvas;                         // get actual canvas
        this.ctx = this.canvas.getContext('2d');                        // get actual context to draw
        this.reelBitmap = new Image();                                  // reel bitmap image -to be used as a source for actual context in actual canvas-

        var reelBitmapCanvas = null;                                    // create primary / pseudo base image canvas
        var iconNum = this.fullIconNum;                                 // number of items to be drawn at once or per cycle
        var reelBitmapCanvas = this.GetBaseReelImage(this.reelItemData, iconNum); //get in-memory roller image canvas.

        var orgY = (-1 * vm.itemH) * iconNum;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        var self = this;

        this.reelBitmap.src = reelBitmapCanvas.toDataURL("image/png");  //set rollerImageCanvas as a source for roller image element .
        this.reelBitmap.addEventListener("load", function (img) {
            self.ctx.drawImage(self.reelBitmap, 0, 0); //draw initial roller image to canvas.
        });

        if (this.id == 'reel_4') {

            var notification = new Notification(Constants.$_GAME_INITED, {
                action: Constants.$_DISPLAY_GAME,
                data: {},
            }, Constants.$_REEL_CONTROLLER_NOTIFICATION);

            broadcaster.Notify(notification);
        }
    }

    this.itemArr = [6, 6, 2, 2, 5, 0, 0, 0, 5, 5, 5, 7, 7, 6, 6, 6, 3, 3, 3, 0, 2, 2, 2, 0, 0, 1, 4, 4, 0, 0, 0, 5, 5, 5, 6, 6, 6, 3, 3, 4, 4, 2, 2, 1, 1, 5, 5, 5, 6, 6, 6, 4, 4, 0, 0, 0, 0, 4, 3, 3, 3, 6, 6, 6, 7, 7, 7, 3, 3, 3, 4, 4, 4, 6, 6, 2, 2, ];
    this.org = (this.itemArr.length - 3) * -110;
    this.inc = 40;
    this.xpos = 0;
    this.ypos = 40;
    this.posCounter = 0;
    this.isStopInited = false;
    this.posy = (this.itemArr.length - 3) * -110;
    this.arrPos = [-55, -71, -82, -90.11, -96.831, -101.53, -104.36, -106.49, -107.99, -108.80, -109.32, -109.66, -109.85, -109.93, -109.97, -109.99, -109.99, -109.992, -109.99, -109.99, -110];
    this.isSpinComplete = false;
    this.currentSpinId;
    this.canStop = true;

    this.StopSpin = function () {
        this.isStopped = true;
    }

    /*this.StopSpin = function (delay) {
        var that = this;
        this.timer = doTimer(delay, 100, null, function () {
            debug("doTimer worked : " + that.currentSpinId);
            that.isStopped = true;
        });
    }*/

    this.cut = function (param) {
        if (this.id = "reel_0") {
            debug(">" + param.toString());
        }
    }

    /*HARD-CORE CANVAS ANIMATION*/
    this.AnimateReel = function (spinId) {

        this.currentSpinId = spinId;
        if (this.isSpinComplete) return;

        if (this.isStopped == true) {

            if (!this.isStopInited) {
                this.isStopInited = true;
                this.posCounter = 0;
            }
            else {
                //
            }

            if (this.posCounter < this.arrPos.length - 1) {
                this.posCounter++;
                this.ypos = this.arrPos[this.posCounter];

                if (this.id == "reel_4") {
                    // debug(this.isStopped + ", stop: pos:" + this.posCounter);
                }
            }
            else {
                this.isSpinComplete = true;
                if (this.id == "reel_4") {
                   // debug("last item fires..." + this.posCounter);
                }
            }

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(this.reelFinalBitmap, 0, 0, 110, 110 * 4, this.xpos, this.ypos, 110, 110 * 4);
        }
        else {

            this.posy += this.inc;

            if (this.id == "reel_4") {
                //debug(">>>>>>>>>" + this.isStopped + ", run: posy:" + this.posy);
            }

            if (this.posy > -1650) {
                this.posy = this.org;
            }

            if (this.reelAnimBitmap == null) {
                this.reelAnimBitmap = this.reelBitmap;
            }

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            for (var i = 0; i < this.itemArr.length; i++) {
                var n = this.itemArr[i];
                this.ctx.drawImage(this.reelAnimBitmap, 0, n * 110, 110, 110, this.xpos, (i * 110) + this.posy, 110, 110);
            }
        }
    }


    // get roller base img
    this.GetBaseReelImage = function (reelData, iconNum) {

        this.yoffset = 0;
        var _sprites = reelData.sprite;       //get sprite data from rollerdata.

        var reelItems = reelData.reelItems;    //items of sprite data to be drawn on the roll image.

        var canvasCache = document.createElement('canvas'); //create in-memory cache canvas for copying.
        var cacheCtx; //get canvas context 

        canvasCache.setAttribute('width', vm.itemH);
        canvasCache.setAttribute('height', (vm.itemH * iconNum));
        cacheCtx = canvasCache.getContext('2d');
        cacheCtx.clearRect(0, 0, canvasCache.width, canvasCache.height);

        for (var i = 0; i < iconNum; i++) {
            var rItem = reelItems[i];
            cacheCtx.drawImage(_sprites, rItem.x, rItem.y, rItem.w, 110, 0, this.yoffset, rItem.w, 110);
            this.yoffset += vm.itemH;
        }
        return canvasCache;
    };

});
