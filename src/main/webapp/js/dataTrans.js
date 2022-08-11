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

        this.onloadDo();

    },
    methods: {
        onloadDo() {
            let that = this;
            $.ajax({
                type: "GET",
                url: "/user/selectAll",
                success(res) {
                    that.userList = JSON.parse(res);
                }
            });
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
                    for (let i = 0; i < aa.length; i++) {
                        that.hardwareList[0].push(aa[i]);
                    }
                    for (let i = 0; i < bb.length; i++) {
                        that.hardwareList[1].push(bb[i]);
                    }
                }
            });
        },
        delUser(k) {
            let that = this;
            conf("您确定要删除此用户吗", () => {
                $.ajax({
                    type: "GET",
                    url: "/user/deleteUser",
                    data: {
                        id: k + 1,
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
            if ($(".h_inp")[0].value.trim() != "" &&
                $(".h_inp")[1].value.trim() != "" &&
                $(".h_inp")[2].value.trim() != "") {
                $.ajax({
                    type: "POST",
                    url: "/hardware/addHardware",
                    data: {
                        name: $(".h_inp")[0].value,
                        hardware_id: $(".h_inp")[2].value,
                        hardware_port: $(".h_inp")[1].value,
                    },
                    success(res) {
                        warn("添加成功")
                        that.onloadDo();
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

                if ($(".h_inp")[0].value.trim() != "" &&
                    $(".h_inp")[1].value.trim() != "" &&
                    $(".h_inp")[2].value.trim() != "") {
                    $.ajax({
                        type: "POST",
                        url: "/hardware/changeHardware",
                        data: {
                            name: $(".h_inp")[0].value,
                            hardware_id: $(".h_inp")[2].value,
                            hardware_port: $(".h_inp")[1].value,
                        },
                        success(res) {
                            warn("添加成功")
                            that.onloadDo();
                        }
                    });
                } else {
                    warn("有输入框未填写哦")
                }
            });
        }
    }
});