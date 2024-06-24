/*
 * Planets array
 * size - radius of the planet in km
 * distance - distance of the planet from the sun in AU
 * speed - time taken to complete one revolution around the sun in hours
 */
var config = {
    speed: 1,
    sun_radius: 696340,
    distance_factor: 0.01,
    planets: {
        earth: {
            radius: 6371,
            distance: 149597870,
            speed: 24
        }
    }
};

// 
// CONFIG END
// 
var window_width;
var window_height;
var planets = [];

function init() {
    // Calculate planets object
    for (var planet in config.planets) {
        var p = config.planets[planet];
        planets.push({
            name: planet,
            radius: p.radius / config.sun_radius,
            distance: p.distance * config.distance_factor,
            speed: p.speed
        });
    }
    // Get furthest planet distance
    var max_distance = 0;
    var max_planet;
    planets.forEach(function (planet) {
        if (planet.distance > max_distance) {
            max_distance = planet.distance;
            max_planet = planet.name;
        }
    });
    document.getElementById(max_planet).style.border = "15px solid red";

}
init();


function positionPlanets() {
}

function resize() {
    window_width = window.innerWidth;
    window_height = window.innerHeight;
    positionPlanets();
}
window.addEventListener('resize', resize);