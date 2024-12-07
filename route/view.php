<?php
$dep=html_entity_decode($_POST['dep']);
$arr=html_entity_decode($_POST['arr']);

$secret = 'TUlJQlZBSUJBREFOQmdrcWhraUc5dzBCQVFFRkFBU0NBVDR3Z2dFNkFnRUFBa0VBeGRjaHFEdGkrSTNZZjNNcQpuY2prNTlVUERmV28wMU04V2tlMjlYeXRqRGYvWW5hZEFuNHp5dFVIbHBYVDFrL3UvVStjKzlFRG5QU3NzVUZCCk96RjVCd0lEQVFBQkFrQWk2d0IrdjlTTkNBUVJJcE4vKzhnaS91REVWdnB3S2YyNTlYUmVTWjRiNUNwd2hLUEMKbHd3WDdkS0NMUzJKWUU4dVdUOUdnUUJ2N2hvRE1RZ0IxL21oQWlFQStNejY0MHN5YU40ekl6aVJZalltQ00xZwpYWHBYZ3h0MDJuT2tHa1pna3BFQ0lRRExrS2dqV0xzSTVPNnVIemJCamN3dUpVMUFMTnV1TmJVcEZIS1E0ZXB1CkZ3SWhBT3B3YkRCbEdSa0wxMi9teThlWmNubDAzTXI0anlHeGE0aTAwdnNYT2NTaEFpQjRpNFFWMG1DSHB0SDAKaUlWclh1WFBXY1dDUUU0aXZxazExMmIwaHVQRkp3SWdET2pjK1ZjbDNUNHRuV1pUT0xsVVFLWVJuUjdFL21MMgozWHJiRlA2bWI1UT0=';
$microtime = microtime();
$secretJson = json_encode(array("secret" => hash("sha256", $secret . $microtime), "time" => $microtime));
$encryData = base64_encode(openssl_encrypt($secretJson, "DES-CBC", "fI8~eR7!", 0, "oW2{eU8`"));

$token_get_body = [
    'secret' => $encryData,
    'platform' => "cfcsim"
];

$platform = "cfcsim";

$url_token = "http://api.lvtenghui.com:8081/v1/auth/?secret=" . urlencode($token_get_body['secret']) . "&platform=" . urlencode($token_get_body['platform']);

$token = file_get_contents($url_token);

$token = json_decode($token, true);

$token = $token['msg']['token'];


//获取航路
$route_get_body = [
    'token' => $token,
    'dep' => $dep,
    'arr' => $arr,
    'dbid' => '2402'
];

$url_route = "http://api.lvtenghui.com:8081/v1/route/?dep=" . urlencode($route_get_body['dep']) . "&arr=" . urlencode($route_get_body['arr']) . "&token=" . urlencode($route_get_body['token']) . "&dbid=" . urlencode($route_get_body['dbid']);
$route_json = file_get_contents($url_route);
$route_arr = json_decode($route_json, true);

$route = $route_arr['msg']['route'];
//获取航路解析
$route_parse_get_body = [
    'token' => $token,
    'type' => 'km',
    'route' => $route
];
$url_route_parse = "http://api.lvtenghui.com:8081/v1/parseRoute/?route=" . urlencode($route_parse_get_body['route']) . "&token=" . urlencode($route_parse_get_body['token']) . "&type=" . urlencode($route_parse_get_body['type']);
$route_parse_json = file_get_contents($url_route_parse);

$route_parse_arr = json_decode($route_parse_json, true);
//获取起飞机场信息
$airport_dep_get_body = [
    'token' => $token,
    'icao' => $dep
];
$url_airport_dep = "http://api.lvtenghui.com:8081/v1/airport/?icao=" . urlencode($airport_dep_get_body['icao']) . "&token=" . urlencode($airport_dep_get_body['token']);
$airport_dep_json = file_get_contents($url_airport_dep);

$airport_dep_arr = json_decode($airport_dep_json, true);
//获取落地机场信息
$airport_arr_get_body = [
    'token' => $token,
    'icao' => $arr
];
$url_airport_arr = "http://api.lvtenghui.com:8081/v1/airport/?icao=" . urlencode($airport_arr_get_body['icao']) . "&token=" . urlencode($airport_arr_get_body['token']);
$airport_arr_json = file_get_contents($url_airport_arr);

