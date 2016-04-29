/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


// get random spinner roller items for spin animation
function getDecoratedItems() {

    var retval = {};
    var rolls = [];
    var totalIconsInSpin = 8;
    var totalRollNum = 5;

    var itemsBoxEl0 = [0, 0, 0, 0, 0];
    var itemsBoxEl1 = [1];
    var itemsBoxEl2 = [2, 2, 2, 2, 2];
    var itemsBoxEl3 = [3, 3, 3, 3, 3];
    var itemsBoxEl4 = [4, 4, 4, 4];
    var itemsBoxEl5 = [5];
    var itemsBoxEl6 = [6, 6, 6, 6];
    var itemsBoxEl7 = [7, 7, 7];

    var itemBox = itemsBoxEl0.concat(itemsBoxEl1).concat(itemsBoxEl2).concat(itemsBoxEl3).concat(itemsBoxEl4).concat(itemsBoxEl5).concat(itemsBoxEl6).concat(itemsBoxEl7);

    function getRandomNumber() {
        return itemBox[(Math.floor(Math.random() * itemBox.length))];
    }

    function getRoll() {
        var nuRoll = [];
        function checkRoll() {
            if ((nuRoll.indexOf(1) > -1) || (nuRoll.indexOf(5) > -1)) {
                return 0
            } else {
                return 1;
            }
        }

        function getNewRandom() {
            addElement();
        }

        function addElement() {
            var rnum = getRandomNumber();
            if (rnum == 5 || rnum == 1) {
                if (checkRoll() > 0) {
                    nuRoll[nuRoll.length] = rnum;
                } else {
                    getNewRandom();
                }
            } else {
                nuRoll[nuRoll.length] = rnum;
            }
        }

        for (var n = 0; n < totalIconsInSpin; n++) {
            addElement();
        }

        return nuRoll;
    }

    var rollersString = "";

    for (var j = 0; j < totalRollNum; j++) {
        rollersString += getRoll().toString() + ",";
    }

    var rawDataArr = [];
    var sliced = rollersString.substr(0, rollersString.length - 1);
    var spinnersData = processRawDataForSpinners(sliced);

    var decorated = [];

    // number of total icons to be shown on spin animation..
    var count = document.getElementsByClassName('cItem').length; //get total number of spinner canvas items
    count = 5;

    for (var n = 0; n < count; n++) {
        var aRollicons = []; // array to contain total icons to be animated..
        var totalIconsInARoll = spinnersData[n].length;
        for (var i = 0; i < totalIconsInARoll; i++) {
            aRollicons[aRollicons.length] = bg_sprites[spinnersData[n][i]];
        }
        decorated[decorated.length] = aRollicons;   //add decorated items array the newly created rolleritems array
    }
    return decorated;
}

function processRawDataForSpinners(rawData) {
    var rArr = rawData.split(',');
    var retval = [];
    var totalIconsNum = 8;

    while (rArr.length > 0) {
        var spliced = rArr.splice(0, totalIconsNum);
        spliced.push(spliced[0], spliced[1], spliced[2]); // add extra items for seamlessly looping of the spinning animation
        retval[retval.length] = spliced;   //add decorated items array the newly created rolleritems array

        console.log("l:" + rawData.length);
    }
    return retval;
}

function getFinalItems(rawdata) { //get roller items for final stage according to the numbers retrieved from server
    var finalRollersArray = [];     // create a holder for final roller items
    var finalRollerItemsArr = processRawData(rawdata);    // assign data retrieved from service to finalRollerArr.


    for (var i = 0; i < finalRollerItemsArr.length; i++) {
        var finalRoller = []; // create final screen roller
        for (var n = 0; n < finalRollerItemsArr[i].length; n++) {
            finalRoller[finalRoller.length] = bg_sprites[finalRollerItemsArr[i][n]]; // form final roller icons by getting items from base assets, 
            //                                                                                      according to the numbers retrieved from server
        }
        finalRollersArray[finalRollersArray.length] = finalRoller; //assign roller item to roller item holder
    }
    return finalRollersArray; //return final screen roller items array
}


function processRawData(rawData) {
    var rArr = rawData.toString().split(',');
    var retval = [];

    while (rArr.length > 0) {
        var spliced = rArr.splice(0, 3);
        spliced.unshift(getRandomNumForPadding());

        retval[retval.length] = spliced;
        /*test*/
        console.log("l:" + rawData.length);
    }
    return retval;
}

function getRandomNumForPadding() {

    var randomArr = [0, 2, 3, 4, 6, 7];
    return randomArr[Math.floor(Math.random() * randomArr.length)];
}
