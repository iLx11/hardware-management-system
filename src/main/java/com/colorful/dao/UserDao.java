package com.colorful.dao;

import com.colorful.domain.User;
import org.apache.ibatis.annotations.*;
import org.springframework.test.context.jdbc.Sql;

import java.util.List;

public interface UserDao {

    @Select("select * from user_data where name = #{name} and password = #{password}")
    public User userVerify(@Param("name") String name, @Param("password") String password);

    @Insert("insert into user_data (name,password,status,mana) value(#{name},#{password},0,0)")
    public boolean addUser(@Param("name") String name,@Param("password") String password);

    @Select("Select id, name, status, mana from user_data")
    public List<User> selectAll();

    @Select("select id, name, status, mana from user_data where name = #{name}")
    public User selectByName(@Param("name") String name);

    @Update("update user_data set mana = #{mana} where name = #{name} ")
    public boolean changeMana(@Param("mana") byte value, @Param("name") String name);

    @Update("update user_data set status = #{status} where name = #{name} ")
    public boolean changeStatus(@Param("status") byte value, @Param("name") String name);

    @Update("update user_data set name = #{param1} where name = #{param2};")
    public boolean changeName(@Param("name") String value, @Param("name") String name);

    @Update("update user_data set password = #{password} where name = #{name} ")
    public boolean changePassword(@Param("password") String value, @Param("name") String name);

    @Delete("delete from user_data where id = #{id}")
    public boolean deleteById(Integer id);

    @Update("alter table user_data drop column id;")
    public void idDel();

    @Update("alter table user_data add id int NOT NULL PRIMARY KEY AUTO_INCREMENT FIRST;")
    public void idSort();

}

