package com.colorful.web.servlet;

import com.alibaba.fastjson.JSON;
import com.colorful.service.imp.hardwareServiceImp;
import com.colorful.service.imp.userServiceImp;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/hardware/*")
public class hardwareServlet extends baseServlet {
    private hardwareServiceImp service = new hardwareServiceImp();

    public void selectAll(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("hardware");
    }
}
