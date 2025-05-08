var role = /** @class */ (function () {
    function role() {
    }
    return role;
}());
var roles = [
    { name: "Spielleiter", picture: "game_master.png", description: "Der Spielleiter ist derjenige, der das Spiel leitet und die Regeln erklärt." },
    { name: "Werwolf", picture: "werwolf.png", description: "Der Werwolf ist ein Spieler, der in der Nacht einen anderen Spieler töten kann." },
    { name: "Dorfbewohner", picture: "villager.png", description: "Der Dorfbewohner ist ein Spieler, der versucht, die Werwölfe zu finden" },
    { name: "Seher", picture: "seer.png", description: "Der Seher ist ein Spieler, der in der Nacht einen anderen Spieler ansehen kann." },
    { name: "Hexe", picture: "witch.png", description: "Die Hexe ist ein Spieler, der in der Nacht einen anderen Spieler retten oder töten kann." },
    { name: "Jäger", picture: "hunter.png", description: "Der Jäger ist ein Spieler, der in der Nacht einen anderen Spieler töten kann." },
    { name: "Liebespaar", picture: "lover.png", description: "Das Liebespaar sind zwei Spieler, die sich gegenseitig beschützen." },
    { name: "Bürgermeister", picture: "mayor.png", description: "Der Bürgermeister ist ein Spieler, der in der Nacht einen anderen Spieler wählen kann." },
    { name: "Diebe", picture: "thief.png", description: "Die Diebe sind zwei Spieler, die in der Nacht einen anderen Spieler stehlen können." }
];
var rolesOrder = [0, 2, 2, 1, 3, 1, 2, 4, 2, 1, 5, 2, 6, 2, 1, 7, 2, 1, 9, 2, 2, 2, 2, 2, 2];
var players = [];
var playersWithRoles = [];
function assignRoles() {
    var usedRoles = rolesOrder.slice(0, players.length);
    console.log("usedRoles: " + usedRoles);
    players.forEach(function (player) {
        var randomIndex = Math.floor(Math.random() * usedRoles.length);
        console.log("RandomIndex: " + randomIndex);
        playersWithRoles.push({ player: player, role: roles[usedRoles[randomIndex]] });
        console.log("Used Roles before: " + usedRoles);
        usedRoles.splice(randomIndex, 1); // Entferne den Wert an der Position randomIndex
        console.log("Used Roles after: " + usedRoles);
    });
}
function startGame() {
}
document.addEventListener("DOMContentLoaded", function () {
    var body = document.body;
    var addPlayerBtn = document.getElementById("addPlayer");
    var newPlayerNameInput = document.getElementById("playerName");
    var playerList = document.getElementById("playerList");
    var startGameBtn = document.getElementById("startGame");
    var selectPlayersContainer = document.getElementById("selectPlayers");
    addPlayerBtn === null || addPlayerBtn === void 0 ? void 0 : addPlayerBtn.addEventListener("click", function () {
        if (newPlayerNameInput.value) {
            players.push(newPlayerNameInput === null || newPlayerNameInput === void 0 ? void 0 : newPlayerNameInput.value);
        }
        if (playerList) {
            playerList.innerHTML = "";
            players.forEach(function (player) {
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
        if (players.length >= 4) {
            localStorage.setItem("players", JSON.stringify(players));
            //window.location.href = "game.html";
            if (selectPlayersContainer) {
                selectPlayersContainer.remove();
            }
            assignRoles();
            var displayElement_1 = document.createElement("div");
            displayElement_1.setAttribute("id", "displayRoles");
            displayElement_1.innerText = "Klicken, um den Spielern ihre Rollen zu geben";
            document.body.appendChild(displayElement_1);
            var showRolesIndex_1 = 0;
            var passAlong_1 = true;
            body.addEventListener("click", function () {
                if (showRolesIndex_1 > playersWithRoles.length - 1) {
                    displayElement_1.innerText = "Gib das Handy an den Spielleiter";
                    startGame();
                }
                else {
                    if (passAlong_1 == true) {
                        displayElement_1.innerText = "Gib das Handy an ".concat(playersWithRoles[showRolesIndex_1].player);
                        passAlong_1 = false;
                    }
                    else if (passAlong_1 == false) {
                        displayElement_1.innerText = "".concat(playersWithRoles[showRolesIndex_1].player, " ist ").concat(playersWithRoles[showRolesIndex_1].role.name);
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