$airport_arr_arr = json_decode($airport_arr_json, true);
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="./css/bootstrap.css">
    <link rel="stylesheet" href="./index.css">
    <link rel="stylesheet" href="./css/animate.min.css">
    <script src="https://webapi.amap.com/maps?v=2.0&key=68a8e76c24efbfb6116710882ba665d3"></script>
    <script src="../js/checkall.js"></script>
    <script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "kpp9urix5f");
</script>
    <style type="text/css">
        #map {
            height: 300px;
        }
    </style>
    <title>Document</title>
</head>
<body style="padding-left: 200px;padding-right: 200px;padding-top: 30px;">
<div class="card animate__animated animate__fadeIn" id="animatedCard">
    <div class="card-body">
        <div class="title">航路查询 <?php echo $dep; ?>~<?php echo $arr; ?>
        </div>
        <div class="en_name">
            <?php echo $airport_dep_arr['msg']['cn_name']; ?>~<?php echo $airport_arr_arr['msg']['cn_name']; ?>
        </div>
        <br>
        <div id="map"></div>
        <br>
        <div class="route_body">
            <div class="route_main">
                <button type="button" class="btn btn-success" style="width: 100%;text-align: left;">
                    全部航路:<?php echo $route; ?></button>
            </div>
            <div class="route_main">
                <button type="button" class="btn btn-success" style="width: 100%;text-align: left;">
                    飞行计划提交航路:<?php
                    $route = str_replace($dep . ' SID', "", $route);
                    $route = str_replace('STAR ' . $arr, "", $route);
                    echo $route; ?></button>
            </div>
        </div>
        <br>
        <div class="container text-center">
            <div class="row">
                <div class="col">
                    <button class="btn btn-warning" style="width: 100%;margin-left: -30px">
                        <div class="sid">
                            <table class="table">
                                <thead>
                                <tr>
                                    <th scope="col" colspan="2">推荐<?php echo $dep ?>离场程序</th>
                                </tr>
                                </thead>
                                <tbody>
                                <?php
                                for ($i = 0; $i < count($route_arr['msg']['sid']); $i++) {
                                    echo '<tr>';
                                    echo '<td>' . $route_arr['msg']['sid'][$i][1] . '</td>';
                                    echo '<td>' . $route_arr['msg']['sid'][$i][0] . '</td>';
                                    echo '</tr>';
                                }
                                ?>
                                </tbody>
                            </table>
                        </div>
                    </button>

                </div>
                <div class="col">
                    <button class="btn btn-warning" style="width: 100%;margin-left: -30px">
                        <div class="star">
                            <table class="table">
                                <thead>
                                <tr>
                                    <th scope="col" colspan="2">推荐<?php echo $arr ?>进场程序</th>
                                </tr>
                                </thead>
                                <tbody>
                                <?php
                                for ($i = 0; $i < count($route_arr['msg']['star']); $i++) {
                                    echo '<tr>';
                                    echo '<td>' . $route_arr['msg']['star'][$i][1] . '</td>';
                                    echo '<td>' . $route_arr['msg']['star'][$i][0] . '</td>';
                                    echo '</tr>';
                                }
                                ?>
                                </tbody>
                            </table>
                        </div>
                    </button>

                </div>
                <div class="col">
                    <?php
                    $weather_dep_get_body = [
                        'token' => $token,
                        'icao' => $dep
                    ];
                    $url_weather_dep = "http://api.lvtenghui.com:8081/v1/weather/?icao=" . urlencode($weather_dep_get_body['icao']) . "&token=" . urlencode($weather_dep_get_body['token']);
                    $weather_dep_json = file_get_contents($url_weather_dep);
                    $weather_dep_arr = json_decode($weather_dep_json, true); ?>
                    <button class="btn btn-outline-info" style="width: 100%;margin-left: -30px">
                        <div class="star">
                            <table class="table">
                                <thead>
                                <tr>
                                    <th scope="col" colspan="2"><?php echo $dep ?>天气</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>时间</td>
                                    <td><?php echo $weather_dep_arr['msg']['metar_decode']['time'] ?> </td>
                                </tr>
                                <tr>
                                    <td>风况</td>
                                    <td><?php echo $weather_dep_arr['msg']['metar_decode']['wind_dir']; ?>°<?php echo $weather_dep_arr['msg']['metar_decode']['wind_speed']; ?><?php echo $weather_dep_arr['msg']['metar_decode']['wind_unit']; ?></td>
                                </tr>
                                <tr>
                                    <td>能见度</td>
                                    <td><?php echo $weather_dep_arr['msg']['metar_decode']['visibility']; ?> <?php echo $weather_dep_arr['msg']['metar_decode']['visibility_unit']; ?></td>
                                </tr>
                                <tr>
                                    <td>温度/露点温度</td>
                                    <td><?php echo$weather_dep_arr['msg']['metar_decode']['temperature']; ?>°C /<?php echo $weather_dep_arr['msg']['metar_decode']['dewpoint']; ?>°C</td>
                                </tr>
                                <tr>
                                    <td>预报</td>
                                    <td><?php echo $weather_dep_arr['msg']['metar_decode']['forcast']; ?></td>
                                </tr>
                                <tr>
                                    <td>METAR</td>
                                    <td><?php echo $weather_dep_arr['msg']['metar']; ?></td>
                                </tr>
                                <tr>
                                    <td>TAF</td>
                                    <td><?php echo $weather_dep_arr['msg']['taf']; ?></td>
                                </tr>

                                </tbody>
                            </table>
                        </div>
                    </button>
                    <br>
                    <?php
                    $weather_arr_get_body = [
                        'token' => $token,
                        'icao' => $arr
                    ];
                    $url_weather_arr = "http://api.lvtenghui.com:8081/v1/weather/?icao=" . urlencode($weather_arr_get_body['icao']) . "&token=" . urlencode($weather_arr_get_body['token']);
                    $weather_arr_json = file_get_contents($url_weather_arr);
                    $weather_arr_arr = json_decode($weather_arr_json, true); ?>
                    <br>
                    <button class="btn btn-outline-info" style="width: 100%;margin-left: -30px">
                        <div class="star">
                            <table class="table">
                                <thead>
                                <tr>
                                    <th scope="col" colspan="2"><?php echo $arr ?>天气</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>时间</td>
                                    <td><?php echo $weather_arr_arr['msg']['metar_decode']['time'] ?> </td>
                                </tr>
                                <tr>
                                    <td>风况</td>
                                    <td><?php echo $weather_arr_arr['msg']['metar_decode']['wind_dir']; ?>°<?php echo $weather_arr_arr['msg']['metar_decode']['wind_speed']; ?><?php echo $weather_arr_arr['msg']['metar_decode']['wind_unit']; ?></td>
                                </tr>
                                <tr>
                                    <td>能见度</td>
                                    <td><?php echo $weather_arr_arr['msg']['metar_decode']['visibility']; ?> <?php echo $weather_arr_arr['msg']['metar_decode']['visibility_unit']; ?></td>
                                </tr>
                                <tr>
                                    <td>温度/露点温度</td>
                                    <td><?php echo$weather_arr_arr['msg']['metar_decode']['temperature']; ?>°C /<?php echo $weather_arr_arr['msg']['metar_decode']['dewpoint']; ?>°C</td>
                                </tr>
                                <tr>
                                    <td>预报</td>
                                    <td><?php echo $weather_arr_arr['msg']['metar_decode']['forcast']; ?></td>
                                </tr>
                                <tr>
                                    <td>METAR</td>
                                    <td><?php echo $weather_arr_arr['msg']['metar']; ?></td>
                                </tr>
                                <tr>
                                    <td>TAF</td>
                                    <td><?php echo $weather_arr_arr['msg']['taf']; ?></td>
                                </tr>

                                </tbody>
                            </table>
                        </div>
                    </button>
                </div>
            </div>
        </div>

    </div>
</div>
</body>
<?php
$waypoints = array();
foreach ($route_parse_arr['msg']['waypoint'] as $waypoint) {
    $latitude = $waypoint['lat'];
    $longitude = $waypoint['lon'];
    $name = $waypoint['name'];

    $waypoints[] = array($longitude, $latitude);
    $center = array($waypoint['lon'], $waypoint['lat']);
}
?>
<script>
    var center = <?php echo json_encode($center); ?>;
    var map = new AMap.Map('map', {
        zoom: 5,
        center: center
    });

    // 标记航路点
    <?php foreach ($waypoints as $waypoint): ?>
    var marker = new AMap.Marker({
        position: <?php echo json_encode($waypoint); ?>,
        map: map
    });
    <?php endforeach; ?>

    // 绘制航路线
    var path = new AMap.Polyline({
        path: <?php echo json_encode($waypoints); ?>,
        strokeColor: '#f43e06',
        strokeOpacity: 2,
        strokeWeight: 5,
        strokeStyle: 'solid'
    });

    path.setMap(map);
</script>
<script src="./js/bootstrap.js"></script>
</html>
