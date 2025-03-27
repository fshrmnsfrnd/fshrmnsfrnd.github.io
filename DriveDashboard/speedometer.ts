const testoutput : HTMLElement | null = document.getElementById("test");
/*
const speedDisplay: HTMLElement|null = document.getElementById("speedDisplay");
let lastPosition: { latitude: number; longitude: number } | null = null;
let lastTimestamp = 0;

function getSpeed(fspeedDisplay: HTMLElement|null) {
  if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const { timestamp } = position;

        if (lastPosition && lastTimestamp) {
          const distance = getDistanceFromLatLon(
            lastPosition.latitude,
            lastPosition.longitude,
            latitude,
            longitude
          );

          const timeDiff = (timestamp - lastTimestamp) / 1000; // Sekunden
          const speedKmh = timeDiff > 0 ? (distance / timeDiff) * 3.6 : 0; // m/s → km/h

          if (fspeedDisplay) {
           fspeedDisplay.innerText = `Geschwindigkeit: ${speedKmh.toFixed(2)} km/h`; 
          }

        lastPosition = { latitude, longitude };
        lastTimestamp = timestamp;
        }
      },
      (error) => {
        alert("Fehler beim Abrufen der Geschwindigkeit:" + error.message);
        if (fspeedDisplay) {
          fspeedDisplay.innerText = error.message;
        }
      },
      { enableHighAccuracy: true }
    );
  } else {
    alert("Geolocation wird nicht unterstützt.");
  }
}

// Haversine-Formel zur Berechnung der Distanz zwischen zwei GPS-Punkten
function getDistanceFromLatLon(lat1:number, lon1:number, lat2:number, lon2:number) {
  const R = 6371e3; // Erdradius in Metern
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Entfernung in Metern
}

document.addEventListener("DOMContentLoaded", () => getSpeed(speedDisplay));

console.log(navigator.permissions)
*/
const speedElement = document.getElementById("speedDisplay");

if ("geolocation" in navigator) {
  let lastPosition: GeolocationPosition | null = null;
  let lastTimestamp: number | null = null;

  navigator.geolocation.watchPosition(
    (position) => {
      const { speed, latitude, longitude } = position.coords;
      const timestamp = position.timestamp;

      let speedValue: number | null = null;
      let speedy: number | null = speed; // Use the `speed` property from `position.coords`let speedy: number = GeolocationCoordinates.speed;
      if (testoutput && speedy) {
        testoutput.innerText = speedy.toString();
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
    },
    (error) => {
      console.error("Fehler bei der Standortbestimmung:", error);
      speedElement!.textContent = "Standortzugriff fehlgeschlagen.";
    },
    { enableHighAccuracy: true }
  );
} else {
  speedElement!.textContent = "Geolocation wird nicht unterstützt.";
}

// Haversine-Formel zur Berechnung der Distanz zwischen zwei Koordinaten
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Erdradius in Metern
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}