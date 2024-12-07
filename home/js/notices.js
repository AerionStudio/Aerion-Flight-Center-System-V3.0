const url = '../server/GetNotices.php';
const xhr = new XMLHttpRequest();
xhr.open('POST', url, true);
xhr.setRequestHeader('Content-Type', 'application/json');

xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            var cards = '';
            for (var i = 0; i < response.length; i++) {
                cards += '<div class="alert alert-primary" role="alert">';
                cards += ' <h4 class="alert-heading">' + response[i].tittle + ' / ' + response[i].time + '</h4>';
                cards+="<br>";
                cards += '<p>';
                for (let j = 0; j < response[i].body.length; j++) {
                    cards += response[i].body[j] + '<br>';
                }
                cards += '</p>';
                cards += '<hr>';
                cards += '  <p class="mb-0">发布者：' + response[i].push + '</p>';
                cards+='</div>'
            }

            document.getElementById('notices').innerHTML = cards;

            console.log(response);
        } else {
            console.error('There was an error with the request:', xhr.status);
        }
    }
};

xhr.onerror = function () {
    console.error('There was an error with the request');
};

xhr.send();
