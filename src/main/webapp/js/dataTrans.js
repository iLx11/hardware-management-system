var Mana = new Vue({
    el: '#hardware_sys',
    data: {
        userList: [],
        hardwareList: [
            [],
            []
        ],
        HardwareList: [],
    },
    mounted() {

        this.userLoad();
        this.hardwareLoad();

    },
    methods: {
        //加载完成后执行（导入列表）
        //加载用户列表
        userLoad() {
            let that = this;
            $.ajax({
                type: "GET",
                url: "/users",
                success(res) {
                    that.userList = JSON.parse(res);
                }
            });
        },
        //加载硬件列表
        hardwareLoad() {
            let that = this;
            $.ajax({
                type: "GET",
                url: "/hardware/selectAll",
                success(res) {
                    that.HardwareList = arrayh = JSON.parse(res);

                    let pattern1 = /^AGSW/;
                    let pattern2 = /^SPSW/;
                    let aa = arrayh.filter((o, i) => {
                        return pattern1.test(o.hardwareID);
                    });
                    let bb = arrayh.filter((o, i) => {
                        return pattern2.test(o.hardwareID);
                    });
                    that.hardwareList[0] = [];
                    that.hardwareList[1] = [];
                    for (let i = 0; i < aa.length; i++) {
                        that.hardwareList[0].push(aa[i]);
                    }
                    for (let i = 0; i < bb.length; i++) {
                        that.hardwareList[1].push(bb[i]);
                    }
                }
            });
        },
        //模拟引脚显示
        analogShow(k) {
            if ($(".bar").eq(k)[0].style.display == "block") {
                $(".bar").eq(k).fadeOut(100);
            } else {
                $(".bar").eq(k).fadeIn(100);
                let barIn = $('.bar-input').eq(k)[0];
                barIn.addEventListener('change', function() {
                    $('.indicator').eq(k).html(barIn.value + '%').stop().animate({ "marginLeft": barIn.value + '%' }, 600);
                });
                barIn.addEventListener('touchmove', function() {
                    $('.indicator').eq(k).html(barIn.value + '%').css("marginLeft", barIn.value + '%');
                });
            }

        },
        //简单控制
        SPSWControl(k, s) {
            console.log(`${k}-----${s}`)
            let that = this;
            let hardwareIP = "http://192.168.2.178"
            storage.save("hardwareIP", hardwareIP); //储存函数

            // storage.retrieve("hardwareIP") //读取函数
            $.ajax({
                type: "GET",
                url: storage.retrieve("hardwareIP") + "/spswControl",
                data: {
                    name: that.HardwareList[k + that.hardwareList[0].length].name,
                    hardwareID: that.HardwareList[k + that.hardwareList[0].length].hardwareID,
                    hardwarePort: that.HardwareList[k + that.hardwareList[0].length].hardwarePort,
                    instruction: s,
                },
                success(res) {
                    warn("发送成功");
                }
            });
        },
        exit() {
            conf("请问您真的想要退出吗", () => {
                this.changeUser(3, false, null, $('.ch_n').html(), (res) => {
                    warn("已退出");
                    window.location.href = '/index.html';
                });
            });
        },
        dataTransfer(a) {
            let that = this;
            $('.userChange').show();
            $('.glass_cover').show().on("click", () => {
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
                                    that.changeUser(a, false, $('#change_put').val(), current_user, (res) => {
                                        warn("修改完成");
                                        that.userList = JSON.parse(res);
                                        $('.ch_n').html($('#change_put').val());
                                    });
                                } else {
                                    warn("抱歉，此用户名已注册");
                                }
                            }
                        });
                    }
                    if (a == 2) {
                        that.changeUser(a, false, md5($('#change_put').val()), current_user, (res) => { warn("修改完成"); });
                    }
                }
            });
            $('#change_put').val("");
        },
        delUser(k) {
            let that = this;
            conf("您确定要删除此用户吗", () => {
                $.ajax({
                    type: "GET",
                    url: "/user/deleteUser",
                    data: {
                        id: that.userList[k].id,
                    },
                    success(res) {
                        that.userList = JSON.parse(res);
                        warn("删除成功");

                    }
                });
            });
        },
        changeMana(k) {
            let that = this;
            conf("您确定要更改此用户的管理员权限吗", () => {
                console.log(this.userList[k].mana);
                this.changeUser(4, !this.userList[k].mana, null, this.userList[k].name, (res) => {
                    console.log(res)
                    that.userList = JSON.parse(res);
                    warn("修改完成");
                });
            });
        },
        changeUser(a, b, c, d, e) {
            let that = this;
            $.ajax({
                type: "POST",
                url: "/user/changeUser",
                data: {
                    set: a,
                    status: b,
                    value: c,
                    name: d,
                },
                success(res) {
                    e(res);
                }
            });
        },
        addHardware() {
            let that = this;
            if ($(".addh_inp")[0].value.trim() != "" &&
                $(".addh_inp")[1].value.trim() != "" &&
                $(".addh_inp")[2].value.trim() != "") {
                $.ajax({
                    type: "POST",
                    url: "/hardware/addHardware",
                    data: {
                        name: $(".addh_inp")[0].value,
                        hardware_id: $(".addh_inp")[2].value,
                        hardware_port: $(".addh_inp")[1].value,
                    },
                    success(res) {
                        warn("添加成功")
                        that.hardwareLoad();
                    }
                });
            } else {
                warn("有输入框未填写哦")
            }

        },
        changeHardware(k) {
            let that = this;
            $(".changeH").show();
            $(".glass_cover").show().on("click", () => {
                $(".glass_cover").hide();
                $(".changeH").hide();
            });
            $(".h_inp")[0].value = this.HardwareList[k].name;
            $(".h_inp")[1].value = this.HardwareList[k].hardwarePort;
            $(".h_inp")[2].value = this.HardwareList[k].hardwareID;
            $(".changeH_sub").on("click", () => {
                $(".changeH").hide();
                $(".glass_cover").hide();
                if ($(".h_inp")[0].value.trim() != "" &&
                    $(".h_inp")[1].value.trim() != "" &&
                    $(".h_inp")[2].value.trim() != "") {
                    $.ajax({
                        type: "POST",
                        url: "/hardware/changeHardware",
                        data: {
                            id: that.HardwareList[k].id,
                            name: $(".h_inp")[0].value,
                            hardware_id: $(".h_inp")[2].value,
                            hardware_port: $(".h_inp")[1].value,
                        },
                        success(res) {
                            warn("修改成功")
                            that.hardwareLoad();
                        }
                    });
                } else {
                    warn("有输入框未填写哦")
                }
            });
        },
        changeStatus(k) {
            let that = this;
            conf("请问是否要更改此硬件的状态", () => {
                $.ajax({
                    type: "POST",
                    url: "/hardware/changeStatus",
                    data: {
                        id: that.HardwareList[k].id,
                        status: !that.HardwareList[k].status,
                    },
                    success(res) {
                        warn("修改成功")
                        that.hardwareLoad();
                    }
                });
            });
        },
        delHardware(k) {
            let that = this;
            conf("请问是否要删除此硬件", () => {
                $.ajax({
                    type: "POST",
                    url: "/hardware/delHardware",
                    data: {
                        id: that.HardwareList[k].id,
                    },
                    success(res) {
                        warn("删除成功")
                        that.hardwareLoad();
                    }
                });
            });
        }
    }
});