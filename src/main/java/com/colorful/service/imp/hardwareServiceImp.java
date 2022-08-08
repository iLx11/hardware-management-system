package com.colorful.service.imp;

import com.colorful.mapper.hardwareMapper;
import com.colorful.mapper.userMapper;
import com.colorful.pojo.User;
import com.colorful.service.hardwareService;
import com.colorful.service.userService;
import com.colorful.utils.factoryUtil;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import java.util.List;

public class hardwareServiceImp implements hardwareService {
    SqlSessionFactory factory = factoryUtil.getSqlSessionFactory();
    @Override
    public List<User> selectALL() {
        SqlSession sqlSession = factory.openSession();
        hardwareMapper hardwareMapper = sqlSession.getMapper(hardwareMapper.class);
//        List<User> hardware = hardwareMapper.selectAll();
        sqlSession.close();
        return null;
    }

}
