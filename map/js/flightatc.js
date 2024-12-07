document.addEventListener('DOMContentLoaded', function () {


    setInterval(() => {
        const apiEndpoint = './whazzup.php';
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
                var cards = '';
                for (let i = 0; i < data.pilot.length; i++) {
                    cards += '<tr>';
                    cards += '<th scope="row">' + (i + 1) + '</th>';
                    cards += '<td>' + (data.pilot[i].callsign || 'N/A') + '</td>';
                    cards += '<td>' + (data.pilot[i].cid || 'N/A') + '</td>';
                    // Check if flight_plan is defined and not null
                    if (data.pilot[i].flight_plan && data.pilot[i].flight_plan !== null) {
                        cards += '<td>' + (data.pilot[i].flight_plan.departure || 'N/A') + '</td>';
                        cards += '<td>' + (data.pilot[i].flight_plan.arrival || 'N/A') + '</td>';
                        cards += '<td>' + (data.pilot[i].flight_plan.aircraft || 'N/A') + '</td>';
                        cards += '<td><button type="button" onclick="openmodel(\'' + data.pilot[i].cid + '\', \'' + data.pilot[i].logon_time + '\')" class="btn btn-outline-primary" style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;">跟踪</button></td>';
                    } else {
                        cards += '<td>N/A</td>';
                        cards += '<td>N/A</td>';
                        cards += '<td>N/A</td>';
                        cards += '<td><button type="button" onclick="openmodel(\'' + data.pilot[i].cid + '\', \'' + data.pilot[i].logon_time + '\')" class="btn btn-outline-primary" style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;">跟踪</button></td>';
                    }

                    cards += '</tr>';
                }
                document.getElementById("flight").innerHTML = cards;

                var cards_atc = '';
                for (let i = 0; i < data.controllers.length; i++) {
                    cards_atc += '<tr>';
                    cards_atc += '<th scope="row">' + (i + 1) + '</th>';
                    cards_atc += '<td>' + (data.controllers[i].callsign || 'N/A') + '</td>';
                    cards_atc += '<td>' + (data.controllers[i].frequency || 'N/A') + '</td>';
                    cards_atc += '<td>' + (data.controllers[i].cid || 'N/A') + '</td>';
                    cards_atc += '<td>' + grade(data.controllers[i].rating) + '</td>';
                    cards_atc += '<td><button type="button" onclick="onpenmodelatc(\'' + data.controllers[i].cid + '\', \'' + data.controllers[i].frequency + '\', \'' + data.controllers[i].callsign + '\', \'' + data.controllers[i].longitude + '\', \'' + data.controllers[i].latitude + '\')" class="btn btn-outline-primary" style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;">跟踪</button></td>';
                    cards_atc += '</tr>';
                }
                document.getElementById("atc").innerHTML = cards_atc;
            })
            .catch(error => {
                // Handle errors
                console.error('There was a problem with the fetch operation:', error);
            });
    }, 1000);

});

function grade(gradeNumber) {
    switch (gradeNumber) {
        case 1:
            return 'Pilot/Observer';
        case 2:
            return 'Student1';
        case 3:
            return 'Student2';
        case 4:
            return 'Student3';
        case 5:
            return 'Control1';
        case 6:
            return 'Control2';
        case 7:
            return 'Control3';
        case 8:
            return 'Instructor1';
        case 9:
            return 'Instructor2';
        case 10:
            return 'Instructor3';
        case 11:
            return 'Supervision';
        case 12:
            return 'Administrator';
        default:
            return 'Pilot/Observer';
    }
}

