<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require './mailserver/src/Exception.php';
require './mailserver/src/PHPMailer.php';
require './mailserver/src/SMTP.php';

function Captcha($email,$user){
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

        $mail->setFrom('amstudio@qq.com', 'AV-Studio');
        $mail->addAddress(strval($email), strval($user));
        $mail->addReplyTo('3208629021@qq.com', 'Ariven');

        // 生成验证码
        $verificationCode = mt_rand(100000, 999999);

        $mail->isHTML(true);
        $mail->Subject = 'AVMCV2.0注册验证码';

        $mail->Body = '<style>
                    h1 {
                        
                        font-family: Arial, Helvetica, sans-serif;
                    }
                    </style>
                    <h1>欢迎注册AFCS V3.0 !</h1>
                    <h1>验证码：' . $verificationCode . '</h1>';
        $mail->AltBody = '如果邮件客户端不支持HTML则显示此内容';

        $mail->send();
        return $verificationCode;
        // 将验证码存储在数据库或会话中以供后续验证使用

    } catch (Exception $e) {
        return 0;
    }

}

function welcome($email,$user){
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
        $mail->addReplyTo('3208629021@qq.com', 'Ariven');

        $mail->isHTML(true);
        $mail->Subject = 'AFCS3.0 欢迎邮件';
        $mail->Body = '<style>
                    h1 {
                        
                        font-family: Arial, Helvetica, sans-serif;
                    }
                    </style>
                    <h1>欢迎使用AFCS V3.0 !</h1>
                    <h1>AM-Studio 祝您玩的愉快!</h1>';
        $mail->AltBody = 'AM-Studio 祝您玩的愉快!';

        $mail->send();

    } catch (Exception $e) {

    }

}

function atc($email,$user,$atc){
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
        $mail->addReplyTo('3208629021@qq.com', 'Ariven');

        $mail->isHTML(true);
        $mail->Subject = '席位候补成功通知';
        $mail->Body = '<style>
                    h1 {
                        font-family: Arial, Helvetica, sans-serif;
                    }
                </style>
                <h1>您好！</h1>
                <h1>您候补的' . $atc . '候补成功！记得按时上线管制。</h1>';
        $mail->AltBody = 'AM-Studio 祝您玩的愉快!';

        $mail->send();

    } catch (Exception $e) {

    }

}
function sendatc($cid,$atcname,$en,$experience,$onlinetime,$connect,$reason)
{
    $mail = new PHPMailer(true);
    try {
        // Server configuration
        $mail->CharSet = "UTF-8";
        $mail->SMTPDebug = 0;
        $mail->isSMTP();
        $mail->Host = 'smtp.qq.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'amstudio@qq.com';
        $mail->Password = 'ojxeivkzyineddaj';
        $mail->SMTPSecure = 'ssl';
        $mail->Port = 465;

        // List of email addresses to send the email to
        $recipients = array('atccenter@tianmengva.com', '3208629021@qq.com');

        // Loop through each recipient and send the email
        foreach ($recipients as $recipient) {
            $mail->clearAddresses(); // Clear previous recipient
            $mail->setFrom('amstudio@qq.com', 'AM-Studio');
            $mail->addAddress($recipient);
            $mail->addReplyTo('3208629021@qq.com', 'Ariven');
            $mail->isHTML(true);
            $mail->Subject = '天梦俱乐部管制申请';
            $mail->Body = '<style>
                                h1 {
                                    font-family: Arial, Helvetica, sans-serif;
                                }
                            </style>
                            <h1>有新的管制申请</h1>
                            <h1>呼号: ' . $cid . '</h1>
                            <h1>申请管制室: ' . $atcname . '</h1>
                            <h1>英语水平: ' . $en . '</h1>
                            <h1>是否有管制经验: ' . $experience . '</h1>
                            <h1>在线时长: ' . $onlinetime . '</h1>
                            <h1>联系方式: ' . $connect . '</h1>
                            <h1>申请理由: ' . $reason . '</h1>';
            $mail->AltBody = '天梦俱乐部管制申请';

            $mail->send();
        }
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
}

?>