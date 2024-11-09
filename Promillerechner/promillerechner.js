//Elemente
const buttonadddrink = document.getElementById("adddrink");
var timetable = document.getElementById("timetable");
const buttonpromillenow = document.getElementById("promillejetzt");

//globale Variablen
var drinkcounter = 2;

//Konstanten
const drinkpercent = new Map([
    ["Bier", 5],
    ["Wein", 12],
    ["Sekt", 11],
    ["Wodka", 40],
    ["Whiskey", 40],
    ["Rum", 38],
    ["Gin", 37.5],
    ["Tequila", 38],
    ["Cognac", 40],
    ["Likör", 20],
    ["Champagner", 12]
]);

buttonadddrink.addEventListener("click", () => {
    const newRow = timetable.insertRow();
    newRow.insertCell(0).innerHTML = `<input type="time" id="time${drinkcounter}">`;
    newRow.insertCell(1).innerHTML = `<select id="drink${drinkcounter}"><option value="bier">Bier</option><option value="wein">Wein</option></select>`;
    drinkcounter++;
});

//Alkuholgehalt anzeigen fehlt noch

buttonpromillenow.addEventListener("click", () => {
   alcingramm = 
});