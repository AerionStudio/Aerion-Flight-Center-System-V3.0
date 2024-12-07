document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log("id=", id);
    GetFlightList(id);
    const url = '../server/GetEvents.php';
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                for (let i = 0; i < response.length; i++) {
                    if (response[i].time === id) {

                        const {
                            Publisher,
                            app,
                            app_icao,
                            atc,
                            atc_fq,
                            dep,
                            dep_icao,
                            direction,
                            route,
                            state,
                            takeoff_time,
                            time,
                            starttime,
                            starttime_re,
                            endtime_re,
                            nav,
                            more
                        } = response[i];
                        document.title = "SkyDreamClub官方活动报名 - " + time + " - " + dep_icao + ' ~ ' + app_icao;
                        console.log(Publisher, app, app_icao, atc, atc_fq, dep, dep_icao, direction, route, state, takeoff_time, time);
                        document.getElementById("time").innerText = id;
                        document.getElementById("dep_icao").innerText = dep_icao;
                        document.getElementById("dep").innerText = dep;
                        document.getElementById("app").innerText = app;
                        document.getElementById("app_icao").innerText = app_icao;
                        document.getElementById("route").innerText = route;
                        document.getElementById("begin").innerText = starttime;
                        document.getElementById("re_start").innerText = starttime_re;
                        document.getElementById("re_end").innerText = endtime_re;
                        document.getElementById("nav").innerText = nav;
                        document.getElementById("more").innerText = more;
                        switch (direction) {
                            case '2':
                                document.getElementById("fl").innerText = '向东飞行请使用单数高度层';
                                document.getElementById("fl_all").innerText = '8900米(FL291)、9500米(FL311)、10100米(FL331)、10700米(FL351)、11300米(FL371)、11900米(FL391)、12500米(FL411)';
                                break;
                            case '1':
                                document.getElementById("fl").innerText = '向西飞行请选择双数高度层';
                                document.getElementById("fl_all").innerText = '9200米(FL301)、9800米(FL321)、10400米(FL341)、11000米(FL361)、11600米(FL381)、12200米(FL401)';
                                break;
                            default:
                                document.getElementById("fl").innerText = '管理员未填写';
                                document.getElementById("fl_all").innerText = '管理员未填写';
                                break;
                        }
                        CheckUserFlight(id, state);
                    }
                }
                console.log(response);
            } else {
                console.error('There was an error with the request:', xhr.status);
            }
        }
    };

    xhr.onerror = function () {
        console.error('There was an error with the request');
    };

    xhr.send();
});

function getdata() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log("id=", id);
    GetFlightList(id);
    const url = '../server/GetEvents.php';
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                for (let i = 0; i < response.length; i++) {
                    if (response[i].time === id) {
                        const {
                            Publisher,
                            app,
                            app_icao,
                            atc,
                            atc_fq,
                            dep,
                            dep_icao,
                            direction,
                            route,
                            state,
                            takeoff_time,
                            time,
                            starttime,
                            starttime_re,
                            endtime_re,
                            nav
                        } = response[i];
                        console.log(Publisher, app, app_icao, atc, atc_fq, dep, dep_icao, direction, route, state, takeoff_time, time);
                        document.getElementById("time").innerText = id;
                        document.getElementById("dep_icao").innerText = dep_icao;
                        document.getElementById("dep").innerText = dep;
                        document.getElementById("app").innerText = app;
                        document.getElementById("app_icao").innerText = app_icao;
                        document.getElementById("route").innerText = route;
                        document.getElementById("begin").innerText = starttime;
                        document.getElementById("re_start").innerText = starttime_re;
                        document.getElementById("re_end").innerText = endtime_re;
                        document.getElementById("nav").innerText = nav;
                        switch (direction) {
                            case '2':
                                document.getElementById("fl").innerText = '向东飞行请使用单数高度层';
                                document.getElementById("fl_all").innerText = '8900米(FL291)、9500米(FL311)、10100米(FL331)、10700米(FL351)、11300米(FL371)、11900米(FL391)、12500米(FL411)';
                                break;
                            case '1':
                                document.getElementById("fl").innerText = '向西飞行请选择双数高度层';
                                document.getElementById("fl_all").innerText = '9200米(FL301)、9800米(FL321)、10400米(FL341)、11000米(FL361)、11600米(FL381)、12200米(FL401)';
                                break;
                            default:
                                document.getElementById("fl").innerText = '管理员未填写';
                                document.getElementById("fl_all").innerText = '管理员未填写';
                                break;
                        }
                        CheckUserFlight(id, state);
                    }
                }
                console.log(response);
            } else {
                console.error('There was an error with the request:', xhr.status);
            }
        }
    };

    xhr.onerror = function () {
        console.error('There was an error with the request');
    };

    xhr.send();
}