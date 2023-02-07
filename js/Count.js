mapboxgl.accessToken =
    'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 4, // starting zoom
    minZoom: 1, // minimum zoom level of the map
    center: [-95, 37], // starting center
    projection: "albers"
});
const grades = [10, 100, 1000],
    colors = ['rgb(208,209,230)', 'rgb(103,169,207)', 'rgb(1,108,89)'],
    radii = [5, 5, 5];
//load data to the map as new layers.
//map.on('load', function loadingData() {
map.on('load', () => { //simplifying the function statement: arrow with brackets to define a function
    // when loading a geojson, there are two steps
    // add a source of the data and then add the layer out of the source
    map.addSource('counts', {
        type: 'geojson',
        data: 'assets/us-covid-2020-counts-zip.json'
    });
    map.addLayer({
            'id': 'counts-points',
            'type': 'circle',
            'source': 'counts',
            'paint': {
                // increase the radii of the circle as the zoom level and dbh value increases
                'circle-radius': {
                    'property': 'mag',
                    'stops': [
                        [grades[0], radii[0]],
                        [grades[1], radii[1]],
                        [grades[2], radii[2]]
                    ]
                },
                'circle-color': {
                    'property': 'cases',
                    'stops': [
                        [grades[0], colors[0]],
                        [grades[1], colors[1]],
                        [grades[2], colors[2]]
                    ]
                },
                'circle-stroke-color': 'white',
                'circle-stroke-width': 1,
                'circle-opacity': 0.6
            }
        }
    );
    // click on tree to view magnitude in a popup
    map.on('click', 'counts-points', (event) => {
        new mapboxgl.Popup()
            .setLngLat(event.features[0].geometry.coordinates)
            .setHTML(`<strong>Cases:</strong> ${event.features[0].properties.cases}`)
            .addTo(map);
    });
});
// create legend
const legend = document.getElementById('legend');
//set up legend grades and labels
var labels = ['<strong>Covid Cases</strong>'],
    vbreak;
//iterate through grades and create a scaled circle and label for each
for (var i = 0; i < grades.length; i++) {
    vbreak = grades[i];
    // you need to manually adjust the radius of each dot on the legend 
    // in order to make sure the legend can be properly referred to the dot on the map.
    dot_radii = 2 * radii[i];
    labels.push(
        '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radii +
        'px; height: ' +
        dot_radii + 'px; "></i> <span class="dot-label" style="top: ' + dot_radii / 2 + 'px;">' + vbreak +
        '</span></p>');
}
const source =
    '<p style="text-align: right; font-size:10pt">Source: <a href="https://github.com/jakobzhao/geog458/tree/master/labs/lab03/assets/">jakobzhao geog458</a><p>';
legend.innerHTML = labels.join('') + source;

