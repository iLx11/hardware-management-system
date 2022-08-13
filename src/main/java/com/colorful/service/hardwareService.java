package com.colorful.service;

import com.colorful.pojo.Hardware;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface hardwareService {
    public List<Hardware> selectALL();

    public void addHardware(String name, String hardware_id, int hardware_port);

    public void changeHardware(int id, String name, String hardware_id, int hardware_port);

    public void changeStatus(int id, byte status);

    public void delHardware(int id);

    public void idDel();

    public void idSort();
}
