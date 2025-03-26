let lastPosition = null;
let lastTimestamp = null;

function getSpeed() {
  if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, timestamp } = position.coords;

        if (lastPosition && lastTimestamp) {
          const distance = getDistanceFromLatLon(
            lastPosition.latitude,
            lastPosition.longitude,
            latitude,
            longitude
          );

          const timeDiff = (timestamp - lastTimestamp) / 1000; // Sekunden
          const speedKmh = timeDiff > 0 ? (distance / timeDiff) * 3.6 : 0; // m/s → km/h

          document.getElementById(
            "speedDisplay"
          ).innerText = `Geschwindigkeit: ${speedKmh.toFixed(2)} km/h`;
        }

        lastPosition = { latitude, longitude };
        lastTimestamp = timestamp;
      },
      (error) => {
        alert("Fehler beim Abrufen der Geschwindigkeit:", error);
      },
      { enableHighAccuracy: true }
    );
  } else {
    alert("Geolocation wird nicht unterstützt.");
  }
}

// Haversine-Formel zur Berechnung der Distanz zwischen zwei GPS-Punkten
function getDistanceFromLatLon(lat1, lon1, lat2, lon2) {
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

document.addEventListener("DOMContentLoaded", getSpeed);

console.log(navigator.permissions)