<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

require './setting.php';

// 确保请求是 POST 方法
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // 执行查询语句
    $sql = "SELECT * FROM event ORDER BY time DESC";
$result = $conn->query($sql);


    // 处理查询结果
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
?>
