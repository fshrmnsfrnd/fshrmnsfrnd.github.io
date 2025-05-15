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
let selectedCats = [];
const standardCats = ["Stadt", "Land", "Fluss", "Marke", "Tier", "Lied", "Sexstellung", "Promi", "Schimpfwort", "Ikea", "Dumme Art zu sterben"];
function createCatElement(name) {
    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    const value = name;
    checkbox.setAttribute("id", value);
    checkbox.setAttribute("value", value);
    const text = document.createElement("p");
    text.innerText = value;
    const catDiv = document.createElement("div");
    catDiv.setAttribute("class", "category");
    catDiv.appendChild(checkbox);
    catDiv.appendChild(text);
    return catDiv;
}
function createGameTable(gamebox, categories) {
    const table = document.createElement("table");
    //Description Row
    const resultText = document.createElement("p");
    resultText.setAttribute("class", "resultBox");
    resultText.innerHTML = "0";
    const resultCell = document.createElement("th");
    resultCell.appendChild(resultText);
    const wordElement = document.createElement("h6");
    wordElement.innerText = "Wort";
    const wordDescriptionCell = document.createElement("th");
    wordDescriptionCell.appendChild(wordElement);
    const valueElement = document.createElement("h6");
    valueElement.innerText = "Punkte";
    const valueDescriptionCell = document.createElement("th");
    valueDescriptionCell.appendChild(valueElement);
    const descriptionRow = document.createElement("tr");
    descriptionRow.appendChild(resultCell);
    descriptionRow.appendChild(wordDescriptionCell);
    descriptionRow.appendChild(valueDescriptionCell);
    table === null || table === void 0 ? void 0 : table.appendChild(descriptionRow);
    //Append Categories
    categories.forEach((cat) => {
        //CategorieName
        const catNameText = document.createTextNode(cat);
        const catNameCell = document.createElement("td");
        catNameCell.appendChild(catNameText);
        //Input
        const inputBox = document.createElement("input");
        inputBox.setAttribute("type", "text");
        inputBox.setAttribute("class", "wordInput");
        const inputCell = document.createElement("td");
        inputCell.appendChild(inputBox);
        //Result
        const pointsBox = document.createElement("input");
        pointsBox.setAttribute("class", "points");
        pointsBox.setAttribute("type", "number");
        const valueCell = document.createElement("td");
        valueCell.appendChild(pointsBox);
        //Append Row
        const row = document.createElement("tr");
        row.appendChild(catNameCell);
        row.appendChild(inputCell);
        row.appendChild(valueCell);
        table === null || table === void 0 ? void 0 : table.appendChild(row);
    });
    gamebox.appendChild(table);
}
function sleep(time) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    });
}
function rollLetters() {
    return __awaiter(this, void 0, void 0, function* () {
        const textElement = document.getElementById("letter");
        let letter = "";
        //Animation
        for (let i = 65; i <= 90; i++) {
            yield sleep(50);
            letter = String.fromCharCode(i);
            if (textElement) {
                textElement.innerText = letter;
            }
        }
        //Random letter
        const letterValue = Math.floor(Math.random() * (90 - 65 + 1)) + 65;
        let i;
        for (i = 65; i <= letterValue; i++) {
            yield sleep(50);
            letter = String.fromCharCode(i);
            if (textElement) {
                textElement.innerText = letter;
            }
        }
        return letter;
    });
}
document.addEventListener("DOMContentLoaded", () => {
    //HTML Elements
    const catsDiv = document.getElementById("categories");
    const addCatBtn = document.getElementById("addCategorie");
    const ownCatField = document.getElementById("ownCategory");
    const startGameBtn = document.getElementById("startGame");
    const bigCatsDiv = document.getElementById("selectCategories");
    const game = document.getElementById("game");
    const body = document.getElementById("body");
    const newGameBtn = document.getElementById("newGame");
    const overallResult = document.getElementById("overallResult");
    const letterChoice = document.getElementById("letter");
    //Begin
    //Add all Categorys to List
    standardCats.forEach((catName) => {
        if (catsDiv) {
            catsDiv.appendChild(createCatElement(catName));
        }
    });
    //Add an own Category
    addCatBtn === null || addCatBtn === void 0 ? void 0 : addCatBtn.addEventListener("click", () => {
        const ownCatName = ownCatField.value;
        //New Category Element
        if (ownCatField && ownCatName !== "") {
            catsDiv === null || catsDiv === void 0 ? void 0 : catsDiv.appendChild(createCatElement(ownCatName));
        }
    });
    //Start Game
    startGameBtn === null || startGameBtn === void 0 ? void 0 : startGameBtn.addEventListener("click", () => {
        if (catsDiv) {
            //Read selected Categories
            const allCats = catsDiv.querySelectorAll("div input");
            allCats.forEach((checkbox) => {
                const catName = checkbox.value;
                if (catName && catName !== "" && checkbox instanceof HTMLInputElement && checkbox.checked) {
                    selectedCats.push(catName);
                }
            });
            //Build Game
            if (letterChoice && overallResult && newGameBtn && bigCatsDiv && selectedCats.length != 0 && game) {
                bigCatsDiv.style.display = "none";
                newGameBtn.style.display = "block";
                overallResult.style.display = "block";
                letterChoice.style.display = "block";
                createGameTable(game, selectedCats);
            }
        }
    });
    //Calculate Results
    body === null || body === void 0 ? void 0 : body.addEventListener("click", () => {
        const tables = document.querySelectorAll("table");
        let allResult = 0;
        tables.forEach((table) => {
            const pointCells = table.querySelectorAll(".points");
            const resultBox = table.querySelector(".resultBox");
            let result = 0;
            pointCells.forEach(pointCell => {
                let pointCellValue = Number(pointCell.value);
                if (!isNaN(pointCellValue)) {
                    result += pointCellValue;
                }
            });
            if (resultBox) {
                if (result) {
                    resultBox.innerHTML = result.toString();
                }
            }
            allResult += result;
        });
        if (overallResult) {
            overallResult.innerHTML = "Gesamt: " + allResult.toString();
        }
    });
    //Add Table / Game
    newGameBtn === null || newGameBtn === void 0 ? void 0 : newGameBtn.addEventListener("click", () => {
        if (game) {
            createGameTable(game, selectedCats);
        }
    });
    //Generate random Letter and animate it
    letterChoice === null || letterChoice === void 0 ? void 0 : letterChoice.addEventListener("click", () => {
        const tables = document.querySelectorAll(".wordInput");
        const currTable = tables[tables.length - 1];
        const wordFields = currTable.querySelectorAll(".wordInput");
        rollLetters().then((letter) => {
            wordFields.forEach(wordField => {
                wordField.setAttribute("value", letter.toString());
            });
        });
    });
});
