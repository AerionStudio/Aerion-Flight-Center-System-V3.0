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
                            state
                        } = response[i];
                        status_event = state;

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
                            cards += '<button id="sign-' + i + '" data-id="' + data[i].atc + '" value="1" type="button" class="btn btn-outline-primary application" onclick="postUserAtcByValue(' + i + ',0)"> + 报名</button>';
                        } else {
                            if (data[i].user.id == sessionStorage.getItem("user_num")) {
                                cards += '  <button id="sign-' + i + '" data-id="' + data[i].atc + '" value="5" type="button" class="btn btn-outline-danger application" onclick="postUserAtcByValue(' + i + ',0)"> x 取消报名</button>';
                            } else {
                                cards += '  <button id="sign-' + i + '" data-id="' + data[i].atc + '" value="6" type="button" class="btn btn-outline-warning application" onclick="postUserAtcByValue(' + i + ',0)"> ✓ 已有人报名</button>';
                            }
                        }
                        cards += '<br><br>';
                        if (sessionStorage.getItem("user_grade") >= 8||sessionStorage.getItem("user_num")=='1275') {
                            if (data[i].user && (data[i].user.grade === '2' || data[i].user.grade === '3')) {
                                if (data[i].supervision.id == 'NULL') {
                                    cards += '<button id="sign-sup-' + i + '" data-id="' + data[i].atc + '" value="1" type="button" class="btn btn-outline-primary application" onclick="postUserAtcByValue(' + i + ',1)">+ 报名监管</button>';
                                } else {
                                    if (data[i].supervision.id == sessionStorage.getItem("user_num")) {
                                        cards += '  <button id="sign-sup-' + i + '" data-id="' + data[i].atc + '" value="5" type="button" class="btn btn-outline-danger application" onclick="postUserAtcByValue(' + i + ',1)"> x 取消报名</button>';
                                    } else {
                                        cards += '  <button id="sign-sup-' + i + '" data-id="' + data[i].atc + '" value="3" type="button" class="btn btn-outline-warning application" onclick="postUserAtcByValue(' + i + ',1)"> ✓ 已有人报名</button>';
                                    }
                                }
                            }
                        } else if (data[i].supervision) {
                            cards += '<button id="sign-sup-' + i + '" data-id="' + data[i].atc + '" value="7" type="button" class="btn btn-outline-danger application" onclick="postUserAtcByValue(' + i + ',1)"> x 没有权限</button>';
                        }
                    } else {
                        cards += '<button id="sign-' + i + '" data-id="' + data[i].atc + '" value="7" type="button" class="btn btn-outline-danger application" onclick="postUserAtcByValue(' + i + ',0)"> x 没有权限</button>';
                    }
                } else if (status_event == 2) {
                    cards += '<button id="sign-' + i + '" data-id="' + data[i].atc + '" value="2" type="button" class="btn btn-outline-primary application" onclick="postUserAtcByValue(' + i + ',0)">  正在进行</button>';
                } else if (status_event == 3) {
                    cards += '<button id="sign-' + i + '" data-id="' + data[i].atc + '" value="3" type="button" class="btn btn-outline-warning application" onclick="postUserAtcByValue(' + i + ',0)">  已结束</button>';
                } else {
                    cards += '<button id="sign-' + i + '" data-id="' + data[i].atc + '" value="4" type="button" class="btn btn-outline-danger application" onclick="postUserAtcByValue(' + i + ',0)">  取消</button>';
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

