"use strict";
const speedElement = document.getElementById("speedDisplay");
// Haversine-Formel zur Berechnung der Distanz zwischen zwei Koordinaten
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Erdradius in Metern
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
if ("geolocation" in navigator) {
    let lastPosition = null;
    let lastTimestamp = null;
    navigator.geolocation.watchPosition((position) => {
        const { speed, latitude, longitude } = position.coords;
        const timestamp = position.timestamp;
        let speedValue = null;
        if (speedElement && speed) {
            speedElement;
            speedElement.innerText = (speed * 3.6).toString() + "KMH";
        }
        if (speed !== null) {
            // Falls die Geschwindigkeit vom Gerät geliefert wird (m/s)
            speedValue = speed;
        }
        else if (lastPosition && lastTimestamp) {
            // Falls keine Geschwindigkeit geliefert wird, berechnen wir sie selbst
            const distance = getDistance(lastPosition.coords.latitude, lastPosition.coords.longitude, latitude, longitude);
            const timeDiff = (timestamp - lastTimestamp) / 1000; // in Sekunden
            if (timeDiff > 0) {
                speedValue = distance / timeDiff; // m/s
            }
        }
        lastPosition = position;
        lastTimestamp = timestamp;
        if (speedValue) {
            speedElement.textContent = `${(speedValue * 3.6).toFixed(0)} km/h`;
        }
        else {
            speedElement.textContent = "Geschwindigkeit: Berechnung läuft...";
        }
    }, (error) => {
        console.error("Fehler bei der Standortbestimmung:", error);
        speedElement.textContent = "Standortzugriff fehlgeschlagen.";
    }, { enableHighAccuracy: true });
}
else {
    speedElement.textContent = "Geolocation wird nicht unterstützt.";
}
