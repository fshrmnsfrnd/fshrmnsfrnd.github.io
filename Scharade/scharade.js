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
document.addEventListener("DOMContentLoaded", () => {
    "use strict";
    const categoriesElement = document.getElementById("categories");
    const checkboxTemplate = '<input type="checkbox" name="{category}" id="{category}" value="{category}"><label for="{category}">  {category}</label><br>';
    const startButton = document.getElementById("start");
    const chooseCategories = document.getElementById("chooseCategories");
    const currentWord = document.getElementById("word");
    const game = document.getElementById("game");
    const resetCategories = document.getElementById("resetCategories");
    // Funktion zum Laden der JSON-Datei
    function getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch("./words.json");
            const data = yield response.json();
            return Object.keys(data);
        });
    }
    // Funktion zum Rendern der Kategorien
    function renderCategories(cats) {
        console.log();
        if (categoriesElement) {
            categoriesElement.innerHTML = ""; // Leere den Container
            cats.forEach((category) => {
                const checkboxHtml = checkboxTemplate.replace(/{category}/g, category);
                categoriesElement.innerHTML += checkboxHtml;
            });
        }
    }
    function main() {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield getCategories();
            renderCategories(categories);
            if (game) {
                game.style.display = "none";
            }
        });
    }
    main();
    //---------------------------------------------------------------------------------------------------
    function getWordsFromCategories(selectedCategories) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch("./words.json");
            const data = yield response.json();
            const words = selectedCategories.flatMap((category) => { var _a; return (_a = data[category]) !== null && _a !== void 0 ? _a : []; });
            return words;
        });
    }
    function nextWord() {
        const selectedCategories = Array.from(document.querySelectorAll("#categories input[type='checkbox']:checked")).map((checkbox) => checkbox.value);
        getWordsFromCategories(selectedCategories).then((words) => {
            if (words.length > 0) {
                const randomWord = words[Math.floor(Math.random() * words.length)];
                if (currentWord) {
                    currentWord.textContent = randomWord;
                }
            }
            else {
                console.log("Keine Wörter gefunden.");
                if (currentWord) {
                    currentWord.textContent = "Keine Wörter gefunden.";
                }
            }
        });
    }
    if (startButton) {
        startButton.addEventListener("click", () => {
            if (chooseCategories && game) {
                chooseCategories.style.display = "none";
                game.style.display = "block";
                nextWord();
            }
        });
    }
    if (resetCategories) {
        resetCategories.addEventListener("click", () => {
            chooseCategories.style.display = "block";
            game.style.display = "none";
        });
    }
    if (game) {
        game.addEventListener("click", () => {
            nextWord();
        });
    }
});
