<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include "setting.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $postData = file_get_contents("php://input");
    $data = json_decode($postData, true);
    $token = $data['token'];
    $token = hash('sha256', $token);
    // $token = $_REQUEST['token'];
    // $token = hash('sha256', $token);
    if ($token == $token_Correct) {
        // $cid=$_REQUEST['callsign'];
        // $rating=$_REQUEST['rating'];
        // $rating=intval($rating);
        // $password= $_REQUEST['password'];
        $cid=$data['callsign'];
        $rating=$data['rating'];
        $rating=intval($rating);
        $password= $data['password'];
        $password = hash('sha256', $password);
        if (isset($cid)) {
            $update_sql = $conn->prepare("UPDATE user SET user_pwd = ? WHERE user_num=?");
            $update_sql->bind_param("ss", $password,$cid);
            if ($update_sql->execute()) {
                http_response_code(200);
                $body = json_encode([
                    'password' => $password,
                    'rating' => $rating
                ]);
                $apiEndpoint = 'http://117.24.6.131:6067/users/' . $cid;
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
                $data=array(
                    'cid'=>$cid,
                    'email'=>$password
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

