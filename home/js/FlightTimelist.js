window.onload = function() {
    const url_time = "../server/GetFlightTimeList.php";
    const requestData = {};

    fetch(url_time, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        // body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                let cidArray = data.map(item => item.CID);
                let onlineTimeHoursArray = data.map(item => item.Online_Time_Hours);

                var myCharttime_all = echarts.init(document.getElementById('time_all'));
                var option_all = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                        data: cidArray,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }],
                    yAxis: [{
                        type: 'value'
                    }],
                    series: [{
                        name: '连线时长(小时)',
                        type: 'bar',
                        barWidth: '60%',
                        data: onlineTimeHoursArray
                    }]
                };
                myCharttime_all.setOption(option_all);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    const url_time_my = "../server/GetUserData.php?callsign=" + sessionStorage.getItem("user_num");

    fetch(url_time_my, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            var online_time_flight = 0;

            if (data.online_time && data.online_time.flight) {
                online_time_flight = Math.floor(parseInt(data.online_time.flight) / 3600);
            }

            var online_time_atc = 0;

            if (data.online_time && data.online_time.atc) {
                online_time_atc = Math.floor(parseInt(data.online_time.atc) / 3600);
            }

            var myCharttime_my = echarts.init(document.getElementById('time_my'));
            var option_my = {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '5%',
                    left: 'center'
                },
                series: [{
                    name: '在线时长',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 40,
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [{
                        value: online_time_flight,
                        name: '飞行时长'
                    },
                        {
                            value: online_time_atc,
                            name: '管制时长'
                        },
                    ]
                }]
            };
            myCharttime_my.setOption(option_my);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });


};
   