<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include "setting.php"; // 包含数据库连接设置

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    // 定义目录路径
    $directory = './airports';

    // 获取查询参数
    $searchFilename = $_GET['icao'];
    $aircraft = $_GET['aircraft'];
    $time = $_GET['time'];

    // 获取飞机等级
    $grade = getgrade($aircraft);

    // 搜索并输出JSON文件
    $parkdata = searchAndOutputJsonFile($directory, $searchFilename);
    $output = array();

    // 确认是否找到数据并且对应等级的数据存在
    if ($parkdata && isset($parkdata['parkings'][$grade])) {
        // 遍历相应等级的停车数据
        foreach ($parkdata['parkings'][$grade]['gate'] as $key => $value) {
            $sql = "SELECT * FROM activity_user WHERE activity_time = ? AND park = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ss", $time, $value);
            $stmt->execute();
            $result = $stmt->get_result();

            if (!($result->num_rows > 0)) {
                $output[] = strval($value);
            }
        }
        foreach ($parkdata['parkings'][$grade]['park'] as $key => $value) {
            $sql = "SELECT * FROM activity_user WHERE activity_time = ? AND park = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ss", $time, $value);
            $stmt->execute();
            $result = $stmt->get_result();

            if (!($result->num_rows > 0)) {
                $output[] = strval($value);
            }
        }
        http_response_code(200);
        echo json_encode(array('status' => '200', 'data' => $output));
    } else {
        // 处理未找到数据的情况
        http_response_code(404);
        echo json_encode(array('status' => '404', 'code' => '未找到相应的数据'));
    }
} else {
    http_response_code(500);
    echo json_encode(array('status' => '500', 'code' => '错误提交方法'));
    exit;
}

function searchAndOutputJsonFile($dir, $filename)
{
    // 确保目录路径以斜杠结尾
    $dir = rtrim($dir, '/') . '/';

    // 打开目录
    if (is_dir($dir)) {
        if ($dh = opendir($dir)) {
            // 遍历目录中的文件和文件夹
            while (($file = readdir($dh)) !== false) {
                // 跳过 . 和 .. 目录
                if ($file == '.' || $file == '..') {
                    continue;
                }

                // 检查文件扩展名是否为 .json 且文件名中包含传入的搜索字符串
                if (is_file($dir . $file) && pathinfo($file, PATHINFO_EXTENSION) === 'json' && strpos($file, $filename) !== false) {
                    // 读取并输出文件内容
                    $content = file_get_contents($dir . $file);
                    return json_decode($content, true); // 返回解析后的JSON数据
                }
            }

            // 关闭目录句柄
            closedir($dh);
        } else {
            echo "Cannot open directory: $dir";
        }
    } else {
        echo "Not a valid directory: $dir";
    }
    return null;
}

function getgrade($aircraft)
{
    switch ($aircraft) {
        // Heavy aircraft
        case 'B747-8':
        case 'B747-400':
        case 'B747-200':
        case 'A330-300':
        case 'A330-200':
        case 'A340-600':
        case 'A340-300':
        case 'A350-1000':
        case 'A350-900':
        case 'B777-300ER':
        case 'B777-200ER':
        case 'B787-10':
        case 'B787-9':
        case 'B787-8':
        case 'B767':
        case 'MD11':
        case 'AN225':
        case 'A310':
        case 'A300':
        case 'A330-900':
        case 'A330-800':
        case 'A330-700':
            $grade = 'heavy';
            break;

        // Super aircraft
        case 'A380-800':
            $grade = 'super';
            break;

        // Middle aircraft
        case 'A321':
        case 'A321neo':
        case 'A320':
        case 'A320neo':
        case 'A319neo':
        case 'A319':
        case 'A318':
        case 'B737-10':
        case 'B737-10MAX':
        case 'B737-900':
        case 'B737-900MAX':
        case 'B737-800':
        case 'B737-700':
        case 'B737-600':
        case 'B737-500':
        case 'B737-400':
        case 'B737-300':
        case 'B737-200':
        case 'MD82':
            $grade = 'medium';
            break;

        // Default case if the aircraft type is not recognized
        default:
            $grade = 'unknown';
            break;
    }

    return $grade;
}

