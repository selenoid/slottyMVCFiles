/*SocketManager*/

var ws;
$().ready(function () {
    var memberId = @Model.MemberId;
    if (memberId != null) {
        $("#spanStatus").text("connecting");
        ws = new WebSocket("ws://" + window.location.hostname +
            ":53714/api/Game");

        //ws = new WebSocket("ws://" + window.location.hostname +
        //"/api/Game");
        ws.onopen = function () {
            $("#spanStatus").text("connected");
        };
        ws.onmessage = function (evt) {
            //dlog("[server return] >>" + evt.data.toString());
            var response = evt.data;
            var result = JSON.parse(evt.data,5);
            response = result.split(" ");
            var totalAmount = "";
            for (var i = 0; i < response.length; i++) {
                var column = parseInt(response[7]);
                var row =parseInt(response[9]);
                var profit = parseInt(response[11]);
                if (profit > 0) {
                    $("#checkIcon").show();
                    $("#spanProfit").text("   You Win!!!  "+profit+ " $ ");
                    $("#spanProfit").css("background-color", "greenyellow");
                } else {
                    $("#checkIcon").hide();
                    $("#spanProfit").text("You lost :(( ");
                    $("#spanProfit").css("background-color", "bisque");
                }
                if (i === 3) {
                    totalAmount = response[i];
                }
                else if(i === 5) {
                    var tempMatrix = response[i].substring(1, response[i].length - 1);
                    var gameMatrix = tempMatrix.split(",");
                    dlog("matrix: " + gameMatrix);
                    var r;
                    var rowindex = 0;
                    var rowCount = row;
                    $("#divgameMatrix").empty();
                    for (var c = 0; c < column; c++) {
                        if (row <= gameMatrix.length) {
                            $("#divgameMatrix").append("<ul id="+c+">");
                            $("#" + c).css("float", "left");
                            for (r = rowindex; r < row; r++) {
                                $("#"+c).append("<li>" + gameMatrix[r] + "</li>");
                            }

                            rowindex = row;
                            row = row + rowCount;
                        }

                    }

                    $.gameData = {gameMatrix:gameMatrix, success:"success", code:200};

                }

            }
            $("#totalAmount").text(totalAmount);

        };
        ws.onerror = function (evt) {
            $("#spanStatus").text(evt.message);
        };
        ws.onclose = function () {
            $("#spanStatus").text("disconnected");
        };
        if (ws.readyState == WebSocket.OPEN) {
            ws.send($("#textInput").val());
        }
        else {
            $("#spanStatus").text("Connection is closed");
        }

    }

    function startSpin (e) {
        //dlog("[server send] >> start spin...");
        if (ws.readyState == WebSocket.OPEN) {
            ws.send($("#textInput").val());
        }
        else {
            $("#spanStatus").text("Connection is closed");
        }

    }

    $("#play").click(function (e) {
        startSpin(Constants.$_PlayButton);
    });

    $("#btnDisconnect").click(function () {
        ws.close();
    });
});