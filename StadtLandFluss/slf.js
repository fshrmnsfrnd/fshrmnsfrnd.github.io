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
document.addEventListener("DOMContentLoaded", function () {
    //HTML Elements
    var catsDiv = document.getElementById("categories");
    var addCatBtn = document.getElementById("addCategorie");
    var ownCatField = document.getElementById("ownCategory");
    var startGameBtn = document.getElementById("startGame");
    var bigCatsDiv = document.getElementById("selectCategories");
    var table = document.getElementById("game");
    //Begin
    //Add all Categorys to List
    standardCats.forEach(function (catName) {
        if (catsDiv) {
            catsDiv.appendChild(createCatElement(catName));
        }
    });
    //Add an own Category
    if (addCatBtn && catsDiv) {
        addCatBtn.addEventListener("click", function () {
            var ownCatName = ownCatField.value;
            //New Category Element
            if (ownCatField && ownCatName !== "") {
                catsDiv.appendChild(createCatElement(ownCatName));
            }
        });
    }
    //Start Game
    if (startGameBtn) {
        startGameBtn.addEventListener("click", function () {
            if (catsDiv) {
                var allCats = catsDiv.querySelectorAll("div input");
                allCats.forEach(function (checkbox) {
                    var catName = checkbox.value;
                    if (catName && catName !== "" && checkbox instanceof HTMLInputElement && checkbox.checked) {
                        selectedCats.push(catName);
                    }
                });
                if (bigCatsDiv && selectedCats.length != 0) {
                    bigCatsDiv.style.display = "none";
                    //After Categories select 
                    //While playing the Game
                    selectedCats.forEach(function (cat) {
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
                        var valueBox = document.createElement("input");
                        inputBox.setAttribute("type", "number");
                        var valueCell = document.createElement("td");
                        valueCell.appendChild(valueBox);
                        //Append Row
                        var row = document.createElement("tr");
                        row.appendChild(catNameCell);
                        row.appendChild(inputCell);
                        row.appendChild(valueCell);
                        table === null || table === void 0 ? void 0 : table.appendChild(row);
                    });
                    var resultText = document.createTextNode("result");
                    var resultCell = document.createElement("td");
                    resultCell.appendChild(resultText);
                    var row = document.createElement("tr");
                    row.appendChild(resultCell);
                    table === null || table === void 0 ? void 0 : table.appendChild(row);
                }
            }
        });
    }
});
