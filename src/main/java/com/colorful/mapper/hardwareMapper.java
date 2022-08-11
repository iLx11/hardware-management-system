package com.colorful.mapper;

import com.colorful.pojo.Hardware;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

public interface hardwareMapper {
    public List<Hardware> selectAll();

    void addHardware(@Param("name") String name, @Param("hardware_id") String hardware_id, @Param("hardware_port") int hardware_port);

}
