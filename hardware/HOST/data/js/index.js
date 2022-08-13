$(window).load(function() {
    $('.load').delay(800).fadeOut(100);
    $('.kalada').delay(800).fadeIn(400);
});

$(function() {
    var clientH = document.documentElement.clientHeight;
    console.log(clientH)
    $('.sub').css("height",clientH);

    var res = '{"user":[{"id":"1","name":"L","password":"e10adc3949ba59abbe56e057f20f883e","state":true},{"id":"2","name":"ceshi","password":"c33367701511b4f6020ec61ded352059","state":false}]}';
    var shuzu = JSON.parse(res);
    console.log(shuzu)
    // console.log(shuzu.user)
    // console.log(shuzu.user[0])

    $('#sub').click(() => {
        shuzu.user.forEach((o, i) => {
            if (o.name == $('#user').val() && o.password == md5($('#password').val())) {
                console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyy")
                console.log("欢迎你" + o.name)
                o.state = true;
                console.log(JSON.stringify(shuzu))
                window.location.href = './control.html?current_user=' + md5(o.name);

            }
        });
        if ($('#user').val() != '' && $('#password').val() != '') {
            $.ajax({
                type: 'GET',
                url: "userver",
                data: {
                    json: 1,
                },
                success(res) {
                    console.log(res);
                    var shuzu = JSON.parse(res);
                    shuzu.user.forEach((o) => {
                        if (o.name == $('#user').val() && o.password == md5($('#password').val()) && o.state == false) {
                            console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyy")
                            console.log("欢迎你" + o.name)

                            o.state = true;
                            console.log(JSON.stringify(shuzu))

                            $.ajax({
                                type: 'GET',
                                url: "userver",
                                data: {
                                    json: JSON.stringify(shuzu),
                                },
                                success(res) {
                                    console.log(res)
                                    window.location.href = './control.html?current_user=' + o.name;

                                }
                            });
                        }
                    });
                }
            });
        }
    });

    if ($('#user').val() == 'lxl' && md5($('#password').val()) == 'e10adc3949ba59abbe56e057f20f883e') {
        window.location.href = './control.html';
        // console.log(md5($('#password').val()))

    }
});