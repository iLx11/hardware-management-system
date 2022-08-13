package com.colorful.mapper;

import com.colorful.pojo.Hardware;
import org.apache.ibatis.annotations.*;

import java.util.List;

public interface hardwareMapper {
    List<Hardware> selectAll();

    void addHardware(@Param("name") String name, @Param("hardware_id") String hardware_id, @Param("hardware_port") int hardware_port);

    void changeHardware(@Param("id") int id, @Param("name") String name, @Param("hardware_id") String hardware_id, @Param("hardware_port") int hardware_port);

    @Update("update hardware_data set status = #{status} where id = #{id};")
    void changeStatus(@Param("id") int id,@Param("status") byte status);

    @Delete("delete from hardware_data where id = #{id}")
    void delHardware(@Param("id") int id);

    @Update("alter table hardware_data drop column id;")
    void idDel();

    @Update("alter table hardware_data add id int NOT NULL PRIMARY KEY AUTO_INCREMENT FIRST;")
    void idSort();

}
