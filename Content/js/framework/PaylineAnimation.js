/* PaylineAnimation.js*/
var PaylineAnimation = BaseController.extend(function () {

    this.animSprite = null;
    this.pos = null;
    this.canvas = null;
    this.ctx = null;
    this.canvas = null;
    this.ctx = null;
    this.clipArr = null;
    this.level = null;

    this.constructor = function (type, index, animSprite, pos, clipArr) {

        this.id = "paylineAnimation: "+type+"-"+index;
        this.self = this;

        this.animSprite = animSprite;
        this.pos = pos;
        this.clipArr = clipArr;
        //this.level = level;

        var canvasId = "#animcanvas" + (index+1);

        this.canvas = $(canvasId)[0];//.animate({ opacity: '0' });
        this.ctx = this.canvas.getContext('2d');
    };

    this.updateAnimation = function (animFrame) {
        var clip = this.clipArr[animFrame % 16];
        var cx = clip.x;
        var cy = clip.y
        var ypos = this.pos.y;

        /*if (this.level > 0) {
            var ypos = ((this.level-1) * this.pos.h) + this.pos.y;
        }*/
       
        this.ctx.drawImage(this.animSprite, clip.x, clip.y, 256, 256, this.pos.x, ypos, this.pos.w, this.pos.h);
    }

    this.clearCanvas = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
});
