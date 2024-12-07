const url = '../server/GetEvents.php';
const xhr = new XMLHttpRequest();
xhr.open('POST', url, true);
xhr.setRequestHeader('Content-Type', 'application/json');

xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            var cards = '';
            for (var i = 0; i < response.length; i++) {
              cards += `<a href="#" onclick="openmodal('${response[i].time}')">`;
                cards += ' <div class="layui-timeline-item" >';
                cards += '<i class="layui-icon layui-timeline-axis"></i>';
                cards += ' <div class="layui-timeline-content layui-text">';
                cards += ' <h3 class="layui-timeline-title">[ ' + response[i].time + ' ] ' + response[i].dep_icao + ' ~ ' + response[i].app_icao + ' / ' + response[i].dep + '~' + response[i].app;
                switch (response[i].state) {
                    case '1':
                        cards += ' <span class="badge text-bg-success">报名中</span></h3>';
                        break;
                    case '2':
                        cards += ' <span class="badge text-bg-primary">正在进行</span></h3>';
                        break;
                    case '3':
                        cards += ' <span class="badge text-bg-warning">已结束</span></h3>';
                        break;
                    case '4':
                        cards += ' <span class="badge text-bg-danger">取消</span></h3>';
                        break;
                }
                cards += '</div>'; // corrected line
                cards += '</div></a>'; // corrected line
            }

            document.getElementById('time').innerHTML = cards;

            console.log(response);
        } else {
            console.error('There was an error with the request:', xhr.status);
        }
    }
};

xhr.onerror = function () {
    console.error('There was an error with the request');
};

xhr.send();

function openmodal(id) {
    console.log(id);
    layer.open({
        type: 1, // page 层类型
        area: ['1200px', '600px'],
        title: '活动报名'+id,
        shade: 0.6, // 遮罩透明度
        shadeClose: true, // 点击遮罩区域，关闭弹层
        maxmin: true, // 允许全屏最小化
        anim: 0, // 0-6 的动画形式，-1 不开启
        content: `<iframe src="../../activity/detailed.html?id=${id}" frameborder="0"></iframe>`
    });
}