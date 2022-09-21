package com.colorful.domain;


public class Hardware {
    private int id;
    private String name;
    private String hardwareId;
    private int hardwarePort;
    private boolean status;

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

    public String getHardwareId() {
        return hardwareId;
    }

    public void setHardwareId(String hardwareId) {
        this.hardwareId = hardwareId;
    }

    public int getHardwarePort() {
        return hardwarePort;
    }

    public void setHardwarePort(int hardwarePort) {
        this.hardwarePort = hardwarePort;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "Hardware{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", hardwareId='" + hardwareId + '\'' +
                ", hardwarePort=" + hardwarePort +
                ", status=" + status +
                '}';
    }
}