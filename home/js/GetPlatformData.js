document.addEventListener("DOMContentLoaded", function() {
    const loadingMessage = "Loading..."; // Placeholder text for elements before data is loaded

    // Display loading message initially
    document.getElementById("user_num").innerHTML = loadingMessage;
    document.getElementById("user").innerHTML = loadingMessage;
    document.getElementById("atc").innerHTML = loadingMessage;
    document.getElementById("online").innerHTML = loadingMessage;

    const url = '../server/GetPlatformData.php';
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);

                const countUser = parseInt(response.count_user);
                const countAtc = parseInt(response.count_atc);
                const onlineAll = parseInt(response.online_all);


                // Update the displayed values after the data is loaded
                document.getElementById("user_num").innerHTML = sessionStorage.getItem('user_num');
                document.getElementById("user").innerHTML = countUser;
                document.getElementById("atc").innerHTML = countAtc;
                document.getElementById("online").innerHTML = onlineAll;
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
