document.addEventListener('DOMContentLoaded', function () {



    const url_time_my = "https://imp.xfex.cc/server/GetEventsNow.php";

    fetch(url_time_my, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log(data[0]);
            document.getElementById("cid").innerText = sessionStorage.getItem("user_num");
            document.getElementById("dep").innerText = data[0].dep;
            document.getElementById("app").innerText = data[0].app;
            console.log(data[0].time);
            sessionStorage.setItem("time", data[0].time)
            const timelist = "https://imp.xfex.cc/server/GetMomentList.php?id=" + data[0].time;
            console.log(timelist);
            fetch(timelist, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                    const apiEndpoint = '../server/CheckUserFlightByID.php';
                    const requestData = {
                        token: 'ab321818',
                        id: sessionStorage.getItem("time"),
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
                            if (data.status=='200'){
                                alert("你想要先报名才可以申请时刻!");
                                window.location.href='../../activity/index.html'
                            }
                        })
                        .catch(error => {
                            console.error('There was a problem with the fetch operation:', error);
                        });
                    const check = "https://imp.xfex.cc/server/CheckUserFlightMomentByID.php";
                    const checkdata = {
                        token: 'ab321818',
                        cid: sessionStorage.getItem("user_num"),
                        time: sessionStorage.getItem("time"),
                    };
                    fetch(check, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(checkdata)
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log(data);
                            if (data.status == '202') {
                                var button = document.getElementById("push");
                                button.innerText = "已申请";
                                let buttonClass = "btn-danger";
                                button.classList.remove("btn-primary","btn-warning");
                                button.classList.add(buttonClass);
                                button.disabled = true; // Disable the button
                            }else {
                                if (data.status == '200'){
                                    var button = document.getElementById("push");
                                    button.innerText = "申请";
                                    let buttonClass = "btn-primary";
                                    button.classList.remove("btn-danger","btn-warning");
                                    button.classList.add(buttonClass);
                                    button.disabled = false; // Disable the button
                                }
                            }

                        })
                        .catch(error => {
                            console.error('Error fetching data:', error);
                        });
                    console.log(data);
                    var option = '<option selected>预计放行时间</option>';
                    for (let i = 0; i < data.length; i++) {
                        option += '<option value="' + data[i] + '">' + data[i] + '</option>';
                    }
                    document.getElementById("time").innerHTML = option; // Append options to the select element
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });

        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    const url_list = "https://imp.xfex.cc/server/GetEventFlightMomentByID.php";
    const requestData = {
        token: 'ab321818',
        id: sessionStorage.getItem("time")
    };
    fetch(url_list, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            var cards = ' ';
            for (let i = 0; i < data.data.length; i++) {
                cards += '<tr>';
                cards += '<td>' + (i + 1) + '</td>';
                cards += '<td>' + data.data[i].cid + '</td>';
                cards += '<td>' + data.data[i].moment + '</td>';
                switch (data.data[i].manner) {
                    case '1':
                        cards += '<td> 常规语音(CN) </td>';
                        break;
                    case '2':
                        cards += '<td> 常规语音(EN) </td>';
                        break;
                    case '3':
                        cards += '<td> PDC </td>';
                        break;
                    default:
                        cards += '<td> 常规语音(CN) </td>';
                        break;
                }
                if (data.data[i].cid==sessionStorage.getItem("user_num")){
                    cards += '<td><button type="button" class="btn btn-outline-danger btn-sm" onclick="cancel(\'' + data.data[i].cid + '\', \'' + data.data[i].time + '\')">取消报名</button></td>';
                }else{
                    cards += '<td><button type="button" class="btn btn-outline-primary btn-sm">只可对自己操作</button></td>';
                }
                cards += '</tr>';
            }
            document.getElementById("list").innerHTML = cards;

        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});

function signup() {
    var manner = document.getElementById("manner").value;
    console.log(manner);

    // Retrieve the selected value from the <select> element with id "time"
    var selectedTime = document.getElementById("time").value;
    console.log(selectedTime); // Log the selected time for verification

    const apiEndpoint = '../../server/SignUpFlightMoment.php';
    const requestData = {
        token: 'ab321818',
        cid: sessionStorage.getItem("user_num"),
        id: sessionStorage.getItem("time"), // Ensure this is correct according to your logic
        manner: manner,
        time: selectedTime // Set the selected time
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
                    text: "成功",
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
                window.location.reload();
            } else {
                Toastify({
                    text: "失败",
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
                        // Callback after click
                    }
                }).showToast();
                window.location.reload();
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}


function cancel(cid,time) {
    const apiEndpoint = '../../server/CancelFlightMomentByID.php';
    const requestData = {
        token: 'ab321818',
        cid: cid,
        id: time, // Ensure this is correct according to your logic
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
                    text: "成功",
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
                window.location.reload();
            } else {
                Toastify({
                    text: "失败",
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
                        // Callback after click
                    }
                }).showToast();
                window.location.reload();
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}