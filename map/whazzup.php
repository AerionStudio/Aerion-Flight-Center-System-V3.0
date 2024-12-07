<?php
// 获取远程JSON文件内容
$jsonUrl = 'http://117.24.6.131:6067/whazzup.json';
$jsonData = file_get_contents($jsonUrl);

// 输出JSON内容
echo $jsonData;
?>
