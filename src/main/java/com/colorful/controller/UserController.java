package com.colorful.controller;

import com.alibaba.druid.support.json.JSONParser;
import com.colorful.domain.User;
import com.colorful.domain.UserChange;
import com.colorful.service.UserService;
import org.apache.ibatis.annotations.Delete;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Field;
import java.util.List;

@Controller
@ResponseBody
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService service;

    @PostMapping("/login")
    public Result userVerify(@RequestBody User user, HttpServletResponse response, HttpServletRequest request) throws IOException {
        if (service.userVerify(user.getName(), user.getPassword()) != null) {
            addCookie("user", user.getName(), response, request);
            return new Result(Code.GET_OK, null, "验证成功");
        } else {
            return new Result(Code.GET_ERR, null, "验证失败");
        }
    }

    @PostMapping("/register")
    public Result addUser(@RequestBody User user) {
        return new Result(service.addUser(user.getName(), user.getPassword()) ? Code.POST_OK : Code.POST_ERR, null, "注册成功");
    }

    @GetMapping
    public Result selectAll() {
        return new Result(Code.GET_OK, service.selectAll());
    }

    @GetMapping("/{name}")
    public Result selectByName(@PathVariable String name) {
        return new Result(service.selectByName(name) != null ? Code.GET_OK : Code.GET_ERR, null);
    }

    @PostMapping("/{method}")
    public Result changeUser(@PathVariable Integer method, @RequestBody UserChange value) {
//        System.out.println(method + "--" + value + "--" + name);
        if (method == 1) {
            System.out.println(method + "--" +value + "--" + value.getName());
            int mana = Integer.parseInt(value.getValue());
            boolean flag = service.changeMana((byte) mana, value.getName());
            return new Result(flag ? Code.PUT_OK : Code.PUT_ERR, flag);
        } else if (method == 2) {
            int status = Integer.parseInt(value.getValue());
            boolean flag = service.changeStatus((byte) status, value.getName());
            return new Result(flag ? Code.PUT_OK : Code.PUT_ERR, flag);
        } else if (method == 3) {
            boolean flag = service.changeName(value.getValue(), value.getName());
            return new Result(flag ? Code.PUT_OK : Code.PUT_ERR, flag);
        } else if (method == 4) {
            boolean flag = service.changePassword(value.getValue(), value.getName());
            return new Result(flag ? Code.PUT_OK : Code.PUT_ERR, flag);
        }else {
            return new Result(Code.PUT_ERR, false, "修改失败");
        }
    }

    @DeleteMapping("/{id}")
    public Result delById(@PathVariable Integer id) {
        boolean flag = service.deleteById(id);
        if (flag) {
            service.idDel();
            service.idSort();
        }
        return new Result(flag ? Code.DEL_OK : Code.DEL_ERR, flag, flag ? "删除成功" : "删除失败");
    }

    /**
     * 添加Cookie
     *
     * @param name
     * @param value
     * @param response
     * @param request
     * @throws UnsupportedEncodingException
     */
    public static void addCookie(String name, String value, HttpServletResponse response, HttpServletRequest request) throws UnsupportedEncodingException {
        //创建cookie
        Cookie nameCookie = new Cookie(name, value);
        //设置cookie路径
        nameCookie.setPath("/");
        //设置cookie保存的时间 单位：秒
        nameCookie.setMaxAge(60 * 60);
        //将cookie添加到响应
        response.addCookie(nameCookie);
    }
}
