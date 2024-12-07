<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

require './setting.php';

// 确保请求是 POST 方法
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    function splitTime($time)
    {
        $hour = substr($time, 0, 2);
        $minute = substr($time, 2, 2);
        $zone = substr($time, 4);

        return [$hour * 60 + $minute, $zone];
    }

    $start = '1930CST';
    $end = '2030CST';
    $id = $_GET['id'];
    $startArray = splitTime($start);
    $endArray = splitTime($end);

    $list = array();
    for ($i = $startArray[0]; $i < $endArray[0]; $i += 2) {
        $hour = floor($i / 60);
        $minute = $i % 60;
        if ($minute < 10) {
            $minute = '0' . $minute;
        }
        $time = sprintf("%02d%02d%s", $hour, $minute, $startArray[1]);

        // 构造 SQL 查询语句，假设您的表名为 time_table，字段名为 time
        $sql = "SELECT * FROM moment WHERE moment = '$time' AND time='$id'";
        $result = $conn->query($sql);

        if (!($result->num_rows > 0)) {
            $list[] = $time;
        }
    }
    
    $conn->close();
    echo json_encode($list);

} else {
    http_response_code(405); // 请求方法不允许
    echo json_encode(array('status' => '405', 'error' => 'Method Not Allowed'));
}
