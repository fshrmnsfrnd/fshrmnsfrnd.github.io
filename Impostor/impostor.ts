let playersRolesWord: { player: string, playerRole: string, word: string}[] = []
let imposterGetsAWord:boolean = false;

const resetBtn = document.createElement("input")
resetBtn.setAttribute("type", "button")
resetBtn.setAttribute("value", "Neues Spiel")
resetBtn.addEventListener("click", () => {
    location.reload()
})

let wordList: string[] = [];
fetch('./impostorWords.json')
  .then(response => response.json())
  .then(data => { wordList = data; });

function getWord(): string {
    if (wordList.length > 0) {
        const randomIndex = Math.floor(Math.random() * wordList.length);
        return wordList[randomIndex];
    }
    return "Wort konnte nicht geladen werden";
}

function showTimer(){

    const timerElement = document.createElement("div")
    timerElement.setAttribute("id", "timer")

    const startTimerBtn = document.createElement("input")
    startTimerBtn.setAttribute("type", "button")
    startTimerBtn.setAttribute("value", "Timer starten")
    timerElement.appendChild(startTimerBtn)

    let timer = document.createElement("p")
    timer.setAttribute("id", "timer")
    timer.innerText = "02 : 00"
    timerElement.appendChild(timer)

    document.body.appendChild(timerElement)

    startTimerBtn.addEventListener("click", () => {
        startTimerBtn.remove()
        timerElement.appendChild(resetBtn)

        let timeLeft = 120
        const countdown = setInterval(() => {
            timeLeft--;
            let minutes = Math.floor(timeLeft / 60)
            let seconds = timeLeft % 60
            timer.innerHTML = `<p>${minutes} : ${seconds}</p>`
            if (timeLeft <= 0) {
                clearInterval(countdown)
                timer.innerHTML = "Timer abgelaufen"
                timerElement.appendChild(resetBtn)
            }
        }, 1000)
    })
}

function initializeRoles(numberOfImpostors: number, numberOfPlayers: number){
    const word = getWord()
    let imposterWord:string = "Versuche das Wort herauszufinden"
    if(imposterGetsAWord){
        imposterWord = getWord()
    }

    //Make Players
    for (let i = 1; i <= numberOfPlayers; i++) {
        const playerName: string = "Player " + i
        playersRolesWord.push({ player: playerName, playerRole: "Spieler", word: word });
    }

    //Make Impostors
    let impostorIDs: number[] = []
    do{
        const playerID = Math.floor(Math.random() * ((playersRolesWord.length - 1) - 0 + 1)) + 0;
        if(!(impostorIDs.includes(playerID))){
            impostorIDs.push(playerID)
        }
    }while(impostorIDs.length < numberOfImpostors)

    //Replace Roles in Players Array
    impostorIDs.forEach((playerID) => {
        playersRolesWord[playerID].playerRole = "Impostor"
        playersRolesWord[playerID].word = imposterWord
    })

}

function showRoles(){
    
    const nextButton = document.createElement("input")
    nextButton.setAttribute("type", "button")
    nextButton.setAttribute("value", "Weiter")

    const displayElement = document.createElement("div");
    displayElement.setAttribute("id", "displayRoles");
    displayElement.innerHTML = `Klicken, um den Spielern ihre Rollen zu geben` + "<br>"
    displayElement.appendChild(nextButton)
    document.body.appendChild(displayElement);

    let showRolesIndex: number = 0
    let passAlong: boolean = true

    nextButton.addEventListener("click", () => {
        if (showRolesIndex > playersRolesWord.length - 1) {
            displayElement.remove()
            showTimer()
        } else {
            if (passAlong == true) {
                displayElement.innerHTML = `Gib das Handy an ${playersRolesWord[showRolesIndex].player} \n` + "<br>"
                displayElement.appendChild(nextButton)
                passAlong = false
            } else if (passAlong == false) {
                displayElement.innerHTML = `<p>${playersRolesWord[showRolesIndex].player}</p>`
                if(!imposterGetsAWord){
                    displayElement.innerHTML += `<p>Du bist ${playersRolesWord[showRolesIndex].playerRole}</p>`
                }
                displayElement.innerHTML += `<p>Das Wort ist:</p>`
                displayElement.innerHTML += `<p>${playersRolesWord[showRolesIndex].word} </p>`
                displayElement.appendChild(nextButton)
                showRolesIndex++
                passAlong = true
            }
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {
    const selectPlayersDiv = document.getElementById("selectPlayers")
    const numberOfPlayersInput = document.getElementById("numberOfPlayers") as HTMLInputElement
    const numberOfImpostorsInput = document.getElementById("numberOfImpostors") as HTMLInputElement
    const imposterGetsAWortCheckbox = document.getElementById("imposterGetsAWord") as HTMLInputElement
    const startGameBtn = document.getElementById("startGameButton")

    //Load Values from cookie or take default value
    let numberOfPlayers:number = Number(localStorage.getItem("numberOfPlayers")) !== 0 ? Number(localStorage.getItem("numberOfPlayers")) : 4
    let numberOfImpostors:number = Number(localStorage.getItem("numberOfImpostors")) !== 0 ? Number(localStorage.getItem("numberOfImpostors")) : 4
    imposterGetsAWord = localStorage.getItem("imposterGetsAWort") === "true" ? true : false

    //Write Values to Document
    numberOfPlayersInput.setAttribute("value", numberOfPlayers.toString())
    numberOfImpostorsInput.setAttribute("value", numberOfImpostors.toString())
    imposterGetsAWortCheckbox.setAttribute("checked", imposterGetsAWord.toString())

    startGameBtn?.addEventListener("click", () => {
        if(numberOfImpostorsInput && numberOfPlayersInput){
            numberOfPlayers = Number(numberOfPlayersInput.value)
            numberOfImpostors = Number(numberOfImpostorsInput.value)
            imposterGetsAWord = Boolean(imposterGetsAWortCheckbox.checked)

            //Save values to localstorage
            localStorage.setItem("numberOfPlayers", String(numberOfPlayers))
            localStorage.setItem("numberOfImpostors", String(numberOfImpostors))
            localStorage.setItem("imposterGetsAWort", String(imposterGetsAWord))
        
            selectPlayersDiv?.remove()
            initializeRoles(numberOfImpostors, numberOfPlayers)
            showRoles()
        }
        

    })

})