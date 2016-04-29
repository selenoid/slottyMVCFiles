/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var ReelGenerator = function () {

    this.timer = 5;
    this.reels = [];
    this.self = this;
    this.delegate = null;
    this.decoratedReels = [
        /*[0, 0, 4, 1, 5, 0, 3, 7, 2, 2, 6, 3, 2, 0, 0, 2, 3, 0],
        [7, 0, 0, 1, 6, 6, 3, 6, 2, 2, 0, 2, 4, 7, 3, 6, 3, 7],
        [6, 7, 5, 2, 7, 7, 0, 2, 4, 0, 2, 2, 7, 7, 2, 1, 4, 3],
        [4, 1, 4, 7, 7, 0, 7, 0, 2, 4, 5, 6, 6, 6, 4, 3, 3, 0],
        [7, 4, 7, 4, 1, 3, 0, 0, 6, 6, 0, 7, 6, 3, 2, 2, 5, 7]*/
        [0, 0, 4, 1, 5, 0, 3, 2, 7, 2, 2, 6, 3, 2, 0, 0, 6, 4, 4, 2, 2, 3, 3, 0],
        [7, 0, 0, 0, 1, 6, 6, 3, 6, 4, 2, 2, 0, 2, 4, 7, 3, 2, 4, 6, 6, 6, 3, 7],
        [6, 7, 5, 2, 7, 7, 0, 2, 4, 0, 2, 2, 7, 7, 2, 4, 1, 0, 6, 3, 7, 4, 7, 3],
        [4, 3, 1, 4, 7, 7, 0, 7, 0, 2, 4, 6, 3, 4, 6, 5, 0, 6, 6, 6, 4, 3, 3, 0],
        [7, 4, 7, 4, 2, 1, 3, 0, 0, 2, 6, 4, 7, 2, 6, 6, 0, 7, 6, 3, 2, 2, 5, 7]
    ];

    this.GenerateReels = function (reelNum, iconNum, scatterId, specialId) {
        var counter = 0;
        info('Working...');
        var reel = [];
        var self = this;
        var callback = function () {
            counter++;
            var rand = self.getRandomNum(8);
            if (((rand === scatterId || rand === specialId) === true) && ((reel.indexOf(scatterId) > -1) || (reel.indexOf(specialId) > -1) === true)) {
                log("skipping..." + rand);
            }
            else {
                reel[reel.length] = rand;
            }

            if (reel.length < iconNum) {
                setTimeout(callback, self.timer);
            } else {
                //console.debug(reel);
                self.reels[self.reels.length] = reel;
                if (self.reels.length < reelNum) {
                    reel = [];

                    setTimeout(callback, self.timer);
                }
                else {
                    debug("loops:" + counter);
                    self.delegate.apply(self, [self.reels]);
                    //return self.reels;
                }
            }
        };

        setTimeout(callback, this.timer);
    };

    this.setDelegate = function ($delegate) {
        this.delegate = $delegate;
    };

    this.getRandomNum = function (maxnum) {
        return (Math.floor(Math.random() * maxnum));
    };

    this.GetReels = function () {
        var decorated = this.decoratedReels;
        this.delegate.apply(this, [decorated]);
        //this.delegate.apply(this, [this.decoratedReels];
    };

    this.GetFinalReels = function () {
        var final = this.decoratedReels;
        this.delegate.apply(this, [[]]);
    }

    this.computeBet = function ($reels, rows) {
        var self = this;
        var resultArr = [];
        
        for (var n = 0; n < rows; n++) {
            var randomNumArr = [];
            for (var i = 0; i < $reels.length; i++) {
                var rand = self.getRandomNum($reels[0].length);
                var selected = $reels[n][rand];
                debug('rand:' + rand + " => " + selected);
                randomNumArr[randomNumArr.length] = selected;
            }
            resultArr[resultArr.length] = randomNumArr;
        }
        this.delegate.apply(this,[resultArr]);

    };
};