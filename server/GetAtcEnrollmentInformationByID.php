<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");



require './setting.php';

// 确保请求是 POST 方法
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $postData = file_get_contents("php://input");
    $data = json_decode($postData, true);
    $id = $data['id'];
    // $id = $_REQUEST['id'];
    // 执行查询语句z
    $sql = $conn->prepare("SELECT * FROM event where time = ?");
    $sql->bind_param("s", $id);
    $sql->execute();
    $result = $sql->get_result();

    // 处理查询结果
    if ($result) {
        $data = $result->fetch_all(MYSQLI_ASSOC);

        $output = array();

        for ($i = 0; $i < count($data); $i++) {
            $atc = array(
                'atc' => explode(',', $data[$i]['atc']),
                'atc_fp' => explode(',', $data[$i]['atc_fq']),
                'time' => $data[$i]['time']
            );

            for ($j = 0; $j < count($atc['atc']); $j++) {
                $parts = explode("_", $atc['atc'][$j]);
                $valueAfterUnderscore = end($parts);

                switch ($valueAfterUnderscore) {
                    case 'FOLLOW':
                    case 'APN':
                    case 'GND':
                    case 'DEL':
                    case 'TWR':
                        $atc_grade = 2;
                        break;
                    case 'APP':
                    case 'DEP':
                        $atc_grade = 3;
                        break;
                    case 'CTR':
                        $atc_grade = 4;
                        break;
                    case 'FSS':
                        $atc_grade = 6;
                        break;
                    case 'S3':
                        $atc_grade = 4;
                        break;
                    default:
                         $atc_grade = 12;
                        break;
                }

                $sql = $conn->prepare("SELECT * FROM event_atc where time = ? AND atc = ?");
                $sql->bind_param("ss", $atc['time'], $atc['atc'][$j]);
                $sql->execute();
                $result = $sql->get_result();

                if ($result && $result->num_rows > 0) {
                    $atc_data = $result->fetch_assoc();
                    $sql = $conn->prepare("SELECT * FROM user where user_num=?");
                    $sql->bind_param("s", $atc_data['atc_user']);
                    $sql->execute();
                    $result = $sql->get_result();
                    $user_data = $result->fetch_assoc();
                    $user_grade = $user_data['user_grade'];
                    if ($user_grade == '2' || $user_grade == '3') {
                        $sql = $conn->prepare("SELECT * FROM user where user_num=?");
                        $sql->bind_param("s", $atc_data['supervision']);
                        $sql->execute();
                        $result = $sql->get_result();
                        $user_data = $result->fetch_assoc();
                        $user_supervision_grade='NULL';
                        if(isset($user_data['user_grade'])){
                            $user_supervision_grade = $user_data['user_grade'];
                        }
                        $sta = 1;
                        if ($atc_data['supervision'] == "NULL") {
                            $sta = 0;
                        }
                        $output[] = array(
                            'atc' => $atc['atc'][$j],
                            'atc_fp' => $atc['atc_fp'][$j],
                            'atc_grade' => $atc_grade,
                            'sta' => 1,
                            'user' => array(
                                'id' => $atc_data['atc_user'],
                                'grade' => $user_grade
                            ),
                            'supervision' => array(
                                'id' => $atc_data['supervision'],
                                'grade' => $user_supervision_grade,
                                'sta' => $sta
                            )
                        );
                    } else {
                        $output[] = array(
                            'atc' => $atc['atc'][$j],
                            'atc_fp' => $atc['atc_fp'][$j],
                            'atc_grade' => $atc_grade,
                            'sta' => 1,
                            'user' => array(
                                'id' => $atc_data['atc_user'],
                                'grade' => $user_grade
                            )
                        );
                    }

                } else {
                    $output[] = array(
                        'atc' => $atc['atc'][$j],
                        'atc_fp' => $atc['atc_fp'][$j],
                        'atc_grade' => $atc_grade,
                        'sta' => 0,
                        'user' => null
                    );
                }
            }
        }

        echo json_encode($output);
    } else {
        http_response_code(500); // 服务器内部错误
        echo json_encode(array('error' => $conn->error));
    }

    $sql->close();
    $conn->close();

} else {
    http_response_code(405); // 请求方法不允许
    echo json_encode(array('status' => '405', 'error' => 'Method Not Allowed'));
}
