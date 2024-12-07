let intervalId; // Variable to store the interval ID
let isRouteDisplayed = false; // 新增变量来跟踪航路是否已经打开
function openmodel(cid, time) {
    if (intervalId) {
        clearInterval(intervalId);
    }
    // Remove the existing 'line' source and layer
    if (map.getSource('line')) {
        map.removeLayer('line');
        map.removeSource('line');
    }
    // Remove the existing 'line' source and layer
    if (map.getSource('line-va-source')) {
        map.removeLayer('line-va');
        map.removeSource('line-va-source');
    }
    isRouteDisplayed = false;
    console.log('cid=', cid);
    console.log('time', time);
    document.getElementById("card3").style.display = 'none';
    document.getElementById("card4").style.display = 'none';
    document.getElementById("card2").style.display = 'none';
    document.getElementById("card2").style.display = 'block';

    // Clear the previous interval
    if (intervalId) {
        clearInterval(intervalId);
    }

    fetchData('./whazzup.php').then(data => {
        if (data.pilot && data.pilot.length > 0) {
            data.pilot.forEach(pilot => {
                if (pilot.cid == cid) {
                    document.getElementById("pilot").innerText = cid;
                    document.getElementById("callsign").innerText = pilot.callsign;
                    document.getElementById("latitude").innerText = pilot.latitude;
                    document.getElementById("longitude").innerText = pilot.longitude;
                    document.getElementById("speed").innerText = pilot.groundspeed;
                    document.getElementById("alt").innerText = pilot.altitude;
                    map.flyTo({
                        center: [pilot.longitude, pilot.latitude],
                        essential: true,
                    });
                    if (pilot.flight_plan) {
                        document.getElementById("aircraft").innerText = pilot.flight_plan.aircraft;
                        document.getElementById("dep").innerText = pilot.flight_plan.departure;
                        document.getElementById("app").innerText = pilot.flight_plan.arrival;
                    } else {
                        document.getElementById("aircraft").innerText = 'N/A'
                        document.getElementById("dep").innerText = 'N/A';
                        document.getElementById("app").innerText = 'N/A';
                    }
                }
            });
        }

        // Set the new interval
        intervalId = setInterval(() => {
            const api = "https://imp.xfex.cc/server/GetOnlineFlightDataByCid.php";
            const requestData = {
                token: 'ab321818',
                cid: cid,
                time: time
            };

            fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    document.getElementById("onlinetime").innerText = data.data.onlinetime;
                    var altitudedata = data.data.altitude;
                    var groundspeeddata = data.data.groundspeed;
                    var timelist = data.data.timelist;
                    var longitudelist = data.data.lon;
                    var latitudelist = data.data.lat;


                    window.addEventListener('resize', myChart.resize);
                    var coordinates = [];
                    for (var i = 0; i < longitudelist.length; i++) {
                        var longitude = parseFloat(longitudelist[i]);
                        var latitude = parseFloat(latitudelist[i]);

                        if (!isNaN(longitude) && !isNaN(latitude)) {
                            coordinates.push([longitude, latitude]);
                        } else {
                            console.error('Invalid coordinates at index ' + i + ': ' + longitudelist[i] + ', ' + latitudelist[i]);
                        }
                    }


                    // Add the new 'line' source and layer
                    map.addSource('line', {
                        'type': 'geojson',
                        'data': {
                            'type': 'Feature',
                            'properties': {},
                            'geometry': {
                                'type': 'LineString',
                                'coordinates': coordinates
                            }
                        }
                    });

                    map.addLayer({
                        'id': 'line',
                        'type': 'line',
                        'source': 'line',
                        'layout': {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        'paint': {
                            'line-color': '#9400D3',
                            'line-width': 3
                        }
                    });
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }, 1000);
    });
}

function closemodel() {
    // Clear the interval when closing the model
    if (intervalId) {
        clearInterval(intervalId);
    }

    // Rest of the code...

    if (map.getSource('line')) {
        map.removeLayer('line');
        map.removeSource('line');
    }
    if (map.getSource('line-va-source')) {
        map.removeLayer('line-va');
        map.removeSource('line-va-source');
    }
    document.getElementById("card2").style.display = 'none';
    document.getElementById("card3").style.display = 'none';
    document.getElementById("card4").style.display = 'none';
}

function onpenmodelatc(cid, fq, callsign, lon, lat, rating) {
    document.getElementById("card2").style.display = 'none';
    document.getElementById("card4").style.display = 'none';
    document.getElementById("card3").style.display = 'none';
    document.getElementById("card3").style.display = 'block';

    map.flyTo({
        center: [lon, lat],
        essential: true,
    });
    document.getElementById("callsignatc").innerText = callsign;
    document.getElementById("fqatc").innerText = fq;
    document.getElementById("cid").innerText = cid;
    document.getElementById("rating").innerText = grade(rating);

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
}


function openmodelva(booking) {
    if (intervalId) {
        clearInterval(intervalId);
    }
    // Remove the existing 'line' source and layer
    if (map.getSource('line')) {
        map.removeLayer('line');
        map.removeSource('line');
    }
    // Remove the existing 'line' source and layer
    if (map.getSource('line-va-source')) {
        map.removeLayer('line-va');
        map.removeSource('line-va-source');
    }
    isRouteDisplayed = false;
    document.getElementById("card3").style.display = 'none';
    document.getElementById("card2").style.display = 'none';
    document.getElementById("card4").style.display = 'none';
    document.getElementById("card4").style.display = 'block';

    fetchData('https://imp.xfex.cc/server/vawhazzup.json').then(data => {
        document.getElementById("pilot-va").innerText = data['flights'][booking]['pilot']['username'];
        document.getElementById("callsign-va").innerText = data['flights'][booking]['booking']['callsign'];
        document.getElementById("latitude-va").innerText = data['flights'][booking]['progress']['location']['lat'];
        document.getElementById("longitude-va").innerText = data['flights'][booking]['progress']['location']['lon'];
        document.getElementById("speed-va").innerText = data['flights'][booking]['progress']['groundSpeed'];
        document.getElementById("alt-va").innerText = data['flights'][booking]['progress']['altitude'];
        document.getElementById("aircraft-va").innerText = data['flights'][booking]['aircraft']['code'];
        var departureAirport = data['flights'][booking]['departureAirport']['name'];
        var arrivalAirport = data['flights'][booking]['arrivalAirport']['name'];

        // 提取管道符号后的内容
        var depName = departureAirport.split('|')[1].trim();
        var appName = arrivalAirport.split('|')[1].trim();

        document.getElementById("dep-va").innerText = depName;
        document.getElementById("app-va").innerText = appName;
        document.getElementById("dep-icao-va").innerText = data['flights'][booking]['departureAirport']['icao'];
        document.getElementById("app-icao-va").innerText = data['flights'][booking]['arrivalAirport']['icao'];
        map.flyTo({
            center: [data['flights'][booking]['progress']['location']['lon'], data['flights'][booking]['progress']['location']['lat']],
            essential: true,
        });
        document.getElementById("onlinetime-va").innerText = data['flights'][booking]['progress']['timeRemaining'];
        if (!isRouteDisplayed) { // 检查航路是否已经显示

            var timelist = Object.keys(data.flights[booking].progress.posreps);
            const lats = [];
            const lons = [];
            const alts = [];
            Object.values(data.flights[booking].progress.posreps).forEach(posrep => {
                lats.push(parseFloat(posrep.lat));
                lons.push(parseFloat(posrep.lon));
                alts.push(posrep.alt);
            });

            var dom = document.getElementById('table1-va');
            var myChart = echarts.init(dom, null, {
                renderer: 'canvas',
                useDirtyRect: false
            });

            var option;

            option = {
                color: ['#80FFA5', '#FF0087'],
                title: {
                    text: '高度'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    data: ['高度']
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: timelist
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '高度',
                        type: 'line',
                        stack: 'Total',
                        smooth: true,
                        lineStyle: {
                            width: 0
                        },
                        showSymbol: false,
                        areaStyle: {
                            opacity: 0.8,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: 'rgb(128, 255, 165)'
                                },
                                {
                                    offset: 1,
                                    color: 'rgb(1, 191, 236)'
                                }
                            ])
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        data: alts
                    },
                ]
            };

            if (option && typeof option === 'object') {
                myChart.setOption(option);
            }

            window.addEventListener('resize', myChart.resize);

            var sampleRate = 20;
            var sampledCoordinates = [];

            for (var i = 0; i < lons.length; i += sampleRate) {
                var longitude = parseFloat(lons[i]);
                var latitude = parseFloat(lats[i]);
                if (!isNaN(longitude) && !isNaN(latitude)) {
                    sampledCoordinates.push([longitude, latitude]);
                } else {
                    console.error('Invalid coordinates at index ' + i + ': ' + lons[i] + ', ' + lats[i]);
                }
            }


            // Add the new 'line' source and layer
            map.addSource('line-va-source', {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': sampledCoordinates
                    }
                }
            });

            map.addLayer({
                'id': 'line-va',
                'type': 'line',
                'source': 'line-va-source',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#9400D3',
                    'line-width': 3
                }
            });

            isRouteDisplayed = true;
        }
    });
}
