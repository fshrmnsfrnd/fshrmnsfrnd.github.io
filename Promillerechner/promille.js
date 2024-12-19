document.addEventListener("DOMContentLoaded", () => {
  const addDrinkButton = document.getElementById("adddrink");
  const timetable = document.getElementById("timetable");
  const promilleButton = document.getElementById("promillejetzt");
  const nuchternButton = document.getElementById("nuchternum");
  const geschlechtSelect = document.getElementById("geschlecht");
  const gewichtInput = document.getElementById("gewicht");
  const beginnvor = document.getElementById("dauer");
  // Popup und Inhalt
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popup-message");
  const popupClose = document.getElementById("close-symbol");
  const popupContent = document.getElementById("popup-content");

  var rows = 0;

  // Standardwerte für Getränke: {Getränkname: {Alkoholgehalt, Menge in ml}}
  const standardMengen = {
    bier: { alkoholgehalt: 5, menge: 500 },
    wein: { alkoholgehalt: 12, menge: 200 },
    gin: { alkoholgehalt: 40, menge: 50 },
    whisky: { alkoholgehalt: 40, menge: 40 },
    vodka: { alkoholgehalt: 40, menge: 40 },
    sekt: { alkoholgehalt: 11, menge: 125 },
    rum: { alkoholgehalt: 40, menge: 50 },
    tequila: { alkoholgehalt: 40, menge: 40 },
  };

  // Liste der Getränke für das Dropdown-Menü
  const drinks = Object.keys(standardMengen);

  // Popup schließen
  popup.addEventListener("click", () => {
    popup.style.display = "none";
    popupClose.style.display = "none";
    popupContent.style.display = "none";
  });

  // Funktion zur Anzeige des Popups
  const showPopup = (message) => {
    popupMessage.textContent = message;
    popup.style.display = "flex"; 
    popupClose.style.display = "flex";
    popupContent.style.display = "flex";
  };

  addDrinkButton.addEventListener("click", () => {
      const newRow = document.createElement("tr");
      newRow.id = `drink${rows}`;

      // Drink Dropdown
      const drinkCell = document.createElement("td");
      const drinkSelect = document.createElement("select");
      drinks.forEach((drink) => {
          const option = document.createElement("option");
          option.value = drink;
          option.textContent = drink.charAt(0).toUpperCase() + drink.slice(1);
          drinkSelect.appendChild(option);
      });
      drinkCell.appendChild(drinkSelect);

      // Prozent Input
      const percentCell = document.createElement("td");
      const percentInput = document.createElement("input");
      percentInput.type = "number";
      percentInput.value = standardMengen[drinkSelect.value].alkoholgehalt; // Standard Alkoholgehalt
      percentCell.appendChild(percentInput);

      // Menge Input
      const amountCell = document.createElement("td");
      const amountInput = document.createElement("input");
      const amounteinheit = document.createElement("p");
      amountInput.type = "number";
      amountInput.value = standardMengen[drinkSelect.value].menge; // Standard Menge
      amountCell.appendChild(amountInput);
      amounteinheit.innerHTML = "ml";
      amountCell.appendChild(amounteinheit);

      //Getränk löschen
      const deleteCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = `&times;`;
      deleteCell.appendChild(deleteButton);
      deleteButton.id = `deletebutton${rows}`;
      deleteButton.addEventListener("click", () => {
          timetable.removeChild(newRow);
      });

      // Event Listener für Änderungen im Dropdown
      drinkSelect.addEventListener("change", () => {
          const selectedDrink = drinkSelect.value;
          percentInput.value = standardMengen[selectedDrink].alkoholgehalt;
          amountInput.value = standardMengen[selectedDrink].menge;
      });

      newRow.appendChild(drinkCell);
      newRow.appendChild(percentCell);
      newRow.appendChild(amountCell);
      newRow.appendChild(deleteCell);
      timetable.appendChild(newRow);
      rows = rows + 1;
  });

  promilleButton.addEventListener("click", () => {
    const geschlecht = geschlechtSelect.value;
    const gewicht = parseFloat(gewichtInput.value);
    if (!gewicht) {
      showPopup("Gewicht eingeben");
      return;
    }

    let totalAlcohol = 0;

    const rows = timetable.getElementsByTagName("tr");
    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName("td");
      const drinkType = cells[0].getElementsByTagName("select")[0].value;
      const percent = parseFloat(
        cells[1].getElementsByTagName("input")[0].value
      );
      const amount = parseFloat(
        cells[2].getElementsByTagName("input")[0].value
      );

      const alcoholAmount = (percent / 100) * amount;
      totalAlcohol += alcoholAmount;
    }

    const r = geschlecht === "m" ? 0.7 : 0.6;
    const a = geschlecht === "m" ? 0.15 : 0.1;
    const dauer = beginnvor.value;
    let promille = (totalAlcohol * 0.8) / (gewicht * r) - dauer * a; // Widmark
    promille = promille >= 0 ? promille : 0.0;

    showPopup("Aktuelle Promille: \n" + promille.toFixed(2));
  });

  nuchternButton.addEventListener("click", () => {
    const geschlecht = geschlechtSelect.value;
    const gewicht = parseFloat(gewichtInput.value);
    if (!gewicht) {
      showPopup("Gewicht eingeben");
      return;
    }

    let totalAlcohol = 0;

    const rows = timetable.getElementsByTagName("tr");
    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName("td");
      const drinkType = cells[0].getElementsByTagName("select")[0].value;
      const percent = parseFloat(
        cells[1].getElementsByTagName("input")[0].value
      );
      const amount = parseFloat(
        cells[2].getElementsByTagName("input")[0].value
      );

      const alcoholAmount = (percent / 100) * amount;
      totalAlcohol += alcoholAmount;
    }

    const r = geschlecht === "m" ? 0.7 : 0.6;
    const dauer = beginnvor.value;
    const promillePerHour = geschlecht === "m" ? 0.15 : 0.1; // Promilleabbau pro Stunde
    const timeToSober =
      (totalAlcohol * 0.8) / (gewicht * r) / promillePerHour - dauer;

    showPopup(
      "Sie sind in " + timeToSober.toFixed(2) + " Stunden nüchtern."
    );
  });
});
