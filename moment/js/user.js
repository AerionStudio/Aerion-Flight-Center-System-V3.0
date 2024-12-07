document.addEventListener('DOMContentLoaded', function () {

    const url_time_my = "https://imp.xfex.cc/server/GetEventsNow.php";
    const requestData = {
        token: 'ab321818',
        id: sessionStorage.getItem("time")
    };
    fetch(url_time_my, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data[0]);
            var cards = ' ';
            for (let i = 0; i < data.data.length; i++) {
                cards += '<tr>';
                cards += '<td>' + (i + 1) + '</td>';
                cards += '<td>' + data.data.cid + '</td>';
                cards += '<td>' + data.data.moment + '</td>';
                switch (data.data.moment) {
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
                cards += '</tr>';
            }
            document.getElementById("list").innerHTML=cards;

        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

});