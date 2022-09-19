$(function() {

    //页面跳转
    class PageChange {
        constructor(page) {
            $(".nav").on("click", 'div', function() {
                let index = $(this).index();
                for (let i = 0; i < page.length; i++) { $(page[i]).hide(); }
                $(page[index]).show();
                $(this).css("background", "rgba(51, 51, 51, 0.4)").siblings().css("background", "rgba(51, 51, 51, 0)").find('.icon').css("filter", "brightness(100%)");
                $(this).find('.icon').css("filter", "brightness(400%)");
            });
        }
    }
    new PageChange(['.controlPage', '.userPage', '.hardwarePage', '.chartPage']);

    window.onresize = function() {
        let clientW = document.documentElement.clientWidth;
        if (clientW < 900 && clientW > 600) {
            $('.mqttMess').hide();
            $('.component').css("width", "90%");
        } else if (clientW > 900) {
            $('.mqttMess').show();
            $('.component').css("width", "65%");
        } else if (clientW < 600) {
            if (getcookie("user") != null && getcookie("user") != '')
                window.location.href = "/control.html?user=" + getcookie("user");
        }
    }

    function getcookie(objname) {
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
    $("#mqt").blur(() => {
        if ($("#mqt").val() === '') {
            warn("服务器地址为空");
        } else {
            mqtt_address = $('#mqt').val();
            let client = mqtt.connect(mqtt_address, options)
            client.on('connect', () => {
                mqtt_state = 1; //mqtt状态
                mqttClient = client;
                warn("连接成功");
                $('.MQTTStatus>h1').html('已连接');
            })
            client.on('error', function(err) {
                warn("连接失败");
                $('.MQTTStatus>h1').html('未连接');
                client.end();
            })
        }
    });
    /*MQTT订阅与发布控制
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
        }*/

    // mqtt消息测试
    class MqttBox {
        constructor(a, b, c, d, e, f) {
            let that = this;
            $('.MQTTcontent').on('click', function() {
                if (mqtt_state === 1) {
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
            if (topic.trim() !== '' && content.trim() !== '') {
                mqttClient.publish(topic, content);
                $('.mqtt_mes').append(`<div class="messBox messRight"><div class="from"><span>${topic}</span></div><div class="mes"><span>${content}</span></div></div>`);

                warn("发布成功");
            } else {
                warn("发布主题和内容不能为空");
            }
        }
        subTopic(d) {
            let topic = $(d).val();
            if (topic.trim() !== '') {
                mqttClient.subscribe(topic, function(err) {
                    if (!err) {
                        warn("订阅成功");
                        //处理消息
                        mqttClient.on('message', function(topic, message) {
                            // 此处就是打印消息的具体内容                             
                            $('.mqtt_mes').append(`<div class="messBox"><div class="from"><span>${topic}</span></div><div class="mes"><span>${message.toString()}</span></div></div>`);
                            document.querySelector('.mMessage').scrollTop += 600;
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
            if (topic.trim() !== '') {
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

    // 遮罩图层
    $('.cover').on('click', () => {
        $(this).hide();
        $('.changeH').hide();
    });
});