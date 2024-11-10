//Elemente
const buttonadddrink = document.getElementById("adddrink");
var timetable = document.getElementById("timetable");
const drinktypes = document.getElementsByClassName("typeofdrink");
const buttonpromillenow = document.getElementById("promillejetzt");

//globale Variablen
var drinkcounter = 1;

//Konstanten
const getranke = new Map([
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

const timecell = `<input type="time" class="timeofdrink" id="time${drinkcounter}">`;
const drinkcell = `<select class="typeofdrink" id="drink${drinkcounter}"><option value="bier">Bier</option><option value="wein">Wein</option></select>`;
const percentcell = `<input type="number" class="percentofdrink" id="percent${drinkcounter}">`;
const amountcell = `<input type="number" class="drinkamount" id="amount${drinkcounter}" value="${getranke.get(document.getElementById(`drink${drinkcounter}`))}">`;

//Funktionen
function adddrink() {
    var newRow = timetable.insertRow();
    newRow.insertCell(0).innerHTML = timecell;
    newRow.insertCell(1).innerHTML = drinkcell;
    newRow.insertCell(2).innerHTML = percentcell;
    newRow.insertCell(3).innerHTML = amountcell;
    drinkcounter++;
}

function updatedrinkvalues(){
    for(var i = 1; i <= timetable.rows.length; i++){
        var getrank = getranke.get(document.getElementById(`drink${i}`));
        var [percent, amount] = getrank;
        document.getElementById(`percent${i}`).innerHTML = percent;
        document.getElementById(`amount${i}`).innerHTML = amount;
    }
}

//Seitenstart
adddrink();

buttonadddrink.addEventListener("click", () => {
    adddrink();
});

//Alkuholgehalt anzeigen fehlt noch

drinktypes.addEventListener("change", () => {
    updatedrinkvalues();
});

buttonpromillenow.addEventListener("click", () => {
});