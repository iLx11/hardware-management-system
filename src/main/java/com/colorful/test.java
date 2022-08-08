package com.colorful;

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

        userMapper userM = sqls.getMapper(userMapper.class);
//        userM.changeUserStatus((byte) 1,"test6");
        System.out.println(userM.selectAll());
        userM.changeUser(4, (byte) 1,null,"test12234");
        sqls.close();
    }
}
