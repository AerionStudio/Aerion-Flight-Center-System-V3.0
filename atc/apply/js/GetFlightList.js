function GetFlightList(id) {
    // 替换为你的API端点URL
    const apiEndpoint = '../../server/GetEventFlightByID.php';

// 准备要发送的数据
    const requestData = {
        token: 'ab321818',
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

            console.log(data);
            if (data.status == "200") {
                cards = '';
                for (let i = 0; i < data.data.length; i++) {
                    cards += "<tr>";
                    cards += "<th scope=\"row\">" + (i + 1) + "</th>";
                    cards += "<td>" + data.data[i].user + "</td>";
                    cards += "<td>" + data.data[i].time + "</td>";
                    cards += "</tr>";
                }
                document.getElementById("flightlist").innerHTML=cards;
                document.getElementById("flightnum").innerText=data.data.length;
            } else {
                alert("没有这个活动");
                window.location.href = '../index.html';
            }
        })
        .catch(error => {
            // 处理错误情况
            console.error('There was a problem with the fetch operation:', error);
        });

}