var role = /** @class */ (function () {
    function role() {
    }
    return role;
}());
var roles = [
    { name: "Spielleiter", picture: "game_master.png", description: "Du leitest das Spiel. Wenn alle ihre Rollen kennen bekommst du das Handy" },
    { name: "Werwolf", picture: "werwolf.png", description: "Du darfst mit deinen Artgenossen (ab 6 Spieler) nachts einen Dorfbewohner töten" },
    { name: "Dorfbewohner", picture: "villager.png", description: "Du versuchst, die Werwölfe zu finden. Du schläfst Nachts und darfst Tags abstimmen" },
    { name: "Seher", picture: "seer.png", description: "Wenn du gerufen wirst, darfst du jede Nacht die Identität einer Person erfahren" },
    { name: "Hexe", picture: "witch.png", description: "Du hast 2 Zaubertränke. Mit dem einen kannst du einmal im Spiel jemanden töten, mit dem anderen kannst du ein Opfer der Werwölfe retten. Du darfst beide in derselben Nacht nutzen" },
    { name: "Jäger", picture: "hunter.png", description: "Du bist ein normaler Dorfbewohner, aber wenn du stirbst darfst du jemanden mit in den Tod reißen" },
    { name: "Amor", picture: "amor.png", description: "Du bist ein normaler Dorfbewohner, darfst aber in der ersten Nacht ein Liebespaar bestimmen. Wenn einer von ihnen stirbt, reißt er den anderen mit in den Tod" }
];
var rolesOrder = [0, 2, 2, 1, 3, 1, 2, 4, 2, 1, 5, 2, 6, 2, 1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2];
var playerNames = [];
var playersWithRoles = [];
function assignRoles() {
    var usedRoles = rolesOrder.slice(0, playerNames.length);
    playerNames.forEach(function (player) {
        var randomIndex = Math.floor(Math.random() * usedRoles.length);
        playersWithRoles.push({ player: player, role: roles[usedRoles[randomIndex]] });
        usedRoles.splice(randomIndex, 1);
    });
}
function startGame() {
    window.location.href = "game.html";
}
document.addEventListener("DOMContentLoaded", function () {
    var addPlayerBtn = document.getElementById("addPlayer");
    var newPlayerNameInput = document.getElementById("playerName");
    var playerList = document.getElementById("playerList");
    var startGameBtn = document.getElementById("startGame");
    var selectPlayersContainer = document.getElementById("selectPlayers");
    addPlayerBtn === null || addPlayerBtn === void 0 ? void 0 : addPlayerBtn.addEventListener("click", function () {
        if (newPlayerNameInput.value) {
            playerNames.push(newPlayerNameInput === null || newPlayerNameInput === void 0 ? void 0 : newPlayerNameInput.value);
        }
        if (playerList) {
            playerList.innerHTML = "";
            playerNames.forEach(function (player) {
                var playerElement = document.createElement("div");
                playerElement.setAttribute("class", "player");
                playerElement.innerText = player;
                playerList.appendChild(playerElement);
            });
        }
        if (newPlayerNameInput) {
            newPlayerNameInput.value = "";
        }
    });
    startGameBtn === null || startGameBtn === void 0 ? void 0 : startGameBtn.addEventListener("click", function () {
        if (playerNames.length >= 4) {
            assignRoles();
            localStorage.setItem("players", JSON.stringify(playersWithRoles));
            if (selectPlayersContainer) {
                selectPlayersContainer.remove();
            }
            var nextButton_1 = document.createElement("input");
            nextButton_1.setAttribute("type", "button");
            nextButton_1.setAttribute("value", "Weiter");
            var displayElement_1 = document.createElement("div");
            displayElement_1.setAttribute("id", "displayRoles");
            displayElement_1.innerText = "Klicken, um den Spielern ihre Rollen zu geben";
            displayElement_1.appendChild(nextButton_1);
            document.body.appendChild(displayElement_1);
            var showRolesIndex_1 = 0;
            var passAlong_1 = true;
            nextButton_1.addEventListener("click", function () {
                if (showRolesIndex_1 > playersWithRoles.length - 1) {
                    displayElement_1.innerText = "Gib das Handy an den Spielleiter\n";
                    var start = document.createElement("input");
                    start.setAttribute("type", "button");
                    start.setAttribute("value", "Start");
                    start.setAttribute("onclick", "startGame()");
                    displayElement_1.appendChild(start);
                }
                else {
                    if (passAlong_1 == true) {
                        displayElement_1.innerText = "Gib das Handy an ".concat(playersWithRoles[showRolesIndex_1].player, " \n");
                        displayElement_1.appendChild(nextButton_1);
                        passAlong_1 = false;
                    }
                    else if (passAlong_1 == false) {
                        displayElement_1.innerText = "".concat(playersWithRoles[showRolesIndex_1].player, " ist ").concat(playersWithRoles[showRolesIndex_1].role.name);
                        displayElement_1.innerText += "\n" + playersWithRoles[showRolesIndex_1].role.picture;
                        displayElement_1.innerText += "\n" + playersWithRoles[showRolesIndex_1].role.description + "\n";
                        displayElement_1.appendChild(nextButton_1);
                        showRolesIndex_1++;
                        passAlong_1 = true;
                    }
                }
            });
        }
        else {
            alert("Mindestens 4 Spieler!");
        }
    });
});
