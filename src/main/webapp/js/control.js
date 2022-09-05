//当前用户获取，并提示
$(function() {
    $(window).load(function() {
        $('.load').delay(500).fadeOut(200);
        $('.constructor').delay(700).fadeIn(800);
        $('.bottom_nav').delay(700).fadeIn(800);
        $('.doorPassword').delay(700).fadeIn(800);
        // 兼容safari
        // if ((/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent))) {
        //     $('.C_t').css("background", "rgba(226, 225, 223, 0.87)");
        // }   
    });
    // //温湿度数据获取
    // $('.content_data').on('click', () => {
    //     console.log('-----------hum------------------')
    //     // var res = "12.00|23.00";
    //     // $('#tem').html(res.split("|")[1].replaceAll(0, "").replaceAll(".", ""));
    //     // $('#hum').html(res.split("|")[0].replaceAll(0, "").replaceAll(".", ""));
    //     $.ajax({
    //         type: 'GET',
    //         url: 'humAndTem',
    //         dataType: 'jsonp',
    //         data: {
    //             data_trs: 1,
    //         },
    //         success(res) {
    //             console.log(res)
    //             $('#tem').html(res.split("|")[1].replaceAll(".00", ""));
    //             $('#hum').html(res.split("|")[0].replaceAll(".00", ""));
    //             if (res.split("|")[1].replaceAll(".00", "") > 15) {
    //                 $('.headData').fadeOut(10);
    //                 $('.auto_temp').fadeIn(10);
    //                 setTimeout(() => {
    //                     console.log('nininininiin')
    //                     $('.headData').fadeIn(10);
    //                     $('.auto_temp').fadeOut(10);
    //                 }, 5000);
    //             }
    //             if (res.split("|")[0].replaceAll(".00", "") < 5) {
    //                 $('.headData').fadeOut(10);
    //                 $('.auto_wet').fadeIn(10);
    //                 setTimeout(() => {
    //                     console.log('nininininiin')
    //                     $('.headData').fadeIn(10);
    //                     $('.auto_wet').fadeOut(10);
    //                 }, 5000);
    //             }
    //         }
    //     })

    // })
    // $('.temp_left').on('click', () => {
    //     $('.fan_o').click();
    // })
    // $('.temp_right').on('click', () => {
    //     $('.fan_c').click();
    // })
    // $('.wet_left').on('click', () => {
    //     $('.wet_o').click();
    // })
    // $('.wet_right').on('click', () => {
    //     $('.wet_c').click();
    // })
    // var c_user = '';
    // var shu = { "user": [{ "id": "1", "name": "L", "password": "e10adc3949ba59abbe56e057f20f883e", "state": false, "mana": true }, { "id": "2", "name": "ceshi", "password": "c33367701511b4f6020ec61ded352059", "state": false, "mana": false }, { "id": "3", "name": "ceshi2", "password": "c33367701511b4f6020ec61ded352059", "state": false, "mana": false }] };

    var current_user = getUrlQueryString('user');
    $('.ch_n').html(current_user);

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
        if ($('#mqt').val() == '') {
            return;
        } else {
            mqtt_address = $('#mqt').val();
            warn(mqtt_address)
            var client = mqtt.connect(mqtt_address, options)
            client.on('connect', () => {
                warn("connect success!")
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


    //管理页面切换
    class ManaPage {
        constructor(page) {
            $(".mana_nav").on("click", "div", function() {
                let index = $(this).index();
                $(this).css("background","rgba(233, 240, 240, 0.7)").siblings().css("background","rgba(255, 255, 255, 1)");
                $(page[index]).show();
                if(index == 1) {$(page[0]).hide();$(".addHardware").stop().fadeIn("60");$(".addH").slideUp();}
                else if(index == 0){$(page[1]).hide();$(".addHardware").stop().hide();$(".addH").slideUp();}
                else if(index == 2){
                    $(".addHardware").slideUp();
                    $(".addH").slideDown();
                }
            });
        }
    }
    new ManaPage(["#user_list", "#hardware_list"]);
    // 发送数据到硬件实现控制
    // class control {
    //     constructor(o, f, d, h, s) {
    //         this.s = s;
    //         this.h = h;

    //         $(o).click(() => {
    //             console.log(this.h)
    //             this.sendData('on');

    //             if (mqtt_state != 0) { this.mqtt(3); } $(o).parents('.ct').find('.state').html("Open");
    //         })
    //         $(f).click(() => {

    //             this.sendData('off')
    //             $(o).parents('.ct').find('.state').html("Close");
    //         })
    //         $(d).click(() => {
    //             cc = !cc;
    //             this.analog(o, s);
    //         })
    //     }
    //     // ajax向硬件发送信息
    //     sendData(content) {
    //         $.ajax({
    //             type: 'GET',
    //             url: this.h,
    //             data: {
    //                 handle: content,
    //             },
    //             success(res) {
    //                 console.log(res)
    //             }
    //         });
    //     }
    //     // 模拟引脚设置
    //     analog(xx, ss) {
    //         if (cc == 1) {
    //             $(xx).parents('.ct').nextAll('.bar').fadeIn(200);
    //             var cAnalog = [];
    //             var x = 0;
    //             var time = setInterval(() => {
    //                 cAnalog[x] = inp[ss].value;
    //                 if (cAnalog[0] != cAnalog[1]) {
    //                     ind[ss].style.marginLeft = inp[ss].value + '%';
    //                     ind[ss].textContent = inp[ss].value + '%';
    //                     this.sendData(inp[ss].value);
    //                     console.log(cAnalog);
    //                     x++;
    //                 }
    //                 if (x > 1) x = 0;
    //             }, 100)
    //         } else {
    //             $(xx).parents('.ct').nextAll('.bar').fadeOut(200);
    //         }
    //     }
    //     // MQTT订阅与发布控制
    //     mqtt(message) {
    //         client.on('connect', () => {
    //             console.log("connect success!")
    //             //订阅主题 presence
    //             client.subscribe('control', (err) => {
    //                 if (!err) {
    //                     console.log("subscribe success!")
    //                     //发布主题presence,消息内容为Hello mqtt
    //                     client.publish('presence', message)
    //                 } else {
    //                     //打印错误
    //                     console.log(err)
    //                     console.log('mqtt连接错误')
    //                 }
    //             })
    //         })
    //         //如果连接错误，打印错误
    //         client.on('error', function(err) {
    //             console.log(err)
    //             client.end()
    //         })
    //     }
    // }
    // var led_control = new control('.led_on', '.led_off', '.led_analog', 'ledHandle', 0);
    // var win_control = new control('.wind_on', '.wind_off', '.wind_analog', 'winHandle', 1);
    // var door_control = new control('.door_o', '.door_c', 0, 'doorHandle');
    // var fan_control = new control('.fan_o', '.fan_c', 0, 'fanHandle');
    // var wet_control = new control('.wet_o', '.wet_c', 0, 'wetHandle');
    // var curtain_control = new control('.curtain_o', '.curtain_c', 0, 'curtainHandle');

    //页面跳转
    class PageChange {
        constructor(page) {
            $(".bottom_nav").on("click", '.font>svg', function() {
                let index = $(this).index();
                let aa = ["control", "Mqtt_m", "Mana_c", "User"]
                for (let i = 0; i < page.length; i++) { $(page[i]).hide(); }
                $(page[index - 1]).show();
                $(".move_cube").stop().animate({ "left": ((index - 1) * 25) + 4 + "%" }, 400);
                $(".move_cube p").html(aa[index - 1]);
            });
        }
    }
    new PageChange(['.kalada_c', '.kalada_m_m', '.kalada_m_c', '.kalada_user']);

    // mqtt消息测试
    class MqttBox {
        constructor(a, b, c, d, e, f) {
            $(a).on("click", () => {
                console.log("dfsdfdfasdfsjddflkfj;a")
                let topic = $(b).val();
                let content = $(c).val();
                if (topic.trim() != '' && content.trim() != '') {
                    mqttClient.publish(topic, content);
                }
            })
            $(e).on("click", () => {
                let topic = $(d).val();
                if (topic.trim() != '') {
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
            $(f).on("click", () => {
                let topic = $(d).val();
                if (topic.trim() != '') {
                    mqttClient.unsubscribe(topic, (err) => {
                        if (!err) {
                            console.log('unsubscribe success')
                        }
                    })
                }
            })
        }
    }
    new MqttBox('.mqtt_send', '#pub_topic', '#pub_content', '#sub_topic', '#sub_t', '#unsub_t');
    // 管理员操作

    //用户界面操作
    class User {
        constructor() {
            //更改用户名
            $('.change_n').on("click", () => {
                this.dataTransfer(1);
            });
            //更改密码
            $('.change_p').on("click", () => {
                this.dataTransfer(2);
            });
            $('.exit').on("click", () => {
                this.exit();
            })
        }
        exit() {
            conf("请问您真的想要退出吗", () => {
                Mana.changeUser(3, false, null, $('.ch_n').html(), (res) => {
                    warn("已退出");
                    window.location.href = '/index.html';
                });
            });
        }
        dataTransfer(a) {
            let that = this;
            $('.userChange').show();
            $('.glass_cover').show().on("click",() =>{
                $('.userChange').hide();
                $('.glass_cover').hide();
            });
            $('.bottom_nav').hide();
            $('#user_c_inp').on("click", () => {
                $('.userChange').hide();
                $('.glass_cover').hide();
                $('.bottom_nav').show();
                if ($('#change_put').val().trim() != "") {
                    if (a == 1) {
                        $.ajax({
                            type: "POST",
                            url: "/user/userVerify",
                            data: {
                                name: $('#change_put').val(),
                            },
                            success(response) {
                                if (response != "Exist") {
                                    Mana.changeUser(a, false, $('#change_put').val(), current_user, (res) => {
                                        warn("修改完成");
                                        Mana.userList = JSON.parse(res);
                                        $('.ch_n').html($('#change_put').val());
                                    });
                                } else {
                                    warn("抱歉，此用户名已注册");
                                }
                            }
                        });
                    }
                    if (a == 2) {
                        Mana.changeUser(a, false, md5($('#change_put').val()), current_user, (res) => { warn("修改完成"); });
                    }
                }
            });
            $('#change_put').val("");
        }
    }
    new User();
});