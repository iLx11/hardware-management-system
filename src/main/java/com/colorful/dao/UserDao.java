package com.colorful.dao;

import com.colorful.domain.User;
import org.apache.ibatis.annotations.*;

import java.util.List;

public interface UserDao {

    @Select("select * from user_data where name = #{name} and password = #{password}")
    public User userVerify(@Param("name") String name, @Param("password") String password);

    @Insert("insert into user_data (name,password,status,mana) value(#{name},#{password},0,0)")
    public void addUser(@Param("name") String name,@Param("password") String password);

    @Select("Select id, name, status, mana from user_data")
    public List<User> selectAll();

    @Select("select * from user_data where name = #{name}")
    public User selectByName(@Param("name") String name);


    @Delete("delete from user_data where id = #{id}")
    public void deleteById(Integer id);

    @Update("alter table user_data drop column id;")
    public void idDel();

    @Update("alter table user_data add id int NOT NULL PRIMARY KEY AUTO_INCREMENT FIRST;")
    public void idSort();

}

