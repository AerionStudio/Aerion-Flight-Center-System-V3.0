function SearchWeatherByICAO() {
    var icao_input = document.getElementById("icaoinput").value.trim();
    console.log(icao_input);

    // Regular expression to match only English letters
    var englishLettersRegex = /^[a-zA-Z]+$/;

    if (englishLettersRegex.test(icao_input)) {
        const apiEndpoint = '../server/GetWeather.php';
        const requestData = {
            token: 'ab321818',
            icao: icao_input
        };

        fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
if (data.airport !== 'airports not found') {
    // Store data in local storage
    localStorage.setItem('ch-name', data.airport.cn_name);
    localStorage.setItem('iso_country', data.airport.iso_country);
    localStorage.setItem('en-name', data.airport.en_name);
    localStorage.setItem('metar', data.weather.metar);
    localStorage.setItem('metar_decode', JSON.stringify(data.weather.metar_decode));
    localStorage.setItem('taf', data.weather.taf);
} else {
    alert('未找到机场');
    // Stop further execution, for example, return from the function or exit the script
    return; // or use "throw new Error('Airport not found');" depending on the context
}
// Continue with the rest of your code if needed


                // Redirect to view.html
                window.location.href = 'view.html';
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    } else {
        alert('请输入ICAO！！！');
    }
}
