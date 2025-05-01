addEventListener("DOMContentLoaded", function (event) {
    var table = document.getElementById("mainTable");
    var addPlayerBtn = document.getElementById("addPlayer");
    //Spieler hinzufügen   
    //Variables
    var playerCounter = 1;
    var colCounter = 2;
    var rowCounter = 0;
    var cellValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 25, 30, 40, 50, 0, 0];
    //HTML Elements
    var headerElement = document.createElement("h4");
    var inputElement = document.createElement("input");
    inputElement.setAttribute("type", "number");
    var checkboxElement = document.createElement("input");
    checkboxElement.setAttribute("type", "checkbox");
    var resultElement = document.createElement("p");
    resultElement.setAttribute("class", "resultCell");
    if (addPlayerBtn) {
        addPlayerBtn.addEventListener("click", function () {
            if (table) {
                for (var _i = 0, _a = Array.from(table.rows); _i < _a.length; _i++) {
                    var row = _a[_i];
                    //Add Cells
                    row.insertCell();
                    row.cells[playerCounter].setAttribute("value", cellValues[rowCounter].toString());
                    if (rowCounter == 0) { //Header Cell
                        //row.cells[colCounter].innerHTML = firstCell1 + playerCounter.toString() + firstCell2;
                        var newHeaderElement = headerElement.cloneNode();
                        newHeaderElement.innerText = "Spieler " + playerCounter;
                        row.cells[colCounter].appendChild(newHeaderElement);
                    }
                    else if ((rowCounter >= 1 && rowCounter <= 8) || rowCounter == 13) { //Number Input Cells
                        //row.cells[colCounter].innerHTML = inputCell;
                        var newInputElement = inputElement.cloneNode();
                        //newInputElement.setAttribute("value", cellValues[rowCounter].toString());
                        row.cells[colCounter].appendChild(newInputElement);
                    }
                    else if (rowCounter >= 9 && rowCounter <= 12) { //Checkbox Zeilen
                        //row.cells[colCounter].innerHTML = checkboxCell;
                        var newCheckboxElement = checkboxElement.cloneNode();
                        newCheckboxElement.setAttribute("value", cellValues[rowCounter].toString());
                        row.cells[colCounter].appendChild(newCheckboxElement);
                    }
                    else if (rowCounter == 14) { //Letzte Zeile
                        //row.cells[colCounter].innerHTML = resultCell;
                        var newResultElement = resultElement.cloneNode();
                        row.cells[colCounter].appendChild(newResultElement);
                    }
                    //inkrement Counters
                    rowCounter++;
                    if (rowCounter > 14) {
                        colCounter++;
                        playerCounter++;
                        rowCounter = 0;
                    }
                }
            }
        });
    }
    //Auswertung
    if (table) {
        table.addEventListener("click", function () {
            var rows = table.querySelectorAll("tr");
            var playersResults = new Array(colCounter - 2).fill(0, 0, colCounter - 2);
            // Get Values
            rows.forEach(function (row) {
                var inputElements = row.querySelectorAll("td input");
                inputElements.forEach(function (input, col) {
                    if (input instanceof HTMLInputElement) {
                        if (input.type === "checkbox" && input.checked) {
                            playersResults[col] += parseInt(input.value) || 0;
                        }
                        else if (input.type === "number") {
                            playersResults[col] += parseInt(input.value) || 0;
                        }
                    }
                });
            });
            //Write Results
            var resultCells = document.querySelectorAll(".resultCell");
            var resultCellCounter = 0;
            resultCells.forEach(function (output) {
                output.innerHTML = playersResults[resultCellCounter].toString();
                resultCellCounter++;
            });
        });
    }
});
