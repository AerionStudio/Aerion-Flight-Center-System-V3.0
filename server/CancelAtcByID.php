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
include "mail.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $postData = file_get_contents("php://input");
    $data = json_decode($postData, true);
    $token = $data['token'];
    $token = hash('sha256', $token);

    if ($token == $token_Correct) {
        $time = $data['time'];
        $atc_user = $data['atc_user'];
        $atc = $data['atc'];
        $supervision = 'NULL';

        if (isset($time, $atc_user, $atc)) {
            // 删除 `event_atc` 表中的记录
            $sql = $conn->prepare("DELETE FROM `event_atc` WHERE time = ? AND atc_user = ? AND atc = ?");
            $sql->bind_param("sss", $time, $atc_user, $atc);

            if ($sql->execute()) {
                // 检查并获取 `atcwaitlist` 表中的记录
                $sql = $conn->prepare("SELECT * FROM atcwaitlist WHERE atc = ? AND time = ?");
                $sql->bind_param("ss", $atc, $time);
                $sql->execute();
                $resultFlight = $sql->get_result();

                if ($resultFlight->num_rows > 0) {
                    $list = $resultFlight->fetch_assoc(); // 假设只需要第一条记录
                    $atc_user_waitlist = $list['cid'];
                    // 删除 `atcwaitlist` 表中的记录
                    $deleteSql = $conn->prepare("DELETE FROM atcwaitlist WHERE atc = ? AND time = ? AND cid=?");
                    $deleteSql->bind_param("sss", $atc, $time,$atc_user_waitlist);
                    $deleteSql->execute();

                    // 插入新的记录到 `event_atc` 表
                    $insert_sql = $conn->prepare("INSERT INTO event_atc (time, atc_user, atc, supervision) VALUES (?, ?, ?, ?)");
                    $insert_sql->bind_param("ssss", $time, $atc_user_waitlist, $atc, $supervision);

                    if ($insert_sql->execute()) {
                        // 获取用户电子邮件并发送通知
                        $sql = $conn->prepare("SELECT * FROM user WHERE user_num = ?");
                        $sql->bind_param("s", $atc_user_waitlist);
                        $sql->execute();
                        $result = $sql->get_result();

                        if ($result->num_rows > 0) {
                            $row = $result->fetch_assoc();
                            $email = $row['user_email'];
                            atc($email, $email, $atc);
                        }

                        http_response_code(200);
                        $responseData = array(
                            'id' => $atc,
                            'user' => $atc_user_waitlist
                        );
                        echo json_encode(array('status' => '200', 'data' => $responseData));
                        exit;
                    }
                } else {
                    http_response_code(404);
                    echo json_encode(array('status' => '404', 'code' => '没有找到相关候补数据'));
                    exit;
                }
            } else {
                http_response_code(500);
                echo json_encode(array('status' => '500', 'code' => '删除记录失败'));
                exit;
            }
        } else {
            http_response_code(400);
            echo json_encode(array('status' => '400', 'code' => '缺少必要的值'));
            exit;
        }
    } else {
        http_response_code(403);
        echo json_encode(array('status' => '403', 'code' => '错误的token'));
        exit;
    }
} else {
    http_response_code(405);
    echo json_encode(array('status' => '405', 'code' => '错误提交方法'));
    exit;
}
