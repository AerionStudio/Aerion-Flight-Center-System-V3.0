<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include "setting.php";

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $directory = './airports';
    $searchFilename = $_GET['icao'];
    $data = searchAndOutputJsonFile($directory, $searchFilename);
    $garde = $data['airport_grade'];
    $output_array = getaircraft($garde);
    http_response_code(200);
    echo json_encode(array('status' => '200', 'dara' => $output_array));

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

function getaircraft($aircraft)
{
    $aircraftData = [
        '4D' => ['B737-800', 'A320', 'B767', 'MD11', 'A310', 'A300', 'B757', 'A321', 'A321neo', 'A320', 'A320neo', 'A319neo', 'A319', 'A318',
            'B737-10', 'B737-10MAX', 'B737-900', 'B737-700'
        ],
        '4E' => [
            'B737-800', 'A320', 'B747-400', 'B747-200', 'A330-300', 'A330-200', 'A340-600', 'A340-300',
            'A350-1000', 'A350-900', 'B777-300ER', 'B777-200ER', 'B787-10', 'B787-9',
            'B787-8', 'B767', 'MD11', 'A310', 'A300', 'B757',
            'A321', 'A321neo', 'A320neo', 'A319neo', 'A319', 'A318',
            'B737-10', 'B737-10MAX', 'B737-900', 'B737-700','A330-900','A330-800','A330-800'
        ],
        '4F' => [
            'B737-800', 'A320', 'B747-8', 'B747-400', 'B747-200', 'A330-300', 'A330-200', 'A340-600',
            'A340-300', 'A350-1000', 'A350-900', 'B777-300ER', 'B777-200ER', 'B787-10',
            'B787-9', 'B787-8', 'B767', 'MD11', 'AN225', 'A310', 'A300', 'B757', 'A380-800', 'A321', 'A321neo', 'A320neo', 'A319neo', 'A319', 'A318',
            'B737-10', 'B737-10MAX', 'B737-900', 'B737-700','A330-900','A330-800','A330-800'

        ]
    ];
    switch ($aircraft) {
        case  '4D';
            return $aircraftData['4D'];
        case  '4E';
            return $aircraftData['4E'];
        case  '4F';
            return $aircraftData['4F'];
    }

}