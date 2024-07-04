/*
 * Planets array
 * size - radius of the planet in km
 * distance - distance of the planet from the sun in AU
 * speed - time taken to complete one revolution around the sun in hours
 */
const CONFIG = {
    secure_area: 0.05,
    planets: {
        mercury: {
            radius: 2439.7,
            distance: 5,
            size_factor: 5,
            angle: 300,
            sidereal_year: 88 * 86400,
            sidereal_day: 58.65 * 86400
        },
        venus: {
            radius: 6051.8,
            distance: 10,
            size_factor: 5,
            angle: 270,
            sidereal_year: 224.701 * 86400,
            sidereal_day: 243 * 86400
        },
        earth: {
            radius: 6371,
            distance: 15,
            size_factor: 5,
            angle: 105,
            sidereal_year: 365.256 * 86400,
            sidereal_day: 23.934 * 86400
        },
        jupiter: {
            radius: 69911,
            distance: 25,
            size_factor: 5,
            angle: 210,
            sidereal_year: 4332.59 * 86400,
            sidereal_day: 9.925 * 3600
        },
        mars: {
            radius: 3389.5,
            distance: 20,
            size_factor: 5,
            angle: 345,
            sidereal_year: 687 * 86400,
            sidereal_day: 24 * 3600 + 37 * 60 + 22
        },
        saturn: {
            radius: 58232,
            distance: 30,
            size_factor: 5,
            angle: 30,
            sidereal_year: 10759.22 * 86400,
            sidereal_day: 10.7 * 3600
        },
        uranus: {
            radius: 25362,
            distance: 35,
            size_factor: 5,
            angle: 195,
            sidereal_year: 84 * 365 * 86400 + 16 * 3600,
            sidereal_day: 17 * 3600 + 14 * 60 + 24
        },
        neptune: {
            radius: 24622,
            distance: 40,
            size_factor: 5,
            angle: 240,
            sidereal_year: 164 * 365 * 86400 + 288 * 86400,
            sidereal_day: 15 * 86400 + 57 * 3600 + 59
        },
    }
};

// 
// CONFIG END
// 
const SUN_SIZE = 696340;
const SUN_PX = 100;
const max_distance = Math.max(...Object.keys(CONFIG.planets).map(planet => CONFIG.planets[planet].distance));

var system_center = {
    x: 0,
    y: 0
};
var planets = [];
var system_diameter;
var time = 0; // Time is unix timestamp
var time_per_second = 86400;
var fps = 10;

function init() {
    // Copy config planets to planets array
    planets = JSON.parse(JSON.stringify(CONFIG.planets));

    // Reset time to 01.01.1970 00:00
    time = 0;

    // Query window size
    var window_width = window.innerWidth;
    var window_height = window.innerHeight;
    system_center = { x: window_width / 2, y: window_height / 2 };

    // Calculate planet sizes
    for (var p in planets) {
        planets[p].radius = planets[p].radius / SUN_SIZE * SUN_PX * planets[p].size_factor;
        document.getElementById(p).style.width = planets[p].radius + 'px';
    }

    // Get biggest planet size by px
    var biggest_planet = 0;
    for (var p in planets) {
        biggest_planet = Math.max(biggest_planet, planets[p].radius);
    }

    // Calculate system radius
    system_diameter = Math.min(window_width, window_height) * (1 - CONFIG.secure_area) - (biggest_planet / 2);
    document.getElementsByTagName('main')[0].style.width = system_diameter + 'px';
    document.getElementsByTagName('main')[0].style.height = system_diameter + 'px';

    // Set sun size
    document.getElementById('sun').style.width = SUN_PX + 'px';
    document.getElementById('sun').style.height = SUN_PX + 'px';

    // Calculate planet distances
    for (var p in planets) {
        planets[p].distance_px = planets[p].distance / max_distance * (system_diameter / 2 - SUN_PX / 2) + (SUN_PX / 2);
    }

    positionPlanets();
}
init();

function positionPlanets() {
    // All planets
    for (var planet in planets) {
        var planet_element = document.getElementById(planet);
        var x = Math.cos(planets[planet].angle * (Math.PI / 180)) * planets[planet].distance_px;
        var y = Math.sin(planets[planet].angle * (Math.PI / 180)) * planets[planet].distance_px;
        planet_element.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    }
}

function timeToPositions(time) {
    for (planet in planets) {
        // Remove time overhead
        angle = (time % planets[planet].sidereal_year);
        // Get revolution percentage
        angle /= planets[planet].sidereal_year;
        // Percentage to degrees
        angle *= 360;
        // Add starting angle
        angle += CONFIG.planets[planet].angle;
        // Set angle
        planets[planet].angle = angle;
    }
    positionPlanets();
}

function tick() {
    // Advance time
    time += time_per_second / fps;
    // Calculate planet angles
    timeToPositions(time);
    // Set day overlay
    const date = new Date(time * 1000);
    var timeD = date.getDate();
    var timeM = date.getMonth() + 1;
    var timeY = date.getFullYear();
    timeD = timeD.toString().length < 2 ? "0" + timeD : timeD;
    timeM = timeM.toString().length < 2 ? "0" + timeM : timeM;
    document.getElementById("date").innerText = timeD + "." + timeM + "." + timeY;
}

// Button actions
var loopInterval;
function pausePlay() {
    if (loopInterval) { clearInterval(loopInterval); loopInterval = undefined; }
    else loopInterval = setInterval(tick, 1000 / fps);
    // Set button
    loopInterval ? document.getElementById("startPause").classList.add("active") : document.getElementById("startPause").classList.remove("active");
}
var last_btn = document.getElementById("overlay-controls").childNodes[3];
function setTimeFactor(factor, e) {
    time_per_second = 86400 * factor;
    last_btn.classList.remove("active");
    e.classList.add("active");
    last_btn = e;
}

window.setInterval(() => { angle += 0.25; positionPlanets(); }, 25);
