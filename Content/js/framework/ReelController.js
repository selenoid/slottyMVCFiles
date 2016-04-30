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
    this.slotData = null;
    this.reelBase = null;
    this.canvas = null;
    this.sprites = null;
    this.ctx = null;
    //this.itemh = 110;
    this.yoffset = 0;
    this.stagedIconNum = 3;
    this.fullIconNum = 0;
    this.container = null;
    this.counter = 0;
    this.iconNum = this.stagedIconNum;
    this.self = null;
    this.reelAnimationBitmapCanvas = null;
    this.reelAnimBitmap = null;
    this.reelFinalAnimBitmap = null;
    this.animIncOrg = 0.25;
    this.animInc = this.animIncOrg;
    this.animOffsety = this.orgY;
    this.reelBitmap = null;
    this.reelFinalBitmap = null;
    this.Stopped = false;
    this.stopDelay = 0;


    this.dest = 0;
    this.curP = null;
    this.spinAnimOrgY = 0; // ((this.itemh* (this.fullIconNum)) - (3 * this.itemh) ) ;
    this.spinAnimOffset = this.spinAnimOrgY;
    this.animIncFinal = 0;
    this.finalPos = null;
    this.isBouncing = false;
    this.lastItem = false;

    this.finalCounter = 12;
    this.xOffset = 0;
    this.finalOffset = 0;
    this.finalClearOffset = 0;


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

    $.testReels = function (val, inc) {
        console.clear();
        slotEngine.reelItems[0].TestAnimateReel(val, inc);
    }

    this.stopCounter = -10;

    this.ResetReel = function () {
        this.animInc = this.animIncOrg;
        this.curP = null;
        this.Stopped = false;
        this.stopCounter = -10;
        this.isBouncing = false;
        this.finalPos = 0;
        this.finalCounter = 12;
        this.xOffset = 0;
        this.finalOffset = 0;
        this.finalClearOffset = 0;
    }

    this.InitReel = function (reelItemData) {
        this.UpdateReel(reelItemData);
    };

    this.InitFinalReel = function (finalBitmap) {
        this.UpdateReelFinal(finalBitmap);
    }

    /*this.InitFinalReel = function (finalReelData) {
        this.UpdateReelFinal(finalReelData);
    }*/

    this.onNotification = function (notification) {
        switch (notification.message) {
            case Constants.$_SERVER_RESPONSE:
                //
                break;
            case Constants.$_REEL_COMMAND:u
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

        //this.ctx.drawImage(reelBitmapCanvas, 0, 0); //draw initial roller image to canvas.
      
        var self = this;

        this.reelBitmap.src = reelBitmapCanvas.toDataURL("image/png");  //set rollerImageCanvas as a source for roller image element .
        this.reelBitmap.addEventListener("load", function (img) {
            self.ctx.drawImage(self.reelBitmap, 0, 0); //draw initial roller image to canvas.
        });
        
        this.container = $(this.canvas).parent();
    }

    this.UpdateReelFinal= function (finalBitmap) {

        dlog("updating final bitmap : " + finalBitmap);
        debugger
        this.reelFinalBitmap = new Image();             // reel bitmap image -to be used as a source for actual context in actual canvas-
        this.reelFinalBitmap.setAttribute("class", "finalImage");
    }



    this.StopSpin = function (delay) {
        this.stopDelay = delay;
        var that = this;

        doTimer(delay, 100, null, function () {
            that.Stopped = true;
        });
    }

    /*HARD-CORE CANVAS ANIMATION*/
    this.AnimateReel = function (inc) {
        if (this.isBouncing) {
            //debug('.');
            return;
        }

        if (this.reelAnimBitmap == null) {
            this.reelAnimBitmap = this.reelBitmap;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.animInc = this.animIncOrg;
        this.counter = inc;

        this.spinAnimOffset = (vm.itemH * (this.animInc * this.counter));
        this.ctx.drawImage(this.reelAnimBitmap, 0, this.spinAnimOffset, this.reelAnimBitmap.width, this.vm.itemH * 3, 0, 0, this.reelAnimBitmap.width, this.vm.itemH * 3);


        if (this.Stopped) {
            this.ctx.clearRect(0, 0, this.canvas.width, (this.vm.itemH * (this.animInc * this.finalClearOffset)));
            this.finalClearOffset += 1;
            var top = (this.reelFinalBitmap.height - (this.vm.itemH * (this.animInc * this.finalClearOffset)));

            var bottom = (this.vm.itemH * (this.animInc * (this.finalClearOffset * -1)));
            var height = top;
      
            this.ctx.drawImage(this.reelFinalBitmap, 0, height, this.reelFinalBitmap.width, this.vm.itemH * 3, 0, 0, this.reelFinalBitmap.width, this.vm.itemH * 3);
        }
        else {
            //this.finalCounterHeader = inc;
        }

        this.xOffset = this.spinAnimOffset;

        var self = this;

        if (this.Stopped) {
            if (this.stopCounter === -10) {
                self.extraTick = self.counter % 4;
                self.stopCounter = 12 + self.extraTick;
            }
            else {
                if (this.stopCounter > -1) {
                    this.stopCounter--;
                }
                else {
                    self.isBouncing = true;
                    self.bounceAnimationStart();
                }
            }
        }
        else {
            //
        }

        $("#tf" + this.id).text(this.counter + ", " + (this.counter % 4));
    }

    this.getGrooved = function (pos) {
        var grd = 0;
        var nuposdif = pos % this.vm.itemH;
        //debug("diff:" + nuposdif);
        grd = (pos - nuposdif) + (1 * this.vm.itemH);
        return grd;
    }

    this.bounceAnimationStart = function () {

        var self = this;
        var animNode = $("<div class='animNode'></div>");
        this.finalPos = this.getGrooved(this.spinAnimOffset); +(this.vm.itemH * (this.animInc * (0.5)));


        $(animNode).css({ top: -15 });
        $(animNode).animate({ top: 0 }, {
            easing: "easeOutExpo",
            duration: 250,
            start: function () {

            },
            step: function (val) {
                self.updateBounce(val);
            },
            complete: function () {
                self.parentController.onBounceComplete(self);
            }
        });
    }
    this.top = 0;
    this.updateBounce = function (val) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.reelFinalBitmap, 0, val, this.reelFinalBitmap.width, vm.itemH * 3, 0, 0, this.reelFinalBitmap.width, vm.itemH * 3);
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

        var xoffset = 0;
        
        for (var i = 0; i < iconNum; i++) {
            var rItem = reelItems[i];
            cacheCtx.drawImage(_sprites, rItem.x, rItem.y, rItem.w, 110, 0, this.yoffset, rItem.w, 110);
            this.yoffset += vm.itemH;
        }
        return canvasCache;
    };
});