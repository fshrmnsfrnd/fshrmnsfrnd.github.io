// Lade das players-Array aus dem localStorage
const players = JSON.parse(localStorage.getItem("players") || "[]");

// Zeige die Spieler in der Liste an
const playerList = document.getElementById("playerList");
if (playerList) {
    players.forEach(player => {
        const playerElement = document.createElement("div");
        playerElement.textContent = player;
        playerList.appendChild(playerElement);
    })
}
