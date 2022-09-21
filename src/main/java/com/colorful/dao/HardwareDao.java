package com.colorful.dao;

import com.colorful.domain.Hardware;
import org.apache.ibatis.annotations.*;

import java.util.List;

public interface HardwareDao {
    @Select("select * from hardware_data")
    public List<Hardware> selectAll();

    @Insert("insert into hardware_data (name,hardware_id,hardware_port,status) value (#{name},#{hardware_id},#{hardware_port},1); ")
    public boolean addHardware(@Param("name") String name, @Param("hardware_id") String hardware_id, @Param("hardware_port") int hardware_port);

    @Update("update hardware_data set name = #{name}, hardware_id = #{hardware_id}, hardware_port = #{hardware_port} where id = #{id}")
    public boolean changeHardware(@Param("id") int id, @Param("name") String name, @Param("hardware_id") String hardware_id, @Param("hardware_port") int hardware_port);

    @Update("update hardware_data set status = #{status} where id = #{id};")
    public boolean changeStatus(@Param("id") int id,@Param("status") boolean status);

    @Delete("delete from hardware_data where id = #{id}")
    public boolean delHardware(@Param("id") int id);

    @Update("alter table hardware_data drop column id;")
    public void idDel();

    @Update("alter table hardware_data add id int NOT NULL PRIMARY KEY AUTO_INCREMENT FIRST;")
    public void idSort();
}
