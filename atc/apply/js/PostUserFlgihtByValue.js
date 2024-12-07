function postUserFlightByValue(id,sta) {
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


}


