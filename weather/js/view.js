// Retrieve data from local storage
document.getElementById("ch-name").innerText = localStorage.getItem('ch-name');
document.getElementById("iso_country").innerText = localStorage.getItem('iso_country');
document.getElementById("en-name").innerText = localStorage.getItem('en-name');
document.getElementById("metar-un").innerText = localStorage.getItem('metar');

const metarDecode = JSON.parse(localStorage.getItem('metar_decode'));
document.getElementById("time").innerText = metarDecode.time;
document.getElementById("wind_dir").innerText = metarDecode.wind_dir;
document.getElementById("wind_speed").innerText = metarDecode.wind_speed;
document.getElementById("wind_unit").innerText = metarDecode.wind_unit;
document.getElementById("visibility").innerText = metarDecode.visibility;
document.getElementById("visibility_unit").innerText = metarDecode.visibility_unit;
document.getElementById("qnh").innerText = metarDecode.qnh;
document.getElementById("qnh_unit").innerText = metarDecode.qnh_unit;
document.getElementById("temperature").innerText = metarDecode.temperature;
document.getElementById("dewpoint").innerText = metarDecode.dewpoint;
document.getElementById("forecast").innerText = metarDecode.forcast;

document.getElementById("taf-un").innerText = localStorage.getItem('taf');

