package com.colorful.controller;

import com.colorful.domain.User;
import com.colorful.service.UserService;
import com.colorful.service.impl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@ResponseBody
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService service;

    @PostMapping
    public String userVerify(String name, String password) {

        return "sd23";
    }
    @GetMapping
    public List<User> selectAll() {
        return service.selectAll();
    }

    @GetMapping("/{name}")
    public User selectByName(@PathVariable String name) {
       return service.selectByName(name);
    }
}
