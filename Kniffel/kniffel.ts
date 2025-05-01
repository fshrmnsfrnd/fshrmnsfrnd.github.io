addEventListener("DOMContentLoaded", (event) => {
    const table = document.getElementById("mainTable") as HTMLTableElement;
    const addPlayerBtn = document.getElementById("addPlayer");

    //Add Player
      
    //Variables
    let playerCounter = 1;
    let colCounter = 2;
    let rowCounter = 0;

    const cellValues: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 25, 30, 40, 50, 0, 0];

    //HTML Elements
    const headerElement = document.createElement("h6");
    const inputElement = document.createElement("input");
    inputElement.setAttribute("type", "number");
    const checkboxElement = document.createElement("input");
    checkboxElement.setAttribute("type", "checkbox");
    const resultElement = document.createElement("p");
    resultElement.setAttribute("class", "resultCell")

    if (addPlayerBtn) {
        addPlayerBtn.addEventListener("click", () => {
            if (table) {
                for (const row of Array.from(table.rows)) {
                    //Add Cells
                    row.insertCell()
                    row.cells[playerCounter].setAttribute("value", cellValues[rowCounter].toString());

                    if (rowCounter == 0) {//Header Cell
                        const newHeaderElement = headerElement.cloneNode() as HTMLElement;
                        newHeaderElement.innerText = "Spieler " + playerCounter;
                        row.cells[colCounter].appendChild(newHeaderElement);

                    } else if ((rowCounter >= 1 && rowCounter <= 8) || rowCounter == 13){//Number Input Cells
                        const newInputElement = inputElement.cloneNode() as HTMLInputElement;
                        row.cells[colCounter].appendChild(newInputElement);

                    } else if (rowCounter >= 9 && rowCounter <= 12) {//Checkbox Cells
                        const newCheckboxElement = checkboxElement.cloneNode() as HTMLInputElement;
                        newCheckboxElement.setAttribute("value", cellValues[rowCounter].toString());
                        row.cells[colCounter].appendChild(newCheckboxElement);

                    } else if (rowCounter == 14) {//Last Row
                        const newResultElement = resultElement.cloneNode() as HTMLInputElement;
                        row.cells[colCounter].appendChild(newResultElement);
                    }
                    
                    //inkrement Counters
                    rowCounter++
                    if(rowCounter > 14){ 
                        colCounter++;
                        playerCounter++; 
                        rowCounter = 0; 
                    }
                }
            }
        })
    }

    //Calculate Results
    if (table) {
        table.addEventListener("click", () => {
            const rows = table.querySelectorAll("tr");
            const playersResults: number[] = new Array(colCounter - 2).fill(0, 0, colCounter - 2);

            // Get Values
            rows.forEach((row) => {
                const inputElements = row.querySelectorAll("td input");

                inputElements.forEach((input, col) => {
                    if (input instanceof HTMLInputElement) {
                        if (input.type === "checkbox" && input.checked) {
                            playersResults[col] += parseInt(input.value) || 0;
                        } else if (input.type === "number") {
                            playersResults[col] += parseInt(input.value) || 0;
                        }
                    }
                });
            });
            
            //Write Results
            const resultCells = document.querySelectorAll(".resultCell")
            let resultCellCounter = 0;
            resultCells.forEach((output) => {
                output.innerHTML = playersResults[resultCellCounter].toString();
                resultCellCounter++;
            })

        })
    }
})