<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");



if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $jsonData = file_get_contents('./coord.json');
    $dataArray = json_decode($jsonData, true);
    $searchedValue = $_GET['atc_id']; // Value to search for
    $foundItems = [];

    foreach ($dataArray as $item) {
        if ($item['name'] === $searchedValue) {
            $foundItems[] = $item['coord'];
        }
    }

    if (!empty($foundItems)) {
        http_response_code(200);
        echo json_encode(array('status' => '200', 'data' => $foundItems));
    } else {
        http_response_code(200); // Not Found
        echo json_encode(array('status' => '404', 'error' => 'Not Found'));
    }

} else {
    http_response_code(405);
    echo json_encode(array('status' => '405', 'error' => 'Method Not Allowed'));
}

