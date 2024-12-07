<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

require './setting.php';

// Ensure the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Execute query
    $sql = "SELECT * FROM user WHERE user_grade > '1'";
    $result = $conn->query($sql);

    // Process query results
    if ($result) {
        $data = $result->fetch_all(MYSQLI_ASSOC);

        if (!empty($data)) {
            $outputdata = [];
            $outputdata_1 = [];
            $unique_callsigns = []; // Array to track unique callsigns
            foreach ($data as $key => $row) {
                $num = $row['user_num'];
                $grade_num = $row['user_grade'];
                $user_qq=$row['user_qq'];
                echo $user_qq;
                $sql = $conn->prepare("SELECT * FROM atcdisplay WHERE callsign = ?");
                $sql->bind_param("s", $num);
                $sql->execute();
                $result = $sql->get_result();
                if ($result->num_rows > 0) {
                    $row = $result->fetch_assoc();
                    $callsign = $row['callsign'];
                    if (!in_array($callsign, $unique_callsigns)) {
                        $grade_list = explode(",", $row['gradelist']);
                        if ($row['remark'] == '') {
                            $remark = '该教员很懒，暂时没有留下介绍';
                        } else {
                            $remark = $row['remark'];
                        }
                        if ($user_qq != '未填写') {
                            $image = 'http://q.qlogo.cn/headimg_dl?dst_uin=' .  $user_qq . '&spec=640&img_type=jpg';
                        } else {
                            $image = 'https://imp.xfex.cc/server/atc.png';
                        }
                        $grade_text = grade($data[$key]['user_grade']); // Pass user grade to the function

                        $grade = explode(",", $row['gradelist']);

                        if ($grade[0] != ' ') {
                            for ($i = 0; $i < count($grade); $i++) {
                                switch ($grade [$i]) {
                                    case 0:
                                        $grade_list[$i] = [
                                            'text' => 'X',
                                            'type' => 'info'
                                        ];
                                        break;
                                    case 1:
                                        $grade_list[$i] = [
                                            'text' => 'T',
                                            'type' => 'warning'
                                        ];
                                        break;
                                    case 2:
                                        $grade_list[$i] = [
                                            'text' => '√',
                                            'type' => 'success'
                                        ];
                                        break;
                                    case 3:
                                        $grade_list[$i] = [
                                            'text' => '资深',
                                            'type' => 'success'
                                        ];
                                        break;
                                    case 4:
                                        $grade_list[$i] = [
                                            'text' => '√',
                                            'type' => 'primary'
                                        ];
                                        break;
                                    case 5:
                                        $grade_list[$i] = [
                                            'text' => 'T',
                                            'type' => 'primary'
                                        ];
                                        break;
                                    case 6:
                                        $grade_list[$i] = [
                                            'text' => '暂停',
                                            'type' => 'danger'
                                        ];
                                        break;
                                    case 7:
                                        $grade_list[$i] = [
                                            'text' => '休假',
                                            'type' => 'info'
                                        ];
                                        break;
                                }
                            }
                        } else {
                            switch ($grade_num) {
                                case '0':
                                case '1':
                                    $grade_list = [
                                        ['text' => 'X', 'type' => 'info'],
                                        ['text' => 'X', 'type' => 'info'],
                                        ['text' => 'X', 'type' => 'info'],
                                        ['text' => 'X', 'type' => 'info'],
                                        ['text' => 'X', 'type' => 'info'],
                                        ['text' => 'X', 'type' => 'info']
                                    ];
                                    break;
                                case '2':
                                    $grade_list = [
                                        ['text' => 'T', 'type' => 'warning'],
                                        ['text' => 'X', 'type' => 'info'],
                                        ['text' => 'X', 'type' => 'info'],
                                        ['text' => 'X', 'type' => 'info'],
                                        ['text' => 'X', 'type' => 'info'],
                                        ['text' => 'X', 'type' => 'info']
                                    ];
                                    break;
                                case '3':
                                    $grade_list = [
                                        ['text' => '√', 'type' => 'success'],
                                        ['text' => 'T', 'type' => 'warning'],
                                        ['text' => 'X', 'type' => 'info'],
                                        ['text' => 'X', 'type' => 'info'],
                                        ['text' => 'X', 'type' => 'info'],
                                        ['text' => 'X', 'type' => 'info']
                                    ];
                                    break;
                                case '4':
                                    $grade_list = [
                                        ['text' => '√', 'type' => 'success'],
                                        ['text' => '√', 'type' => 'success'],
                                        ['text' => 'T', 'type' => 'warning'],
                                        ['text' => 'X', 'type' => 'info'],
                                        ['text' => 'X', 'type' => 'info'],
                                        ['text' => 'X', 'type' => 'info']
                                    ];
                                    break;
                                case '5':
                                    $grade_list = [
                                        ['text' => '√', 'type' => 'success'],
                                        ['text' => '√', 'type' => 'success'],
                                        ['text' => '√', 'type' => 'success'],
                                        ['text' => 'T', 'type' => 'warning'],
                                        ['text' => 'X', 'type' => 'info'],
                                        ['text' => 'X', 'type' => 'info']
                                    ];
                                    break;
                                case '6':
                                    $grade_list = [
                                        ['text' => '√', 'type' => 'success'],
                                        ['text' => '√', 'type' => 'success'],
                                        ['text' => '√', 'type' => 'success'],
                                        ['text' => '√', 'type' => 'success'],
                                        ['text' => 'T', 'type' => 'warning'],
                                        ['text' => 'X', 'type' => 'info']
                                    ];
                                    break;
                                case '7':
                                case '8':
                                case '9':
                                    $grade_list = [
                                        ['text' => '√', 'type' => 'success'],
                                        ['text' => '√', 'type' => 'success'],
                                        ['text' => '√', 'type' => 'success'],
                                        ['text' => '√', 'type' => 'success'],
                                        ['text' => 'X', 'type' => 'info'],
                                        ['text' => 'X', 'type' => 'info']
                                    ];
                                    break;
                                case '11':
                                    $grade_list = [
                                        ['text' => '√', 'type' => 'success'],
                                        ['text' => '√', 'type' => 'success'],
                                        ['text' => '√', 'type' => 'success'],
                                        ['text' => '√', 'type' => 'success'],
                                        ['text' => '√', 'type' => 'success'],
                                        ['text' => 'X', 'type' => 'info']
                                    ];
                                    break;
                                case '12':
                                    $grade_list = [
                                        ['text' => '√', 'type' => 'success'],
                                        ['text' => '√', 'type' => 'success'],
                                        ['text' => '√', 'type' => 'success'],
                                        ['text' => '√', 'type' => 'success'],
                                        ['text' => '√', 'type' => 'success'],
                                        ['text' => '√', 'type' => 'success']
                                    ];
                                    break;
                            }
                        }

                        switch ($data[$key]['user_grade']) {
                            case '8':
                            case '9':
                            case '10':
                            case '11':
                                $outputdata_1[] = [
                                    'callsign' => $callsign,
                                    'grade' => $data[$key]['user_grade'],
                                    'grade_text'=>$grade_text,
                                    'avatar' => $image,
                                    'remark' => $remark,
                                    'gradelist' => $grade_list
                                ];
                                break;
                        }
                        $outputdata[] = [
                            'callsign' => $callsign,
                            'grade' => $data[$key]['user_grade'],
                            'grade_text'=>$grade_text,
                            'avatar' => $image,
                            'remark' => $remark,
                            'gradelist' => $grade_list,
                        ];
                        $unique_callsigns[] = $callsign; // Add callsign to unique callsigns array
                    }
                }
            }
            // Sort $outputdata based on 'num' in descending order
            usort($outputdata, function ($a, $b) {
                return $b['grade'] <=> $a['grade'];
            });

            $data_out = [
                'teacher' => $outputdata_1,
                'all' => $outputdata
            ];
            http_response_code(200);
            echo json_encode(['code' => '200', 'data' => $data_out]);
        } else {
            http_response_code(200); // Assume 0 results is a valid response
            echo json_encode(['message' => '0 results']);
        }
    } else {
        http_response_code(500); // Internal server error
        echo json_encode(['error' => $conn->error]);
    }

    $conn->close();

} else {
    http_response_code(405); // Method not allowed
    echo json_encode(['status' => '405', 'error' => 'Method Not Allowed']);
}

function grade($grade)
{
    switch ($grade) {
        case '2':
            return 'STU1';
        case '3':
            return 'STU2';
        case '4':
            return 'STU3';
        case '5':
            return 'CTR1';
        case '6':
            return 'CTR2';
        case '7':
            return 'CTR3';
        case '8':
            return 'INS1';
        case '9':
            return 'INS2';
        case '10':
            return 'INS3';
        case '11':
            return 'SUP';
        case '12':
            return 'ADM';
        default:
            return 'error';
    }
}

