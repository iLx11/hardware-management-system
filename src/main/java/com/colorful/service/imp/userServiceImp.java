package com.colorful.service.imp;

import com.colorful.mapper.userMapper;
import com.colorful.pojo.User;
import com.colorful.pojo.UserShow;
import com.colorful.service.userService;
import com.colorful.utils.factoryUtil;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import java.util.List;

public class userServiceImp implements userService {
    SqlSessionFactory factory = factoryUtil.getSqlSessionFactory();
    @Override
    public List<UserShow> selectAll() {
        SqlSession sqlSession = factory.openSession();
        userMapper userMapper = sqlSession.getMapper(userMapper.class);
        List<UserShow> user = userMapper.selectAll();
        sqlSession.close();
        return user;
    }
    public User userVerify(String name, String password) {
        SqlSession sqlSession = factory.openSession();
        userMapper userMapper = sqlSession.getMapper(userMapper.class);
        User result = userMapper.userVerify(name,password);
        sqlSession.close();
        return result;
    }
    public void deleteById(int id) {
        SqlSession sqlSession = factory.openSession(true);
        userMapper userMapper = sqlSession.getMapper(userMapper.class);
        userMapper.deleteById(id);
        sqlSession.close();
    }
    public void idDel() {
        SqlSession sqlSession = factory.openSession();
        userMapper userMapper = sqlSession.getMapper(userMapper.class);
        userMapper.idDel();
        sqlSession.close();
    }
    public void idSort() {
        SqlSession sqlSession = factory.openSession();
        userMapper userMapper = sqlSession.getMapper(userMapper.class);
        userMapper.idSort();
        sqlSession.close();
    }
    public void changeUser(int set, Byte status, String value, String name){
        SqlSession sqlSession = factory.openSession(true);
        userMapper userMapper = sqlSession.getMapper(userMapper.class);
        userMapper.changeUser(set,status,value,name);
        sqlSession.close();
    }
    public UserShow selectByName(String name) {
        SqlSession sqlSession = factory.openSession(true);
        userMapper userMapper = sqlSession.getMapper(userMapper.class);
        UserShow user = userMapper.selectByName(name);
        sqlSession.close();
        return user;
    }
    public void addUser(String name, String password) {
        SqlSession sqlSession = factory.openSession(true);
        userMapper userMapper = sqlSession.getMapper(userMapper.class);
        userMapper.addUser(name,password);
        sqlSession.close();
    }
}
