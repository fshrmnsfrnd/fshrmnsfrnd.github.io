"use strict";
const speedElement = document.getElementById("speedDisplay");
if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition((position) => {
        const { speed, latitude, longitude } = position.coords;
        const timestamp = position.timestamp;
        if (speed && speedElement) {
            speedElement.innerText = (speed * 3.6).toString() + "km/h";
        }
        else if (speedElement) {
            speedElement.innerText = "0 km/h";
        }
    }, (error) => {
        console.error("Fehler bei der Standortbestimmung:", error);
        if (speedElement) {
            speedElement.textContent = "Standortzugriff fehlgeschlagen.";
        }
    }, { enableHighAccuracy: true });
}
else {
    if (speedElement) {
        speedElement.textContent = "Geolocation wird nicht unterstützt.";
    }
}
