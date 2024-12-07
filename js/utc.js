function getUTCTime() {
    const now = new Date();
    const hours = now.getUTCHours().toString().padStart(2, '0'); // 获取小时（补零）
    const minutes = now.getUTCMinutes().toString().padStart(2, '0'); // 获取分钟（补零）
    const seconds = now.getUTCSeconds().toString().padStart(2, '0'); // 获取秒钟（补零）
    return `${hours}:${minutes}:${seconds}`; // 返回格式化的时间字符串
}

function updateUTCTime() {
    const utcElement = document.getElementById('utc-time');
    const utcTime = getUTCTime();
    utcElement.innerText = `UTC ${utcTime}`;
}

// 初始加载页面时显示时间
updateUTCTime();

// 每秒钟更新一次时间
setInterval(updateUTCTime, 1000);
