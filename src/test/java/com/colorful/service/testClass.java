package com.colorful.service;

import com.colorful.config.SpringConfig;
import com.colorful.service.UserService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = SpringConfig.class)
public class testClass {
    @Autowired
    private UserService service;


    @Test
    public void test() {
        System.out.println(service.selectAll());
    }
}
