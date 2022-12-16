// START INIT //

const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth * 2;
canvas.height = window.innerHeight * 2;
const context = canvas.getContext('2d');
context.font = "32px Arial";
context.fillStyle = "black";
const bikeWidth = 200;

const bike = {
  x: 0,
  y: 0,
  speed: 0,
  name: "Coppi Aluminium K-14",
  shifting: "Shimano Ultegra 6500",
  frontGears: 3,
  rearGears: 9
};

// const stage = {
//   name: "Tour De France 2022, Stage 12: Briançon – Alpe d'Huez",
//   //img: "tdf22-12.jpg",
//   waypoints: [
//     { "km": 0, "incline": 1.4, "elevation": "1337", "name": "Départ – Briançon" },
//     { "km": 11.8, "incline": 5.3, "elevation": "1497", "name": "Le Monétier-les-Bains" },
//     { "km": 24.6, "incline": 8.3, "elevation": "2058", "name": "Col du Lautaret" },
//     { "km": 33.2, "incline": -5.3, "elevation": "2642", "name": "Col du Galibier" },
//     { "km": 50.7, "incline": 3, "elevation": "1433", "name": "Valloire" },
//     { "km": 56.6, "incline": -5, "elevation": "1564", "name": "Col du Télégraphe" },
//     { "km": 67.7, "incline": -2, "elevation": "734", "name": "Saint-Michel-de-Maurienne" },
//     { "km": 80.5, "incline": 5, "elevation": "536", "name": "Saint-Jean-de-Maurienne" },
//     { "km": 102.9, "incline": 6, "elevation": "1486", "name": "Saint-Sorlin-d'Arves" },
//     { "km": 110.6, "incline": -4, "elevation": "2067", "name": "Col de la Croix de Fer" },
//     { "km": 128.2, "incline": -3, "elevation": "1275", "name": "Rivier d'Allemond" },
//     { "km": 139.3, "incline": 0, "elevation": "731", "name": "Allemond" },
//     { "km": 148.7, "incline": 8, "elevation": "718", "name": "Le Bourg d'Oisans" },
//     { "km": 159.3, "incline": 8, "elevation": "1426", "name": "Huez Village" },
//     { "km": 165.1, "incline": 0, "elevation": "1850", "name": "Alpe d'Huez" }
//   ]
// }

const stage = {
  name: "Tour De France 2022, Stage 12: Briançon – Alpe d'Huez",
  img: "tdf22-12.jpg",
  waypoints: [
    { "km": 0, "incline": 0, "elevation": "1337", "name": "Départ – Briançon" },
    { "km": 10, "incline": 9, "elevation": "1497", "name": "Le Monétier-les-Bains" },
    { "km": 20, "incline": 0, "elevation": "2058", "name": "Col du Lautaret" },
    { "km": 30, "incline": -9, "elevation": "2642", "name": "Col du Galibier" },
    { "km": 40.0, "incline": 0, "elevation": "1433", "name": "Valloire" },
    { "km": 40.0, "incline": 0, "elevation": "1564", "name": "Col du Télégraphe" },
    { "km": 50.0, "incline": -2, "elevation": "734", "name": "Saint-Michel-de-Maurienne" },
    { "km": 60.0, "incline": 5, "elevation": "536", "name": "Saint-Jean-de-Maurienne" },
    { "km": 70.0, "incline": 6, "elevation": "1486", "name": "Saint-Sorlin-d'Arves" },
    { "km": 80.0, "incline": -4, "elevation": "2067", "name": "Col de la Croix de Fer" },
    { "km": 90.0, "incline": -3, "elevation": "1275", "name": "Rivier d'Allemond" },
    { "km": 100.0, "incline": 0, "elevation": "731", "name": "Allemond" },
    { "km": 110.0, "incline": 8, "elevation": "718", "name": "Le Bourg d'Oisans" },
    { "km": 120.0, "incline": 8, "elevation": "1426", "name": "Huez Village" },
    { "km": 130.0, "incline": 0, "elevation": "1850", "name": "Alpe d'Huez" }
  ]
}

var currentFrontGear = Math.round(bike.frontGears / 2);
var currentRearGear = Math.round(bike.rearGears / 2);

const bikeImg = new Image();
bikeImg.src = 'road-bike.png';
const stageImg = new Image();
stageImg.src = stage.img;

var keyNeeded = "";
var xValFixedElements = 0;
var gearingFactor = bike.frontGears * bike.rearGears;
var waypointIndex = 0;
var nextWaypoint = 0;
var inclineIsSet = false;
var inclineTransitionStepCount = 0;
var inverseIncline = 0;
var riddenDistance = 0;

var keys = {
  left: false,
  right: false
};

document.querySelector(".stageName").innerHTML = "Stage: " + stage.name;
document.querySelector(".bikeName").innerHTML = "Bike: " + bike.name + " with " + bike.shifting + " (" + bike.frontGears + "x" + bike.rearGears + ")";

// END INIT //

context.translate(- canvas.width / 4, - canvas.height * 1.25);
context.scale(2, 2);

