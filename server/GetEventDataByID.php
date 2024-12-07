<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

require './setting.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    /** 获取数据 **/
    $id = $_GET['id'];
    if (isset($id)) {
        $sql = $conn->prepare("SELECT * FROM event WHERE time=?");
        $sql->bind_param("s", $id);
        $sql->execute();
        $result = $sql->get_result();
        $data = array();
        $depweahter = array();
        $appweather = array();
        $pilot = array();
        $atc = array();
        if ($result->num_rows > 0) {
            $eventdata = $result->fetch_all(MYSQLI_ASSOC);
            $depweahter = getweather($eventdata[0]['dep_icao']);
            $appweather = getweather($eventdata[0]['app_icao']);
            $pilot = getflight($id);
            $atc = getatc($id);
            $data = ([
                'basic' => $eventdata,
                'user' => [
                    'pilot' => $pilot,
                    'atc' => $atc
                ],
                'weather' => [
                    'dep' => $depweahter,
                    'app' => $appweather
                ]

            ]);
            http_response_code(200);
            echo json_encode(array('status' => '200', 'data' => $data));
            exit;
        } else {
            http_response_code(200);
            echo json_encode(array('status' => '200', 'data' => $data));
            exit;
        }
    } else {
        http_response_code(300);
        echo json_encode(array('status' => '300', 'code' => '缺少必要的值'));
        exit;
    }

} else {
    http_response_code(500);
    echo json_encode(array('status' => '500', 'code' => '错误提交方法'));
    exit;
}

function getweather($icao)
{
    ;
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

    $weather_get_body = [
        'token' => $token,
        'icao' => $icao
    ];
    $url_weather = "http://api.lvtenghui.com:8081/v1/weather/?icao=" . urlencode($weather_get_body['icao']) . "&token=" . urlencode($weather_get_body['token']);
    $weather_json = file_get_contents($url_weather);

    $weather_arr = json_decode($weather_json, true);

    $airport_get_body = [
        'token' => $token,
        'icao' => $icao
    ];
    $url_airport = "http://api.lvtenghui.com:8081/v1/airport/?icao=" . urlencode($weather_get_body['icao']) . "&token=" . urlencode($weather_get_body['token']);
    $airport_json = file_get_contents($url_airport);

    $airport_arr = json_decode($airport_json, true);
    http_response_code(200);
    $output_array = [
        'airport' => $airport_arr['msg'],
        'weather' => $weather_arr['msg']
    ];
    return $output_array;
}

function getflight($id)
{
    require './setting.php';

    // 准备第一个查询
    $sql = $conn->prepare("SELECT * FROM activity_user WHERE activity_time = ?");
    $sql->bind_param("s", $id);
    $sql->execute();
    $result = $sql->get_result();

    $data = array();
    if ($result->num_rows > 0) {
        $data_1 = $result->fetch_all(MYSQLI_ASSOC);

        foreach ($data_1 as $activity) {
            $user = $activity['user'];
            $park=$activity['park'];
            // 准备第二个查询
            $sql = $conn->prepare("SELECT * FROM moment WHERE time = ? AND cid = ?");
            $sql->bind_param("ss", $id, $user);
            $sql->execute();
            $result2 = $sql->get_result();

            if ($result2->num_rows > 0) {
                $data_2 = $result2->fetch_all(MYSQLI_ASSOC);

                // 将数据合并到结果数组中
                foreach ($data_2 as $moment) {
                    $manner = ' ';
                    switch ($moment['manner']) {
                        case '1':
                            $manner = '语音放行(CN)';
                            break;
                        case '2':
                            $manner = '语音放行(EN)';
                            break;
                        case '3':
                            $manner = 'PDC放行';
                            break;
                    }
                    $data[] = array(
                        'user' => $activity['user'],
                        'aircraft' => $activity['aircraft'],
                        'takeoff_time' => $moment['moment'], // 假设moment表有id字段
                        'manner' => $manner,
                        'callsign' => $moment['callsign'],
                        'park'=>$park// 假设moment表有description字段
                    );
                }
            }
        }
        return $data;
    } else {
        return 0;
    }
}


