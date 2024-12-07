<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

require './setting.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // 执行查询语句
    $sql = "SELECT user_num, user_grade,user_email FROM user WHERE user_grade > 1";
    $result = $conn->query($sql);

    // 处理查询结果
    if ($result) {
        $data = $result->fetch_all(MYSQLI_ASSOC);

        if (!empty($data)) {
            $filteredData = array();
            foreach ($data as $record) {
                $filteredData[] = array(
                    "user_num" => $record["user_num"],
                    "user_email" => $record["user_email"],
                    "user_grade" => $record["user_grade"]
                );
            }

            // 按照 user_grade 降序排序
            usort($filteredData, function($a, $b) {
                return $b['user_grade'] - $a['user_grade'];
            });

            http_response_code(200);
            echo json_encode($filteredData);
        } else {
            http_response_code(200);
            echo json_encode(array('message' => '0 results'));
        }
    } else {
        http_response_code(500);
        echo json_encode(array('error' => $conn->error));
    }

    $conn->close();

} else {
    http_response_code(405);
    echo json_encode(array('status' => '405', 'error' => 'Method Not Allowed'));
}
