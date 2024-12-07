document.addEventListener('DOMContentLoaded', function () {
    if (!((sessionStorage.getItem('user_num') !== null) && (sessionStorage.getItem('user_grade') !== null))) {
        window.location.href = 'https://imp.xfex.cc/login.html';
    }

    document.onkeydown = function (event) {
        if (event.keyCode === 123) { // F12键
            return false;
        } else if (event.ctrlKey && event.shiftKey && event.keyCode === 73) { // Ctrl+Shift+I
            return false;
        }
    };
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });
});