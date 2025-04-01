"use strict";
const testoutput = document.getElementById("test");
const speedElement = document.getElementById("speedDisplay");

if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition((position) => {
        const { speed, latitude, longitude } = position.coords;
        const timestamp = position.timestamp;

        if (testoutput && speed && speedElement) {
            speedElement.innerText = (speed * 3.6).toString();
        }else if(testoutput){
          testoutput.innerText = "0";
        }

    }, (error) => {
        console.error("Fehler bei der Standortbestimmung:", error);
        if(speedElement){
          speedElement.textContent = "Standortzugriff fehlgeschlagen.";
        }
    }, { enableHighAccuracy: true });
}
else {
  if(speedElement){
    speedElement.textContent = "Geolocation wird nicht unterstützt.";
  }
}
