<?php
// GetPlatformData.php

// Setting CORS headers
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

// Your database connection settings and other required settings
require './setting.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

        $sql_user = "SELECT COUNT(*) as count_user FROM user";
        $result_user = $conn->query($sql_user);
        $count_user = ($result_user->num_rows > 0) ? $result_user->fetch_assoc()['count_user'] : 0;

        $sql_atc = "SELECT COUNT(*) as count_atc FROM user WHERE user_grade > '1'";
        $result_atc = $conn->query($sql_atc);
        $count_atc = ($result_atc->num_rows > 0) ? $result_atc->fetch_assoc()['count_atc'] : 0;

        $jsonData = file_get_contents($url_whazzup);
        $data = json_decode($jsonData, true);
        $online_user = count($data['pilot']);
        $online_atc = count($data['controllers']);
        $online_all = $online_atc + $online_user;

        // Creating an array with the data
        $output_data = array(
            "count_user" => $count_user,
            "count_atc" => $count_atc,
            "online_all" => $online_all
        );

        // Sending JSON response
        header('Content-Type: application/json');
        echo json_encode($output_data);

} else {
    http_response_code(405);
    header('Content-Type: application/json');
    echo json_encode(array('status' => '405', 'error' => 'Method Not Allowed'));
}
?>
