function postUserFlightByValue() {
    // 获取按钮元素
    const yourButton = document.getElementById("sign-flight");

    // 获取按钮的值和 data-id
    const buttonValue = yourButton.value;
    const id = yourButton.getAttribute("data-id");

    // 在这里使用按钮的值进行其他操作
    console.log("按钮的值是：" + buttonValue);
    switch (buttonValue) {
        case '1':
            const apiEndpoint = '../server/SignUpFlightByID.php';
            const requestData = {
                token: 'ab321818',
                id: id,
                userid: sessionStorage.getItem("user_num")
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
                        GetFlightList(id);
                        getdata();
                        window.location.href='https://imp.xfex.cc/moment/'
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
            const apiEndpoint_cancel = '../server/CancelFlightByID.php';
            const requestData_cancel = {
                token: 'ab321818',
                id: id,
                userid: sessionStorage.getItem("user_num")
            };

            fetch(apiEndpoint_cancel, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData_cancel)
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
                        // 报名成功后刷新页面并滚动到底部
                        GetFlightList(id);
                        getdata();
                        window.scrollTo(0, document.body.scrollHeight);
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
        default:
            alert("没有这个活动");
            break;
    }
}