function update() {

  context.clearRect(-canvas.width + bike.x, -canvas.height, 3 * canvas.width, 3 * canvas.height);
  currentWaypoint = stage.waypoints[waypointIndex];

  //Average speeds in real life: flat: 40 kph, sprint: 64 kph, descent: 90 kph
  let bikeAcceleration = 0.5;

  if (keys.left && !keys.right && keyNeeded == "left" || keys.right && !keys.left && keyNeeded == "right") {
    
    // Pedalling effect on bike speed
    // Lowest gear: High speed addition, low top speed
    // Highest gear: Low speed addition, high top speed
    let topSpeed = 75; //Todo: Make it dependent on the bike object: gear ratio
    let topSpeedFactor = gearingFactor / (currentFrontGear * currentRearGear);
    let speedAdditionFactor = 6 * ((gearingFactor / (currentFrontGear * currentRearGear)) / 27);

    if (bike.speed < (topSpeed / topSpeedFactor)) {
      bike.speed += bikeAcceleration + speedAdditionFactor;
    }

  } else {
    
    // Incline effect on bike speed
    let currentIncline = currentWaypoint.incline;
    if (currentIncline > 0) {
      // Decrease acceleration with decreasing speed
      bikeAcceleration += 0.02 * bike.speed;
      // 30% ascent is the brickwall
      bike.speed -= 0.06 * bikeAcceleration * (((1 / 3) * currentIncline) / 1);
    }

    if (currentIncline < 0) {
      // Increase acceleration with inreasing speed
      bikeAcceleration += 0.02 * bike.speed;
      // 30% descent has maximum acceleration
      bike.speed += 0.03 * (bikeAcceleration * (((1 / 3) * -currentIncline) / 1));
      
    }

    if (currentIncline == 0) {
      bike.speed -= 0.06 * bikeAcceleration;
    }

    // Drag effect on bike speed
    bike.speed -= 0.000008 * bike.speed ** 2;

    // Can't go backwards
    bike.speed = Math.max(bike.speed - 0.02, 0);

  }

  bike.x += bike.speed;

  if (keys.left) {
    keyNeeded = "right";
  }
  if (keys.right) {
    keyNeeded = "left";
  }

  if (bike.x >= 0) {
    context.translate(-bike.speed, 0);

    // Sky
    context.fillStyle = "#85ceff";
    context.fillRect(bike.x, canvas.height, canvas.width, -canvas.height);

    // Road posts
    let positionFactor = Math.ceil(bike.x / canvas.width);
    context.fillStyle = "#fff";
    context.fillRect(positionFactor * canvas.width, canvas.height - 80, 10, 60);
    context.fillStyle = "#e44545";
    context.fillRect(positionFactor * canvas.width, canvas.height - 70, 10, 10);

    // Road
    context.fillStyle = "#949494";
    context.fillRect(bike.x, canvas.height - 20, canvas.width, 20);
  }

  context.drawImage(bikeImg, bike.x + (canvas.width / 4), canvas.height - bikeWidth, bikeWidth, bikeWidth);
  riddenDistance = (bike.x / 10000).toFixed(2);

  let bikeSpeed = "Speed: " + (bike.speed).toFixed(0) + " km/h";
  let bikeGears = "Gears: " + currentFrontGear + "x" + currentRearGear;
  let bikeDistance = "Distance: " + riddenDistance + " km";

  document.querySelector(".bikeSpeed").innerHTML = bikeSpeed;
  document.querySelector(".bikeGears").innerHTML = bikeGears;
  document.querySelector(".bikeDistance").innerHTML = bikeDistance;

  if (bike.speed == 0) {
    document.querySelector("#tutorial").style.display = "block";
  } else {
    document.querySelector("#tutorial").style.display = "none";
  }

  // Waypoint/Incline check and Canvas rotation
  // Current waypoint
  document.querySelector(".currentWaypointName").innerHTML = "Waypoint: " + currentWaypoint.name + " (" + (waypointIndex + 1) + "/" + stage.waypoints.length + ")";
  document.querySelector(".currentWaypointElevation").innerHTML = "Elevation: " + parseInt(currentWaypoint.elevation).toLocaleString() + " m";
  document.querySelector(".currentWaypointIncline").innerHTML = "Incline: " + currentWaypoint.incline + "%";

  // Next waypoint
  document.querySelector(".nextWaypointName").innerHTML = "Next: " + nextWaypoint.name + " (km " + nextWaypoint.km + ")";
  document.querySelector(".nextWaypointElevation").innerHTML = "Elevation: " + parseInt(nextWaypoint.elevation).toLocaleString() + " m";
  document.querySelector(".nextWaypointIncline").innerHTML = "Incline: " + nextWaypoint.incline + "%";

  nextWaypoint = currentWaypoint;
  if (stage.waypoints.length > waypointIndex + 1) {
    nextWaypoint = stage.waypoints[waypointIndex + 1];
  }

  if (
    riddenDistance >= currentWaypoint.km &&
    (riddenDistance < nextWaypoint.km || nextWaypoint == currentWaypoint) &&
    currentWaypoint.incline + inverseIncline !== 0 &&
    !inclineIsSet
  ) {

    context.translate(bike.x, 0);
    if (currentWaypoint.incline + inverseIncline > 0) {
      context.rotate(- 0.1 / 90);
    }
    if (currentWaypoint.incline + inverseIncline < 0) {
      context.rotate(0.1 / 90);
    }
    context.translate(-bike.x, 0);

    inclineTransitionStepCount += 1;
    if (Math.abs(inverseIncline * 10 + currentWaypoint.incline * 10) == inclineTransitionStepCount) {
      inclineIsSet = true;
      inclineTransitionStepCount = 0
      // Nullify the current incline for nextwaypoint.Incline
      inverseIncline = -currentWaypoint.incline;
    }

  }
  if (riddenDistance >= nextWaypoint.km && (nextWaypoint !== currentWaypoint)) {
    if (stage.waypoints.length > waypointIndex + 1) {
      waypointIndex += 1;
    }
    inclineIsSet = false;
  }
}

setInterval(update, 10);