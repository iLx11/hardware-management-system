$(function() {
    $(window).load(function() {
        $('.load').delay(800).fadeOut(100);
        $('.kalada').delay(800).fadeIn(400);
        // 获取设备高度
        var clientH = document.documentElement.clientHeight;
        document.querySelector(".sub").style.height = clientH;
        $('.sub').css("height", clientH);
    });
    $('#sub').click(() => {
        if ($('#user').val() != '' && $('#password').val() != '') {
            $.ajax({
                type: "POST",
                url: "/user/userVerify",
                data: {
                    name: $('#user').val(),
                    password: md5($('#password').val())
                },
                success(res) {
                    console.log(res)
                    if (res == "Successful") {
                        warn("验证成功");
                        window.location.href = "/control.html?user=" + $('#user').val();
                    } else {
                        warn("验证失败");
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