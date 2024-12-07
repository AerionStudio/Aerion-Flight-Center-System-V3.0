function email() {
    let email = document.getElementById("email").value;
    let url = 'https://api.ariven-sky.cn/AFCSV3.0/captcha.php?email=' + email + '&user=' + email;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.verificationCode) {
                let capnum = data.verificationCode;
                sessionStorage.setItem("capnum", capnum);
                sessionStorage.setItem("email", email);
                document.getElementById("step-1").style.display = 'none';
                document.getElementById("step-2").style.display = 'block';
            } else {
                throw new Error('Invalid response format from captcha.php');
            }
        })
        .catch(error => {
            console.error('Error fetching captcha:', error);
        });

}

function check() {
    console.log(123);
    var inputs = document.querySelectorAll(".check");
    var result = "";

    for (var i = 0; i < inputs.length; i++) {
        result += inputs[i].value;
    }
    if (result == sessionStorage.getItem("capnum")) {
        document.getElementById("step-2").style.display = 'none';
        document.getElementById("step-3").style.display = 'block';
    }
}

function changepassword() {
    let password_input = document.getElementById("pwd");
    let password = password_input.value;
    if (password) {
        const apiEndpointCancel = '../server/ForgetUserPassword.php';
        const requestDataCancel = {
            token: 'ab321818',
            email: sessionStorage.getItem("email"),
            password: password
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
                    alert("更改成功");
                    window.location.href = "https://www.avmc.club/login.html";
                } else {
                    alert("更改失败");
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }
}