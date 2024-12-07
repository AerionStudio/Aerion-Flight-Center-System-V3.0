<?php

// 待获取 JSON 数据的 URL
$url = "https://vamsys.io/statistics/v2/map/96b29035-8200-4eb4-be80-7fd9fff745be";

// 指定要保存 JSON 数据的文件路径
$filePath = "vawhazzup.json";

// 无限循环
while (true) {
    // 获取 JSON 数据
    $json = file_get_contents($url);
    
    // 将 JSON 数据写入文件
    file_put_contents($filePath, $json);
    
    // 等待 1 秒
    sleep(1);
}

?>
