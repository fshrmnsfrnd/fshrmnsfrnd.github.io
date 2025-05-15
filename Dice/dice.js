"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
addEventListener("DOMContentLoaded", (event) => {
    let dices = [];
    const addDiceButton = document.getElementById("addDice");
    const diceContainer = document.getElementById("dicecontainer");
    let anzahlDices = 0;
    function sleep(time) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, time);
            });
        });
    }
    function rollDice(diceID) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const imgElement = (_a = document.getElementById(diceID.toString())) === null || _a === void 0 ? void 0 : _a.querySelector("img");
            //Wurfel animieren
            for (let j = 1; j <= 3; j++) {
                for (let i = 1; i <= 6; i++) {
                    yield sleep(100);
                    imgElement === null || imgElement === void 0 ? void 0 : imgElement.setAttribute("src", "./Pictures/" + i + ".png");
                }
            }
            //Wurfel enden
            const diceValue = Math.floor(Math.random() * (6)) + 1;
            imgElement === null || imgElement === void 0 ? void 0 : imgElement.setAttribute("src", "./Pictures/" + diceValue + ".png");
        });
    }
    addDiceButton === null || addDiceButton === void 0 ? void 0 : addDiceButton.addEventListener("click", () => {
        anzahlDices++;
        //Nachsten Wurfel erstellen
        const nextDice = document.createElement("div");
        //Bildelement für Wurfel erstellen
        const img = document.createElement("img");
        img.setAttribute("src", "./Pictures/1.png");
        nextDice.appendChild(img);
        nextDice.innerHTML = '<img src="./Pictures/1.png">';
        nextDice.setAttribute("class", "dice");
        nextDice.setAttribute("id", anzahlDices.toString());
        const diceID = parseInt(nextDice.getAttribute("id"));
        diceContainer === null || diceContainer === void 0 ? void 0 : diceContainer.appendChild(nextDice);
        nextDice.addEventListener("click", () => { rollDice(diceID); });
    });
    addDiceButton === null || addDiceButton === void 0 ? void 0 : addDiceButton.click();
});
