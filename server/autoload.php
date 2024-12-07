<?php

$servername = "localhost";
$username = "imp_xfex_cc";
$password = "34M3aePXSKYSS3Bi";
$dbname = "imp_xfex_cc";
$conn = new mysqli($servername, $username, $password, $dbname);



$jsonUrl = 'http://117.24.6.131:6067/whazzup.json';
$jsonData = file_get_contents($jsonUrl);
$data = json_decode($jsonData, true);

foreach ($data['pilot'] as $pilot) {
    $cid = $pilot['cid'];
    $callsign = $pilot['callsign'];
    $last_updated = $pilot['last_updated'];
    $departure = $pilot['flight_plan']['departure'];
    $arrival = $pilot['flight_plan']['arrival'];
    $aircraft = $pilot['flight_plan']['aircraft'];
    $route = $pilot['flight_plan']['route'];
    $heading = $pilot['heading'];
    $groundspeed = $pilot['groundspeed'];
    $transponder = $pilot['transponder'];
    $altitude = $pilot['altitude'];
    $longitude = $pilot['longitude'];
    $latitude = $pilot['latitude'];
    $time = $pilot['logon_time'];

    // 更新history表
    $sql = "SELECT * FROM history WHERE cid = '$cid' AND time = '$time'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // 表示用户已经连接，更新history表
        $onlineTime = strtotime($time); // 将时间转换为时间戳
        $offlineTime = time() + 28800; // 获取当前时间戳
        $onlineDuration = $offlineTime - $onlineTime;
        $sql = "UPDATE history SET online_time = '$onlineDuration' WHERE cid = '$cid' AND time = '$time'";
        if ($conn->query($sql) === TRUE) {
            echo "记录更新成功";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }

        // Update the online table with comma-separated data
        $sqlSelect = "SELECT * FROM online WHERE cid = '$cid' AND time = '$time'";
        $resultSelect = $conn->query($sqlSelect);

        if ($resultSelect->num_rows > 0) {
            $row = $resultSelect->fetch_assoc();
            $existingLat = $row['lat'];
            $existingLot = $row['lon'];
            $existingAltitude = $row['altitude'];
            $existingGroundspeed = $row['groundspeed'];
            $existingFlightTimeOnline = $row['flighttimeonline'];
            // Concatenate existing and new data with commas
            $newLat = $existingLat . ',' . $latitude;
            $newLot = $existingLot . ',' . $longitude;
            $newAltitude = $existingAltitude . ',' . $altitude;
            $newGroundspeed = $existingGroundspeed . ',' . $groundspeed;
            $newFlightTimeOnline = $existingFlightTimeOnline . ',' . $last_updated;
            // Update the record with the concatenated data
            $sqlUpdate = "UPDATE online SET lat = '$newLat', lon = '$newLot', altitude = '$newAltitude', groundspeed = '$newGroundspeed',flighttimeonline='$newFlightTimeOnline' WHERE cid = '$cid' AND time = '$time'";
            if ($conn->query($sqlUpdate) === TRUE) {
                echo "123";
            } else {
                echo "Error: " . $sqlUpdate . "<br>" . $conn->error;
            }
        } else {
            $sql = "INSERT INTO online (cid, lat, lon, time, groundspeed, altitude,flighttimeonline) VALUES ('$cid', '0', '0', '$time', '0', '0', '0')";
            if ($conn->query($sql) === TRUE) {
                echo "新记录插入成功";
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }
        }
    } else {
        // 表示用户刚刚连接，插入新记录到history表
        if (isset($departure)) {
            $onlineTime = strtotime($time); // 将时间转换为时间戳
            $offlineTime = time() + 28800; // 获取当前时间戳
            $onlineDuration = $offlineTime - $onlineTime;
            $sql = "INSERT INTO history (client_name, depairport, destairport, aircraft, cid, time, online_time) VALUES ('$callsign', '$departure', '$arrival', '$aircraft', '$cid', '$time', '$onlineDuration')";
            if ($conn->query($sql) === TRUE) {
                echo "新记录插入成功";
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }

            // Insert new record into the online table
            $sql = "INSERT INTO online (cid, lat, lon, time, groundspeed, altitude,flighttimeonline) VALUES ('$cid', '0', '0', '$time', '0', '0', '0')";
            if ($conn->query($sql) === TRUE) {
                echo "新记录插入成功";
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }
        }
    }
}

foreach ($data['controllers'] as $atc) {
    $cid = $atc['cid'];
    $callsign = $atc['callsign'];
    $frequency = $atc['frequency'];
    $time = $atc['logon_time'];

    // 更新history表
    $sql = "SELECT * FROM history_atc WHERE cid = '$cid' AND logon_time = '$time'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // 表示用户已经连接，更新history表
        $onlineTime = strtotime($time); // 将时间转换为时间戳
        $offlineTime = time() + 28800; // 获取当前时间戳
        $onlineDuration = $offlineTime - $onlineTime;

        // Update the history_atc table
        $sql = "UPDATE history_atc SET online_time = '$onlineDuration', frequency='$frequency' WHERE cid = '$cid' AND logon_time = '$time'";
        if ($conn->query($sql) === TRUE) {
            echo "记录更新成功";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }

        // Update the online table with comma-separated frequency
        $sqlSelect = "SELECT * FROM online WHERE cid = '$cid' AND time = '$time'";
        $resultSelect = $conn->query($sqlSelect);

        if ($resultSelect->num_rows > 0) {
            $row = $resultSelect->fetch_assoc();
            $existingFrequency = $row['frequency'];

            // Concatenate existing and new frequency with commas
            $newFrequency = $existingFrequency . ',' . $frequency;

            // Update the record with the concatenated frequency
            $sqlUpdate = "UPDATE online SET frequency = '$newFrequency' WHERE cid = '$cid' AND time = '$time'";
            if ($conn->query($sqlUpdate) === TRUE) {
                echo "记录更新成功";
            } else {
                echo "Error: " . $sqlUpdate . "<br>" . $conn->error;
            }
        }
    } else {
        // 表示用户刚刚连接，插入新记录到history_atc表
        if (isset($frequency)) {
            $onlineTime = strtotime($time); // 将时间转换为时间戳
            $offlineTime = time() + 28800; // 获取当前时间戳
            $onlineDuration = $offlineTime - $onlineTime;

            // Insert new record into history_atc table
            $sql = "INSERT INTO history_atc (cid, callsign, frequency, logon_time, online_time) VALUES ('$cid', '$callsign', '$frequency', '$time', '$onlineDuration')";
            if ($conn->query($sql) === TRUE) {
                echo "新记录插入成功";
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }

            // Insert new record into online table
            $sql = "INSERT INTO online (cid, frequency, time) VALUES ('$cid', '$frequency', '$time')";
            if ($conn->query($sql) === TRUE) {
                echo "新记录插入成功";
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }
        }
    }
}

$conn->close();
