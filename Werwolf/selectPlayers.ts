class role {
    name!: string
    picture!: string
    description!: string
}

const roles: role[] = [
    { name: "Spielleiter", picture: "game_master.png", description: "Du leitest das Spiel. Wenn alle ihre Rollen kennen bekommst du das Handy" },
    { name: "Werwolf", picture: "werwolf.png", description: "Du darfst mit deinen Artgenossen (ab 6 Spieler) nachts einen Dorfbewohner töten" },
    { name: "Dorfbewohner", picture: "villager.png", description: "Du versuchst, die Werwölfe zu finden. Du schläfst Nachts und darfst Tags abstimmen" },
    { name: "Seher", picture: "seer.png", description: "Wenn du gerufen wirst, darfst du jede Nacht die Identität einer Person erfahren" },
    { name: "Hexe", picture: "witch.png", description: "Du hast 2 Zaubertränke. Mit dem einen kannst du einmal im Spiel jemanden töten, mit dem anderen kannst du ein Opfer der Werwölfe retten. Du darfst beide in derselben Nacht nutzen" },
    { name: "Jäger", picture: "hunter.png", description: "Du bist ein normaler Dorfbewohner, aber wenn du stirbst darfst du jemanden mit in den Tod reißen" },
    { name: "Amor", picture: "amor.png", description: "Du bist ein normaler Dorfbewohner, darfst aber in der ersten Nacht ein Liebespaar bestimmen. Wenn einer von ihnen stirbt, reißt er den anderen mit in den Tod" }
]

let rolesOrder: number[] = [0, 2, 2, 1, 3, 1, 2, 4, 2, 2, 5, 2, 1, 2, 6, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2]
let playerNames: string[] = []
let playersWithRoles: { player: string; role: role }[] = []

function assignRoles(): void {
    const usedRoles = rolesOrder.slice(0, playerNames.length);
    playerNames.forEach((player) => {
        const randomIndex = Math.floor(Math.random() * usedRoles.length);
        playersWithRoles.push({ player: player, role: roles[usedRoles[randomIndex]] });
        usedRoles.splice(randomIndex, 1);
    })
}

function startGame(): void {
    window.location.href = "game.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const addPlayerBtn = document.getElementById("addPlayer")
    const newPlayerNameInput = document.getElementById("playerName") as HTMLInputElement
    const playerList = document.getElementById("playerList")
    const startGameBtn = document.getElementById("startGame")
    const selectPlayersContainer = document.getElementById("selectPlayers")

    addPlayerBtn?.addEventListener("click", () => {
        if (newPlayerNameInput.value) {
            playerNames.push(newPlayerNameInput?.value)
        }
        if (playerList) {
            playerList.innerHTML = ""
            playerNames.forEach((player) => {
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
        if (playerNames.length >= 4) {
            assignRoles();

            localStorage.setItem("players", JSON.stringify(playersWithRoles));
            if (selectPlayersContainer) {
                selectPlayersContainer.remove();
            }

            const nextButton = document.createElement("input")
            nextButton.setAttribute("type", "button")
            nextButton.setAttribute("value", "Weiter")
            const displayElement = document.createElement("div");
            displayElement.setAttribute("id", "displayRoles");
            displayElement.innerText = "Klicken, um den Spielern ihre Rollen zu geben"
            displayElement.appendChild(nextButton)
            document.body.appendChild(displayElement);

            let showRolesIndex: number = 0
            let passAlong: boolean = true

            nextButton.addEventListener("click", () => {
                if (showRolesIndex > playersWithRoles.length - 1) {
                    displayElement.innerText = `Gib das Handy an den Spielleiter\n`
                    const start = document.createElement("input")
                    start.setAttribute("type", "button")
                    start.setAttribute("value", "Start")
                    start.setAttribute("onclick", "startGame()")
                    displayElement.appendChild(start)
                } else {
                    if (passAlong == true) {
                        displayElement.innerText = `Gib das Handy an ${playersWithRoles[showRolesIndex].player} \n`
                        displayElement.appendChild(nextButton)
                        passAlong = false
                    } else if (passAlong == false) {
                        displayElement.innerText = `${playersWithRoles[showRolesIndex].player} ist ${playersWithRoles[showRolesIndex].role.name}`
                        displayElement.innerText += `\n` + playersWithRoles[showRolesIndex].role.picture
                        displayElement.innerText += `\n` + playersWithRoles[showRolesIndex].role.description + `\n`
                        displayElement.appendChild(nextButton)
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