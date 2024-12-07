var va = [];
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

// Function to update marker positions
function updateMarkerPositions(data) {
    if (data.flights) {
        Object.values(data.flights).forEach(flight => {
            var aircraftMarkerData = va.find(markerData => markerData.cid === flight.pilot.username);
            if (aircraftMarkerData) {
                aircraftMarkerData.marker.setLngLat([flight.progress.location.lon, flight.progress.location.lat]);
            } else {
                var aircraftMarker = new mapboxgl.Marker({
                    element: createMarkerElementPilotVa('fas fa-plane', '#DC143C', flight.progress.magneticHeading, flight.progress.location.lat, flight.progress.location.lon, flight.progress.departureTime, flight.pilot.username,flight.bookingId),
                    anchor: 'bottom',
                })
                    .setLngLat([flight.progress.location.lon, flight.progress.location.lat])
                    .addTo(map)
                    .on('click', function () {
                        // Move the map center to the clicked aircraft marker
                        map.flyTo({
                            center: [flight.progress.location.lon, flight.progress.location.lat],
                            essential: true, // this animation is considered essential with respect to prefers-reduced-motion
                        });
                    });
                va.push({ cid: flight.pilot.username, marker: aircraftMarker });
            }
        });
    }
}

// Fetch and update data every 5 seconds
setInterval(() => {
    fetchData('https://imp.xfex.cc/server/vawhazzup.json').then(data => {
        // Update marker positions
        updateMarkerPositions(data);
    });
}, 10000);

// Function to create a marker element with FontAwesome icon and rotation
function createMarkerElementPilotVa(iconClass, iconColor, rotation, lat, lon, time, cid,booking) {
    var markerElement = document.createElement('div');
    markerElement.className = 'custom-marker';
    markerElement.innerHTML = `<i class="${iconClass}" style="font-size: 20px; color: ${iconColor}; transform: rotate(${rotation - 90}deg);"></i>`;
    // Add click event listener on marker element
    markerElement.addEventListener('click', function () {
        map.flyTo({
            center: [lon,lat],
            essential: true,
        });
         openmodelva(booking);
    });

    return markerElement;
}
