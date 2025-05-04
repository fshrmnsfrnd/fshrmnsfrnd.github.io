var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var selectedCats = [];
var standardCats = ["Stadt", "Land", "Fluss", "Marke", "Tier", "Lied", "Sexstellung", "Promi", "Schimpfwort", "Ikea", "Dumme Art zu sterben"];
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
    var resultCell = document.createElement("th");
    resultCell.appendChild(resultText);
    var wordElement = document.createElement("h6");
    wordElement.innerText = "Wort";
    var wordDescriptionCell = document.createElement("th");
    wordDescriptionCell.appendChild(wordElement);
    var valueElement = document.createElement("h6");
    valueElement.innerText = "Punkte";
    var valueDescriptionCell = document.createElement("th");
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
        inputBox.setAttribute("class", "wordInput");
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
function sleep(time) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    setTimeout(function () {
                        resolve();
                    }, time);
                })];
        });
    });
}
function rollLetters() {
    return __awaiter(this, void 0, void 0, function () {
        var textElement, letter, i_1, letterValue, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    textElement = document.getElementById("letter");
                    i_1 = 65;
                    _a.label = 1;
                case 1:
                    if (!(i_1 <= 90)) return [3 /*break*/, 4];
                    return [4 /*yield*/, sleep(50)];
                case 2:
                    _a.sent();
                    letter = String.fromCharCode(i_1);
                    if (textElement) {
                        textElement.innerText = letter;
                    }
                    _a.label = 3;
                case 3:
                    i_1++;
                    return [3 /*break*/, 1];
                case 4:
                    letterValue = Math.floor(Math.random() * (90 - 65 + 1)) + 65;
                    i = 65;
                    _a.label = 5;
                case 5:
                    if (!(i <= letterValue)) return [3 /*break*/, 8];
                    return [4 /*yield*/, sleep(50)];
                case 6:
                    _a.sent();
                    letter = String.fromCharCode(i);
                    if (textElement) {
                        textElement.innerText = letter;
                    }
                    _a.label = 7;
                case 7:
                    i++;
                    return [3 /*break*/, 5];
                case 8: return [2 /*return*/, letter];
            }
        });
    });
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
    var letterChoice = document.getElementById("letter");
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
    //Add Table / Game
    newGameBtn === null || newGameBtn === void 0 ? void 0 : newGameBtn.addEventListener("click", function () {
        if (game) {
            createGameTable(game, selectedCats);
        }
    });
    //Generate random Letter and animate it
    letterChoice === null || letterChoice === void 0 ? void 0 : letterChoice.addEventListener("click", function () {
        var wordFields = document.querySelectorAll(".wordInput");
        rollLetters().then(function (letter) {
            wordFields.forEach(function (wordField) {
                wordField.setAttribute("value", letter.toString());
            });
        });
    });
});
