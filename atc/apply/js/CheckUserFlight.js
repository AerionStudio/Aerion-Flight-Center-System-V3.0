function CheckUserFlight(id, sta) {
    const apiEndpoint = '../../server/CheckUserFlightByID.php';
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
            const signButton = document.getElementById("sign");
            let buttonText, buttonClass, value;

            if (data.status === "200" && sta === '1') {
                buttonText = "+ 报名";
                buttonClass = "btn-outline-success";
                value = "1";
            } else if (sta === '2') {
                buttonText = "✓ 正在进行";
                buttonClass = "btn-outline-primary";
                value = "2";
            } else if (sta === '3') {
                buttonText = "✓ 已结束";
                buttonClass = "btn-outline-warning";
                value = "3";
            } else if (sta === '4') {
                buttonText = "x 已取消";
                buttonClass = "btn-outline-danger";
                value = "4";
            } else {
                buttonText = "x 取消报名";
                buttonClass = "btn-outline-danger";
                value = "5";
            }

            signButton.innerText = buttonText;
            signButton.classList.remove("btn-outline-success", "btn-outline-warning", "btn-outline-danger");
            signButton.classList.add(buttonClass);
            signButton.value = value;
            signButton.setAttribute("data-id", id);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
