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

if ($_SERVER['REQUEST_METHOD'] === 'POST') { //检测提交方式是否为 POST
    $postData = file_get_contents("php://input");
    $data = json_decode($postData, true);
    $token = $data['token'];
    $token = hash('sha256', $token);
    if ($token == $token_Correct) {//鉴权
        /** 获取数据 **/

        $user_num = $data['user_num'];
        if (isset($user_num)) {
            /** 查询用户 **/
            $sql = $conn->prepare("SELECT * FROM user WHERE user_num=?  ");
            $sql->bind_param("s", $user_num);
            $sql->execute();
            $result = $sql->get_result(); // 获取结果集
            if ($result->num_rows > 0) {
                $data = $result->fetch_all(MYSQLI_ASSOC);
                $output=array(
                    'user'=>$user_num,
                );
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array('status' => '200', 'data' => $output));
                exit;
            }else{


                http_response_code(201);
                header('Content-Type: application/json');
                echo json_encode(array('status' => '201', 'code' => '已注册'));
                exit;
            }
        } else {
            // 记录错误信息到日志


            http_response_code(300);
            header('Content-Type: application/json');
            echo json_encode(array('status' => '300', 'code' => '缺少必要的值'));
            exit;
        }
    } else {
        // 记录错误信息到日志


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
?>