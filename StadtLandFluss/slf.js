var selectedCats = [];
var standardCats = ["Stadt", "Land", "Fluss", "Marke", "Tier", "Lied", "Sexstellung", "Promi", "Schimpfwort"];
function createCatElement(name) {
    var checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    var value = name;
    checkbox.setAttribute("id", value);
    checkbox.setAttribute("value", value);
    var text = document.createElement("p");
    text.innerText = value;
    var catDiv = document.createElement("div");
    catDiv.setAttribute("class", "category");
    catDiv.appendChild(checkbox);
    catDiv.appendChild(text);
    return catDiv;
}
function createGameTable(gamebox, categories) {
    var table = document.createElement("table");
    //Description Row
    var resultText = document.createElement("p");
    resultText.setAttribute("class", "resultBox");
    resultText.innerHTML = "0";
    var resultCell = document.createElement("td");
    resultCell.appendChild(resultText);
    var wordElement = document.createElement("h6");
    wordElement.innerText = "Wort";
    var wordDescriptionCell = document.createElement("td");
    wordDescriptionCell.appendChild(wordElement);
    var valueElement = document.createElement("h6");
    valueElement.innerText = "Punkte";
    var valueDescriptionCell = document.createElement("td");
    valueDescriptionCell.appendChild(valueElement);
    var descriptionRow = document.createElement("tr");
    descriptionRow.appendChild(resultCell);
    descriptionRow.appendChild(wordDescriptionCell);
    descriptionRow.appendChild(valueDescriptionCell);
    table === null || table === void 0 ? void 0 : table.appendChild(descriptionRow);
    //Append Categories
    categories.forEach(function (cat) {
        //CategorieName
        var catNameText = document.createTextNode(cat);
        var catNameCell = document.createElement("td");
        catNameCell.appendChild(catNameText);
        //Input
        var inputBox = document.createElement("input");
        inputBox.setAttribute("type", "text");
        var inputCell = document.createElement("td");
        inputCell.appendChild(inputBox);
        //Result
        var pointsBox = document.createElement("input");
        pointsBox.setAttribute("class", "points");
        pointsBox.setAttribute("type", "number");
        var valueCell = document.createElement("td");
        valueCell.appendChild(pointsBox);
        //Append Row
        var row = document.createElement("tr");
        row.appendChild(catNameCell);
        row.appendChild(inputCell);
        row.appendChild(valueCell);
        table === null || table === void 0 ? void 0 : table.appendChild(row);
    });
    gamebox.appendChild(table);
}
document.addEventListener("DOMContentLoaded", function () {
    //HTML Elements
    var catsDiv = document.getElementById("categories");
    var addCatBtn = document.getElementById("addCategorie");
    var ownCatField = document.getElementById("ownCategory");
    var startGameBtn = document.getElementById("startGame");
    var bigCatsDiv = document.getElementById("selectCategories");
    var game = document.getElementById("game");
    var body = document.getElementById("body");
    var newGameBtn = document.getElementById("newGame");
    var overallResult = document.getElementById("overallResult");
    //Begin
    //Add all Categorys to List
    standardCats.forEach(function (catName) {
        if (catsDiv) {
            catsDiv.appendChild(createCatElement(catName));
        }
    });
    //Add an own Category
    addCatBtn === null || addCatBtn === void 0 ? void 0 : addCatBtn.addEventListener("click", function () {
        var ownCatName = ownCatField.value;
        //New Category Element
        if (ownCatField && ownCatName !== "") {
            catsDiv === null || catsDiv === void 0 ? void 0 : catsDiv.appendChild(createCatElement(ownCatName));
        }
    });
    //Start Game
    startGameBtn === null || startGameBtn === void 0 ? void 0 : startGameBtn.addEventListener("click", function () {
        if (catsDiv) {
            //Read selected Categories
            var allCats = catsDiv.querySelectorAll("div input");
            allCats.forEach(function (checkbox) {
                var catName = checkbox.value;
                if (catName && catName !== "" && checkbox instanceof HTMLInputElement && checkbox.checked) {
                    selectedCats.push(catName);
                }
            });
            //Build Game
            if (overallResult && newGameBtn && bigCatsDiv && selectedCats.length != 0 && game) {
                bigCatsDiv.style.display = "none";
                newGameBtn.style.display = "block";
                overallResult.style.display = "block";
                createGameTable(game, selectedCats);
            }
        }
    });
    //Calculate Results
    body === null || body === void 0 ? void 0 : body.addEventListener("click", function () {
        var tables = document.querySelectorAll("table");
        var allResult = 0;
        tables.forEach(function (table) {
            var pointCells = table.querySelectorAll(".points");
            var resultBox = table.querySelector(".resultBox");
            var result = 0;
            pointCells.forEach(function (pointCell) {
                var pointCellValue = Number(pointCell.value);
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
    newGameBtn === null || newGameBtn === void 0 ? void 0 : newGameBtn.addEventListener("click", function () {
        if (game) {
            createGameTable(game, selectedCats);
        }
    });
});
