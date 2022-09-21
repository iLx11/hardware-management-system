$(function() {
    $(window).load(function() {
        $('.load').delay(800).fadeOut(100);
        $('.kalada').delay(800).fadeIn(400);
        // 获取设备高度
        var clientH = document.documentElement.clientHeight;
        $('.sub').css("height", clientH);
    });

    $('#user').on("blur", () => {
        if ($('#user').val().trim() != '') {
            $.ajax({
                type: "GET",
                url: "/users/" + $('#user').val(),
                success(res) {
                    if (res.code == 10041) {
                        warn("抱歉，该用户名已被占用");
                    } else {
                        warn("该用户名可用");
                    }
                }
            });
        }else {
            warn("请输入内容");
        }
    });
    $('#sub').on("click", () => {
        if ($('#user').val().trim() != '' && $('#password').val().trim() != '') {
            $.ajax({
                type: "GET",
                url: "/users/" + $('#user').val(),
                success(res) {
                    if (res.code == 10040) {
                        $.ajax({
                            type: "POST",
                            url: "/users/register",
                            data: {
                                name: $('#user').val(),
                                password: md5($('#password').val())
                            },
                            success(res) {
                                if (res.code == 10011) {
                                    warn(res.massage)
                                    window.location.href = "/index.html";
                                }
                            }
                        });
                    } else if (res.code == 10041) {
                        warn("抱歉，该用户名已被占用");
                    }

                }
            });
        }else {
            warn("输入不能为空");
        }
    });
});