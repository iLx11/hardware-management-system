$(function() {
    $(window).load(function() {
        $('.load').delay(800).fadeOut(100);
        $('.kalada').delay(800).fadeIn(400);
        // 获取设备高度
        var clientH = document.documentElement.clientHeight;
        $('.sub').css("height", clientH);
    });

    $('#user').on("blur", () => {
        $.ajax({
            type: "POST",
            url: "/user/userVerify",
            data: {
                name: $('#user').val(),
            },
            success(res) {
                console.log(res)
                if (res == "Exist") {
                    warn("抱歉，该用户名已被占用");
                } else {
                    warn("该用户名可用");
                }
            }
        });
    });
    $('#sub').on("click", () => {
        if ($('#user').val() != '' && $('#password').val() != '') {
            $.ajax({
                type: "POST",
                url: "/user/userVerify",
                data: {
                    name: $('#user').val(),
                },
                success(res) {
                    if (res != "Exist") {
                        $.ajax({
                            type: "POST",
                            url: "/user/addUser",
                            data: {
                                name: $('#user').val(),
                                password: md5($('#password').val())
                            },
                            success(res) {
                                if (res == "Successful") {
                                    window.location.href = "/index.html";
                                }
                            }
                        });
                    } else {
                        warn("抱歉，该用户名已被占用");
                    }

                }
            });
        }
    });
});