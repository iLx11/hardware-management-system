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
        String result = JSON.toJSONString(service.selectALL());
        response.getWriter().write(result);
        System.out.println(result);
    }

    public void addHardware(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String name = request.getParameter("name");
        String hardware_id = request.getParameter("hardware_id");
        int hardware_port = Integer.parseInt(request.getParameter("hardware_port"));
        service.addHardware(name, hardware_id, hardware_port);
        response.getWriter().write("res");
    }

    public void changeHardware(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int id = Integer.parseInt(request.getParameter("id"));
        String name = request.getParameter("name");
        String hardware_id = request.getParameter("hardware_id");
        int hardware_port = Integer.parseInt(request.getParameter("hardware_port"));
        service.changeHardware(id,name, hardware_id, hardware_port);
        response.getWriter().write("res");
    }

    public void changeStatus(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int id = Integer.parseInt(request.getParameter("id"));
        String st = request.getParameter("status");
        byte status = 1;
        if("false".equals(st)) {
            status = 0;
        }
        service.changeStatus(id, status);
        response.getWriter().write("res");
    }

    public void delHardware(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int id = Integer.parseInt(request.getParameter("id"));
        service.delHardware(id);
        service.idDel();
        service.idSort();
        response.getWriter().write("res");
    }
}
