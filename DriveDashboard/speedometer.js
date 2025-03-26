function getSpeed() {
  if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition(
      (position) => {
        const speedMps = position.coords.speed; // Geschwindigkeit in m/s
        const speedKmh =
          speedMps !== null ? (speedMps * 3.6).toFixed(2) : "N/A";
        document.getElementById(
          "speedDisplay"
        ).innerText = `Geschwindigkeit: ${speedKmh} km/h`;
      },
      (error) => {
        console.error("Fehler beim Abrufen der Geschwindigkeit:", error);
      },
      { enableHighAccuracy: true }
    );
  } else {
    alert("Geolocation wird nicht unterstützt.");
  }
}

// Beim Laden der Seite starten
document.addEventListener("DOMContentLoaded", getSpeed);