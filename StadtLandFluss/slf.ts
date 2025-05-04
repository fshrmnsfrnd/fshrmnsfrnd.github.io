let selectedCats: string[] = []
const standardCats: string[] = ["Stadt", "Land", "Fluss", "Marke", "Tier", "Lied", "Sexstellung", "Promi", "Schimpfwort"]

function createCatElement(name: string): HTMLElement {
    const checkbox = document.createElement("input")
    checkbox.setAttribute("type", "checkbox")
    const value = name;
    checkbox.setAttribute("id", value)
    checkbox.setAttribute("value", value)
    const text = document.createElement("p")
    text.innerText = value
    const catDiv = document.createElement("div")
    catDiv.setAttribute("class", "category")
    catDiv.appendChild(checkbox)
    catDiv.appendChild(text)

    return catDiv
}

document.addEventListener("DOMContentLoaded", () => {
    //HTML Elements
    const catsDiv = document.getElementById("categories")
    const addCatBtn = document.getElementById("addCategorie")
    const ownCatField = document.getElementById("ownCategory")
    const startGameBtn = document.getElementById("startGame")
    const bigCatsDiv = document.getElementById("selectCategories")
    const table = document.getElementById("game")

    //Begin
    //Add all Categorys to List
    standardCats.forEach((catName) => {
        if (catsDiv) {
            catsDiv.appendChild(createCatElement(catName))
        }
    })

    //Add an own Category
    if (addCatBtn && catsDiv) {
        addCatBtn.addEventListener("click", () => {
            const ownCatName = (ownCatField as HTMLInputElement).value;
            //New Category Element
            if (ownCatField && ownCatName !== "") {
                catsDiv.appendChild(createCatElement(ownCatName))
            }
        })
    }

    //Start Game
    if (startGameBtn) {
        startGameBtn.addEventListener("click", () => {
            if (catsDiv) {
                const allCats = catsDiv.querySelectorAll("div input")

                allCats.forEach((checkbox) => {
                    const catName = (checkbox as HTMLInputElement).value
                    if (catName && catName !== "" && checkbox instanceof HTMLInputElement && checkbox.checked) {
                        selectedCats.push(catName)
                    }
                })

                if (bigCatsDiv && selectedCats.length != 0) {
                    bigCatsDiv.style.display = "none";

                    //After Categories select 
                    //While playing the Game

                    selectedCats.forEach((cat) => {
                        //CategorieName
                        const catNameText = document.createTextNode(cat)
                        const catNameCell = document.createElement("td")
                        catNameCell.appendChild(catNameText)
                        //Input
                        const inputBox = document.createElement("input")
                        inputBox.setAttribute("type", "text")
                        const inputCell = document.createElement("td")
                        inputCell.appendChild(inputBox)
                        //Result
                        const valueBox = document.createElement("input")
                        inputBox.setAttribute("type", "number")
                        const valueCell = document.createElement("td")
                        valueCell.appendChild(valueBox)
                        //Append Row
                        const row = document.createElement("tr")
                        row.appendChild(catNameCell)
                        row.appendChild(inputCell)
                        row.appendChild(valueCell)

                        table?.appendChild(row)
                    })

                    const resultText = document.createTextNode("result")
                    const resultCell = document.createElement("td")
                    resultCell.appendChild(resultText)
                    const row = document.createElement("tr")
                    row.appendChild(resultCell)
                    table?.appendChild(row)
                }
            }
        })
    }
})