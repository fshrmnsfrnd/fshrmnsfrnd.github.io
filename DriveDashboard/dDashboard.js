const displayBeta = document.getElementById("beta");
const displayMaxAngle = document.getElementById("maxbeta");
const permissionButton = document.getElementById("requestPermission");
const calibrateButton = document.getElementById("calibrate")
let verschiebung = 90.0;
let maxAngle = 0.0;
let screenorientation;

function calibrate() {
    maxAngle = 0.0;
    displayMaxAngle.innerText = maxAngle.toFixed(0);

    if (screen.height < screen.width){ //if landscape
        screenorientation = "landscape";
    }else{
        screenorientation = "portrait";
    }
}

function updateMax(angle){
    if(angle < 0){
        angle = angle * (-1);
    }

    if(angle > maxAngle){
        maxAngle = angle;
    }

    displayMaxAngle.innerText = maxAngle.toFixed(0);
}

async function requestPermission() {
  if (typeof DeviceOrientationEvent.requestPermission === "function") {
    const permissionState = await DeviceOrientationEvent.requestPermission();
    if (permissionState === "granted") {
      window.addEventListener("deviceorientation", updateAngle);
      permissionButton.style.display = "none";
    } else {
      alert("Berechtigung abgelehnt");
    }
  } else {
    window.addEventListener("deviceorientation", updateAngle);
    permissionButton.style.display = "none";
  }
  calibrate;
}

function updateAngle(event) {
    let angle;
    if(screenorientation == "landscape"){
        angle = event.beta;
    }else if (screenorientation == "portrait"){
        angle = event.gamma;
    }
    
    displayBeta.textContent = event.beta.toFixed(0);
    gauge.set(angle + verschiebung);
    updateMax(event.beta);
}

permissionButton.addEventListener("click", requestPermission);
calibrateButton.addEventListener("click", calibrate);

var opts = {
  angle: 0, // The span of the gauge arc
  lineWidth: 0.2, // The line thickness
  radiusScale: 1, // Relative radius
  pointer: {
    length: 0.56, // // Relative to gauge radius
    strokeWidth: 0.1, // The thickness
    color: "#ffffff", // Fill color
  },
/*  staticLabels: {
    font: "10px sans-serif", // Specifies font
    labels: [0.5, 45, 90, 135, 180], // Print labels at these values
    color: "#ffffff", // Optional: Label text color
    fractionDigits: 0, // Optional: Numerical precision. 0=round off.
  },*/
  staticZones: [
    { strokeStyle: "#F03E3E", min: 0, max: 30 }, // Red from
    { strokeStyle: "#FFDD00", min: 30, max: 45 }, // Yellow
    { strokeStyle: "#30B32D", min: 45, max: 135 }, // Green
    { strokeStyle: "#FFDD00", min: 135, max: 150 }, // Yellow
    { strokeStyle: "#F03E3E", min: 150, max: 180 }, // Red
  ],
  limitMax: true, // If false, max value increases automatically if value > maxValue
  limitMin: true, // If true, the min value of the gauge will be fixed
  colorStart: "#6FADCF", // Colors
  colorStop: "#8FC0DA", // just experiment with them
  strokeColor: "#E0E0E0", // to see which ones work best for you
  generateGradient: true,
  highDpiSupport: true, // High resolution support
};
var target = document.getElementById("neigungdisplay"); // your canvas element
var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
gauge.maxValue = 180; // set max gauge value
gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gauge.animationSpeed = 30; // set animation speed (32 is default value)