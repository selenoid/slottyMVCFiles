//Create Finalizer by extending Class.
var Finalizer = Class.extend(function () {

    this.id = "finalizer";
    this.date = new Date();
    //this.itemh = 110;
    this.counter = 0;
    this.workers = [];
    this.worker = null;
    this.ctxArr = [];

    //Classes can have constructors
    this.constructor = function () {
        //console.log(this.id + " inited...");
        //createWorkers();

        this.worker = new Worker('../Content/js/framework/workers/computefinals.js');
    };

    //WORKER SESSION..
    function processData(icons, orgImgData, nuImgData) {

        //dlog("[start processing ]" + date.getTime());

        var sourceL = 0;
        for (var i = 0; i < icons.length; i++) {
            var offsetY = icons[i].id;
            var offset = (vm.itemH * offsetY) * (4 * vm.itemH);
            var start = offset;
            var end = start + ((vm.itemH * 1) * (4 * vm.itemH));

            for (var n = start; n < end; n++) {
                nuImgData.data[sourceL] = orgImgData.data[n];
                sourceL++;
            }
        }

        //dlog("[return processing ]" + date.getTime());

        return nuImgData;
    }


    //CREATE FINAL SPRITES
    this.CreateSpriteCanvas = function (reelItem, daCtx, imgData, daSprites, reelData, size, delay) {
        var self = this;

        doTimer(delay, 20, null, function () {
            var tempCanvas = document.createElement('canvas');
            var _ctx = tempCanvas.getContext('2d');
            self.ctxArr.push(_ctx);

            tempCanvas.setAttribute("id", "_canvas" + self.counter);
            tempCanvas.setAttribute("width", size.w);
            tempCanvas.setAttribute("height", size.h);

            //cache canvas variables
            var cw = 110
            //blank reel image for final cut
            var nuImageData = daCtx.createImageData(cw, vm.itemH * size.length);

            //worker.postMessage('Hello World'); // Send data to our worker.
            var wo = {
                reelItemId: reelItem.id,
                reelData: reelData,
                imgData: imgData,
                nuImageData: nuImageData,
                itemH: vm.itemH
            }

            //call processed data via workers
            var processedData = processData(reelData, imgData, nuImageData);

            _ctx.putImageData(processedData, 0, 0);
            reelItem.reelFinalBitmap.src = tempCanvas.toDataURL("image/png");

            //$("#imagesHolder").append(reelItem.reelFinalBitmap);

            if (self.counter == 5) {
                console.timeEnd('sequence');
            }

            self.counter++;
        });


    };

});