/*
 * Planets array
 * size - radius of the planet in km
 * distance - distance of the planet from the sun in AU
 * speed - time taken to complete one revolution around the sun in hours
 */
var config = {
    secure_area: 0.05,
    planets: {
        mercury: {
            radius: 2439.7,
            distance: 5,
            size_factor: 5
        },
        venus: {
            radius: 6051.8,
            distance: 10,
            size_factor: 5
        },
        earth: {
            radius: 6371,
            distance: 15,
            size_factor: 5
        },
        jupiter: {
            radius: 69911,
            distance: 25,
            size_factor: 5
        },
        mars: {
            radius: 3389.5,
            distance: 20,
            size_factor: 5
        },
        saturn: {
            radius: 58232,
            distance: 30,
            size_factor: 5
        },
        uranus: {
            radius: 25362,
            distance: 35,
            size_factor: 5
        },
        neptune: {
            radius: 24622,
            distance: 40,
            size_factor: 5
        },
    }
};

// 
// CONFIG END
// 
const SUN_SIZE = 696340;
const SUN_PX = 150;
const max_distance = Math.max(...Object.keys(config.planets).map(planet => config.planets[planet].distance));

var system_center = {
    x: 0,
    y: 0
};
var planets = [];
var system_diameter;

function init() {
    // Copy config planets to planets array
    planets = JSON.parse(JSON.stringify(config.planets));

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
    system_diameter = Math.min(window_width, window_height) * (1 - config.secure_area) - (biggest_planet / 2);
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

var angle = 0;

function positionPlanets() {
    // All planets
    for (var planet in planets) {
        var planet_element = document.getElementById(planet);
        var x = Math.cos(angle * (Math.PI / 180)) * planets[planet].distance_px;
        var y = Math.sin(angle * (Math.PI / 180)) * planets[planet].distance_px;
        planet_element.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    }
}

window.addEventListener('resize', init);

window.setInterval(() => { angle += 0.25; positionPlanets(); }, 25);
