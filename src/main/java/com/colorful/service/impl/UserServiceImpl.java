package com.colorful.service.impl;

import com.colorful.dao.UserDao;
import com.colorful.domain.User;
import com.colorful.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserDao userDao;

    @Override
    public User userVerify(String name, String password) {
        return userDao.userVerify(name, password);
    }

    @Override
    public void addUser(String name, String password) {
        userDao.addUser(name, password);
    }

    @Override
    public List<User> selectAll() {
        return userDao.selectAll();
    }

    @Override
    public User selectByName(String name) {
        return userDao.selectByName(name);
    }

    @Override
    public void deleteById(Integer id) {
        userDao.deleteById(id);
    }

    @Override
    public void idDel() {
        userDao.idDel();
    }

    @Override
    public void idSort() {
        userDao.idSort();
    }

}
