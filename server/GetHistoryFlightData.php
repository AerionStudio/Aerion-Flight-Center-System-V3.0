<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include "setting.php";

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    /** 获取数据 **/
    $callsign = $_GET['callsign'];
    $time = $_GET['time'];
    if (isset($callsign, $time)) {
        $sqlFlight = $conn->prepare("SELECT * FROM history WHERE cid=? AND time=?");
        $sqlFlight->bind_param("ss", $callsign, $time);
        $sqlFlight->execute();
        $resultFlight = $sqlFlight->get_result();

        if ($resultFlight->num_rows > 0) {
            $list = $resultFlight->fetch_assoc(); // Use fetch_assoc() to get an associative array
            if (isset($list)) {
                $sqlFlight = $conn->prepare("SELECT * FROM online WHERE cid=? AND time=?");
                $sqlFlight->bind_param("ss", $callsign, $time);
                $sqlFlight->execute();
                $resultFlight = $sqlFlight->get_result();
                if ($resultFlight->num_rows > 0) {
                    $list_more = $resultFlight->fetch_assoc(); // Use fetch_assoc() to get an associative array
                    $lat = explode(",", $list_more['lat']);
                    $lon = explode(",", $list_more['lon']);
                    $groundspeed = explode(",", $list_more['groundspeed']);
                    $altitude = explode(",", $list_more['altitude']);
                    $flighttimeonline = explode(",", $list_more['flighttimeonline']);


                }
            }
            for ($i = 0; $i < count($lat); $i++) {
                $location[$i] = $lon[$i] . ',' . $lat[$i];
            }
            for ($j = 0; $j < count($flighttimeonline); $j++) {
                $timelist[$j] = date('Y年m月d日 H:i:s', $flighttimeonline[$j]);
            }
            $details = array(
                'location' => $location, // Assuming $lat and $lon are arrays with longitude and latitude as the first elements
                'groundspeed' => $groundspeed,
                'altitude' => $altitude,
                'timelist'=> $timelist
            );
            $data = array(
                'Basic_Information' => $list,
                'Details' => $details

            );
            http_response_code(200);
            echo json_encode(array('status' => '200', 'data' => $data));
            exit;
        } else {
            http_response_code(200);
            echo json_encode(array('status' => '201', 'data' => '无数据'));
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

