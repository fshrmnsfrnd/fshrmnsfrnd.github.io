"use strict";
let gamePhases = [
    "Die Nacht bricht über das Dorf herein, alle Dorfbewohner schlafen ein",
    "Die Seherin erwacht und bestimmt eine Person, deren wahre Identität sie erfahren will",
    "Die Werwölfe erwachen und bestimmen eine Person, die sie töten wollen",
    "Hexe erwache! Ich zeige dir das Opfer der Werwölfe. Willst Du das Opfer mit Deinem Heiltrank retten? Oder setzt du das Gift gegen eine andere Person ein?",
    "Es graut der Morgen, das Dorf erwacht, alle Dorfbewohner wachen auf, außer …",
    "Die Dorfbewohner diskutieren und stimmen ab, wer die Werwölfe sind",
];
document.addEventListener("DOMContentLoaded", () => {
    // Lade das players-Array aus dem localStorage
    const players = JSON.parse(localStorage.getItem("players") || "[]");
    if (!(players.some((player) => player.role.name === "Hexe"))) {
        gamePhases.splice(3, 1);
        if (!(players.some((player) => player.role.name === "Seher"))) {
            gamePhases.splice(1, 1);
        }
    }
    // Erstelle eine Tabelle
    const table = document.createElement("table");
    // Erstelle den Tabellenkopf
    const headerRow = document.createElement("tr");
    const nameHeader = document.createElement("th");
    nameHeader.innerText = "Spieler";
    const roleHeader = document.createElement("th");
    roleHeader.innerText = "Rolle";
    headerRow.appendChild(nameHeader);
    headerRow.appendChild(roleHeader);
    table.appendChild(headerRow);
    // Füge die Spieler und ihre Rollen zur Tabelle hinzu
    players.forEach((player) => {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        nameCell.innerText = player.player;
        const roleCell = document.createElement("td");
        roleCell.innerText = player.role.name;
        row.appendChild(nameCell);
        row.appendChild(roleCell);
        table.appendChild(row);
    });
    // Füge die Tabelle zum Body der Seite hinzu
    document.body.appendChild(table);
    //Füge den Spielbereich hinzu
    const gameDisplay = document.createElement("div");
    gameDisplay.setAttribute("id", "gameDisplay");
    document.body.appendChild(gameDisplay);
    function updateGameDisplay(text) {
        const gameDisplay = document.getElementById("gameDisplay");
        if (gameDisplay) {
            gameDisplay.innerText = text;
        }
    }
    const nextPhaseButton = document.createElement("button");
    nextPhaseButton.innerText = "Nächste Spielphase";
    updateGameDisplay("Die Nacht bricht über das Dorf herein, alle Dorfbewohner schlafen ein");
    let phasenCounter = -1;
    nextPhaseButton.addEventListener("click", () => {
        if (phasenCounter == -1 && (players.some((player) => player.role.name === "Armor"))) {
            updateGameDisplay("Armor erwacht und läst mit seinen Pfeilen ein Pärchen ineinander verlieben");
        }
        else if (phasenCounter == -1 && !(players.some((player) => player.role.name === "Armor"))) {
            phasenCounter += 2;
        }
        if (phasenCounter >= 0) {
            updateGameDisplay(gamePhases[phasenCounter]);
            if (phasenCounter >= gamePhases.length - 1) {
                phasenCounter = -1;
            }
        }
        phasenCounter++;
    });
    // Füge den Button zum Body der Seite hinzu
    document.body.appendChild(nextPhaseButton);
});
