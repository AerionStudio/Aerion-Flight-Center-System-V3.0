<?php
header("Content-Type: application/json");

// 检查请求的来源
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// 允许特定域名跨域访问
$allowed_origins = ['http://localhost:5173', 'https://v4.ariven.cn'];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Credentials: true");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        // Handle preflight request
        header('HTTP/1.1 200 OK');
        exit();
    }
}
header("Access-Control-Allow-Headers: Content-Type");


include "setting.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $postData = file_get_contents("php://input");
    $data = json_decode($postData, true);
    $token = $data['token'];
    $token = hash('sha256', $token);
    if ($token == $token_Correct) {
        /** 获取数据 **/
        $cid = $data['cid'];
        $time = $data['time'];
        if (isset($cid)) {
            $png=get($time);
            http_response_code(200);
            echo json_encode(array('status' => '200', 'image' => $png));
            exit;
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

function get($time)
{
    $time = intval($time);

    if ($time >= 360000 && $time < 720000) {
        return 'https://imp.xfex.cc/server/grade/SeniorPilot.png';
    } elseif ($time >= 360000 && $time < 720000) {
        return 'https://imp.xfex.cc/server/grade/F1.png';
    } elseif ($time >= 720000 && $time < 1080000) {
        return 'https://imp.xfex.cc/server/grade/F2.png';
    } elseif ($time >= 1080000 && $time < 1440000) {
        return 'https://imp.xfex.cc/server/grade/F3.png';
    } elseif ($time >= 1440000 && $time < 1800000) {
        return 'https://imp.xfex.cc/server/grade/captain.png';
    } elseif ($time >= 1800000) {
        return 'https://imp.xfex.cc/server/grade/Captainandinstructor.png';
    } else {
        return 'https://imp.xfex.cc/server/grade/Juniorpilot.png';
    }

}