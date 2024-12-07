function changeemail() {
    let email_input = document.getElementById("email");
    let email = email_input.value;
    if (email){
     const apiEndpointCancel = '../../server/ChangeUserEmail.php';
     const requestDataCancel = {
      token: 'ab321818',
      callsign:sessionStorage.getItem("user_num"),
      email:email
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
           window.location.reload;
          } else {
           alert("更改失败");
          }
         })
         .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
         });
    }
}

function changepassword() {
    let password_input = document.getElementById("inputPassword2");
    let password = password_input.value;
    if (password){
        const apiEndpointCancel = '../../server/ChangeUserPassword.php';
        const requestDataCancel = {
            token: 'ab321818',
            callsign:sessionStorage.getItem("user_num"),
            rating:sessionStorage.getItem("user_grade"),
            password:password
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
                    window.location.reload;
                } else {
                    alert("更改失败");
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }
}