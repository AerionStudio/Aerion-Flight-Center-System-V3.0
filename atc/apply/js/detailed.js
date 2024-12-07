document.addEventListener('DOMContentLoaded', function () {
    const url = '../../../server/GetEvents.php';
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    let status_event
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
                        status_event = state;
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


    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    const apiEndpoint = '../../server/GetAtcEnrollmentInformationByID.php';

    const requestData = {
        id: id // 替换为你的特定ID
    };
    fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => {

            return response.json();
        })
        .then(data => {
            var cards = '';

            for (let i = 0; i < data.length; i++) {
                cards += '<div class="card">';
                cards += '<div class="icon-container">';
                cards += '<div class="card-title">席位名称：' + data[i].atc + '</div>';
                console.log(status_event);
                console.log(data);
                if (status_event == 1) {
                    if (sessionStorage.getItem("user_grade") >= data[i].atc_grade) {
                        if (!data[i].user) {
                            cards += '<button id="sign-' + i + '" data-id="' + data[i].atc + '" value="1" type="button" class="btn btn-outline-primary application" onclick="postUserFlightByValue(' + i + ',0)"> + 报名</button>';
                        } else {
                            if (data[i].user.id == sessionStorage.getItem("user_num")) {
                                cards += '  <button id="sign-' + i + '" data-id="' + data[i].atc + '" value="5" type="button" class="btn btn-outline-danger application" onclick="postUserFlightByValue(' + i + ',0)"> x 取消报名</button>';
                            } else {
                                cards += '  <button id="sign-' + i + '" data-id="' + data[i].atc + '" value="6" type="button" class="btn btn-outline-warning application" onclick="postUserFlightByValue(' + i + ',0)"> ✓ 已有人报名</button>';
                            }
                        }
                        cards += '<br><br>';
                        if (sessionStorage.getItem("user_grade") >= 8) {
                            if (data[i].user && (data[i].user.grade === '2' || data[i].user.grade === '3')) {
                                if (data[i].supervision.id == 'NULL') {
                                    cards += '<button id="sign-sup-' + i + '" data-id="' + data[i].atc + '" value="1" type="button" class="btn btn-outline-primary application" onclick="postUserFlightByValue(' + i + ',1)">+ 报名监管</button>';
                                } else {
                                    if (data[i].supervision.id == sessionStorage.getItem("user_num")) {
                                        cards += '  <button id="sign-sup-' + i + '" data-id="' + data[i].atc + '" value="5" type="button" class="btn btn-outline-danger application" onclick="postUserFlightByValue(' + i + ',1)"> x 取消报名</button>';
                                    } else {
                                        cards += '  <button id="sign-sup-' + i + '" data-id="' + data[i].atc + '" value="3" type="button" class="btn btn-outline-warning application" onclick="postUserFlightByValue(' + i + ',1)"> ✓ 已有人报名</button>';
                                    }
                                }
                            }
                        } else if (data[i].supervision) {
                            cards += '<button id="sign-sup-' + i + '" data-id="' + data[i].atc + '" value="7" type="button" class="btn btn-outline-danger application" onclick="postUserFlightByValue(' + i + ',1)"> x 没有权限</button>';
                        }
                    } else {
                        cards += '<button id="sign-' + i + '" data-id="' + data[i].atc + '" value="7" type="button" class="btn btn-outline-danger application" onclick="postUserFlightByValue(' + i + ',0)"> x 没有权限</button>';
                    }
                } else if (status_event == 2) {
                    cards += '<button id="sign-' + i + '" data-id="' + data[i].atc + '" value="2" type="button" class="btn btn-outline-primary application" onclick="postUserFlightByValue(' + i + ',0)">  正在进行</button>';
                } else if (status_event == 3) {
                    cards += '<button id="sign-' + i + '" data-id="' + data[i].atc + '" value="3" type="button" class="btn btn-outline-warning application" onclick="postUserFlightByValue(' + i + ',0)">  已结束</button>';
                } else {
                    cards += '<button id="sign-' + i + '" data-id="' + data[i].atc + '" value="4" type="button" class="btn btn-outline-danger application" onclick="postUserFlightByValue(' + i + ',0)">  取消</button>';
                }


                cards += ' </div>';
                cards += '<div class="atc">席位频率：' + data[i].atc_fp + '</div>\n<br>';
                if (data[i].user) {
                    cards += '<div class="atc">席位人员：' + data[i].user.id + '</div>\n<br>';
                } else {
                    cards += '<div class="atc">席位人员：暂无</div>\n<br>';
                }

                // Check if user is not null before accessing its properties
                if (data[i].user && (data[i].user.grade === '2' || data[i].user.grade === '3')) {
                    cards += '<div class="atc">监管人员：' + data[i].supervision.id + '</div>\n</div>';
                }

                cards += '\n</div>';
                cards += '\n<br>';
            }


            document.getElementById("atc-card").innerHTML = cards;
        })
        .catch(error => {
            // 处理错误情况
            console.error('There was a problem with the fetch operation:', error);
            console.log(error.response); // Assuming you have a response property in the error object
        });

});

