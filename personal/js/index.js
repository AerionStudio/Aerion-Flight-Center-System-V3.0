document.addEventListener('DOMContentLoaded', function () {
    let userNumElement = document.getElementById("user_num");
    let userNumInput = document.getElementById("user_num_input");
    let useremailInput=document.getElementById("email");
    if (userNumElement) {
        userNumElement.innerText = sessionStorage.getItem("user_num");
        userNumInput.placeholder= sessionStorage.getItem("user_num");
        useremailInput.placeholder=sessionStorage.getItem("user_email");
        const url_time_my = "../server/GetUserData.php?callsign=" + sessionStorage.getItem("user_num");

        fetch(url_time_my, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                let flight_time = document.getElementById("flight_time");
                var online_time_flight = 0;

                if (data.online_time && data.online_time.flight) {
                    online_time_flight = Math.floor(parseInt(data.online_time.flight) / 3600);
                }

                flight_time.textContent = online_time_flight + '小时';

                let atc_time = document.getElementById("atc_time");
                var online_time_atc = 0;

                if (data.online_time && data.online_time.atc) {
                    online_time_atc = Math.floor(parseInt(data.online_time.atc) / 3600);
                }

                atc_time.textContent = online_time_atc + '小时';

            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });


        const flight_atc_list = "../server/GetUserFlightAtcDataByID.php?callsign=" + sessionStorage.getItem("user_num");

        fetch(flight_atc_list, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                var cards_flight = '';
                for (let i = data.data.flightData.length-1; i >0 ; i--) {
                    cards_flight += "<tr>";
                    cards_flight += '<td>' + (i+1) + '</td>';
                    cards_flight += '<td>' + data.data.flightData[i].client_name + '</td>';
                    cards_flight += '<td>' + data.data.flightData[i].depairport + '</td>';
                    cards_flight += '<td>' + data.data.flightData[i].destairport + '</td>';
                    cards_flight += '<td>' + data.data.flightData[i].aircraft + '</td>';
                    cards_flight += '<td>' + data.data.flightData[i].time + '</td>';
                    var online_time_flight = 0;
                    online_time_flight = Math.floor(parseInt(data.data.flightData[i].online_time) / 3600);
                    cards_flight += '<td>' + online_time_flight + '小时</td>';
                    cards_flight += '<td><button type="button" onclick="openmodal(\'' + data.data.flightData[i].cid + '\', \'' + data.data.flightData[i].time + '\')" class="btn btn-primary btn-sm">查看</button></td>';
                    cards_flight += "</tr>";
                }
                document.getElementById("flightlist").innerHTML=cards_flight;
                document.getElementById("flightlistnum").innerText=data.data.flightData.length+'架次';



                var cards_atc = '';
                for (let i =  data.data.atcData.length-1; i >0; i--) {
                    cards_atc += "<tr>";
                    cards_atc += '<td>' + (i+1) + '</td>';
                    cards_atc += '<td>' + data.data.atcData[i].callsign + '</td>';
                    cards_atc += '<td>' + data.data.atcData[i].frequency + '</td>';
                    cards_atc += '<td>' + data.data.atcData[i].logon_time + '</td>';
                    var online_time_atc = 0;
                    online_time_atc = Math.floor(parseInt(data.data.atcData[i].online_time) / 3600);
                    cards_atc += '<td>' + online_time_atc + '小时</td>';
                    cards_atc += "</tr>";
                }
                document.getElementById("atclist").innerHTML=cards_atc;
                document.getElementById("atclistnum").innerText=data.data.atcData.length+'次';

            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });


    }

    let userGrade = document.getElementById("user_grade");
    if (userGrade) {
        let grade = 'pilot/observer';
        switch (parseInt(sessionStorage.getItem("user_grade"))) {
            case 1:
                grade = 'Pilot/Observer';
                break;
            case 2:
                grade = 'Student1';
                break;
            case 3:
                grade = 'Student2';
                break;
            case 4:
                grade = 'Student3';
                break;
            case 5:
                grade = 'Control1';
                break;
            case 6:
                grade = 'Control2';
                break;
            case 7:
                grade = 'Control3';
                break;
            case 8:
                grade = 'Instructor1';
                break;
            case 9:
                grade = 'Instructor2';
                break;
            case 10:
                grade = 'Instructor3';
                break;
            case 11:
                grade = 'Supervision';
                break;
            case 12:
                grade = 'Administrator';
                break;
            default:
                grade = 'Pilot/Observer';
                break;
        }
        userGrade.innerText = grade;
    }
});
function openmodal(cid,time) {
    // console.log(id);
    layer.open({
        type: 1, // page 层类型
        area: ['1800px', '800px'],
        title: '航班详细',
        shade: 0.6, // 遮罩透明度
        shadeClose: true, // 点击遮罩区域，关闭弹层
        maxmin: true, // 允许全屏最小化
        anim: 0, // 0-6 的动画形式，-1 不开启
        content: `<iframe src="https://imp.xfex.cc/personal/flight.html?cid=${cid}&time=${time}" frameborder="0"></iframe>`
    });
}