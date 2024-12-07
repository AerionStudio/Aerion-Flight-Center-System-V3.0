<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include "setting.php";

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    /** 获取数据 **/
    $callsign = $_GET['callsign'];
    if (isset($callsign)) {
        $flightData = array();
        $atcData = array();

        $sqlFlight = $conn->prepare("SELECT * FROM atcdisplay WHERE callsign=?");
        $sqlFlight->bind_param("s", $callsign);
        $sqlFlight->execute();
        $resultFlight = $sqlFlight->get_result();

        if ($resultFlight->num_rows > 0) {
            $list = $resultFlight->fetch_assoc(); // Use fetch_assoc() to get an associative array

            if (isset($list['gradelist'])) {
                $grade_list = explode(",", $list['gradelist']);
                if ( $grade_list!=' '){
                    for ($i = 0; $i < count($grade_list); $i++) {
                        switch ($grade_list[$i]) {
                            case 0:
                                $grade_list[$i] = '<td><span class="badge text-bg-secondary">X</span></td>';
                                break;
                            case 1:
                                $grade_list[$i] = '<td><span class="badge text-bg-warning">T</span></td>';
                                break;
                            case 2:
                                $grade_list[$i] = '<td><span class="badge text-bg-success">√</span></td>';
                                break;
                            case 3:
                                $grade_list[$i] = '<td><span class="badge text-bg-success">资深</span></td>';
                                break;
                            case 4:
                                $grade_list[$i] = '<td><span class="badge text-bg-primary">√</span></td>';
                                break;
                            case 5:
                                $grade_list[$i] = '<td><span class="badge text-bg-primary">T</span></td>';
                                break;
                            case 6:
                                $grade_list[$i] = '<td><span class="badge text-bg-danger">暂停</span></td>';
                                break;
                            case 7:
                                $grade_list[$i] = '<td><span class="badge text-bg-info">因事暂停权限</span></td>';
                                break;
                        }
                    }
                }else{

                }

                $data = array(
                    'list' => $grade_list,
                    'remark'=>$list['remark'],
                    'teacher'=>$list['teacher']
                );
                http_response_code(200);
                echo json_encode(array('status' => '200', 'data' => $data));
                exit;
            } else {
                http_response_code(200);
                echo json_encode(array('status' => '201', 'data' => 'gradelist字段不存在'));
                exit;
            }
        } else {
            http_response_code(200);
            echo json_encode(array('status' => '201', 'data' => '无数据'));
            exit;
        }


    } else {
        http_response_code(300);
        echo json_encode(array('status' => '300', 'code' => '缺少必要的值'));
        exit;
    }

} else {
    http_response_code(500);
    echo json_encode(array('status' => '500', 'code' => '错误提交方法'));
    exit;
}

