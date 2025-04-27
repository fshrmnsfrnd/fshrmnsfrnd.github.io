addEventListener("DOMContentLoaded", (event) => {
    let dices: HTMLElement[] = [];

    const dice1 = document.getElementById("dice1");
    if (dice1) {
        dices.push(dice1);
    }

    function rollDice(diceID: number) {
        const imgElement = dices[diceID].querySelector("img");
        //Würfel animieren
        for (let j = 1; j <= 3; j++) {
            for (let i = 1; i <= 6; i++) {
                setTimeout(() => {
                    imgElement?.setAttribute("src", "./Pictures/" + i + ".png");
                }, 5000);
            }
        }
        //Würfel enden
        const diceValue = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
        imgElement?.setAttribute("src", "./Pictures/" + diceValue + ".png")
    }

    if (dices[0]) {
        dices[0].addEventListener("click", () => {rollDice(1)});
    }
})