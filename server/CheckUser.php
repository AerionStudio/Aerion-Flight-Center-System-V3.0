<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include 'setting.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') { //检测提交方式是否为 POST
    $postData = file_get_contents("php://input");
    $data = json_decode($postData, true);
    $token = $data['token'];
    $token = hash('sha256', $token);
    if ($token == $token_Correct) {//鉴权
        /** 获取数据 **/
        $user_pwd = $data['user_pwd'];
        $user_num = $data['user_num'];
        if (isset($user_num) && isset($user_pwd)) {
            /** 建立数据库连接 **/

            $user_pwd = hash("sha256", $user_pwd);
            /** 查询用户 **/
            $sql = $conn->prepare("SELECT * FROM user WHERE user_num=? AND user_pwd=? ");
            $sql->bind_param("ss", $user_num, $user_pwd);
            $sql->execute();
            $result = $sql->get_result(); // 获取结果集
            if ($result->num_rows > 0) {
                $data = $result->fetch_all(MYSQLI_ASSOC);
                $output=array(
                    'user'=>$user_num,
                    'grade'=>$data[0]['user_grade'],
                    'email'=>$data[0]['user_email']
                );
                http_response_code(200);
                header('Content-Type: application/json');
                echo json_encode(array('status' => '200', 'data' => $output));
                exit;
            }else{


                http_response_code(201);
                header('Content-Type: application/json');
                echo json_encode(array('status' => '201', 'code' => '登录失败'));
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