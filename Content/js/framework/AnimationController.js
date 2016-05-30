/*AnimationController.js*/
var AnimationController = BaseController.extend(function () {

    this.canvas = null;
    this.ctx = null;
    this.img = null;
    this.tick = 0;
    this.animFrame = 0;
    this.animFrameReq = null;
    this.viewModel = null;
    this.animationCluster = [];
    this.tick = 0;
    this.halted = false;
    this.endAnimStarted = false;
    this.isAnimEnded = true;
    this.payLineImages = [];
    this.paylineImageId = 0;
    this.imageCounter = 0;
    this.payPath = "";

    var globalAnimId;

    $.halt = function () {
        debug("halt:" + this);
        $.animatik.stop();
    }

    this.stop = function () {
        this.animFrame = 1600;
        return (this.id + " is Stopped!.");
        //debug("isHalted:" + this.animFrame);
    }

    this.constructor = function () {
        this.id = "anima";
        this.viewModel = new GameModel();
        $.animatik = this;
    };

    this.animFrame = 0;

    this.onNotification = function (notification) {
        switch (notification.message) {

            case Constants.$_START_ANIMATION:
                var animCode = notification.notificationData.data.animCode;
                if (notification.notificationData.action == Constants.$_START_WIN_ANIMATION) {
                    this.processAnimationSequence(animCode); //START PAYLINE ANIMATION
                }
                break;
            default:
                //dlog("[notification] | no action mapped..." + this.id);
                break;
        }
    }

    //PROCESS SERVER SENT RESULT CODE FOR ANIMATION
    this.processAnimationSequence = function (animCode) {
        debug("Process Animation Sequence...");
        this.animationCluster = [];
        this.payLineImages = [];

        $("#paylineImg").attr("src", "");

        var paylineModels = animCode.PayLineModels;
        var clipArr = this.viewModel.animCoords;

        //check for every payline hit...
        for (var k = 0; k < paylineModels.length; k++) {
            var posArr = [];
            var _payline = animCode.PayLineModels[k].Line;
            //modify payline Id.
            if (_payline == 6) {
                _payline = 4;
            } else if (_payline == 7) {
                _payline = 5;
            }


            //var pArr = [];
            this.payPath = "";
            var paylinemaskId = "";

            var icons = animCode.PayLineModels[k].Icons;

            if (_payline == 99) {

                this.payPath = Constants.$_DIR.Payline + "scatter.png";
                this.payLineImages[this.payLineImages.length] = "";
                var posCoords = icons
                for (var n = 0; n < posCoords.length; n++) {
                    var pos = {
                        x: 0,
                        y: parseInt(posCoords[n]) * 110,
                        w: 110,
                        h: 110
                    }

                    var img = new Image();

                    img.setAttribute('src', this.payPath);
                    img.setAttribute("id", 'scatter_' + n);
                    img.setAttribute("class", "scatter-img");


                    var idtag = "animcanvas" + (n + 1);
                    $("#" + idtag).parent().append(img);

                    var finalPosy = (pos.y > 120) ? 218 : pos.y;
                    $("#scatter_" + n).css({ top: finalPosy });

                    if (finalPosy < 0) {
                        $("#scatter_" + n).remove();
                    }

                    posArr.push(pos);
                }

                $("#pin").css({ top: 0 });
                $(".scatter-img").css("display", "none");
            }
            else {

                posArr = this.viewModel.getPosArrPayline(_payline);
                paylinemaskId = "payline" + _payline + "" + icons.length + "";
                this.payPath = Constants.$_DIR.Payline + paylinemaskId + ".png";
                this.payLineImages[this.payLineImages.length] = this.payPath;

                var posy = 110 * (_payline - 1);
                var finalPosy = (posy > 120) ? 217 : posy;
            }

            for (var i = 0; i < icons.length; i++) {
                var iconId = icons[i];
                if (iconId > -1) {
                    if (_payline == 99) iconId = vm.ScatterId;
                    var animSprite = this.viewModel.animAssets["anim" + iconId];
                    var paylineAnimation = new PaylineAnimation(paylinemaskId, i, animSprite, posArr[i], clipArr);
                    this.animationCluster[this.animationCluster.length] = paylineAnimation;
                }
            }

            this.StartAnimation();
        }
    }

    this.StartAnimation = function () {
        debug("start animation...");
        if (this.isAnimEnded == false) return;
        debug("Animation started..");
        this.paylineImageId = 0;
        this.isAnimEnded = false;
        animFrame = 0;

        $("#pin").fadeIn();
        $(".scatter-img").fadeIn();

        $(".scatter-img").animate({ opacity: '1' }, {
            complete: function () {
                //
            }
        });

        $("canvas[id*='anim']").animate({ opacity: '1' }, {
            complete: function () {
                //
            }
        });

        this.isAnimationg = true;
        this.updatePaylineImage();
        this.animFrame = 0;
        globalAnimId = requestAnimationFrame(this.updateAnimation);
    }

    this.clearAnimations = function () {

    }

    this.updatePaylineImage = function () {
        debug("Update payline image..");
        this.paylineImagePath = this.payLineImages[this.paylineImageId % this.payLineImages.length];

        if (this.paylineImagePath.length == 0) {
            $(".scatter-img").css("display", "block");
        }
        else {
            $(".scatter-img").css("display", "none");
        }

        $("#paylineImg").attr("src", this.paylineImagePath);
        this.paylineImageId++;
        this.imageCounter = 0;
    }

    this.updateAnimation = function () {

        this.tick++;
        var opacity = 1 - ((this.imageCounter % 40) > 20 ? 0.3 : 0);
        this.imageCounter++;

        if (this.imageCounter > 100) {
            this.updatePaylineImage()
        }

        $("#pin").css("opacity", opacity);
        $(".scatter-img").css("opacity", opacity);

        if (this.tick % 3 == 0) {
            this.animFrame++;
            for (var a = 0; a < this.animationCluster.length; a++) {
                var itemAnim = this.animationCluster[a];
                itemAnim.updateAnimation(this.animFrame);
            }
        }

        if (this.animFrame > (16 * 5)) {
            if (this.endAnimStarted == false) {
                dlog("endAnimStarted..");
                this.endAnimStarted = true;
                this.stopPaylineAnimations();
            }
            else {

            }
        }
        else {
            //
        }

        if (this.isAnimEnded) {
            this.endAnimStarted = false;
            this.closeBetSession();
            return;
        }

        globalAnimId = requestAnimationFrame(this.updateAnimation);
    }

    this.hideAnimationItems = function () {
        var self = this;
        $("#pin").fadeOut();
        $(".scatter-img").animate({ opacity: 0 }, {
            complete: function () {
                $(this).remove();
                self.animationCluster = [];
            }
        });

        $("canvas[id*='anim']").animate({ opacity: '0' }, {
            step: function () {
                //self.updateAnimation();
            },
            complete: function () {
                if (self.isAnimEnded == false) {
                    self.clearCanvas();
                    self.isAnimEnded = true;
                    self.animationCluster = [];
                }
            }
        });
    }

    this.clearCanvas = function () {
        var canvasArr = $(".cItemOver");

        for (var c = 0; c < canvasArr.length; c++) {
            var curCanvas = canvasArr[c];
            var ctx = curCanvas.getContext("2d");
            ctx.clearRect(0, 0, curCanvas.width, curCanvas.height);
        }

        /*for (var a = 0; a < this.animationCluster.length; a++) {
            var itemAnim = this.animationCluster[a];
            itemAnim.clearCanvas();
        }*/
    }

    this.stopPaylineAnimations = function () {
        dlog("closing animation started...");
        this.hideAnimationItems();
        return;
    }

    this.closeBetSession = function () {
        debug("close bet session...");

        var notification = new Notification(Constants.$_ALL_ANIMATIONS_COMPLETE, {
            action: Constants.$_PAYLINE_ANIMATION_COMPLETE,
            data: {},
        }, Constants.$_ANIMATION_CONTROLLER_NOTIFICATION);

        broadcaster.Notify(notification);
    }


    /*
    $("#start").on("click", function () {
        globalAnimId = requestAnimationFrame(this.updateAnimation);
    });

    $("#stop").on("click", function () {
        cancelAnimationFrame(globalAnimId);
    });
    */

});
