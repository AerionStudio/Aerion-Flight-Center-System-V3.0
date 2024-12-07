<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include "setting.php";

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    /** 获取数据 **/
    $callsign = $_GET['callsign'];
    if (isset($callsign)) {
        $flightData = array();
        $atcData = array();

        $sqlFlight = $conn->prepare("SELECT * FROM history WHERE cid=?");
        $sqlFlight->bind_param("s", $callsign);
        $sqlFlight->execute();
        $resultFlight = $sqlFlight->get_result();

        if ($resultFlight->num_rows > 0) {
            $flightData = $resultFlight->fetch_all(MYSQLI_ASSOC);
        }

        $sqlATC = $conn->prepare("SELECT * FROM history_atc WHERE cid=?");
        $sqlATC->bind_param("s", $callsign);
        $sqlATC->execute();
        $resultATC = $sqlATC->get_result();

        if ($resultATC->num_rows > 0) {
            $atcData = $resultATC->fetch_all(MYSQLI_ASSOC);
        }

        $data = array(
            'flightData' => $flightData,
            'atcData' => $atcData
        );

        http_response_code(200);
        echo json_encode(array('status' => '200', 'data' => $data));
        exit;

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

