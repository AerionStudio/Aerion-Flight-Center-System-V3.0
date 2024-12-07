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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $postData = file_get_contents("php://input");
    $data = json_decode($postData, true);
    $token = $data['token'];
    $token = hash('sha256', $token);
    if ($token == $token_Correct) {
        $time = $data['time'];
        $cid = $data['cid'];
        $atc = $data['atc'];
        if (isset($time, $cid,$atc)) {
            $sql = $conn->prepare("DELETE FROM `atcwaitlist` WHERE time = ? AND atc = ? AND cid=?");
            $sql->bind_param("sss", $time, $atc, $cid);
            if ($sql->execute()) {
                http_response_code(200);
                $data = array(
                    'id' => $atc,
                    'user' => $cid
                );
                echo json_encode(array('status' => '200', 'data' => $data));
                exit;
            } else {
                http_response_code(404);
                echo json_encode(array('status' => '404', 'code' => '缺少必要的值'));
                exit;
            }
        } else {
            http_response_code(300);
            echo json_encode(array('status' => '300', 'code' => '缺少必要的值'));
            exit;
        }
    } else {
        http_response_code(505);
        echo json_encode(array('status' => '505', 'code' => '错误的token'));
        exit;
    }
} else {
    http_response_code(500);
    echo json_encode(array('status' => '500', 'code' => '错误提交方法'));
    exit;
}

