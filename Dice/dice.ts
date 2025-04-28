addEventListener("DOMContentLoaded", (event) => {
    let dices: HTMLElement[] = [];
    const addDiceButton = document.getElementById("addDice");
    const diceContainer = document.getElementById("dicecontainer");
    let anzahlDices:number = 0;

    async function sleep(time:number): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, time)
        })
    }

    async function rollDice(diceID: number) {
        const imgElement = document.getElementById(diceID.toString())?.querySelector("img");
        //Wurfel animieren
        for (let j = 1; j <= 3; j++) {
            for (let i = 1; i <= 6; i++) {
                await sleep(100);
                imgElement?.setAttribute("src", "./Pictures/" + i + ".png");
            }
        }
        //Wurfel enden
        const diceValue = Math.floor(Math.random() * (6)) + 1;
        imgElement?.setAttribute("src", "./Pictures/" + diceValue + ".png");
    }

    addDiceButton?.addEventListener("click", () => {
        anzahlDices++;
        //Nachsten Wurfel erstellen
        const nextDice = document.createElement("div");
        //Bildelement für Wurfel erstellen
        const img = document.createElement("img");
        img.setAttribute("src", "./Pictures/1.png")
        nextDice.appendChild(img);
        nextDice.innerHTML = '<img src="./Pictures/1.png">';
        nextDice.setAttribute("class", "dice");
        nextDice.setAttribute("id", anzahlDices.toString());
        const diceID = parseInt(nextDice.getAttribute("id") as string);        
        diceContainer?.appendChild(nextDice);

        nextDice.addEventListener("click", () => {rollDice(diceID)}) ;
    })

    addDiceButton?.click();
})