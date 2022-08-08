package com.colorful.mapper;

import com.colorful.pojo.User;
import com.colorful.pojo.UserShow;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

import java.util.List;

public interface userMapper {
    List<UserShow> selectAll();

    User userVerify(@Param("name") String name, @Param("password") String password);

    void deleteById(int id);

    @Update("alter table user_data drop column id;")
    void idDel();

    @Update("alter table user_data add id int NOT NULL PRIMARY KEY AUTO_INCREMENT FIRST;")
    void idSort();

    void changeUser(@Param("set") int set, @Param("status") Byte status, @Param("value") String value, @Param("name") String name);
}
