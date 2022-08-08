//当前用户获取，并提示
$(function() {
    $(window).load(function() {
        $('.load').delay(500).fadeOut(200);
        $('.constructor').delay(700).fadeIn(800);
        $('.bottom_nav').delay(700).fadeIn(800);
        $('.doorPassword').delay(700).fadeIn(800);
        // $('.kalada_c').fadeOut(10);
        // $('.kalada_m_m').fadeOut(10);
        // $('.kalada_m_c').fadeOut(10);
        // 兼容safari
        // if ((/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent))) {
        //     $('.C_t').css("background", "rgba(226, 225, 223, 0.87)");
        // }   
    });
    // var kk = 30;
    // if (kk > 15) {
    //     $('.headData').fadeOut(10);
    //     $('.auto_temp').fadeIn(10);
    //     // setTimeout(() => {
    //     //     console.log('nininininiin')
    //     //     $('.headData').fadeIn(10);
    //     //     $('.auto_temp').fadeOut(10);
    //     // }, 3000);
    // }

    //温湿度数据获取
    $('.content_data').on('click', () => {
        console.log('-----------hum------------------')
        // var res = "12.00|23.00";
        // $('#tem').html(res.split("|")[1].replaceAll(0, "").replaceAll(".", ""));
        // $('#hum').html(res.split("|")[0].replaceAll(0, "").replaceAll(".", ""));
        $.ajax({
            type: 'GET',
            url: 'humAndTem',
            dataType: 'jsonp',
            data: {
                data_trs: 1,
            },
            success(res) {
                console.log(res)
                $('#tem').html(res.split("|")[1].replaceAll(".00", ""));
                $('#hum').html(res.split("|")[0].replaceAll(".00", ""));
                if (res.split("|")[1].replaceAll(".00", "") > 15) {
                    $('.headData').fadeOut(10);
                    $('.auto_temp').fadeIn(10);
                    setTimeout(() => {
                        console.log('nininininiin')
                        $('.headData').fadeIn(10);
                        $('.auto_temp').fadeOut(10);
                    }, 5000);
                }
                if (res.split("|")[0].replaceAll(".00", "") < 5) {
                    $('.headData').fadeOut(10);
                    $('.auto_wet').fadeIn(10);
                    setTimeout(() => {
                        console.log('nininininiin')
                        $('.headData').fadeIn(10);
                        $('.auto_wet').fadeOut(10);
                    }, 5000);
                }
            }
        })

    })
    $('.temp_left').on('click', () => {
        $('.fan_o').click();
    })
    $('.temp_right').on('click', () => {
        $('.fan_c').click();
    })
    $('.wet_left').on('click', () => {
        $('.wet_o').click();
    })
    $('.wet_right').on('click', () => {
        $('.wet_c').click();
    })
    var c_user = '';
    var shu = { "user": [{ "id": "1", "name": "L", "password": "e10adc3949ba59abbe56e057f20f883e", "state": false, "mana": true }, { "id": "2", "name": "ceshi", "password": "c33367701511b4f6020ec61ded352059", "state": false, "mana": false }, { "id": "3", "name": "ceshi2", "password": "c33367701511b4f6020ec61ded352059", "state": false, "mana": false }] };
    var current_user = getUrlQueryString('current_user');
    // shu.user.forEach((o) => {
    //     if (md5(o.name) == current_user) {
    //         alert('欢迎您的登录' + o.name);
    //         $('.ch_n').html(o.name);
    //         c_user = o.name;
    //         if (o.mana != true) {
    //             $('.kalada_m_c').fadeOut(10);
    //             $('#icon_mana').fadeOut(10);
    //         }
    //     }
    // })

    //检测跳转页面传回来的参数
    function getUrlQueryString(names, urls) {
        urls = urls || window.location.href;
        urls && urls.indexOf("?") > -1 ? urls = urls
            .substring(urls.indexOf("?") + 1) : "";
        var reg = new RegExp("(^|&)" + names + "=([^&]*)(&|$)", "i");
        var r = urls ? urls.match(reg) : window.location.search.substr(1)
            .match(reg);
        if (r != null && r[2] != "")
            return unescape(r[2]);
        return null;
    }

    // 页面跳转
    // ss = 1;
    // if(ss == 1){window.location.href='http://www.baidu.com';}
    var ind = document.getElementsByClassName('indicator');
    var inp = document.getElementsByClassName('analogInp');


    // var 
    var mqtt_state = 0;
    var mqtt_address = '';

    var options = {
        //mqtt客户端的id
        // clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
        clientId: '75ee4e39450943889749e9924e3a982c',
        // connectTimeout: 3,
    }
    //wss://bemfa.com:9504/wss
    var mqttClient = '';
    // MQTT服务器地址输入
    $('#mqt').blur(() => {
        console.log('sdf')
        if ($('#mqt').val() == '') {
            return;
        } else {
            mqtt_address = $('#mqt').val();
            console.log(mqtt_address)
            var client = mqtt.connect(mqtt_address, options)
            client.on('connect', () => {
                console.log("connect success!")
                //订阅主题 presence
                mqtt_state = 1;
                $('#mqtt_sit').html('connected')
                mqttClient = client;
                console.log(mqttClient)

            })
            client.on('error', function(err) {
                console.log(err)
                $('#mqtt_sit').html('failed to connected');
                client.end();
            })
        }
    });
    var cc = 1;

    // 发送数据到硬件实现控制
    class control {
        constructor(o, f, d, h, s) {
            this.s = s;
            this.h = h;

            $(o).click(() => {
                console.log(this.h)
                this.sendData('on');

                if (mqtt_state != 0) { this.mqtt(3); } $(o).parents('.ct').find('.state').html("Open");
            })
            $(f).click(() => {

                this.sendData('off')
                $(o).parents('.ct').find('.state').html("Close");
            })
            $(d).click(() => {
                cc = !cc;
                this.analog(o, s);
            })
        }
        // ajax向硬件发送信息
        sendData(content) {
            $.ajax({
                type: 'GET',
                url: this.h,
                data: {
                    handle: content,
                },
                success(res) {
                    console.log(res)
                }
            });
        }
        // 模拟引脚设置
        analog(xx, ss) {
            if (cc == 1) {
                $(xx).parents('.ct').nextAll('.bar').fadeIn(200);
                var cAnalog = [];
                var x = 0;
                var time = setInterval(() => {
                    cAnalog[x] = inp[ss].value;
                    if (cAnalog[0] != cAnalog[1]) {
                        ind[ss].style.marginLeft = inp[ss].value + '%';
                        ind[ss].textContent = inp[ss].value + '%';
                        this.sendData(inp[ss].value);
                        console.log(cAnalog);
                        x++;
                    }
                    if (x > 1) x = 0;
                }, 100)
            } else {
                $(xx).parents('.ct').nextAll('.bar').fadeOut(200);
            }
        }
        // MQTT订阅与发布控制
        mqtt(message) {
            client.on('connect', () => {
                console.log("connect success!")
                //订阅主题 presence
                client.subscribe('control', (err) => {
                    if (!err) {
                        console.log("subscribe success!")
                        //发布主题presence,消息内容为Hello mqtt
                        client.publish('presence', message)
                    } else {
                        //打印错误
                        console.log(err)
                        console.log('mqtt连接错误')
                    }
                })
            })
            //如果连接错误，打印错误
            client.on('error', function(err) {
                console.log(err)
                client.end()
            })
        }
    }
    var led_control = new control('.led_on', '.led_off', '.led_analog', 'ledHandle', 0);
    var win_control = new control('.wind_on', '.wind_off', '.wind_analog', 'winHandle', 1);
    var door_control = new control('.door_o', '.door_c', 0, 'doorHandle');
    var fan_control = new control('.fan_o', '.fan_c', 0, 'fanHandle');
    var wet_control = new control('.wet_o', '.wet_c', 0, 'wetHandle');
    var curtain_control = new control('.curtain_o', '.curtain_c', 0, 'curtainHandle');

    // 页面内容跳转与更改
    class change {
        constructor(a, b, c, d, e) {
            this.e = e;
            var page = ['.kalada_c', '.kalada_m_m', '.kalada_m_c', '.kalada_user'];

            $(a).click(() => {
                this.bottom_n("4%", 'control');
                this.fade(page, 0);
            })
            $(b).click(() => {
                this.bottom_n("29%", 'Mqtt_m');
                this.fade(page, 1);

            })
            $(c).click(() => {
                this.bottom_n("54%", 'Mana_c');
                this.fade(page, 2);

            })
            $(d).click(() => {
                this.bottom_n("79%", 'user');
                this.fade(page, 3);

            })

        }
        fade(page, x) {
            $(page[x]).fadeIn(10);
            let shuzu = page.filter((o, i) => { return i != x; })
            for (let i in shuzu) {
                $(shuzu[i]).fadeOut(10);
            }
            document.documentElement.scrollTop = 0;
        }
        bottom_n(o, i) {
            $(this.e).stop().animate({ left: o }, 360);
            $(this.e).find('p').html(i);
        }
    }
    new change('#icon_control', '#icon_mqtt', '#icon_mana', '#icon_user', '.move_cube');

    // mqtt消息测试
    class mqttBox {
        constructor(a, b, c, d, e, f) {
            $(a).click(() => {
                let topic = $(b).val();
                let content = $(c).val();
                if (topic.replaceAll(' ', '') != '' && content.replaceAll(' ', '') != '') {
                    mqttClient.publish(topic, content);
                }
            })
            $(e).click(() => {
                let topic = $(d).val();
                if (topic.replaceAll(' ', '') != '') {
                    mqttClient.subscribe('ceshi', function(err) {
                        if (!err) {
                            console.log("subscribe success!")
                            mqttClient.on('message', function(topic, message) {
                                // message is Buffer,此处就是打印消息的具体内容
                                $('.mqtt_mes').prepend('receive-> ' + message.toString() + '---from->' + topic + '<br>');
                            })
                        }
                    })
                }
            })
            $(f).click(() => {
                let topic = $(d).val();
                if (topic.replaceAll(' ', '') != '') {
                    mqttClient.unsubscribe(topic, (err) => {
                        if (!err) {
                            console.log('unsubscribe success')
                        }
                    })
                }
            })
        }
    }
    new mqttBox('.mqtt_send', '#pub_topic', '#pub_content', '#sub_topic', '#sub_t', '#unsub_t');

    //用户列表操作
    class userList {
        constructor() {
            // 测试区域开始-----------------------------
            // var userStr = template('user_tep', shu);
            // $('#user_list').html(userStr);

            // var shuzu = shu;
            // this.shuzu;
            // console.log(shuzu);
            // this.ceshi2();
            // console.log(this.shuzu);
            // this.ceshi();

            // 测试区域结束-----------------------------
            this.shuzu;
            this.getData();



        }
        ceshi2() {
            this.shuzu = 123;
        }
        ceshi() {
            console.log(this.shuzu);
        }
        getElement() {
            this.li = document.querySelectorAll('.user_l');
            this.udel = document.getElementsByClassName('user_del');
            this.umana = document.getElementsByClassName('user_mana');
            this.ul = document.querySelector('ul');
        }
        getData() {
            var that = this;
            console.log('---------------get----------------')
            $.ajax({
                type: "GET",
                url: "http://localhost/user/selectAll",
                data: {
                    json: 1,
                },
                success(res) {
                    console.log(res)
                    this.shuzu = JSON.parse(res);
                    var userStr = template('user_tep', this.shuzu);
                    $('#user_list').html(userStr);
                    // console.log('-----------res-----------')
                    // if (x == 1) {
                    //     this.shuzu = JSON.parse(res);
                    //     var userStr = template('user_tep', this.shuzu);
                    //     that.shuzu = this.shuzu;
                    //     console.log(that.shuzu)
                    //     $('#user_list').html(userStr);

                    //     that.getElement(that);
                    //     that.delUser(that);
                    //     that.changeMana(that);
                    //     console.log('---------yyyyyyyyy-----------')
                    // } else {
                    //     console.log(res)
                    // }

                }
            })
        }
        delUser(that) {
            for (let i = 0; i < this.li.length; i++) {

                this.udel[i].onclick = function() {

                    if (confirm('您确定要删除此用户吗')) {
                        console.log(that.shuzu)
                        that.shuzu.user = that.shuzu.user.filter((o, x) => { return x != i });
                        that.ul.removeChild(that.li[i])
                        that.li = document.querySelectorAll('li');
                        for (let i = 0; i < that.li.length; i++) {
                            that.shuzu.user[0].id = i + 1;
                            console.log(that.shuzu)
                        }
                        console.log(that.li)
                    }
                    that.getData(JSON.stringify(that.shuzu));
                }

            }
        }
        changeMana(that) {
            for (let i = 0; i < this.li.length; i++) {
                this.umana[i].onclick = function() {
                    console.log(that.umana[i])
                    if (confirm('您确定要更改此用户管理员身份吗')) {
                        that.shuzu.user[i].mana = !that.shuzu.user[i].mana;
                        console.log(that.shuzu)
                        console.log('---------success----------')
                    }
                    that.getData(JSON.stringify(that.shuzu));
                }
            }
        }
    }
    new userList();

    //用户界面操作
    class user {
        constructor() {
            this.shuzu;
            // this.getData(1);
            this.c_name = c_user;
            console.log('userrrrrrrrrrrrrrrrrrrrrrrrrrrr')
            //更改用户名
            $('.change_n').click(() => {
                this.userChange();
                $('#change_put').blur(() => {
                    $('.glass_cover').fadeOut(10);
                    $('#change_put').fadeOut(10);
                    $('.bottom_nav').fadeIn(10);
                    if ($('#change_put').val() != "") {
                        this.getData(1, "name", $('#change_put').val());
                        console.log($('#change_put').val());
                    }
                    $('#change_put').val("");
                })
            });
            //更改密码
            $('.change_p').click(() => {
                this.userChange();
                $('#change_put').blur(() => {
                    $('.glass_cover').fadeOut(10);
                    $('#change_put').fadeOut(10);
                    $('.bottom_nav').fadeIn(10);
                    if ($('#change_put').val() != "") {
                        this.getData(1, "passw", $('#change_put').val());
                        console.log($('#change_put').val());
                    }
                    $('#change_put').val("");
                })


            });

            $('.exit').click(() => {
                if (confirm('请问您真的想要退出吗')) {
                    this.getData(1, "passw", $('#change_put').val());
                    window.location.href = './index.html';
                }
            })

        }
        change() {

        }

        userChange() {
            $('.glass_cover').fadeIn(10);
            $('#change_put').fadeIn(10);
            $('.bottom_nav').fadeOut(10);

        }
        getData(x, l, c) {
            var that = this;
            console.log('---------------get----------------')
            $.ajax({
                type: 'GET',
                url: 'userver',
                data: {
                    json: x,
                },
                success(res) {
                    console.log(res)
                    console.log('-----------res-----------')
                    if (x == 1) {
                        that.shuzu = JSON.parse(res);
                        if (l != 0) {
                            that.shuzu.user.forEach((o, i) => {
                                if (that.c_name == o.name) {
                                    if (l == "name") {
                                        that.shuzu.user[i].name = c;
                                        console.log('success_______')
                                        that.getData(JSON.stringify(that.shuzu));
                                    }
                                    if (l == "passw") {
                                        that.shuzu.user[i].password = md5(c);
                                        console.log('success_______')

                                        that.getData(JSON.stringify(that.shuzu));

                                    }
                                }
                            });
                        }


                    } else {

                        console.log(res)
                    }

                }
            });


        }
    }

    new user();
});