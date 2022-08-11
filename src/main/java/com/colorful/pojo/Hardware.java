package com.colorful.pojo;

public class Hardware {
    private int id;
    private String name;
    private String hardwareID;
    private int hardwarePort;
    private boolean status;

    public int getHardwarePort() {
        return hardwarePort;
    }

    public void setHardwarePort(int hardwarePort) {
        this.hardwarePort = hardwarePort;
    }

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

    public String getHardwareID() {
        return hardwareID;
    }

    public void setHardwareID(String hardwareID) {
        this.hardwareID = hardwareID;
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
                ", hardwareID='" + hardwareID + '\'' +
                ", hardwarePort=" + hardwarePort +
                ", status=" + status +
                '}';
    }
}
