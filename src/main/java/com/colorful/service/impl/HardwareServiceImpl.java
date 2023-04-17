package com.colorful.service.impl;

import com.colorful.dao.HardwareDao;
import com.colorful.domain.Hardware;
import com.colorful.service.HardwareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HardwareServiceImpl implements HardwareService {
    // 自动装配持久层对象
    @Autowired
    private HardwareDao hardwareDao;
    // 获取所以硬件列表数据
    @Override
    public List<Hardware> selectAll() {
        return hardwareDao.selectAll();
    }
    // 添加硬件
    @Override
    public boolean addHardware(String name, String hardware_id, int hardware_port) {
        return hardwareDao.addHardware(name, hardware_id, hardware_port);
    }
    // 修改硬件
    @Override
    public boolean changeHardware(int id, String name, String hardware_id, int hardware_port) {
        return hardwareDao.changeHardware(id, name, hardware_id, hardware_port);
    }
    // 根据硬件 id 修改硬件状态
    @Override
    public boolean changeStatus(int id, boolean status) {
        return hardwareDao.changeStatus(id, status);
    }
    // 根据硬件 id 删除硬件
    @Override
    public boolean delHardware(int id) {
        return hardwareDao.delHardware(id);
    }
    // 删除数据库中 id 列表
    @Override
    public void idDel() {
        hardwareDao.idDel();
    }
    // 重排 id 列表
    @Override
    public void idSort() {
        hardwareDao.idSort();
    }
}
