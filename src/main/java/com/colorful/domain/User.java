package com.colorful.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
public class User {
    private int id;
    private String name;
    private String password;
    private boolean status;
    private boolean mana;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public boolean isMana() {
        return mana;
    }

    public void setMana(boolean mana) {
        this.mana = mana;
    }
}
