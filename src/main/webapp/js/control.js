$(function() {
    $(window).load(function() {
        $('.load').delay(500).fadeOut(200);
        $('.constructor').delay(700).fadeIn(800);
        $('.bottom_nav').delay(700).fadeIn(800);
        // 兼容safari
        // if ((/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent))) {
        //     $('.C_t').css("background", "rgba(226, 225, 223, 0.87)");
        // }
    });

    //获取用户
    let currentUser = getCookie("user");
    if (currentUser != null) {
        Mana.current_user = currentUser;
        Mana.changeUser(2, 1, Mana.current_user);
    }
    $(".ch_n").html(currentUser);
    function getCookie(objname) {
        let arrstr = document.cookie.split("; ");
        for (var i = 0; i < arrstr.length; i++) {
            var temp = arrstr[i].split("=");
            if (temp[0] === objname) return unescape(temp[1]);
        }
    }

    /*MQTT部分
    ------------------------------------------*/
    var mqtt_state = 0;
    //wss://bemfa.com:9504/wss
    var mqtt_address = '';
    var mqttClient = '';
    var options = {
        //mqtt客户端的id
        // clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
        clientId: '75ee4e39450943889749e9924e3a982c',
        // connectTimeout: 3,
    }

    // MQTT服务器地址输入
    $('#mqt').blur(() => {
        if ($('#mqt').val() == '') {
            warn("服务器地址为空");
            return;
        } else {
            mqtt_address = $('#mqt').val();
            let client = mqtt.connect(mqtt_address, options)
            client.on('connect', () => {
                mqtt_state = 1; //mqtt状态
                mqttClient = client;
                warn("连接成功");
                $('#mqtt_sit').html('connected')
            })
            client.on('error', function(err) {
                warn("连接失败");
                $('#mqtt_sit').html('failed to connected');
                client.end();
            })
        }
    });
    // MQTT订阅与发布控制
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


    //管理页面切换
    class ManaPage {
        constructor(page) {
            $(".mana_nav").on("click", "div", function() {
                let index = $(this).index();
                $(this).css("background", "rgba(233, 240, 240, 0.7)").siblings().css("background", "rgba(255, 255, 255, 1)");
                $(page[index]).show();
                if (index == 1) {
                    $(page[0]).hide();
                    $(".addHardware").stop().fadeIn("60");
                    $(".addH").slideUp();
                } else if (index == 0) {
                    $(page[1]).hide();
                    $(".addHardware").stop().hide();
                    $(".addH").slideUp();
                } else if (index == 2) {
                    $(".addHardware").slideUp();
                    $(".addH").slideDown();
                }
            });
        }
    }
    new ManaPage(["#user_list", "#hardware_list"]);

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
            let that = this;
            $('.mqtt_trans').on('click', () => {
                if (mqtt_state == 1) {
                    document.querySelector(a).onclick = function() { that.pubTopic(b, c); };
                    document.querySelector(e).onclick = function() { that.subTopic(d); };
                    document.querySelector(f).onclick = function() { that.unsubTopic(d); };
                } else {
                    warn("MQTT服务器未连接");
                }
            });
        }
        pubTopic(b, c) {
            let topic = $(b).val();
            let content = $(c).val();
            if (topic.trim() != '' && content.trim() != '') {
                mqttClient.publish(topic, content);
                $('.mqtt_mes').append(`<div class="messBox messRight"><div class="from"><span>${topic}</span></div><div class="mes"><span>${content}</span></div></div>`);

                warn("发布成功");
            } else {
                warn("发布主题和内容不能为空");
            }
        }
        subTopic(d) {
            let topic = $(d).val();
            if (topic.trim() != '') {
                mqttClient.subscribe(topic, function(err) {
                    if (!err) {
                        warn("订阅成功");
                        //处理消息
                        mqttClient.on('message', function(topic, message) {
                            // 此处就是打印消息的具体内容
                            $('.mqtt_mes').append(`<div class="messBox"><div class="from"><span>${topic}</span></div><div class="mes"><span>${message.toString()}</span></div></div>`);
                            document.querySelector('.mqtt_mes').scrollTop += 600;
                        })
                    } else {
                        warn("订阅失败");
                    }
                })
            } else {
                warn("订阅的主题不能为空");
            }
        }
        unsubTopic(d) {
            let topic = $(d).val();
            if (topic.trim() != '') {
                mqttClient.unsubscribe(topic, (err) => {
                    if (!err) {
                        warn('取消订阅成功');
                    }
                })
            } else {
                warn("主题不能为空");
            }
        }
    }
    new MqttBox('.mqtt_send', '#pub_topic', '#pub_content', '#sub_topic', '#sub_t', '#unsub_t');

});