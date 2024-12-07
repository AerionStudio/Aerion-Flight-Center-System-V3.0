<?php
header("Content-Type: application/json");

// 检查请求的来源
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// 允许特定域名跨域访问

$allowed_origins = ['http://localhost:5173', 'http://localhost:5174', 'https://v4.ariven.cn','https://admin.imp.xfex.cc'];

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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $postData = file_get_contents("php://input");
    $data = json_decode($postData, true);
    $token = $data['token'];
    $token = hash('sha256', $token);
    if ($token == $token_Correct) {
        /** 获取数据 **/
        $cid = $data['cid'];
        $grade = $data['grade'];
// Check if $cid is set
        if (isset($cid)) {
            // Prepare a SQL statement to check if the record exists
            $check_sql = $conn->prepare("SELECT * FROM atcgrade WHERE cid = ?");
            $check_sql->bind_param("s", $cid);
            $check_sql->execute();
            $result = $check_sql->get_result();

            if ($result->num_rows > 0) {
                // Record exists, so update it
                $update_sql = $conn->prepare("UPDATE atcgrade SET grade = ? WHERE cid = ?");
                $update_sql->bind_param("ss", $grade, $cid);
                if ($update_sql->execute()) {
                    http_response_code(200);
                    $data = array(
                        'grade' => $grade,
                        'cid' => $cid
                    );
                    echo json_encode(array('status' => '200', 'data' => $data));
                    exit;
                } else {
                    http_response_code(404);
                    echo json_encode(array('status' => '404', 'data' => '更新失败'));
                    exit;
                }
            } else {
                // Record does not exist, so insert it
                $insert_sql = $conn->prepare("INSERT INTO atcgrade (cid, grade) VALUES (?, ?)");
                $insert_sql->bind_param("ss", $cid, $grade);
                if ($insert_sql->execute()) {
                    http_response_code(200);
                    $data = array(
                        'grade' => $grade,
                        'cid' => $cid
                    );
                    echo json_encode(array('status' => '200', 'data' => $data));
                    exit;
                } else {
                    http_response_code(404);
                    echo json_encode(array('status' => '404', 'data' => '报名失败'));
                    exit;
                }
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

