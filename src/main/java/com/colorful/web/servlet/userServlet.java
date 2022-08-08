package com.colorful.web.servlet;

import com.alibaba.fastjson.JSON;
import com.colorful.pojo.User;
import com.colorful.pojo.UserShow;
import com.colorful.service.imp.userServiceImp;
import com.colorful.service.userService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

@WebServlet("/user/*")
public class userServlet extends baseServlet {
    private userServiceImp service = new userServiceImp();

    public void selectAll(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String jsonstr = JSON.toJSONString(service.selectAll());
        response.getWriter().println(jsonstr);
    }

    public void userVerify(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        Cookie[] cookies = request.getCookies();
//        for (Cookie cookie: cookies) {
//            System.out.println(cookie.getName());
//            if(cookie.getName() == "user") {
//
//            }
//        }
        String name = request.getParameter("name");
        String password = request.getParameter("password");
        if (password == null) {
            UserShow user = service.selectByName(name);
            if (user != null) {
                response.getWriter().write("Exist");
            }
        }
        if (password != null && name != null) {
            User result = service.userVerify(name, password);
            if (result != null) {
                response.getWriter().write("Successful");
                service.changeUser(3, (byte) 1, null, name);
//            Cookie cookie = new Cookie("user",name);
//            response.addCookie(cookie);
//            cookie.setMaxAge(60 * 30);
            } else {
                response.getWriter().write("Failed");
            }
            System.out.println(result);
        }
    }

    public void deleteUser(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String idstr = request.getParameter("id");
        int id = Integer.parseInt(idstr);
        service.deleteById(id);
        service.idDel();
        service.idSort();
        String jsonstr = JSON.toJSONString(service.selectAll());
        response.getWriter().write(jsonstr);
    }

    public void changeUser(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int set = Integer.parseInt(request.getParameter("set"));
        byte status = 1;
        if ("false".equals(request.getParameter("status"))) {
            status = 0;
        }
        String value = request.getParameter("value");
        String name = request.getParameter("name");
        System.out.println(set + "---" + status + "---" + value + "---" + name);
        service.changeUser(set, status, value, name);
        String jsonstr = JSON.toJSONString(service.selectAll());
        response.getWriter().write(jsonstr);
    }

    public void addUser(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String name = request.getParameter("name");
        String password = request.getParameter("password");
        service.addUser(name, password);
        response.getWriter().write("Successful");
    }

}
