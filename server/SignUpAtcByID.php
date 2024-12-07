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
    if ($token == $token_Correct) {
        /** 获取数据 **/
        $time=$data['time'];
        $atc_user=$data['atc_user'];
        $atc=$data['atc'];
        $supervision='NULL';
        if (isset($time,$atc_user,$atc)) {
            $insert_sql = $conn->prepare("INSERT INTO event_atc (time,atc_user,atc,supervision) VALUES (?, ?, ?,?);");
            $insert_sql->bind_param("ssss", $time, $atc_user, $atc,$supervision);
            if ($insert_sql->execute()) {
                http_response_code(200);
                $data=array(
                    'id'=>$atc,
                    'user-id'=>$atc_user
                );
                echo json_encode(array('status' => '200', 'data' => $data));
                exit;
            } else {
                http_response_code(404);
                echo json_encode(array('status' => '404', 'data' => '报名失败'));
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