function getatc($id)
{
    require './setting.php';
    $sql = $conn->prepare("SELECT * FROM event where time = ?");
    $sql->bind_param("s", $id);
    $sql->execute();
    $result = $sql->get_result();

    // 处理查询结果
    if ($result) {
        $data = $result->fetch_all(MYSQLI_ASSOC);

        $output = array();

        for ($i = 0; $i < count($data); $i++) {
            $atc = array(
                'atc' => explode(',', $data[$i]['atc']),
                'atc_fp' => explode(',', $data[$i]['atc_fq']),
                'time' => $data[$i]['time']
            );

            for ($j = 0; $j < count($atc['atc']); $j++) {
                $parts = explode("_", $atc['atc'][$j]);
                $valueAfterUnderscore = end($parts);

                switch ($valueAfterUnderscore) {
                    case 'FOLLOW':
                    case 'APN':
                    case 'GND':
                    case 'DEL':
                    case 'TWR':
                        $atc_grade = 2;
                        break;
                    case 'APP':
                    case 'DEP':
                        $atc_grade = 3;
                        break;
                    case 'CTR':
                        $atc_grade = 4;
                        break;
                    case 'FSS':
                        $atc_grade = 6;
                        break;
                    case 'S3':
                        $atc_grade = 4;
                        break;
                    default:
                        $atc_grade = 12;
                        break;
                }

                $sql = $conn->prepare("SELECT * FROM event_atc where time = ? AND atc = ?");
                $sql->bind_param("ss", $atc['time'], $atc['atc'][$j]);
                $sql->execute();
                $result = $sql->get_result();

                if ($result && $result->num_rows > 0) {
                    $atc_data = $result->fetch_assoc();
                    $sql = $conn->prepare("SELECT * FROM user where user_num=?");
                    $sql->bind_param("s", $atc_data['atc_user']);
                    $sql->execute();
                    $result = $sql->get_result();
                    $user_data = $result->fetch_assoc();
                    $user_grade = $user_data['user_grade'];
                    if ($user_grade == '2' || $user_grade == '3') {
                        $sql = $conn->prepare("SELECT * FROM user where user_num=?");
                        $sql->bind_param("s", $atc_data['supervision']);
                        $sql->execute();
                        $result = $sql->get_result();
                        $user_data = $result->fetch_assoc();
                        $user_supervision_grade = 'NULL';
                        if (isset($user_data['user_grade'])) {
                            $user_supervision_grade = $user_data['user_grade'];
                        }
                        $sta = 1;
                        if ($atc_data['supervision'] == "NULL") {
                            $sta = 0;
                        }
                        $output[] = array(
                            'atc' => $atc['atc'][$j],
                            'atc_fp' => $atc['atc_fp'][$j],
                            'atc_grade' => $atc_grade,
                            'sta' => 1,
                            'user' => array(
                                'id' => $atc_data['atc_user'],
                                'grade' => $user_grade
                            ),
                            'supervision' => array(
                                'id' => $atc_data['supervision'],
                                'grade' => $user_supervision_grade,
                                'sta' => $sta
                            )
                        );
                    } else {
                        $output[] = array(
                            'atc' => $atc['atc'][$j],
                            'atc_fp' => $atc['atc_fp'][$j],
                            'atc_grade' => $atc_grade,
                            'sta' => 1,
                            'user' => array(
                                'id' => $atc_data['atc_user'],
                                'grade' => $user_grade
                            )
                        );
                    }

                } else {
                    $output[] = array(
                        'atc' => $atc['atc'][$j],
                        'atc_fp' => $atc['atc_fp'][$j],
                        'atc_grade' => $atc_grade,
                        'sta' => 0,
                        'user' => null
                    );
                }
            }
        }

        return $output;
    } else {
        return 0;
    }
}