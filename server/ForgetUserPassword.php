<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include "setting.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $postData = file_get_contents("php://input");
    $data = json_decode($postData, true);
    $token = $data['token'];
//    $token = $_REQUEST['token'];
    $token = hash('sha256', $token);
    if ($token == $token_Correct) {
        $cid=$data['email'];
        $password= $data['password'];
//        $cid=$_REQUEST['email'];
//        $password= $_REQUEST['password'];
        $password = hash('sha256', $password);
        if (isset($cid)) {
            $sql = $conn->prepare("SELECT * FROM user WHERE user_email = ?");
            $sql->bind_param("s", $cid);
            $sql->execute();
            $result = $sql->get_result();
            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                $update_sql = $conn->prepare("UPDATE user SET user_pwd = ? WHERE user_email=?");
                $update_sql->bind_param("ss", $password,$cid);
                if ($update_sql->execute()) {
                    $rating=intval($row['user_grade']);
                    $body = json_encode([
                        'password' => $password,
                        'rating' => $rating
                    ]);
                    $apiEndpoint = 'http://117.24.6.131:6067/users/' . $row['user_num'];
                    $headers = [
                        'Content-Type: application/json',
                        'Authorization: Bearer 157fd42534a1a058a8ee3de1104dfbbfee6d37b1a3930157b25b24b8da4d680a'
                    ];
                    $ch = curl_init();
                    curl_setopt($ch, CURLOPT_URL, $apiEndpoint);
                    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
                    curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
                    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
                    $response = curl_exec($ch);
                    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                    http_response_code(200);

                    echo json_encode(array('status' => '200', 'data' => array('password' => $password, 'rating' => $row['user_grade'])));
                    exit;
                } else {
                    http_response_code(404);
                    echo json_encode(array('status' => '404', 'code' => '缺少必要的值'));
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

