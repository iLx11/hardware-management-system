package com.colorful.controller;

import com.colorful.domain.Hardware;
import com.colorful.service.HardwareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@Controller
@ResponseBody
@RequestMapping("/hardwares")
public class HardwareController {

    @Autowired
    private HardwareService service;

    @GetMapping
    public Result selcetAll() {
        return new Result(Code.GET_OK,service.selectAll(),"获取成功");
    }

    @PostMapping
    public Result addHardrware(@RequestBody Hardware hardware) {
        boolean flag = service.addHardware(hardware.getName(), hardware.getHardwareId(), hardware.getHardwarePort());
        return new Result(flag ? Code.POST_OK: Code.POST_ERR,flag,"添加");
    }

    @PutMapping
    public Result changeHardware(@RequestBody Hardware hardware) {
        boolean flag = service.changeHardware(hardware.getId(), hardware.getName(), hardware.getHardwareId(), hardware.getHardwarePort());
        return new Result(flag ? Code.PUT_OK: Code.PUT_ERR, flag);
    }

    @PutMapping("/{id}")
    public Result changeStatus(@PathVariable int id, @RequestBody Hardware hardware) {
        boolean flag = service.changeStatus(id, hardware.isStatus());
        return new Result(flag ? Code.PUT_OK: Code.PUT_ERR, flag);
    }

    @DeleteMapping("/{id}")
    public Result delHardware(@PathVariable int id) {
        boolean flag = service.delHardware(id);
        if(flag) {
            service.idDel();
            service.idSort();
        }
        return new Result(flag ? Code.PUT_OK: Code.PUT_ERR, flag);
    }
}
