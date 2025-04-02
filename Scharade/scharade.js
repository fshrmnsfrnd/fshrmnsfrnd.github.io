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
const categorysElement = document.getElementById("categories");
const checkboxTemplate = '<input type="checkbox" name="{category}" id="{category}" value="{category}">';
var categories = [];
function loadJson() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('./words.json');
        const data = yield response.json();
        categories = Object.keys(data);
    });
}
loadJson();
console.log(categories);
categories.forEach((category) => {
    categorysElement.innerHTML = checkboxTemplate.replace('{category}', category);
    console.log("foreach");
});
