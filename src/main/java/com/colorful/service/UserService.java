package com.colorful.service;

import com.colorful.domain.User;
import org.apache.ibatis.annotations.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface UserService {
    /**
     * 验证用户
     * @param name
     * @param password
     * @return
     */
    public User userVerify(String name, String password);

    /**
     * 添加用户
     * @param name
     * @param password
     */
    public void addUser(String name,String password);

    /**
     * 获取所有用户列表
     * @return
     */
    public List<User> selectAll();

    /**
     * 查看用户名是否存在（修改用户名）
     * @param name
     * @return
     */
    public User selectByName(String name);

    /**
     * 通过用户id删除用户
     * @param id
     */
    public void deleteById(Integer id);

    /**
     * 删除表的id列
     */
    public void idDel();

    /**
     * 重新添加id列，实现重新排序
     */
    public void idSort();


}
