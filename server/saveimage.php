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

// 确保请求是 POST 请求
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(array('message' => 'Method Not Allowed'));
    exit;
}

// 确保上传的文件存在并且没有错误
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400); // Bad Request
    echo json_encode(array('message' => 'No file uploaded or upload error occurred'));
    exit;
}


// 上传目录
$uploadDirectory = './posters/';

// 如果目录不存在，则创建目录
if (!is_dir($uploadDirectory)) {
    mkdir($uploadDirectory, 0777, true);
}

// 生成文件名
$fileName =  $_FILES['file']['name']; // 使用时间作为文件名前缀
$filePath = $uploadDirectory . $fileName;

// 移动上传的文件到目标路径
if (move_uploaded_file($_FILES['file']['tmp_name'], $filePath)) {
    // 文件保存成功
    echo json_encode(array('message' => 'File uploaded successfully', 'file' => $fileName));
} else {
    // 文件保存失败
    http_response_code(500); // Internal Server Error
    echo json_encode(array('message' => 'Failed to upload file'));
}
