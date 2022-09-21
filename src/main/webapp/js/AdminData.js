var Mana = new Vue({
    el: '#hardware_sys_PC',
    data: {
        userList: [],
        AnaList: [],
        SpList: [],
        HardwareList: [],
        current_user: '',
    },
    mounted() {
        this.userLoad();
        this.hardwareLoad();
    },
    methods: {
        //加载完成后执行（导入列表）
        userLoad() {
            let that = this;
            $.ajax({
                type: "GET",
                url: "/users",
                success(res) {
                    that.userList = res.data;
                    $('.uNum>h1').html(that.userList.length);
                }
            });
        },
        hardwareLoad() {
            let that = this;
            $.ajax({
                type: "GET",
                url: "/hardwares",
                success(res) {
                    that.HardwareList = res.data;
                    $('.hNum>h1').html(that.HardwareList.length);
                    let pattern1 = /^AGSW/;
                    let pattern2 = /^SPSW/;
                    that.AnaList = that.HardwareList.filter((o, i) => {
                        return pattern1.test(o.hardwareId);
                    });
                    that.SpList = that.HardwareList.filter((o, i) => {
                        return pattern2.test(o.hardwareId);
                    });
                }
            });
        },
        //模拟引脚显示
        analogShow(k) {
            console.log("sdfsdfadf")
            let barIn = $('.bar-input').eq(k)[0];
            barIn.addEventListener('change', function() {
                $('.ind').eq(k).html(barIn.value + '%');
            });
            barIn.addEventListener('mousemove', function() {
                $('.ind').eq(k).html(barIn.value + '%');
            });

        },
        //简单控制
        SPSWControl(k, s) {
            let that = this;
            let hardwareIP = "http://192.168.2.178"
            storage.save("hardwareIP", hardwareIP); //储存函数

            // storage.retrieve("hardwareIP") //读取函数
            $.ajax({
                type: "GET",
                url: storage.retrieve("hardwareIP") + "/spswControl",
                data: {
                    name: that.HardwareList[k + that.AnaList.length].name,
                    hardwareID: that.HardwareList[k + that.AnaList.length].hardwareID,
                    hardwarePort: that.HardwareList[k + that.AnaList.length].hardwarePort,
                    instruction: s,
                },
                success(res) {
                    warn("发送成功");
                }
            });
        },
        //用户退出
        exit() {
            conf("请问您真的想要退出吗", () => {
                this.changeUser(2, 0, this.current_user);
            });
        },
        //用户更改输入
        dataTransfer(a) {
            let that = this;
            $('.userChangeBox').show();
            $('.cover').show().on("click", () => {
                $('.userChangeBox').hide();
                $('.cover').hide();
            });
            $('.Boxsub').on("click", () => {
                if ($('#change_put').val().trim() != "") {
                    $('.userChangeBox').hide();
                    $('.cover').hide();
                    if (a == 1) {
                        $.ajax({
                            type: "GET",
                            url: "/users/" + $('#change_put').val(),
                            success(res) {
                                if (res.code == 10040) {
                                    that.changeUser(3, $('#change_put').val(), that.current_user);
                                } else {
                                    warn("抱歉，此用户名已注册");
                                }
                            }
                        });
                    }
                    if (a == 2) {
                        that.changeUser(4, md5($('#change_put').val()), that.current_user);
                    }
                } else {
                    warn("输入内容为空或为空格");
                }
            });
            $('#change_put').val("");
        },
        //删除用户
        delUser(k) {
            let that = this;
            conf("您确定要删除此用户吗", () => {
                $.ajax({
                    type: "DELETE",
                    url: "/users/" + that.userList[k].id,
                    success(res) {
                        if (res.code == 10021) {
                            that.userLoad();
                            warn(res.massage);
                        } else {
                            warn("删除失败");
                        }
                    }
                });
            });
        },
        changeMana(k) {
            let that = this;
            conf("您确定要更改此用户的管理员权限吗", () => {
                this.userList[k].mana ? this.changeUser(1, 0, this.userList[k].name) :
                    this.changeUser(1, 1, this.userList[k].name);
            });
        },
        changeUser(method = null, value = null, name = null) {
            let that = this;
            $.ajax({
                type: "POST",
                url: "/users/" + method,
                data: {
                    value: value,
                    name: name,
                },
                success(res) {
                    console.log(res)
                    if (res.data == true) {
                        warn("修改成功");
                        that.userLoad();
                        if (method == 3) {
                            that.current_user = value;
                            $(".user span").html(that.current_user);
                        }
                    }
                }
            });
        },
        //硬件部分
        addHardware() {
            let that = this;
            $(".changeH").show();
            $(".cover").show().on("click", () => {
                $(".cover").hide();
                $(".changeH").hide();
            });
            document.querySelector(".changeH_sub").onclick = function() {
                if ($(".h_inp")[0].value.trim() != "" &&
                    $(".h_inp")[1].value.trim() != "" &&
                    $(".h_inp")[2].value.trim() != "") {
                    $(".changeH").hide();
                    $(".cover").hide();
                    that.addHardwareDo($(".h_inp")[0].value, $(".h_inp")[2].value, $(".h_inp")[1].value);
                } else {
                    warn("有输入框未填写哦");
                }
            }
        },
        addHardwareDo(name, id, port) {
            let that = this;
            let json = {
                name: name,
                hardwareId: id,
                hardwarePort: port
            };
            $.ajax({
                type: "POST",
                url: "/hardwares",
                contentType: "application/json",
                data: JSON.stringify(json),
                success(res) {
                    if (res.data == true) {
                        warn("添加成功")
                        that.hardwareLoad();
                    }
                }
            });

        },
        changeHardware(k) {
            let that = this;
            $(".changeH").show();
            $(".cover").show().on("click", () => {
                $(".cover").hide();
                $(".changeH").hide();
            });
            $(".h_inp")[0].value = this.HardwareList[k].name;
            $(".h_inp")[1].value = this.HardwareList[k].hardwarePort;
            $(".h_inp")[2].value = this.HardwareList[k].hardwareId;
            document.querySelector(".changeH_sub").onclick = function() {
                if ($(".h_inp")[0].value.trim() != "" &&
                    $(".h_inp")[1].value.trim() != "" &&
                    $(".h_inp")[2].value.trim() != "") {
                    $(".changeH").hide();
                    $(".cover").hide();
                    that.changeHardwareDo(that.HardwareList[k].id, $(".h_inp")[0].value, $(".h_inp")[2].value, $(".h_inp")[1].value);
                } else {
                    warn("有输入框未填写哦")
                }
            };
        },
        changeHardwareDo(id, name, hardwareId, hardwarePort) {
            let that = this;
            let json = {
                id: id,
                name: name,
                hardwareId: hardwareId,
                hardwarePort: hardwarePort,
            };
            $.ajax({
                type: "PUT",
                url: "/hardwares",
                contentType: "application/json",
                data: JSON.stringify(json),
                success(res) {
                    if (res.data == true) {
                        warn("修改成功")
                        that.hardwareLoad();
                    }
                }
            });
        },
        changeStatus(k) {
            let that = this;
            conf("请问是否要更改此硬件的状态", () => {
                let json = {
                    status: that.HardwareList[k].status == true ? 0 : 1
                }
                $.ajax({
                    type: "PUT",
                    url: "/hardwares/" + that.HardwareList[k].id,
                    contentType: "application/json",
                    data: JSON.stringify(json),
                    success(res) {
                        if (res.data == true) {
                            warn("修改成功")
                            that.hardwareLoad();
                        }
                    }
                });
            });
        },
        delHardware(k) {
            let that = this;
            conf("请问是否要删除此硬件", () => {
                $.ajax({
                    type: "DELETE",
                    url: "/hardwares/" + that.HardwareList[k].id,
                    success(res) {
                        if (res.data == true) {
                            warn("删除成功")
                            that.hardwareLoad();
                        }
                    }
                });
            });
        }
    }
});