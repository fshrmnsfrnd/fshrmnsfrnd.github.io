//Elemente
const buttonadddrink = document.getElementById("adddrink");
const timetable = document.getElementById("timetable");
const drinktypes = document.getElementsByClassName("typeofdrink");
const buttonpromillenow = document.getElementById("promillejetzt");

//globale Variablen
var drinkcounter = 1;

//Konstanten
const getranke = [
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
    ["Sonstiges", 0, 0]
];

/*
const timecell = `<input type="time" class="timeofdrink" id="time${drinkcounter}">`;
const drinkcell = `<select class="typeofdrink" id="drink${drinkcounter}"></select>`;
const percentcell = `<input type="number" class="percentofdrink" id="percent${drinkcounter}">`;
const amountcell = `<input type="number" class="drinkamount" id="amount${drinkcounter}">`;
*/

function getCellTemplates(drinkcounter) {
    return {
        timecell: `<input type="time" class="timeofdrink" id="time${drinkcounter}">`,
        drinkcell: `<select class="typeofdrink" id="drink${drinkcounter}"></select>`,
        percentcell: `<input type="number" class="percentofdrink" id="percent${drinkcounter}">`,
        amountcell: `<input type="number" class="drinkamount" id="amount${drinkcounter}">`
    };
}

//Funktionen
function adddrink() {
    const { timecell, drinkcell, percentcell, amountcell } = getCellTemplates(drinkcounter);
    var newRow = timetable.insertRow();
    newRow.insertCell(0).innerHTML = timecell;

    newRow.insertCell(1).innerHTML = drinkcell;
    createdrinkdropdown();
    
    newRow.insertCell(2).innerHTML = percentcell;
    newRow.insertCell(3).innerHTML = amountcell;
    drinkcounter++;
}

function updatedrinkvalues(){
    /*for(var i = 1; i <= timetable.rows.length; i++){
        var getrank = getranke.find(document.getElementById(`drink${i}`).value);
        var [getrank, percent, amount] = getrank;
        document.getElementById(`percent${i}`).innerHTML = percent;
        document.getElementById(`amount${i}`).innerHTML = amount;
    }*/
    for (let i = 1; i <= timetable.rows.length; i++) {
        const drinkDropdown = document.getElementById(`drink${i}`);
        const selectedDrinkName = drinkDropdown.value;

        const selectedDrink = getranke.find(drink => drink[0] === selectedDrinkName);
        if (selectedDrink) {
            const [name, percent, amount] = selectedDrink;
            document.getElementById(`percent${i}`).value = percent;
            document.getElementById(`amount${i}`).value = amount;
        }
    }
}

function createdrinkdropdown(){
    /*var i = 0;
    const dropdown = document.getElementById(`drink${drinkcounter}`);
    while(i < getranke.rows){
        var Value = getranke[i][0];
        var option = document.createElement("option");
        option.value = Value;
        option.innerText = Value;
        dropdown.appendChild(option).addEventListener("change", () => {
            updatedrinkvalues();
        });;
        i++;
    }*/
        const dropdown = document.getElementById(`drink${drinkcounter}`);
    
        getranke.forEach(drink => {
            const option = document.createElement("option");
            option.value = drink[0];
            option.innerText = drink[0];
            dropdown.appendChild(option); 
        });
    
        dropdown.addEventListener("change", () => {
            updatedrinkvalues();
        });
}

//Seitenstart
adddrink();

buttonadddrink.addEventListener("click", () => {
    adddrink();
});

buttonpromillenow.addEventListener("click", () => {
});