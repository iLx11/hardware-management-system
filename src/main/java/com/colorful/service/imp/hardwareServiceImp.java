package com.colorful.service.imp;

import com.colorful.mapper.hardwareMapper;
import com.colorful.pojo.Hardware;
import com.colorful.service.hardwareService;
import com.colorful.utils.factoryUtil;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import java.util.List;

public class hardwareServiceImp implements hardwareService {
    SqlSessionFactory factory = factoryUtil.getSqlSessionFactory();

    @Override
    public List<Hardware> selectALL() {
        SqlSession sqlSession = factory.openSession();
        hardwareMapper hardwareMapper = sqlSession.getMapper(hardwareMapper.class);
        List<Hardware> hardware = hardwareMapper.selectAll();
        sqlSession.close();
        return hardware;
    }

    @Override
    public void addHardware(String name, String hardware_id, int hardware_port) {
        SqlSession sqlSession = factory.openSession(true);
        hardwareMapper hardwareMapper = sqlSession.getMapper(hardwareMapper.class);
        hardwareMapper.addHardware(name,hardware_id,hardware_port);
        sqlSession.close();
    }
}
