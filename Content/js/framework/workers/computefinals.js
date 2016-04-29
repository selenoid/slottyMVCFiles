self.addEventListener('message', function (e) {

    var dp = e.data;
    //dp.reelData, dp.imgData, dp.nuImageData

    var sourceL = 0;

    function getNuData() {

        for (var i = 0; i < 4; i++) {
            var offsetY = dp.reelData[i].id;
            var offset = (dp.itemH * offsetY) * (4 * dp.itemH);
            var start = offset;
            var end = start + ((dp.itemH * 1) * (4 * dp.itemH));

            for (var n = start; n < end; n++) {
                dp.nuImageData.data[sourceL] = dp.imgData.data[n];
                sourceL++;
            }
        }

        var retval = {
            imageData: dp.nuImageData, itemId: dp.reelItemId
        }

        return retval;
    }

    self.postMessage(getNuData());

}, false);