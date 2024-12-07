<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include 'setting.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $postData = file_get_contents("php://input");
    $data = json_decode($postData, true);
    $token = $data['token'];
//    $token = $_REQUEST['token'];
    $token = hash('sha256', $token);

    if ($token == $token_Correct) {
        $cid = $data['cid'];
        $time = $data['time'];
//        $cid = $_REQUEST['cid'];
//        $time = $_REQUEST['time'];
        if (isset($cid) && isset($time)) {
            $sql = $conn->prepare("SELECT * FROM online WHERE cid=? AND time=? ");
            $sql->bind_param("ss", $cid, $time);
            $sql->execute();
            $result = $sql->get_result();

            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();

                // Extract values from the database result and exclude the first element
                $latArray = array_slice(explode(',', $row['lat']), 1);
                $lonArray = array_slice(explode(',', $row['lon']), 1);
                $groundspeedArray = array_slice(explode(',', $row['groundspeed']), 1);
                $altitudeArray = array_slice(explode(',', $row['altitude']), 1);
                $flighttimeArray = array_slice(explode(',', $row['flighttimeonline']), 1);
                $formattedDates = array();
                foreach ($flighttimeArray as $timestamp) {
                    $formattedDateTime = date('Y-m-d H:i:s', $timestamp);
                    $formattedDates[] = $formattedDateTime;
                }
                $sql = $conn->prepare("SELECT * FROM history WHERE cid=? AND time=? ");
                $sql->bind_param("ss", $cid, $time);
                $sql->execute();
                $result = $sql->get_result();
                if ($result->num_rows > 0) {
                    $row = $result->fetch_assoc();
                    $onlinetime = $row['online_time'];
                    $hours = floor($onlinetime / 3600);
                    $minutes = floor(($onlinetime % 3600) / 60);
                    $onlinetime = $hours . '小时' . $minutes.'分钟';
                }
                $outputdata = array(
                    'cid' => $row['cid'],
                    'lat' => $latArray,
                    'lon' => $lonArray,
                    'time' => $row['time'],
                    'groundspeed' => $groundspeedArray,
                    'altitude' => $altitudeArray,
                    'timelist' => $formattedDates,
                    'onlinetime' => $onlinetime
                );

                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array('status' => '200', 'data' => $outputdata));
                exit;
            } else {
                http_response_code(404);
                header('Content-Type: application/json');
                echo json_encode(array('status' => '404', 'code' => '登录失败'));
                exit;
            }
        } else {
            http_response_code(300);
            header('Content-Type: application/json');
            echo json_encode(array('status' => '300', 'code' => '缺少必要的值'));
            exit;
        }
    } else {
        http_response_code(505);
        header('Content-Type: application/json');
        echo json_encode(array('status' => '505', 'code' => '错误的token'));
        exit;
    }
} else {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(array('status' => '500', 'code' => '错误提交方法'));
    exit;
}

