addEventListener("DOMContentLoaded", function (event) {
    var dices = [];
    var dice1 = document.getElementById("dice1");
    if (dice1) {
        dices.push(dice1);
    }
    function rollDice(diceID) {
        var imgElement = dices[diceID].querySelector("img");
        //Würfel animieren
        for (var j = 1; j <= 3; j++) {
            var _loop_1 = function (i) {
                setTimeout(function () {
                    imgElement === null || imgElement === void 0 ? void 0 : imgElement.setAttribute("src", "./Pictures/" + i + ".png");
                }, 5000);
            };
            for (var i = 1; i <= 6; i++) {
                _loop_1(i);
            }
        }
        //Würfel enden
        var diceValue = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
        imgElement === null || imgElement === void 0 ? void 0 : imgElement.setAttribute("src", "./Pictures/" + diceValue + ".png");
    }
    if (dices[0]) {
        dices[0].addEventListener("click", function () { rollDice(1); });
    }
});
