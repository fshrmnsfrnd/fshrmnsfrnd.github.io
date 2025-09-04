document.addEventListener("DOMContentLoaded", () => {
    "use strict";
    const categoriesElement = document.getElementById("categories");
    const checkboxTemplate: string =
        '<div class="category"><input type="checkbox" name="{category}" id="{category}" value="{category}"><label for="{category}">  {category}</label></div>';
    const startButton = document.getElementById("start");
    const chooseCategories = document.getElementById("chooseCategories");
    const currentWord = document.getElementById("word");
    const game = document.getElementById("game");
    const resetCategories = document.getElementById("resetCategories");
    let words: string[] = []

    // Funktion zum Laden der JSON-Datei
    async function getCategories(): Promise<string[]> {
        const response = await fetch("./words.json");
        const data: string[] = await response.json();
        return Object.keys(data);
    }

    // Funktion zum Rendern der Kategorien
    function renderCategories(cats: string[]) {
        if (categoriesElement) {
            categoriesElement.innerHTML = ""; // Leere den Container
            cats.forEach((category: string) => {
                const checkboxHtml = checkboxTemplate.replace(/{category}/g, category);
                categoriesElement.innerHTML += checkboxHtml;
            });
        }
    }

    async function main() {
        const categories = await getCategories();
        renderCategories(categories);
    }

    main();

    //---------------------------------------------------------------------------------------------------

    async function getWordsFromCategories(selectedCategories: string[]) {
        const response = await fetch("./words.json");
        const data = await response.json();

        words = selectedCategories.flatMap(
            (category) => data[category] ?? []
        );
    }

    function nextWord() {
            if (words.length > 0) {
                const wordNum = Math.floor(Math.random() * words.length)
                const randomWord: string = words[wordNum]
                words.splice(wordNum, 1)
                if (currentWord) {
                    currentWord.textContent = randomWord;
                }
            } else {
                if (currentWord) {
                    currentWord.textContent = "Keine Wörter gefunden.";
                }
            }
    }

    if (startButton) {
        startButton.addEventListener("click", () => {
            if (chooseCategories && game) {
                chooseCategories.style.display = "none";
                game.style.display = "block";
                const selectedCategories: string[] = Array.from(
                    document.querySelectorAll<HTMLInputElement>(
                        "#categories input[type='checkbox']:checked"
                    )
                ).map((checkbox) => checkbox.value);
                getWordsFromCategories(selectedCategories).then(() => {
                    nextWord();
                });
            }
        })
    }

    if (resetCategories) {
        resetCategories.addEventListener("click", () => {
            chooseCategories!.style.display = "block";
            game!.style.display = "none";
        });
    }

    document.addEventListener("click", () => {
        nextWord();
    });
});