mapboxgl.accessToken = 'pk.eyJ1IjoiZ3VvYXI3c2J2ZCIsImEiOiJjbG9wd2s5dncwMThxMnFtazNncGxoZ3VyIn0.kxcLHaYXSoM8GfPpurqU7w'; // Replace with your Mapbox access token

var center = [116.397428, 39.90923];
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/guoar7sbvd/clsspd7zp00zy01pf82hx1x67',
    center: center,
    zoom: 3,
});

var markers = [];
var circleLayers = {}; // Use an object to store references to circle layers

// Function to fetch data from the server
async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Fetch and update data every 5 seconds
setInterval(() => {
    fetchData('./whazzup.php').then(data => {
        // Clear existing markers and circles
        markers.forEach(marker => marker.remove());
        markers = [];

        // Remove existing circle layers and sources
        Object.keys(circleLayers).forEach(layerId => {
            try {
                // Remove the layer only if it exists on the map
                if (map.getLayer(layerId)) {
                    map.removeLayer(layerId);
                }

                // Remove the source associated with the layer
                if (map.getSource(layerId)) {
                    map.removeSource(layerId);
                }
            } catch (error) {
                console.error('Error removing layer or source:', error);
            }
        });
        circleLayers = {};

        if (data.controllers && data.controllers.length > 0) {
            data.controllers.forEach(atc => {
                var atcMarker = new mapboxgl.Marker({
                    element: createMarkerElementAtc('fas fa-broadcast-tower', '#FF0000', atc.heading, atc.latitude, atc.longitude, atc.cid, atc.frequency, atc.callsign, atc.rating),
                    anchor: 'bottom',
                })
                    .setLngLat([atc.longitude, atc.latitude])
                    .addTo(map)
                    .on('click', function () {
                        console.log('Marker clicked');
                        openmodel(atc, atc);
                        map.flyTo({
                            center: [atc.longitude, atc.latitude],
                            essential: true,
                        });
                    });

                markers.push(atcMarker);

                // Add a circle layer
                // Add a circle layer
                var sourceId = `circle-source-${atc.cid}`;
                var layerId = `circle-layer-${atc.cid}`;
                var uniqueSourceId = sourceId + 'coord'; // Define uniqueSourceId here

                circleLayers[layerId] = true;

                try {
                    // Check if the source already exists
                    // Before adding a source, check if it already exists
                    if (!map.getSource(sourceId)) {
                        // Add the source
                        map.addSource(sourceId, {
                            type: 'geojson',
                            data: {
                                type: 'FeatureCollection',
                                features: [{
                                    type: 'Feature',
                                    geometry: {
                                        type: 'Point',
                                        coordinates: [atc.longitude, atc.latitude],
                                    },
                                }],
                            },
                        });
                    }

                    // Check if the layer already exists
                    if (!map.getLayer(layerId)) {
                        const url = 'https://imp.xfex.cc/server/GetAtcCoord.php?atc_id=' + atc.callsign;

                        fetch(url, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                        })
                            .then(response => response.json())
                            .then(data => {
                                console.log('Success:', data);
                                if (data.status == '200') {
                                    // Organize coordinates properly
                                    const coordinates = data.data[0]; // Assuming data is structured as [ [ [x1, y1], [x2, y2], ... ] ]

                                    // Add the source
                                    // 添加数据源
                                    map.addSource(layerId, {
                                        type: 'geojson',
                                        data: {
                                            type: 'Feature',
                                            geometry: {
                                                type: 'Polygon',
                                                coordinates: [coordinates]
                                            }
                                        }
                                    });

// 添加图层
                                    map.addLayer({
                                        'id': layerId,
                                        'type': 'fill',
                                        'source': layerId,
                                        'layout': {},
                                        'paint': {
                                            'fill-color': '#088',
                                            'fill-opacity': 0.4
                                        }
                                    });

// 计算多边形中心
                                    var center = turf.centerOfMass({
                                        type: 'Feature',
                                        properties: {},
                                        geometry: {
                                            type: 'Polygon',
                                            coordinates: [coordinates]
                                        }
                                    });

                                    map.addLayer({
                                        'id': 'textLayer' + layerId,
                                        'type': 'symbol',
                                        'source': {
                                            type: 'geojson',
                                            data: {
                                                type: 'FeatureCollection',
                                                features: [{
                                                    type: 'Feature',
                                                    geometry: {
                                                        type: 'Point',
                                                        coordinates: center.geometry.coordinates
                                                    },
                                                    properties: {
                                                        title: atc.callsign
                                                    }
                                                }]
                                            }
                                        },
                                        'layout': {
                                            'text-field': ['get', 'title'],
                                            'text-size': 14,
                                            'text-offset': [0, 0.5]
                                        },
                                        'paint': {
                                            'text-color': '#fff',
                                            'text-halo-color': '#000', // 描边颜色
                                            'text-halo-width': 2 // 描边宽度
                                        }
                                    });

                                } else {
                                    if (!map.getLayer(layerId)) {
                                        map.addLayer({
                                            id: layerId,
                                            type: 'circle',
                                            source: sourceId,
                                            paint: {
                                                'circle-radius': atc.visual_range / 10,
                                                'circle-color': '#93b5cf',
                                                'circle-opacity': 0.5,
                                            },
                                        });
                                    }
                                }
                            })
                            .catch(error => {
                                console.error('Error:', error);
                                // Implement proper error handling here
                            });
                    }
                } catch (error) {
                    console.error('Error adding layer or source:', error);
                }

            });
        }

        // Example: Display aircraft markers and popups
        if (data.pilot && data.pilot.length > 0) {
            data.pilot.forEach(pilot => {
                var aircraftMarker = new mapboxgl.Marker({
                    element: createMarkerElementPilot('fas fa-plane', '#e8b004', pilot.heading, pilot.latitude, pilot.longitude, pilot.logon_time, pilot.cid),
                    anchor: 'bottom',
                })
                    .setLngLat([pilot.longitude, pilot.latitude])
                    .addTo(map)
                    .on('click', function () {
                        // Move the map center to the clicked aircraft marker
                        map.flyTo({
                            center: [pilot.longitude, pilot.latitude],
                            essential: true,
                        });
                    });

                markers.push(aircraftMarker);
            });
        }
    });
}, 5000);


// Function to create a marker element with FontAwesome icon and rotation
function createMarkerElementPilot(iconClass, iconColor, rotation, lat, lon, time, cid) {
    var markerElement = document.createElement('div');
    markerElement.className = 'custom-marker';
    markerElement.innerHTML = `<i class="${iconClass}" style="font-size: 20px; color: ${iconColor}; transform: rotate(${rotation - 90}deg);"></i>`;
    // Add a click event listener to the marker element
    markerElement.addEventListener('click', function () {
        openmodel(cid, time);
    });

    return markerElement;
}

function createMarkerElementAtc(iconClass, iconColor, rotation, lat, lon, cid, fq, callsign, rating) {
    var markerElement = document.createElement('div');
    markerElement.className = 'custom-marker';
    markerElement.innerHTML = `<i class="${iconClass}" style="font-size: 20px; color: ${iconColor}; transform: rotate(${rotation - 90}deg);"></i>`;
    // Add a click event listener to the marker element
    markerElement.addEventListener('click', function () {
        onpenmodelatc(cid, fq, callsign, lon, lat, rating);
        map.flyTo({
            center: [lon, lat],
            essential: true,
        });
    });

    return markerElement;
}
