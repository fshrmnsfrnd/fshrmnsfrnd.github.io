//const testoutput: HTMLElement | null = document.getElementById("test");
const speedElement = document.getElementById("speedDisplay");

if ("geolocation" in navigator) {
  let lastPosition: GeolocationPosition | null = null;
  let lastTimestamp: number | null = null;

  navigator.geolocation.watchPosition(
    (position) => {
      const { speed, latitude, longitude } = position.coords;
      const timestamp = position.timestamp;

      let speedValue: number | null = null;
      //let speedy: number | null = speed; 
      /*if (testoutput && speedy) {
        testoutput.innerText = speedy.toString();
      } 
        */

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
        speedElement!.textContent = `${(speedValue * 3.6).toFixed(1)} km/h`;
      } else {
        speedElement!.textContent = "Berechnung läuft...";
      }
    },
    (error) => {
      alert("Fehler bei der Standortbestimmung:");
    },
    { enableHighAccuracy: true }
  );
} else {
  alert("Geolocation wird nicht unterstützt.");
}

// Haversine-Formel zur Berechnung der Distanz zwischen zwei Koordinaten
function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Erdradius in Metern
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
