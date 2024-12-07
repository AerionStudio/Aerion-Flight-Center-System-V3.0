document.addEventListener('DOMContentLoaded', function () {


    setInterval(() => {
        const apiEndpoint = 'https://imp.xfex.cc/server/vawhazzup.json';
        fetch(apiEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                // console.log(data);

                let flightKeys = Object.keys(data.flights);
                let cards = '';
                for (let i = 0; i < data['total']; i++) {
                    cards += '<tr>';
                    cards += '<th scope="row">' + flightKeys[i] + '</th>';
                    cards += '<td>' + data['flights'][flightKeys[i]]['booking']['callsign'] + '</td>';
                    cards += '<td>' + data['flights'][flightKeys[i]]['pilot']['username'] + '</td>';
                    cards += '<td>' + data['flights'][flightKeys[i]]['departureAirport']['icao'] + '</td>';
                    cards += '<td>' + data['flights'][flightKeys[i]]['arrivalAirport']['icao'] + '</td>';
                    cards += '<td>' + data['flights'][flightKeys[i]]['aircraft']['code'] + '</td>';
                    switch (data['flights'][flightKeys[i]]['progress']['currentPhase']) {
                        case 'Preflight':
                            cards += '<td> <span class="badge text-bg-primary">航前准备</span></td>';
                            break;
                        case 'Taxiing to Runway':
                            cards += '<td> <span class="badge text-bg-secondary">滑行至跑道</span></td>';
                            break;
                        case 'Climbing':
                            cards += '<td> <span class="badge text-bg-warning">爬升</span></td>';
                            break;
                        case 'Cruising':
                            cards += '<td> <span class="badge text-bg-success">巡航</span></td>';
                            break;
                        case 'Descending':
                            cards += '<td> <span class="badge text-bg-warning">下降</span></td>';
                            break;
                        case 'Pushing Back':
                            cards += '<td> <span class="badge text-bg-secondary">推出开车</span></td>';
                            break;
                        case 'Approaching':
                            cards += '<td> <span class="badge text-bg-info">进近</span></td>';
                            break;
                        case 'Final Approach':
                            cards += '<td> <span class="badge text-bg-info">最终进近</span></td>';
                            break;
                        case 'Taking Off':
                            cards += '<td> <span class="badge text-bg-info">起飞</span></td>';
                            break;
                        case 'Landing':
                            cards += '<td> <span class="badge text-bg-info">落地</span></td>';
                            break;
                        case 'Arrived':
                            cards += '<td> <span class="badge text-bg-primary">到达</span></td>';
                            break;
                        case 'Taxiing to Gate':
                            cards += '<td> <span class="badge text-bg-secondary">滑行至登机口</span></td>';
                            break;
                        default:
                            cards += '<td> <span class="badge text-bg-primary">' + data['flights'][flightKeys[i]]['progress']['currentPhase'] + '</span></td>';
                            break;
                    }
                    cards += '<td><button type="button"  class="btn btn-outline-primary" onclick="openmodelva(\'' + flightKeys[i] + '\')" style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;">跟踪</button></td>';
                    cards += '</tr>';
                }
                document.getElementById("va-data").innerHTML = cards;


            })
            .catch(error => {
                // Handle errors
                console.error('There was a problem with the fetch operation:', error);
            });
    }, 1000);

});

