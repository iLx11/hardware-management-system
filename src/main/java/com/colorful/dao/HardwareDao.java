package com.colorful.dao;

import com.colorful.domain.Hardware;
import org.apache.ibatis.annotations.*;

import java.util.List;

public interface HardwareDao {
    // 获取所以硬件列表数据
    @Select("select * from hardware_data")
    public List<Hardware> selectAll();
    // 添加硬件
    @Insert("insert into hardware_data (name,hardware_id,hardware_port,status) value (#{name},#{hardware_id},#{hardware_port},1); ")
    public boolean addHardware(@Param("name") String name, @Param("hardware_id") String hardware_id, @Param("hardware_port") int hardware_port);
    // 修改硬件
    @Update("update hardware_data set name = #{name}, hardware_id = #{hardware_id}, hardware_port = #{hardware_port} where id = #{id}")
    public boolean changeHardware(@Param("id") int id, @Param("name") String name, @Param("hardware_id") String hardware_id, @Param("hardware_port") int hardware_port);
    // 根据硬件 id 修改硬件状态
    @Update("update hardware_data set status = #{status} where id = #{id};")
    public boolean changeStatus(@Param("id") int id,@Param("status") boolean status);
    // 根据硬件 id 删除硬件
    @Delete("delete from hardware_data where id = #{id}")
    public boolean delHardware(@Param("id") int id);
    // 删除数据库中 id 列表
    @Update("alter table hardware_data drop column id;")
    public void idDel();
    // 重排 id 列表
    @Update("alter table hardware_data add id int NOT NULL PRIMARY KEY AUTO_INCREMENT FIRST;")
    public void idSort();
}
