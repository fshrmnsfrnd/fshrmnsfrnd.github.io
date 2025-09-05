"use strict";
//V2
let playerNames = [];
let playersWithRoles = [];
function startGame() {
    window.location.href = "game.html";
}
function writePlayers(playerNames) {
    const playerList = document.getElementById("playerList");
    if (playerList) {
        playerList.innerHTML = "";
        playerNames.forEach((player, index) => {
            const playerElement = document.createElement("div");
            playerElement.setAttribute("class", "player");
            const playerNameEl = document.createElement("span");
            playerNameEl.textContent = player;
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "X";
            deleteButton.classList.add("delete-player-button");
            deleteButton.addEventListener("click", () => {
                playerNames.splice(index, 1);
                localStorage.setItem("playerNames", JSON.stringify(playerNames));
                writePlayers(playerNames);
            });
            playerElement.appendChild(playerNameEl);
            playerElement.appendChild(deleteButton);
            playerList.appendChild(playerElement);
        });
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const addPlayerBtn = document.getElementById("addPlayer");
    const newPlayerNameInput = document.getElementById("playerName");
    const startGameBtn = document.getElementById("startGame");
    const selectPlayersContainer = document.getElementById("selectPlayers");
    const selectRolesContainer = document.getElementById("selectRoles");
    const storedNames = localStorage.getItem("playerNames");
    if (storedNames) {
        playerNames = JSON.parse(storedNames);
        writePlayers(playerNames);
    }
    addPlayerBtn === null || addPlayerBtn === void 0 ? void 0 : addPlayerBtn.addEventListener("click", () => {
        if (newPlayerNameInput.value) {
            playerNames.push(newPlayerNameInput === null || newPlayerNameInput === void 0 ? void 0 : newPlayerNameInput.value);
        }
        writePlayers(playerNames);
        if (newPlayerNameInput) {
            newPlayerNameInput.value = "";
        }
    });
    startGameBtn === null || startGameBtn === void 0 ? void 0 : startGameBtn.addEventListener("click", () => {
        localStorage.setItem("playerNames", JSON.stringify(playerNames));
        if (playerNames.length >= 4) {
            assignRoles();
            localStorage.setItem("players", JSON.stringify(playersWithRoles));
            if (selectPlayersContainer) {
                selectPlayersContainer.remove();
            }
            if (selectRolesContainer) {
                selectRolesContainer.remove();
            }
            const nextButton = document.createElement("input");
            nextButton.setAttribute("type", "button");
            nextButton.setAttribute("value", "Weiter");
            const displayElement = document.createElement("div");
            displayElement.setAttribute("id", "displayRoles");
            displayElement.innerHTML = `Klicken, um den Spielern ihre Rollen zu geben` + "<br>";
            displayElement.appendChild(nextButton);
            document.body.appendChild(displayElement);
            let showRolesIndex = 0;
            let passAlong = true;
            nextButton.addEventListener("click", () => {
                if (showRolesIndex > playersWithRoles.length - 1) {
                    displayElement.innerHTML = `Gib das Handy an den Spielleiter\nWenn ihr ohne Spielleiterrolle spielt, lege das Handy jetzt weg` + "<br>";
                    const start = document.createElement("input");
                    start.setAttribute("type", "button");
                    start.setAttribute("value", "Start");
                    start.setAttribute("onclick", "startGame()");
                    displayElement.appendChild(start);
                }
                else {
                    if (passAlong == true) {
                        displayElement.innerHTML = `Gib das Handy an ${playersWithRoles[showRolesIndex].player} \n` + "<br>";
                        displayElement.appendChild(nextButton);
                        passAlong = false;
                    }
                    else if (passAlong == false) {
                        displayElement.innerHTML = `${playersWithRoles[showRolesIndex].player} ist ${playersWithRoles[showRolesIndex].role.name}`;
                        displayElement.innerHTML += `\n` + `<img src="` + playersWithRoles[showRolesIndex].role.picture + `">`;
                        displayElement.innerHTML += `\n` + playersWithRoles[showRolesIndex].role.description + `\n` + "<br>";
                        displayElement.appendChild(nextButton);
                        showRolesIndex++;
                        passAlong = true;
                    }
                }
            });
        }
        else {
            alert("Mindestens 4 Spieler!");
        }
    });
});
