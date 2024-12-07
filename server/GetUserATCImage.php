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


include "setting.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $postData = file_get_contents("php://input");
    $data = json_decode($postData, true);
    $token = $data['token'];
    $token = hash('sha256', $token);
    if ($token == $token_Correct) {
        /** 获取数据 **/
        $cid = $data['cid'];
        $sql = $conn->prepare("SELECT * FROM atcgrade WHERE cid=?");
        $sql->bind_param("s", $cid);
        $sql->execute();
        $result = $sql->get_result();
        $data=array();
        if ($result->num_rows > 0) {
            $data = $result->fetch_all(MYSQLI_ASSOC);
            $image=get($data[0]['grade']);
            http_response_code(200);
            echo json_encode(array('status' => '200', 'image' => $image));
            exit;
        } else {
            $image='https://imp.xfex.cc/server/grade/noaatc.png';
            http_response_code(200);
            echo json_encode(array('status' => '200', 'image' => $image));
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

function get($grade)
{

   switch ($grade){
       case 1:
           return 'https://imp.xfex.cc/server/grade/InternshipAtc.png';
       case 2:
           return 'https://imp.xfex.cc/server/grade/FormalAtc.png';
       case 3:
           return 'https://imp.xfex.cc/server/grade/ins.png';
       case 4:
           return 'https://imp.xfex.cc/server/grade/DeputyDirector.png';
       case 5:
           return 'https://imp.xfex.cc/server/grade/managingdirector.png';
       case 6:
           return 'https://imp.xfex.cc/server/grade/adm.png';
   }

}