mapboxgl.accessToken = 'pk.eyJ1IjoiZ3VvYXI3c2J2ZCIsImEiOiJjbG9wd2s5dncwMThxMnFtazNncGxoZ3VyIn0.kxcLHaYXSoM8GfPpurqU7w'; // Replace with your Mapbox access token

var center = [116.397428, 39.90923];
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/guoar7sbvd/clsspd7zp00zy01pf82hx1x67',
    center: center,
    zoom: 3,
});

const urlParams = new URLSearchParams(window.location.search);
const cid = urlParams.get('cid');
const time = urlParams.get('time');
const api = "https://imp.xfex.cc/server/GetHistoryFlightData.php?callsign=" + cid + "&time=" + time;

fetch(api, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
})
    .then(response => response.json())
    .then(data => {
        console.log(data);
        document.getElementById("flightnum").innerText = data.data.Basic_Information.client_name;
        document.getElementById("cid").innerText = data.data.Basic_Information.cid;
        document.getElementById("dep").innerText = data.data.Basic_Information.depairport;
        document.getElementById("app").innerText = data.data.Basic_Information.destairport;
        document.getElementById("aircraft").innerText = data.data.Basic_Information.aircraft;
        document.getElementById("time").innerText = data.data.Basic_Information.time;
        var seconds = data.data.Basic_Information.online_time;
        var hours = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds % 3600) / 60);
        var remainingSeconds = seconds % 60;
        var timeString = hours + " 小时 " + minutes + " 分钟 " + remainingSeconds + " 秒 ";
        document.getElementById("online_time").innerText = timeString;
        var dom = document.getElementById('table1');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        option = {
            color: ['#80FFA5', '#FF0087'],
            title: {
                text: '高度/速度'
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
                data: ['高度', '速度']
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
                    data: data.data.Details.timelist
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
                    data: data.data.Details.altitude
                },
                {
                    name: '速度',
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
                                color: 'rgb(255, 0, 135)'
                            },
                            {
                                offset: 1,
                                color: 'rgb(135, 0, 157)'
                            }
                        ])
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: data.data.Details.groundspeed
                },
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);


        // Parse coordinates
        var coordinates = data.data.Details.location.map(function(coordString, index) {
            if (index > 0) { // Starting from index 1
                var parts = coordString.split(",");
                return [parseFloat(parts[0]), parseFloat(parts[1])];
            } else {
                return null; // Skip the first coordinate
            }
        }).filter(function(coord) {
            return coord !== null; // Filter out null values
        });

// 计算中间点的索引
        var middleIndex = Math.floor(coordinates.length / 2);

// 获取中间点的坐标
        var middleCoordinate = coordinates[middleIndex];

// 使用 flyTo() 方法将地图移动到中间点坐标
        map.flyTo({
            center: middleCoordinate, // 指定中心点坐标
            essential: true, // 表示这是一个必要的动画，以确保在动画过程中不会被中断
        });


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

