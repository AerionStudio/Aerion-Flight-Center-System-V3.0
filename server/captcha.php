<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require './mailserver/src/Exception.php';
require './mailserver/src/PHPMailer.php';
require './mailserver/src/SMTP.php';

$email = $_GET['email'];
$user = $_GET['user'];

if (isset($email) && isset($user)) {
    $mail = new PHPMailer(true);
    try {
        // 服务器配置
        $mail->CharSet = "UTF-8";
        $mail->SMTPDebug = 0;
        $mail->isSMTP();
        $mail->Host = 'smtp.qq.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'amstudio@qq.com';
        $mail->Password = 'ojxeivkzyineddaj';
        $mail->SMTPSecure = 'ssl';
        $mail->Port = 465;

        $mail->setFrom('amstudio@qq.com', 'AM-Studio');
        $mail->addAddress(strval($email), strval($user));
        $mail->addReplyTo('3208629021@qq.com', 'AM-Studio');

        // 生成验证码
        $verificationCode = mt_rand(100000, 999999);

        $mail->isHTML(true);
        $mail->Subject = 'AFCS3.0 注册验证码';

        $mail->Body = '<style>
                    h1 {
                        font-family: Arial, Helvetica, sans-serif;
                    }
                    </style>
                    <h1>欢迎注册AFCS V3.0 !</h1>
                    <h1>验证码：' . $verificationCode . '</h1>';
        $mail->AltBody = '如果邮件客户端不支持HTML则显示此内容';

        $mail->send();

        echo json_encode([
            'status' => 'success',
            'verificationCode' => $verificationCode
        ]);
    } catch (Exception $e) {
        echo json_encode([
            'status' => 'error',
            'message' => '邮件发送失败: ' . $mail->ErrorInfo
        ]);
    }
} else {
    echo json_encode([
        'status' => 'error',
        'message' => '缺少必要的值'
    ]);
}
?>