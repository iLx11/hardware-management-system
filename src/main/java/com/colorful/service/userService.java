package com.colorful.service;

import com.colorful.pojo.User;
import com.colorful.pojo.UserShow;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface userService {
    public List<UserShow> selectAll();

    public User userVerify(String name, String password);

    public void deleteById(int id);

    public void idDel();

    public void idSort();

    public void changeUser(int set, Byte status, String value, String name);

    public UserShow selectByName(String name);

    public void addUser(String name, String password);
}
