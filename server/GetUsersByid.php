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

// 如果是OPTIONS请求（预检请求），直接返回200 OK
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "setting.php";
// 确保请求是 POST 方法
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $callsign=$_GET['callsign'];

    $sql = $conn->prepare("SELECT * FROM user WHERE user_num = ?");
    $sql->bind_param("s", $callsign);
    $sql->execute();
    $result = $sql->get_result();
    if ($result) {
        $data = $result->fetch_all(MYSQLI_ASSOC);

        if (!empty($data)) {
            http_response_code(200);
            echo json_encode($data);
        } else {
            http_response_code(200); // 假设0个结果也是有效响应
            echo json_encode(array('message' => '0 results'));
        }
    } else {
        http_response_code(500); // 服务器内部错误
        echo json_encode(array('error' => $conn->error));
    }

    $conn->close();

} else {
    http_response_code(405); // 请求方法不允许
    echo json_encode(array('status' => '405', 'error' => 'Method Not Allowed'));
}
