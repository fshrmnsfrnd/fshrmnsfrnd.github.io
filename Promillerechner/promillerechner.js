//Elemente
const buttonadddrink = document.getElementById("adddrink");
var timetable = document.getElementById("timetable");
const buttonpromillenow = document.getElementById("promillejetzt");

//globale Variablen
var drinkcounter = 2;

//Konstanten
const drinkpercent = new Map([
    ["Bier", 5, 500],
    ["Wein", 12, 200],
    ["Sekt", 11, 100],
    ["Wodka", 40, 2],
    ["Whiskey", 40, 2],
    ["Rum", 38, 2],
    ["Gin", 37.5, 2],
    ["Tequila", 38, 2],
    ["Cognac", 40, 2],
    ["Likör", 20, 2],
    ["Champagner", 12, 100]
]);

//Funktionen
function adddrink() {
    const newRow = timetable.insertRow();
    newRow.insertCell(0).innerHTML = `<input type="time" id="time${drinkcounter}">`;
    newRow.insertCell(1).innerHTML = `<select id="drink${drinkcounter}"><option value="bier">Bier</option><option value="wein">Wein</option></select>`;
    drinkcounter++;
}

//Seitenstart
adddrink();

buttonadddrink.addEventListener("click", () => {
    adddrink();
});

//Alkuholgehalt anzeigen fehlt noch

buttonpromillenow.addEventListener("click", () => {
});