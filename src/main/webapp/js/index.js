$(function() {
    $(window).load(function() {
        $('.load').delay(800).fadeOut(100);
        $('.kalada').delay(800).fadeIn(400);
        // 获取设备高度
        let clientH = document.documentElement.clientHeight;
        document.querySelector(".sub").style.height = clientH;
        $('.sub').css("height", clientH);
        
    });
    $('#sub').click(() => {
        let clientW = document.documentElement.clientWidth;
        if ($('#user').val() != '' && $('#password').val() != '') {
            $.ajax({
                type: "POST",
                url: "/users/login",
                data: {
                    name: $('#user').val(),
                    password: md5($('#password').val())
                },
                success(res) {
                    console.log(res)
                    if (res.code == 10041) {
                        warn(res.massage);
                        window.location.href = "/control.html";
                        if (clientW > 600) { window.location.href = "/Admin.html";}
                    } else {
                        warn(res.massage);
                        setTimeout(() => {
                            conf("请问是否跳转到注册页面", () => {
                                window.location.href = "/register.html";
                            });
                        }, 1000);
                    }
                }
            });
        }
    });
});