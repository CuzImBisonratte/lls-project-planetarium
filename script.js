/*
 * Planets array
 * size - radius of the planet in km
 * distance - distance of the planet from the sun in AU
 * speed - time taken to complete one revolution around the sun in hours
 */
var config = {
    speed: 1,
    secure_area: 0.1,
    planets: {
        earth: {
            radius: 6371,
            speed: 24,
            distance: 10,
            size_factor: 10
        }
    }
};

// 
// CONFIG END
// 
const SUN_SIZE = 696340;
const SUN_PX = 100;

var system_center = {
    x: 0,
    y: 0
};
var planets = [];
var system_radius;

function init() {
    // Query window size
    var window_width = window.innerWidth;
    var window_height = window.innerHeight;
    system_center = { x: window_width / 2, y: window_height / 2 };

    // Calculate planet sizes
    for (var planet in config.planets) {
        config.planets[planet].radius = config.planets[planet].radius / SUN_SIZE * SUN_PX * config.planets[planet].size_factor;
        document.getElementById(planet).style.width = config.planets[planet].radius + 'px';
    }

    // Get biggest planet size by px
    var biggest_planet = 0;
    for (var planet in config.planets) {
        biggest_planet = Math.max(biggest_planet, config.planets[planet].radius);
    }

    // Calculate system radius
    system_radius = Math.min(window_width, window_height) * (1 - config.secure_area) - biggest_planet * 2;
    document.getElementsByTagName('main')[0].style.width = system_radius + 'px';
    document.getElementsByTagName('main')[0].style.height = system_radius + 'px';

    // Set sun size
    document.getElementById('sun').style.width = SUN_PX + 'px';
    document.getElementById('sun').style.height = SUN_PX + 'px';

    positionPlanets();
}
init();


function positionPlanets() {
}

window.addEventListener('resize', init);