<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

require './mail.php'; //调用邮件服务器
require './setting.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') { //检测提交方式是否为 POST
    $postData = file_get_contents("php://input");
    $data = json_decode($postData, true);
    $token = $data['token'];
    $token = hash('sha256', $token);
    if ($token == $token_Correct) {//鉴权
        /********获取数据*********/
        $user_pwd = $data['user_pwd'];
        $user_num = $data['user_num'];
        $user_email = $data['user_email'];
        if (isset($user_email) && isset($user_num) && isset($user_pwd)) {
            /**查询用户是否存在**/
            $sql = $conn->prepare("SELECT * FROM user WHERE user_email=? ");
            $sql->bind_param("s", $user_email);
            $sql->execute();
            $result = $sql->get_result(); // 获取结果集
            if ($result->num_rows > 0) {
                http_response_code(400);
                header('Content-Type: application/json');
                echo json_encode(array('status' => '400', 'code' => '邮箱已经注册'));
                exit;
            } else {
                $sql = $conn->prepare("SELECT * FROM user WHERE user_num=? ");
                $sql->bind_param("s", $user_num);
                $sql->execute();
                $result = $sql->get_result(); // 获取结果集
                if ($result->num_rows > 0) {
                    http_response_code(401);
                    header('Content-Type: application/json');
                    echo json_encode(array('status' => '400', 'code' => $result));
                    exit;
                } else {
                    $grade = '1';
                    $user_pwd = hash("sha256", $user_pwd);
                    $insertSql = $conn->prepare("INSERT INTO user (user_num,user_pwd,user_email,user_grade) VALUES (?, ?, ?, ?)");
                    $insertSql->bind_param("ssss", $user_num, $user_pwd, $user_email, $grade);
                    $insertSql->execute();
                    // 生成密码的 SHA256 哈希值
                    $apiEndpoint = 'http://117.24.6.131:6067/users';

                    $body = json_encode([
                        'callsign' => $user_num,
                        'password' => $user_pwd
                    ]);

                    $ch = curl_init();

                    curl_setopt($ch, CURLOPT_URL, $apiEndpoint);
                    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
                    curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
                    curl_setopt($ch, CURLOPT_HTTPHEADER, [
                        'Content-Type: application/json',
                        'Authorization: Bearer 157fd42534a1a058a8ee3de1104dfbbfee6d37b1a3930157b25b24b8da4d680a'
                    ]);
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

                    $response = curl_exec($ch);
                    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                    
                    curl_close($ch);
                    welcome($user_email, $user_num); //发送欢迎邮件
                    http_response_code(200);
                    header('Content-Type: application/json');
                    echo json_encode(array('status' => '200', 'code' => '注册成功!'));
                    exit;
                }
            }
        } else {
            http_response_code(300);
            header('Content-Type: application/json');
            echo json_encode(array('status' => '300', 'code' => '缺少必要的值'));
            exit;
        }
    } else {
        http_response_code(505);
        header('Content-Type: application/json');
        echo json_encode(array('status' => '505', 'code' => '错误的token'));
        exit;
    }
} else {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(array('status' => '500', 'code' => '错误提交方法'));
    exit;
}