"use strict";
let playersRolesWord = [];
const resetBtn = document.createElement("input");
resetBtn.setAttribute("type", "button");
resetBtn.setAttribute("value", "Neues Spiel");
resetBtn.addEventListener("click", () => {
    location.reload();
});
let wordList = [];
fetch('./impostorWords.json')
    .then(response => response.json())
    .then(data => { wordList = data; });
function getWord() {
    if (wordList.length > 0) {
        const randomIndex = Math.floor(Math.random() * wordList.length);
        return wordList[randomIndex];
    }
    return "Wort konnte nicht geladen werden";
}
function showTimer() {
    const timerElement = document.createElement("div");
    timerElement.setAttribute("id", "timer");
    /*
    const chooseTimeInput = document.createElement("input")
    chooseTimeInput.setAttribute("type", "number")
    chooseTimeInput.setAttribute("value", "2")
    timerElement.appendChild(chooseTimeInput)
    
    let timeInputDescription = document.createElement("p")
    timeInputDescription.innerText = "Dauer der Runde: "
    timerElement.appendChild(timeInputDescription)
    */
    const startTimerBtn = document.createElement("input");
    startTimerBtn.setAttribute("type", "button");
    startTimerBtn.setAttribute("value", "Timer starten");
    timerElement.appendChild(startTimerBtn);
    let timer = document.createElement("p");
    timer.setAttribute("id", "timer");
    timer.innerText = "02 : 00";
    timerElement.appendChild(timer);
    document.body.appendChild(timerElement);
    startTimerBtn.addEventListener("click", () => {
        //chooseTimeInput.remove()
        //timeInputDescription.remove()
        startTimerBtn.remove();
        let timeLeft = 120;
        const countdown = setInterval(() => {
            timeLeft--;
            let minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            timer.innerHTML = `<p>${minutes} : ${seconds}</p>`;
            if (timeLeft <= 0) {
                clearInterval(countdown);
                timer.innerHTML = "Timer abgelaufen";
                timerElement.appendChild(resetBtn);
            }
        }, 1000);
    });
}
function initializeRoles(numberOfImpostors, numberOfPlayers) {
    const word = getWord();
    //Make Players
    for (let i = 1; i <= numberOfPlayers; i++) {
        const playerName = "Player " + i;
        playersRolesWord.push({ player: playerName, playerRole: "Spieler", word: word });
    }
    //Make Impostors
    let impostorIDs = [];
    do {
        const playerID = Math.floor(Math.random() * ((playersRolesWord.length - 1) - 0 + 1)) + 0;
        if (!(impostorIDs.includes(playerID))) {
            impostorIDs.push(playerID);
        }
    } while (impostorIDs.length < numberOfImpostors);
    //Replace Roles in Players Array
    impostorIDs.forEach((playerID) => {
        playersRolesWord[playerID].playerRole = "Impostor";
        playersRolesWord[playerID].word = "Versuche das Wort herauszufinden";
    });
}
function showRoles() {
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
        if (showRolesIndex > playersRolesWord.length - 1) {
            displayElement.remove();
            showTimer();
        }
        else {
            if (passAlong == true) {
                displayElement.innerHTML = `Gib das Handy an ${playersRolesWord[showRolesIndex].player} \n` + "<br>";
                displayElement.appendChild(nextButton);
                passAlong = false;
            }
            else if (passAlong == false) {
                displayElement.innerHTML = `<p>${playersRolesWord[showRolesIndex].player}</p>`;
                displayElement.innerHTML += `<p>Du bist ${playersRolesWord[showRolesIndex].playerRole}</p>`;
                displayElement.innerHTML += `<p>Das Wort ist:</p>`;
                displayElement.innerHTML += `<p>${playersRolesWord[showRolesIndex].word} </p>`;
                displayElement.appendChild(nextButton);
                showRolesIndex++;
                passAlong = true;
            }
        }
    });
}
document.addEventListener("DOMContentLoaded", () => {
    const body = document.getElementsByName("body");
    const selectPlayersDiv = document.getElementById("selectPlayers");
    const numberOfPlayersInput = document.getElementById("numberOfPlayers");
    const numberOfImpostorsInput = document.getElementById("numberOfImpostors");
    const startGameBtn = document.getElementById("startGameButton");
    startGameBtn === null || startGameBtn === void 0 ? void 0 : startGameBtn.addEventListener("click", () => {
        if (numberOfImpostorsInput && numberOfPlayersInput) {
            let numberOfPlayers = Number(numberOfPlayersInput.value);
            let numberOfImpostors = Number(numberOfImpostorsInput.value);
            selectPlayersDiv === null || selectPlayersDiv === void 0 ? void 0 : selectPlayersDiv.remove();
            initializeRoles(numberOfImpostors, numberOfPlayers);
            showRoles();
        }
    });
});
