<?php
header("Content-Type: application/json");

// 检查请求的来源
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// 允许特定域名跨域访问
$allowed_origins = ['http://localhost:5173', 'https://v4.ariven.cn', 'https://imp.skydreamclub.cn', 'http://imp.skydreamclub.cn'];

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Credentials: true");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        // Handle preflight request
        header('HTTP/1.1 200 OK');
        exit();
    }
} else {
    // If origin is not allowed, return a 403 Forbidden response
    http_response_code(403);
    echo json_encode(array('status' => '403', 'code' => '不允许的来源'));
    exit();
}

// 如果是OPTIONS请求（预检请求），直接返回200 OK
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "setting.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $postData = file_get_contents("php://input");
    $data = json_decode($postData, true);

    // Check if all required parameters are present
    $requiredParams = ['callsign', 'teacher', 'remark', 'gradelist'];
    foreach ($requiredParams as $param) {
        if (!isset($data[$param])) {
            http_response_code(300);
            echo json_encode(array('status' => '300', 'code' => 'Missing required values'));
            exit;
        }
    }

    $token = hash('sha256', $data['token']);
    if ($token !== $token_Correct) {
        http_response_code(505);
        echo json_encode(array('status' => '505', 'code' => 'Invalid token'));
        exit;
    }

    $callsign = $data['callsign'];

    // Check if callsign exists
    $sqlCheck = $conn->prepare("SELECT COUNT(*) FROM atcdisplay WHERE callsign=?");
    $sqlCheck->bind_param("s", $callsign);
    $sqlCheck->execute();
    $sqlCheck->bind_result($count);
    $sqlCheck->fetch();
    $sqlCheck->close();

    if ($count > 0) {
        // Perform update
        $updateColumns = [];
        $bindParams = [];
        $bindTypes = "";

        foreach ($requiredParams as $param) {
            if (isset($data[$param])) {
                $updateColumns[] = "$param=?";
                $bindParams[] = &$data[$param];
                $bindTypes .= 's';
            }
        }
        $bindParams[] = &$data['callsign']; // Add callsign as the last parameter
        $bindTypes .= 's';

        $sqlQuery = "UPDATE atcdisplay SET " . implode(', ', $updateColumns) . " WHERE callsign=?";
    } else {
        // Perform insert
        $insertColumns = [];
        $placeholders = [];
        $bindParams = [];
        $bindTypes = "";

        foreach ($requiredParams as $param) {
            if (isset($data[$param])) {
                $insertColumns[] = $param;
                $placeholders[] = "?";
                $bindParams[] = &$data[$param];
                $bindTypes .= 's';
            }
        }

        $sqlQuery = "INSERT INTO atcdisplay (" . implode(', ', $insertColumns) . ") VALUES (" . implode(', ', $placeholders) . ")";
    }

    // Prepare and execute SQL statement
    $sqlFlight = $conn->prepare($sqlQuery);
    if ($sqlFlight) {
        $bindParams = array_merge([$bindTypes], $bindParams);
        call_user_func_array(array($sqlFlight, 'bind_param'), $bindParams);
        $sqlFlight->execute();

        if ($sqlFlight->affected_rows > 0) {
            http_response_code(200);
            echo json_encode(array('status' => '200', 'data' => $data));
            exit;
        } else {
            http_response_code(404);
            echo json_encode(array('status' => '404', 'code' => 'No rows affected'));
            exit;
        }
    } else {
        http_response_code(500);
        echo json_encode(array('status' => '500', 'code' => 'Internal server error'));
        exit;
    }
} else {
    http_response_code(500);
    echo json_encode(array('status' => '500', 'code' => 'Invalid request method'));
    exit;
}
?>
