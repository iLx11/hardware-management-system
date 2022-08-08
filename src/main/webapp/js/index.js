$(function() {
    $(window).load(function() {
        $('.load').delay(800).fadeOut(100);
        $('.kalada').delay(800).fadeIn(400);
    });
    // 获取设备高度
    var clientH = document.documentElement.clientHeight;
    console.log(clientH)
    $('.sub').css("height", clientH);

    var res = '{"user":[{"id":"1","name":"L","password":"e10adc3949ba59abbe56e057f20f883e","state":true},{"id":"2","name":"ceshi","password":"c33367701511b4f6020ec61ded352059","state":false}]}';
    var shuzu = JSON.parse(res);
    // $.ajax({
    //     type: "POST",
    //     url: "http://localhost/user/userVerify",
    //     success(res) {
    //         if (res == "Successful") {
    //             alert("验证成功");
    //             window.location.href = "http://localhost/control.html";
    //         }
    //     }
    // });
    $('#sub').click(() => {
        if ($('#user').val() != '' && $('#password').val() != '') {
            $.ajax({
                type: "POST",
                url: "http://localhost/user/userVerify",
                data: {
                    name: $('#user').val(),
                    password: md5($('#password').val())
                },
                success(res) {
                    console.log(res)
                    if (res == "Successful") {
                        alert("验证成功");
                        window.location.href = "http://localhost/control.html";
                    } else {
                        alert("验证失败");
                    }
                }
            });
        }
    });
});