<?php
header("Content-Type: application/json");

// 检查请求的来源
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// 允许特定域名跨域访问
$allowed_origins = ['http://localhost:5173', 'https://v4.ariven.cn'];

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: {$origin}");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Credentials: true");
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Handle preflight request
    http_response_code(200);
    exit();
}

include "setting.php";

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // 获取数据
    $time = isset($_GET['time']) ? $_GET['time'] : null;
    $atc = isset($_GET['atc']) ? $_GET['atc'] : null;

    if ($time && $atc) {
        $sqlFlight = $conn->prepare("SELECT * FROM atcwaitlist WHERE atc = ? AND time = ?");
        $sqlFlight->bind_param("ss", $atc, $time);
        $sqlFlight->execute();
        $resultFlight = $sqlFlight->get_result();

        if ($resultFlight->num_rows > 0) {
            $list = $resultFlight->fetch_assoc(); // Use fetch_assoc() to get an associative array

            echo json_encode(array('status' => '200', 'data' => $list));
        } else {
            echo json_encode(array('status' => '201', 'data' => 'gradelist字段不存在'));
        }
    } else {
        echo json_encode(array('status' => '300', 'code' => '缺少必要的值'));
    }

    $sqlFlight->close();
    $conn->close();
    exit();
} else {
    http_response_code(500);
    echo json_encode(array('status' => '500', 'code' => '错误提交方法'));
    exit();
}
