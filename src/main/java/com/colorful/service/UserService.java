package com.colorful.service;

import com.colorful.domain.User;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

//加事务
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
    public boolean addUser(String name,String password);

    /**
     * 获取所有用户列表
     * @return
     */
    public List<User> selectAll();

    /**
     * 查看用户名是否存在
     * @param name
     * @return
     */
    public User selectByName(String name);

    /**
     * 更改管理员状态
     * @param value
     * @param name
     * @return
     */
    public boolean changeMana(byte value, String name);

    /**
     * 更改用户登录状态
     * @param value
     * @param name
     * @return
     */
    public boolean changeStatus(byte value, String name);

    /**
     *更改用户名
     * @param value
     * @param name
     * @return
     */
    public boolean changeName(String value, String name);

    /**
     *更改用户密码
     * @param value
     * @param name
     * @return
     */
    public boolean changePassword(String value, String name);

    /**
     * 通过用户id删除用户
     * @param id
     */
    public boolean deleteById(Integer id);

    /**
     * 删除表的id列
     */
    public void idDel();

    /**
     * 重新添加id列，实现重新排序
     */
    public void idSort();


}
