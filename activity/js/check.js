document.addEventListener('DOMContentLoaded', function () {
    document.onkeydown = function (event) {
        if (event.keyCode === 123) { // F12键
            return false;
        } else if (event.ctrlKey && event.shiftKey && event.keyCode === 73) { // Ctrl+Shift+I
            return false;
        }
    };
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });
    if (!sessionStorage.getItem("user_num")||!sessionStorage.getItem("user_grade")||!sessionStorage.getItem("user_email")) {
        var dataModal = new bootstrap.Modal(document.getElementById('dataModal'), {
            backdrop: 'static' // 防止点击空白区域关闭模态框
        });
        dataModal.show();
    }z
});
function login() {
    let usernum_input = document.getElementById("loginUsernum");
    let user = usernum_input.value;
    let pwd_input = document.getElementById("loginPassword");
    let pwd = pwd_input.value;

    const postData = {
        token: 'ab321818',
        user_pwd: pwd,
        user_num: user,
    };

    // API endpoint URL
    const apiUrl = '../server/CheckUser.php';

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
        if (xhr.status === 200||xhr.status===201) {
            // Successful response
            console.log(xhr.responseText);
            const response = JSON.parse(xhr.responseText);

            if (response.status == '200') {
                sessionStorage.setItem("user_num",user);
                sessionStorage.setItem("user_grade",response.data.grade);
                sessionStorage.setItem("user_email",response.data.email);
                window.location.reload();
            } else {
                alert("登录失败");
            }
        } else {
            console.error('Error:', xhr.status, xhr.statusText);
        }
    };

    // Handle network errors
    xhr.onerror = function () {
        console.error('Network error');
    };

    // Send the request with the JSON data
    xhr.send(jsonData);
}