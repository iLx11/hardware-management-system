package com.colorful.service.impl;

import com.colorful.dao.HardwareDao;
import com.colorful.domain.Hardware;
import com.colorful.service.HardwareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HardwareServiceImpl implements HardwareService {
    @Autowired
    private HardwareDao hardwareDao;

    @Override
    public List<Hardware> selectAll() {
        return hardwareDao.selectAll();
    }

    @Override
    public boolean addHardware(String name, String hardware_id, int hardware_port) {
        return hardwareDao.addHardware(name, hardware_id, hardware_port);
    }

    @Override
    public boolean changeHardware(int id, String name, String hardware_id, int hardware_port) {
        return hardwareDao.changeHardware(id, name, hardware_id, hardware_port);
    }

    @Override
    public boolean changeStatus(int id, boolean status) {
        return hardwareDao.changeStatus(id, status);
    }

    @Override
    public boolean delHardware(int id) {
        return hardwareDao.delHardware(id);
    }

    @Override
    public void idDel() {
        hardwareDao.idDel();
    }

    @Override
    public void idSort() {
        hardwareDao.idSort();
    }
}
