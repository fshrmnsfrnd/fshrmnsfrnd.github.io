"use strict";
/*
const speedElement = document.getElementById("speedDisplay");
const testspeed = document.getElementById("Speed");

// Haversine-Formel zur Berechnung der Distanz zwischen zwei Koordinaten
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Erdradius in Metern
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lat2 - lat1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

if ("geolocation" in navigator) {
  let lastPosition: GeolocationPosition | null = null;
  let lastTimestamp: number | null = null;

  navigator.geolocation.watchPosition(
    (position) => {
      const { speed, latitude, longitude } = position.coords;
      const timestamp = position.timestamp;

      let speedValue: number | null = null;

      if (speedElement && speed) {
        speedElement.innerText = (speed * 3.6).toFixed(0) + " km/h";
      }

      if (speed !== null) {
        // Falls die Geschwindigkeit vom Gerät geliefert wird (m/s)
        speedValue = speed;
      } else if (lastPosition && lastTimestamp) {
        // Falls keine Geschwindigkeit geliefert wird, berechnen wir sie selbst
        const distance = getDistance(
          lastPosition.coords.latitude,
          lastPosition.coords.longitude,
          latitude,
          longitude
        );
        const timeDiff = (timestamp - lastTimestamp) / 1000; // in Sekunden

        if (timeDiff > 0) {
          speedValue = distance / timeDiff; // m/s
        }
      }

      lastPosition = position;
      lastTimestamp = timestamp;

      if (speedValue) {
        speedElement!.textContent = `Geschwindigkeit: ${(speedValue * 3.6).toFixed(2)} km/h`;
      } else {
        speedElement!.textContent = "Geschwindigkeit: Berechnung läuft...";
      }

      // Testoutputs
      let testout: string = "";
      if (speedElement && speed) {
        testout += "Speed: " + speed.toString();
      } else if (speedElement) {
        testout += " No Speed";
      }
      if (position.coords) {
        testout += ` Latitude: ${latitude}, Longitude: ${longitude}`;
      }
    },
    (error) => {
      alert("Fehler bei der Standortbestimmung: " + error.message);
    },
    { enableHighAccuracy: true }
  );
} else {
  alert("Geolocation wird nicht unterstützt.");
}
*/
// Haversine-Formel zur Berechnung der Distanz zwischen zwei Koordinaten
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Erdradius in Metern
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lat2 - lat1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
const speedElement = document.getElementById("speedDisplay");
if ("geolocation" in navigator) {
    let lastPosition = null;
    let lastTimestamp = null;
    navigator.geolocation.watchPosition((position) => {
        const { speed, latitude, longitude } = position.coords;
        const timestamp = position.timestamp;
        let speedValue = null;
        if (speed !== null) {
            speedValue = speed;
        }
        else if (lastPosition && lastTimestamp) {
            const distance = getDistance(lastPosition.coords.latitude, lastPosition.coords.longitude, latitude, longitude);
            const timeDiff = (timestamp - lastTimestamp) / 1000;
            if (timeDiff > 0) {
                speedValue = distance / timeDiff;
            }
        }
        lastPosition = position;
        lastTimestamp = timestamp;
        if (speedValue) {
            speedElement.textContent = `Geschwindigkeit: ${(speedValue * 3.6).toFixed(2)} km/h`;
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
