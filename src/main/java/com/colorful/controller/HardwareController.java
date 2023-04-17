package com.colorful.controller;

import com.colorful.domain.Hardware;
import com.colorful.service.HardwareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@Controller
@ResponseBody
@RequestMapping("/hardwares") // hardwares 应用
public class HardwareController {
    // 自动装配业务层对象
    @Autowired
    private HardwareService service;
    // 获取所以硬件列表数据
    @GetMapping
    public Result selcetAll() {
        return new Result(Code.GET_OK, service.selectAll(), "获取成功");
    }
    // 添加硬件
    @PostMapping
    public Result addHardrware(@RequestBody Hardware hardware) {
        boolean flag = service.addHardware(hardware.getName(), hardware.getHardwareId(), hardware.getHardwarePort());
        return new Result(flag ? Code.POST_OK : Code.POST_ERR, flag, "添加");
    }
    // 修改硬件
    @PutMapping
    public Result changeHardware(@RequestBody Hardware hardware) {
        boolean flag = service.changeHardware(hardware.getId(), hardware.getName(), hardware.getHardwareId(), hardware.getHardwarePort());
        return new Result(flag ? Code.PUT_OK : Code.PUT_ERR, flag);
    }
    // 根据硬件 id 修改硬件状态
    @PutMapping("/{id}")
    public Result changeStatus(@PathVariable int id, @RequestBody Hardware hardware) {
        boolean flag = service.changeStatus(id, hardware.isStatus());
        return new Result(flag ? Code.PUT_OK : Code.PUT_ERR, flag);
    }
    // 根据硬件 id 删除硬件
    @DeleteMapping("/{id}")
    public Result delHardware(@PathVariable int id) {
        boolean flag = service.delHardware(id);
        if (flag) {
            service.idDel();
            service.idSort();
        }
        return new Result(flag ? Code.PUT_OK : Code.PUT_ERR, flag);
    }
}
