
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

function postUserAtcByValue(id,sta) {
    const urlParams = new URLSearchParams(window.location.search);
    var time = urlParams.get('id');
    console.log(time);
    if (!sta){
        var yourButton = document.getElementById("sign-" + id);

        var buttonValue = yourButton.value;

        console.log("按钮的值是：" + buttonValue);

        switch (buttonValue) {
            case '1':
                var myButton = document.getElementById("sign-" + id);

                var dataIdValue = myButton.getAttribute("data-id");

                console.log("data-id值为：" + dataIdValue);
                const apiEndpoint = '../../server/SignUpAtcByID.php';
                const requestData = {
                    token: 'ab321818',
                    time:time,
                    atc_user: sessionStorage.getItem("user_num"),
                    atc:dataIdValue
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
                        console.log(data);
                        if (data.status == '200') {
                            Toastify({
                                text: "报名成功",
                                duration: 3000,
                                destination: "https://github.com/apvarun/toastify-js",
                                newWindow: true,
                                close: true,
                                gravity: "top", // `top` or `bottom`
                                position: "center", // `left`, `center` or `right`
                                stopOnFocus: true, // Prevents dismissing of toast on hover
                                style: {
                                    // Use Bootstrap alert styles
                                    background: "linear-gradient(to right, #38ef7d, #11998e)",
                                },
                                onClick: function () {
                                    // Callback after click
                                }
                            }).showToast();
                            getdataatc();
                            getdataatc();
                            // window.location.reload();
                        } else {
                            Toastify({
                                text: "报名失败",
                                duration: 3000,
                                destination: "https://github.com/apvarun/toastify-js",
                                newWindow: true,
                                close: true,
                                gravity: "top", // `top` or `bottom`
                                position: "center", // `left`, `center` or `right`
                                stopOnFocus: true, // Prevents dismissing of toast on hover
                                style: {
                                    background: "linear-gradient(to right, #ff025e, #d70652)",
                                },
                                onClick: function () {
                                } // Callback after click
                            }).showToast();
                        }
                    })
                    .catch(error => {
                        console.error('There was a problem with the fetch operation:', error);
                    });
                break;
            case '2':
                Toastify({
                    text: "活动正在进行了哦~下次记得早点来~",
                    duration: 3000,
                    destination: "https://github.com/apvarun/toastify-js",
                    newWindow: true,
                    // close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "linear-gradient(to right, #6dd5ed, #2193b0)",
                    },
                    onClick: function () {
                    } // Callback after click
                }).showToast();
                break;
            case '3':
                Toastify({
                    text: "活动结束了哦~下次记得早点来~",
                    duration: 3000,
                    destination: "https://github.com/apvarun/toastify-js",
                    newWindow: true,
                    // close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "linear-gradient(to right, #f5af19, #f12711)",
                    },
                    onClick: function () {
                    } // Callback after click
                }).showToast();
                break;
            case '4':
                Toastify({
                text: "活动取消咯！请关注群通知",
                duration: 10000,
                destination: "https://github.com/apvarun/toastify-js",
                newWindow: true,
                // close: true,
                gravity: "top", // `top` or `bottom`
                position: "center", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: "linear-gradient(to right, #ff025e, #d70652)",
                },
                onClick: function () {
                } // Callback after click
            }).showToast();
                break;
            case '5':
                var myButton = document.getElementById("sign-" + id);

                var dataIdValue = myButton.getAttribute("data-id");

                console.log("data-id值为：" + dataIdValue);
                const apiEndpointcancel = '../../server/CancelAtcByID.php';
                const requestDatacancel = {
                    token: 'ab321818',
                    time:time,
                    atc_user: sessionStorage.getItem("user_num"),
                    atc:dataIdValue
                };

                fetch(apiEndpointcancel, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestDatacancel)
                })
                    .then(response => {
                        return response.json();
                    })
                    .then(data => {
                        console.log(data);
                        if (data.status == '200') {
                            Toastify({
                                text: "取消成功",
                                duration: 3000,
                                destination: "https://github.com/apvarun/toastify-js",
                                newWindow: true,
                                close: true,
                                gravity: "top", // `top` or `bottom`
                                position: "center", // `left`, `center` or `right`
                                stopOnFocus: true, // Prevents dismissing of toast on hover
                                style: {
                                    background: "linear-gradient(to right, #38ef7d, #11998e)",
                                },
                                onClick: function () {
                                } // Callback after click
                            }).showToast();
                            getdataatc();
                            // window.location.reload();
                        } else {
                            Toastify({
                                text: "取消失败",
                                duration: 3000,
                                destination: "https://github.com/apvarun/toastify-js",
                                newWindow: true,
                                close: true,
                                gravity: "top", // `top` or `bottom`
                                position: "center", // `left`, `center` or `right`
                                stopOnFocus: true, // Prevents dismissing of toast on hover
                                style: {
                                    background: "linear-gradient(to right, #ff025e, #d70652)",
                                },
                                onClick: function () {
                                } // Callback after click
                            }).showToast();
                        }
                    })
                    .catch(error => {
                        console.error('There was a problem with the fetch operation:', error);
                    });
                break;
            case '6':
                Toastify({
                    text: "已经有人报名了",
                    duration: 3000,
                    destination: "https://github.com/apvarun/toastify-js",
                    newWindow: true,
                    // close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "linear-gradient(to right, #f5af19, #f12711)",
                    },
                    onClick: function () {
                    } // Callback after click
                }).showToast();
                break;
            case '7':
                Toastify({
                    text: "无权限",
                    duration: 10000,
                    destination: "https://github.com/apvarun/toastify-js",
                    newWindow: true,
                    // close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "linear-gradient(to right, #ff025e, #d70652)",
                    },
                    onClick: function () {
                    } // Callback after click
                }).showToast();
                break;
        }

    }else {
        var yourButtonsup = document.getElementById("sign-sup-" + id);

        var buttonValuesup = yourButtonsup.value;

        console.log("按钮的值是：" + buttonValuesup);

        switch (buttonValuesup) {
            case '1':
                var myButton = document.getElementById("sign-sup-" + id);

                var dataIdValue = myButton.getAttribute("data-id");

                console.log("data-id-sup值为：" + dataIdValue);
                const apiEndpoint = '../../server/SignUpAtcSupervisionByID.php';
                const requestData = {
                    token: 'ab321818',
                    time:time,
                    atc:dataIdValue,
                    supervision:sessionStorage.getItem("user_num")
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
                        console.log(data);
                        if (data.status == '200') {
                            Toastify({
                                text: "报名成功",
                                duration: 3000,
                                destination: "https://github.com/apvarun/toastify-js",
                                newWindow: true,
                                close: true,
                                gravity: "top", // `top` or `bottom`
                                position: "center", // `left`, `center` or `right`
                                stopOnFocus: true, // Prevents dismissing of toast on hover
                                style: {
                                    background: "linear-gradient(to right, #38ef7d, #11998e)",
                                },
                                onClick: function () {
                                } // Callback after click
                            }).showToast();
                            getdataatc();
                            // window.location.reload();
                        } else {
                            Toastify({
                                text: "取消失败",
                                duration: 3000,
                                destination: "https://github.com/apvarun/toastify-js",
                                newWindow: true,
                                close: true,
                                gravity: "top", // `top` or `bottom`
                                position: "center", // `left`, `center` or `right`
                                stopOnFocus: true, // Prevents dismissing of toast on hover
                                style: {
                                    background: "linear-gradient(to right, #ff025e, #d70652)",
                                },
                                onClick: function () {
                                } // Callback after click
                            }).showToast();
                        }
                    })
                    .catch(error => {
                        console.error('There was a problem with the fetch operation:', error);
                    });
                break;
            case '2':
                Toastify({
                    text: "活动正在进行了哦~下次记得早点来~",
                    duration: 3000,
                    destination: "https://github.com/apvarun/toastify-js",
                    newWindow: true,
                    // close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "linear-gradient(to right, #6dd5ed, #2193b0)",
                    },
                    onClick: function () {
                    } // Callback after click
                }).showToast();
                break;
            case '3':
                Toastify({
                    text: "活动结束了哦~下次记得早点来~",
                    duration: 3000,
                    destination: "https://github.com/apvarun/toastify-js",
                    newWindow: true,
                    // close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "linear-gradient(to right, #f5af19, #f12711)",
                    },
                    onClick: function () {
                    } // Callback after click
                }).showToast();
                break;
            case '4':
                Toastify({
                    text: "活动取消咯！请关注群通知",
                    duration: 10000,
                    destination: "https://github.com/apvarun/toastify-js",
                    newWindow: true,
                    // close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "linear-gradient(to right, #ff025e, #d70652)",
                    },
                    onClick: function () {
                    } // Callback after click
                }).showToast();
                break;
            case '5':
                var myButton = document.getElementById("sign-sup-" + id);

                var dataIdValue = myButton.getAttribute("data-id");

                console.log("data-id-sup值为：" + dataIdValue);
                const apiEndpointCancel = '../../server/CancelAtcSupervisionByID.php';
                const requestDataCancel = {
                    token: 'ab321818',
                    time:time,
                    atc:dataIdValue,
                    supervision:sessionStorage.getItem("user_num")
                };

                fetch(apiEndpointCancel, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestDataCancel)
                })
                    .then(response => {
                        return response.json();
                    })
                    .then(data => {
                        console.log(data);
                        if (data.status == '200') {
                            Toastify({
                                text: "取消成功",
                                duration: 3000,
                                destination: "https://github.com/apvarun/toastify-js",
                                newWindow: true,
                                close: true,
                                gravity: "top", // `top` or `bottom`
                                position: "center", // `left`, `center` or `right`
                                stopOnFocus: true, // Prevents dismissing of toast on hover
                                style: {
                                    background: "linear-gradient(to right, #38ef7d, #11998e)",
                                },
                                onClick: function () {
                                } // Callback after click
                            }).showToast();
                            getdataatc();
                        //   window.location.reload();
                        } else {
                            Toastify({
                                text: "取消失败",
                                duration: 3000,
                                destination: "https://github.com/apvarun/toastify-js",
                                newWindow: true,
                                close: true,
                                gravity: "top", // `top` or `bottom`
                                position: "center", // `left`, `center` or `right`
                                stopOnFocus: true, // Prevents dismissing of toast on hover
                                style: {
                                    background: "linear-gradient(to right, #ff025e, #d70652)",
                                },
                                onClick: function () {
                                } // Callback after click
                            }).showToast();
                        }
                    })
                    .catch(error => {
                        console.error('There was a problem with the fetch operation:', error);
                    });
                break;
            case '6':
                Toastify({
                    text: "已经有人报名了",
                    duration: 3000,
                    destination: "https://github.com/apvarun/toastify-js",
                    newWindow: true,
                    // close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "linear-gradient(to right, #f5af19, #f12711)",
                    },
                    onClick: function () {
                    } // Callback after click
                }).showToast();
                break;
            case '7':
                Toastify({
                    text: "无权限",
                    duration: 10000,
                    destination: "https://github.com/apvarun/toastify-js",
                    newWindow: true,
                    // close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "linear-gradient(to right, #ff025e, #d70652)",
                    },
                    onClick: function () {
                    } // Callback after click
                }).showToast();
                break;
        }
    }

getdataatc();
}


