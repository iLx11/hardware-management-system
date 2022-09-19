package com.colorful.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@Configuration
@ComponentScan({"com.colorful.controller","com.colorful.config"})
//数据转换支持
@EnableWebMvc
public class SpringMvcConfig {
}
