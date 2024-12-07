document.addEventListener('DOMContentLoaded', function () {
    const url = '../server/GetEvents.php';
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                var card_1 = ''
                var card_2 = '';
                var card_3 = '';
                var card_4 = '';
                for (var i = 0; i < response.length; i++) {
                    if (response[i].state == '1') {
                        card_1 += '<tr class="table-row">';
                        card_1 += '<td>' + (i + 1) + '</td>';
                        card_1 += '<td>';
                        card_1 += "<div class=\"d-flex align-items-center\">";
                        card_1 += " <div class=\"\">";
                        card_1 += " <p class=\"font-weight-bold mb-0\">" + response[i].dep_icao + " ~ " + response[i].app_icao + " / " + response[i].dep + " ~ " + response[i].app + "</p>";
                        card_1 += "</div>";
                        card_1 += "</div>";
                        card_1 += "</td>";
                        card_1 += "<td>" + response[i].time + "</td>";
                        card_1 += "<td>" + response[i].starttime + "</td>";
                        card_1 += "<td>" + response[i].nav + "</td>";
                        card_1 += '<td>';
                        card_1 += '<button type="button" class="btn btn-success" data-href="./detailed.html?id=' + response[i].time + '">报名</button>';
                        card_1 += "</td>";
                        card_1 += "</tr>";
                    } else if (response[i].state == '3') {
                        card_3 += '<tr class="table-row">';
                        card_3 += '<td>' + (i ) + '</td>';
                        card_3 += '<td>';
                        card_3 += "<div class=\"d-flex align-items-center\">";
                        card_3 += " <div class=\"\">";
                        card_3 += " <p class=\"font-weight-bold mb-0\">" + response[i].dep_icao + " ~ " + response[i].app_icao + " / " + response[i].dep + " ~ " + response[i].app + "</p>";
                        card_3 += "</div>";
                        card_3 += "</div>";
                        card_3 += "</td>";
                        card_3 += "<td>" + response[i].time + "</td>";
                        card_3 += "<td>" + response[i].starttime + "</td>";
                        card_3 += "<td>" + response[i].nav + "</td>";
                        card_3 += '<td>';
                        card_3 += '<button type="button" class="btn btn-warning" data-href="./detailed.html?id=' + response[i].time + '">查看</button>';
                        card_3 += "</td>";
                        card_3 += "</tr>";
                    } else if (response[i].state == '2') {
                        card_2 += '<tr class="table-row">';
                        card_2 += '<td>' + (i) + '</td>';
                        card_2 += '<td>';
                        card_2 += "<div class=\"d-flex align-items-center\">";
                        card_2 += " <div class=\"\">";
                        card_2 += " <p class=\"font-weight-bold mb-0\">" + response[i].dep_icao + " ~ " + response[i].app_icao + " / " + response[i].dep + " ~ " + response[i].app + "</p>";
                        card_2 += "</div>";
                        card_2 += "</div>";
                        card_2 += "</td>";
                        card_2 += "<td>" + response[i].time + "</td>";
                        card_2 += "<td>" + response[i].starttime + "</td>";
                        card_2 += "<td>" + response[i].nav + "</td>";
                        card_2 += '<td>';
                        card_2 += '<button type="button" class="btn btn-primary" data-href="./detailed.html?id=' + response[i].time + '">查看</button>';
                        card_2 += "</td>";
                        card_2 += "</tr>";
                    } else if (response[i].state == '4') {
                        card_4 += '<tr class="table-row">';
                        card_4 += '<td>' + (i) + '</td>';
                        card_4 += '<td>';
                        card_4 += "<div class=\"d-flex align-items-center\">";
                        card_4 += " <div class=\"\">";
                        card_4 += " <p class=\"font-weight-bold mb-0\">" + response[i].dep_icao + " ~ " + response[i].app_icao + " / " + response[i].dep + " ~ " + response[i].app + "</p>";
                        card_4 += "</div>";
                        card_4 += "</div>";
                        card_4 += "</td>";
                        card_4 += "<td>" + response[i].time + "</td>";
                        card_4 += "<td>" + response[i].starttime + "</td>";
                        card_4+= "<td>" + response[i].nav + "</td>";
                        card_4 += '<td>';
                        card_4 += '<button type="button" class="btn btn-danger" data-href="./detailed.html?id=' + response[i].time + '">取消</button>';
                        card_4 += "</td>";
                        card_4 += "</tr>";
                    }
                }

                document.getElementById("1").innerHTML = card_1;
                document.getElementById("2").innerHTML = card_2;
                document.getElementById("3").innerHTML = card_3;
                document.getElementById("4").innerHTML = card_4;
                // Add click functionality to each button within a row
                const buttons = document.querySelectorAll('.table-row button');
                buttons.forEach(button => {
                    button.addEventListener('click', function() {
                        // Get the URL from data-href attribute and navigate
                        const href = this.getAttribute('data-href');
                        if (href) {
                            window.location.href = href;
                        }
                    });
                });
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
});
