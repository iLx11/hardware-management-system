package com.colorful.service;

import com.colorful.domain.Hardware;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface HardwareService {
    /**
     * 获取所有硬件
     * @return
     */
    public List<Hardware> selectAll();

    /**
     * 添加硬件
     * @param name
     * @param hardware_id
     * @param hardware_port
     * @return
     */
    public boolean addHardware(String name, String hardware_id, int hardware_port);

    /**
     * 修改硬件信息
     * @param id
     * @param name
     * @param hardware_id
     * @param hardware_port
     * @return
     */
    public boolean changeHardware(int id, String name, String hardware_id, int hardware_port);

    /**
     * 修改硬件状态
     * @param id
     * @param status
     * @return
     */
    public boolean changeStatus(int id,boolean status);

    /**
     * 删除硬件
     * @param id
     * @return
     */
    public boolean delHardware(int id);

    /**
     * 删除表的id列
     */
    public void idDel();

    /**
     * 重新添加id列，实现重新排序
     */
    public void idSort();

}
