document.addEventListener("DOMContentLoaded", () => {
    "use strict";
    const categoriesElement = document.getElementById("categories");
    const checkboxTemplate: string =
      '<input type="checkbox" name="{category}" id="{category}" value="{category}"><label for="{category}">  {category}</label><br>';
    const startButton = document.getElementById("start");
    const chooseCategories = document.getElementById("chooseCategories");
    const currentWord = document.getElementById("word");
    const game = document.getElementById("game");
    const resetCategories = document.getElementById("resetCategories");

    // Funktion zum Laden der JSON-Datei
    async function getCategories(): Promise<string[]> {
        const response = await fetch("./words.json");
        const data: string[] = await response.json();
        return Object.keys(data);
    }

    // Funktion zum Rendern der Kategorien
    function renderCategories(cats: string[]) {
        console.log()
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
        if(game){
            game.style.display = "none";
        }
    }

    main();

    //---------------------------------------------------------------------------------------------------

    async function getWordsFromCategories(selectedCategories: string[]): Promise<string[]> {
        const response = await fetch("./words.json");
        const data = await response.json();

        const words = selectedCategories.flatMap(
            (category) => data[category] ?? []
        );

        return words;
    }

    function nextWord(){
        const selectedCategories: string[] = Array.from(
          document.querySelectorAll<HTMLInputElement>(
            "#categories input[type='checkbox']:checked"
          )
        ).map((checkbox) => checkbox.value);

    getWordsFromCategories(selectedCategories).then((words: string[]) => {
      if (words.length > 0) {
        const randomWord: string =
          words[Math.floor(Math.random() * words.length)];
        if(currentWord){
            currentWord.textContent = randomWord;
        }
      } else {
        console.log("Keine Wörter gefunden.");
        if(currentWord){
            currentWord.textContent = "Keine Wörter gefunden.";
        }
      }
    });}

    if(startButton){
        startButton.addEventListener("click", () => {
            if(chooseCategories && game){
                chooseCategories.style.display = "none";
                game.style.display = "block";
                nextWord();
            }
        })
    }

    if (resetCategories) {
        resetCategories.addEventListener("click", () => {
            chooseCategories!.style.display = "block";
            game!.style.display = "none";
        });
    }

    if (game) {
        game.addEventListener("click", () => {
            nextWord();
        });
    }
});