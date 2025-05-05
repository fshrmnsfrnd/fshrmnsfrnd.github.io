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
document.addEventListener("DOMContentLoaded", function () {
    "use strict";
    var categoriesElement = document.getElementById("categories");
    var checkboxTemplate = '<input type="checkbox" name="{category}" id="{category}" value="{category}"><label for="{category}">  {category}</label><br>';
    var startButton = document.getElementById("start");
    var chooseCategories = document.getElementById("chooseCategories");
    var currentWord = document.getElementById("word");
    var game = document.getElementById("game");
    var resetCategories = document.getElementById("resetCategories");
    var words = [];
    // Funktion zum Laden der JSON-Datei
    function getCategories() {
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("./words.json")];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, Object.keys(data)];
                }
            });
        });
    }
    // Funktion zum Rendern der Kategorien
    function renderCategories(cats) {
        if (categoriesElement) {
            categoriesElement.innerHTML = ""; // Leere den Container
            cats.forEach(function (category) {
                var checkboxHtml = checkboxTemplate.replace(/{category}/g, category);
                categoriesElement.innerHTML += checkboxHtml;
            });
        }
    }
    function main() {
        return __awaiter(this, void 0, void 0, function () {
            var categories;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getCategories()];
                    case 1:
                        categories = _a.sent();
                        renderCategories(categories);
                        return [2 /*return*/];
                }
            });
        });
    }
    main();
    //---------------------------------------------------------------------------------------------------
    function getWordsFromCategories(selectedCategories) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("./words.json")];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        words = selectedCategories.flatMap(function (category) { var _a; return (_a = data[category]) !== null && _a !== void 0 ? _a : []; });
                        return [2 /*return*/];
                }
            });
        });
    }
    function nextWord() {
        if (words.length > 0) {
            var wordNum = Math.floor(Math.random() * words.length);
            var randomWord = words[wordNum];
            words.splice(wordNum);
            if (currentWord) {
                currentWord.textContent = randomWord;
            }
        }
        else {
            if (currentWord) {
                currentWord.textContent = "Keine Wörter gefunden.";
            }
        }
    }
    if (startButton) {
        startButton.addEventListener("click", function () {
            if (chooseCategories && game) {
                chooseCategories.style.display = "none";
                game.style.display = "block";
                var selectedCategories = Array.from(document.querySelectorAll("#categories input[type='checkbox']:checked")).map(function (checkbox) { return checkbox.value; });
                getWordsFromCategories(selectedCategories);
                nextWord();
            }
        });
    }
    if (resetCategories) {
        resetCategories.addEventListener("click", function () {
            chooseCategories.style.display = "block";
            game.style.display = "none";
        });
    }
    if (game) {
        game.addEventListener("click", function () {
            nextWord();
        });
    }
});
