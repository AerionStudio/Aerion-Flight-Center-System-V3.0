window.onload = function(){
    var item = document.getElementsByClassName("item");
    var it = item[0].getElementsByTagName("div");

    var content = document.getElementsByClassName("content");
    var con = content[0].getElementsByTagName("div");

    for(let i=0;i<it.length;i++){
        it[i].onclick = function(){
            for(let j=0;j<it.length;j++){
                it[j].className = '';
                con[j].style.display = "none";
            }
            this.className = "active";
            it[i].index=i;
            con[i].style.display = "block";
        }
    }
}


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

    const apiUrl = '../server/CheckUser.php';

    const xhr = new XMLHttpRequest();


    xhr.open('POST', apiUrl, true);


    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type');

    const jsonData = JSON.stringify(postData);

    xhr.onload = function () {
        if (xhr.status === 200||xhr.status===201) {

            console.log(xhr.responseText);
            const response = JSON.parse(xhr.responseText);

            if (response.status == '200') {
                sessionStorage.setItem("user_num",user);
                sessionStorage.setItem("user_grade",response.data.grade);
                sessionStorage.setItem("user_email",response.data.email);
                window.location.href='./index.html';
            } else {
                alert("登录失败");
            }
        } else {
            console.error('Error:', xhr.status, xhr.statusText);
        }
    };

    xhr.onerror = function () {
        console.error('Network error');
    };

    xhr.send(jsonData);
}