package com.colorful;

import com.colorful.mapper.hardwareMapper;
import com.colorful.mapper.userMapper;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.io.InputStream;

public class test {
    public static void main(String[] args) throws IOException {

        String res = "mybatis-config.xml";
        InputStream inputStream = Resources.getResourceAsStream(res);
        SqlSessionFactory sqlf = new SqlSessionFactoryBuilder().build(inputStream);
        SqlSession sqls = sqlf.openSession(true);

//        userMapper userM = sqls.getMapper(userMapper.class);
        hardwareMapper hardwareM = sqls.getMapper(hardwareMapper.class);
//        userM.changeUserStatus((byte) 1,"test6");
//        System.out.println(userM.selectAll());
        System.out.println();
        hardwareM.addHardware("ll","sd",16);
//        userM.changeUser(1,(byte) 0,"289dff07669d7a23de0ef88d2f7129e7","test");
//        System.out.println(userM.selectByName("l"));
//        userM.addUser("123","dsfsd");
        sqls.close();

    }
}