function getdataatc() {
    const url = '../../../server/GetEvents.php';
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    let status_event
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
                            time
                        } = response[i];
                        console.log(Publisher, app, app_icao, atc, atc_fq, dep, dep_icao, direction, route, state, takeoff_time, time);
                        status_event = state;
                        document.getElementById("time").innerText = id;
                        document.getElementById("dep_icao").innerText = dep_icao;
                        document.getElementById("dep").innerText = dep;
                        document.getElementById("app").innerText = app;
                        document.getElementById("app_icao").innerText = app_icao;
                        document.getElementById("route").innerText = route;
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


    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    const apiEndpoint = '../../server/GetAtcEnrollmentInformationByID.php';

    const requestData = {
        id: id // 替换为你的特定ID
    };
    fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => {

            return response.json();
        })
        .then(data => {
            var cards = '';

            for (let i = 0; i < data.length; i++) {
                cards += '<div class="card">';
                cards += '<div class="icon-container">';
                cards += '<div class="card-title">席位名称：' + data[i].atc + '</div>';
                console.log(status_event);
                console.log(data);
                if (status_event == 1) {
                    if (sessionStorage.getItem("user_grade") >= data[i].atc_grade) {
                        if (!data[i].user) {
                            cards += '<button id="sign-' + i + '" data-id="' + data[i].atc + '" value="1" type="button" class="btn btn-outline-primary application" onclick="postUserFlightByValue(' + i + ',0)"> + 报名</button>';
                        } else {
                            if (data[i].user.id == sessionStorage.getItem("user_num")) {
                                cards += '  <button id="sign-' + i + '" data-id="' + data[i].atc + '" value="5" type="button" class="btn btn-outline-danger application" onclick="postUserFlightByValue(' + i + ',0)"> x 取消报名</button>';
                            } else {
                                cards += '  <button id="sign-' + i + '" data-id="' + data[i].atc + '" value="6" type="button" class="btn btn-outline-warning application" onclick="postUserFlightByValue(' + i + ',0)"> ✓ 已有人报名</button>';
                            }
                        }
                        cards += '<br><br>';
                        if (sessionStorage.getItem("user_grade") >= 8) {
                            if (data[i].user && (data[i].user.grade === '2' || data[i].user.grade === '3')) {
                                if (data[i].supervision.id == 'NULL') {
                                    cards += '<button id="sign-sup-' + i + '" data-id="' + data[i].atc + '" value="1" type="button" class="btn btn-outline-primary application" onclick="postUserFlightByValue(' + i + ',1)">+ 报名监管</button>';
                                } else {
                                    if (data[i].supervision.id == sessionStorage.getItem("user_num")) {
                                        cards += '  <button id="sign-sup-' + i + '" data-id="' + data[i].atc + '" value="5" type="button" class="btn btn-outline-danger application" onclick="postUserFlightByValue(' + i + ',1)"> x 取消报名</button>';
                                    } else {
                                        cards += '  <button id="sign-sup-' + i + '" data-id="' + data[i].atc + '" value="3" type="button" class="btn btn-outline-warning application" onclick="postUserFlightByValue(' + i + ',1)"> ✓ 已有人报名</button>';
                                    }
                                }
                            }
                        } else if (data[i].supervision) {
                            cards += '<button id="sign-sup-' + i + '" data-id="' + data[i].atc + '" value="7" type="button" class="btn btn-outline-danger application" onclick="postUserFlightByValue(' + i + ',1)"> x 没有权限</button>';
                        }
                    } else {
                        cards += '<button id="sign-' + i + '" data-id="' + data[i].atc + '" value="7" type="button" class="btn btn-outline-danger application" onclick="postUserFlightByValue(' + i + ',0)"> x 没有权限</button>';
                    }
                } else if (status_event == 2) {
                    cards += '<button id="sign-' + i + '" data-id="' + data[i].atc + '" value="2" type="button" class="btn btn-outline-primary application" onclick="postUserFlightByValue(' + i + ',0)">  正在进行</button>';
                } else if (status_event == 3) {
                    cards += '<button id="sign-' + i + '" data-id="' + data[i].atc + '" value="3" type="button" class="btn btn-outline-warning application" onclick="postUserFlightByValue(' + i + ',0)">  已结束</button>';
                } else {
                    cards += '<button id="sign-' + i + '" data-id="' + data[i].atc + '" value="4" type="button" class="btn btn-outline-danger application" onclick="postUserFlightByValue(' + i + ',0)">  取消</button>';
                }


                cards += ' </div>';
                cards += '<div class="atc">席位频率：' + data[i].atc_fp + '</div>\n<br>';
                if (data[i].user) {
                    cards += '<div class="atc">席位人员：' + data[i].user.id + '</div>\n<br>';
                } else {
                    cards += '<div class="atc">席位人员：暂无</div>\n<br>';
                }

                // Check if user is not null before accessing its properties
                if (data[i].user && (data[i].user.grade === '2' || data[i].user.grade === '3')) {
                    cards += '<div class="atc">监管人员：' + data[i].supervision.id + '</div>\n</div>';
                }

                cards += '\n</div>';
                cards += '\n<br>';
            }


            document.getElementById("atc-card").innerHTML = cards;
        })
        .catch(error => {
            // 处理错误情况
            console.error('There was a problem with the fetch operation:', error);
            console.log(error.response); // Assuming you have a response property in the error object
        });


}