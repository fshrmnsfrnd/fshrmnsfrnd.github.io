class role {
    name: string;
    picture: string;
    description: string
}

const roles: role[] = [
    { name: "Spielleiter", picture: "game_master.png", description: "Der Spielleiter ist derjenige, der das Spiel leitet und die Regeln erklärt." },
    { name: "Werwolf", picture: "werwolf.png", description: "Der Werwolf ist ein Spieler, der in der Nacht einen anderen Spieler töten kann." },
    { name: "Dorfbewohner", picture: "villager.png", description: "Der Dorfbewohner ist ein Spieler, der versucht, die Werwölfe zu finden" },
    { name: "Seher", picture: "seer.png", description: "Der Seher ist ein Spieler, der in der Nacht einen anderen Spieler ansehen kann." },
    { name: "Hexe", picture: "witch.png", description: "Die Hexe ist ein Spieler, der in der Nacht einen anderen Spieler retten oder töten kann." },
    { name: "Jäger", picture: "hunter.png", description: "Der Jäger ist ein Spieler, der in der Nacht einen anderen Spieler töten kann." },
    { name: "Liebespaar", picture: "lover.png", description: "Das Liebespaar sind zwei Spieler, die sich gegenseitig beschützen." },
    { name: "Bürgermeister", picture: "mayor.png", description: "Der Bürgermeister ist ein Spieler, der in der Nacht einen anderen Spieler wählen kann." },
    { name: "Diebe", picture: "thief.png", description: "Die Diebe sind zwei Spieler, die in der Nacht einen anderen Spieler stehlen können." }
]

let rolesOrder: number[] = [0, 2, 2, 1, 3, 1, 2, 4, 2, 1, 5, 2, 6, 2, 1, 7, 2, 1, 9, 2, 2, 2, 2, 2, 2]
let players: string[] = []
let playersWithRoles: { player: string; role: role }[] = []

function assignRoles(): void {
    const usedRoles = rolesOrder.slice(0, players.length);
    console.log("usedRoles: " + usedRoles);
    players.forEach((player) => {
        const randomIndex = Math.floor(Math.random() * usedRoles.length);
        console.log("RandomIndex: " + randomIndex);
        playersWithRoles.push({ player: player, role: roles[usedRoles[randomIndex]] });
        console.log("Used Roles before: " + usedRoles);
        usedRoles.splice(randomIndex, 1); // Entferne den Wert an der Position randomIndex
        console.log("Used Roles after: " + usedRoles);
    });
}

function startGame(): void {

}

document.addEventListener("DOMContentLoaded", () => {
    const body = document.body
    const addPlayerBtn = document.getElementById("addPlayer")
    const newPlayerNameInput = document.getElementById("playerName") as HTMLInputElement
    const playerList = document.getElementById("playerList")
    const startGameBtn = document.getElementById("startGame")
    const selectPlayersContainer = document.getElementById("selectPlayers")

    addPlayerBtn?.addEventListener("click", () => {
        if (newPlayerNameInput.value) {
            players.push(newPlayerNameInput?.value)
        }
        if (playerList) {
            playerList.innerHTML = ""
            players.forEach((player) => {
                const playerElement = document.createElement("div")
                playerElement.setAttribute("class", "player")
                playerElement.innerText = player
                playerList.appendChild(playerElement)
            })
        }
        if (newPlayerNameInput) {
            newPlayerNameInput.value = "";
        }
    })

    startGameBtn?.addEventListener("click", () => {
        if (players.length >= 4) {
            localStorage.setItem("players", JSON.stringify(players));
            //window.location.href = "game.html";
            if (selectPlayersContainer) {
                selectPlayersContainer.remove();
            }
            assignRoles();

            const displayElement = document.createElement("div");
            displayElement.setAttribute("id", "displayRoles");
            displayElement.innerText = "Klicken, um den Spielern ihre Rollen zu geben"
            document.body.appendChild(displayElement);

            let showRolesIndex: number = 0
            let passAlong: boolean = true

            body.addEventListener("click", () => {
                if (showRolesIndex > playersWithRoles.length - 1) {
                    displayElement.innerText = `Gib das Handy an den Spielleiter`
                    startGame()
                } else {
                    if (passAlong == true) {
                        displayElement.innerText = `Gib das Handy an ${playersWithRoles[showRolesIndex].player}`
                        passAlong = false
                    } else if (passAlong == false) {
                        displayElement.innerText = `${playersWithRoles[showRolesIndex].player} ist ${playersWithRoles[showRolesIndex].role.name}`
                        showRolesIndex++
                        passAlong = true
                    }
                }
            })
        } else {
            alert("Mindestens 4 Spieler!");
        }
    })
})