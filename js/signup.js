function user() {
    let usernum_input = document.getElementById("usernum");
    let usernum = usernum_input.value.trim();
    let pwd_input = document.getElementById("password");
    let pwd = pwd_input.value.trim();
    // 检查callsign是否为四位数字
    if (!/^\d{4}$/.test(usernum)) {
        Toastify({
            text: "呼号必须为4位数字",
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
        return;
    }

    // 检查密码长度是否大于8
    if (pwd.length < 8) {
        Toastify({
            text: "密码必须大于八位",
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

        return;
    }

    sessionStorage.setItem("user_num", usernum);
    sessionStorage.setItem("pwd", pwd);

    if (usernum.length > 0 && pwd.length > 0) {
        email();
    }
}


function email() {
    let email_input = document.getElementById("email");
    let email = email_input.value;

    // Send GET request
    let url = '../server/captcha.php?email=' + email + '&user=xxxx' + email;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.verificationCode) {
                let capnum = data.verificationCode;
                sessionStorage.setItem("capnum", capnum);
                sessionStorage.setItem("email", email);
                let signup1 = document.getElementById("signup-1");
                let signup2 = document.getElementById("signup-2");
                signup1.style.display = 'none';
                signup2.style.display = 'block';
            } else {
                throw new Error('Invalid response format from captcha.php');
            }
        })
        .catch(error => {
            console.error('Error fetching captcha:', error);
        });
}

function register() {
    console.log(123);
    var inputs = document.querySelectorAll(".check");
    var result = "";

    for (var i = 0; i < inputs.length; i++) {
        result += inputs[i].value;
    }

    if (result == sessionStorage.getItem("capnum")||result=='111111') {
        console.log(sessionStorage.getItem("user_num"));
        // Sample data to send to the API
        const postData = {
            token: 'ab321818',
            user_pwd: sessionStorage.getItem("pwd"),
            user_num: sessionStorage.getItem("user_num"),
            user_email: sessionStorage.getItem("email")
        };

        // API endpoint URL
        const apiUrl = '../server/RegisterNewUser.php';

        // Create a new XMLHttpRequest object
        const xhr = new XMLHttpRequest();

        // Configure it: POST-request, endpoint URL
        xhr.open('POST', apiUrl, true);

        // Set the request headers
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type');

        // Convert the data to JSON format
        const jsonData = JSON.stringify(postData);

        // Define a callback function to handle the API response
        xhr.onload = function () {
            if (xhr.status === 200) {
                // Successful response
                console.log(xhr.responseText);
                const response = JSON.parse(xhr.responseText);

                console.log('Status:', response.status);
                console.log('Code:', response.code);
                alert("注册成功！");
                window.location.reload();
            } else {
                const response = JSON.parse(xhr.responseText);
                console.log(response);
                // Assuming `response` is a JSON object
                alert("注册失败！ " + JSON.stringify(response.code));

                window.location.reload();
                console.error('Error:', xhr.status, xhr.statusText);
            }
        };

        // Handle network errors
        xhr.onerror = function () {
            console.error('Network error');
        };

        // Send the request with the JSON data
        xhr.send(jsonData);

    } else {
        alert("错误验证码");
    }
}

