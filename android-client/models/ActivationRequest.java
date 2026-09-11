package com.prodriver.modapk.models;

public class ActivationRequest {
    private String key;
    private String deviceId;

    public ActivationRequest(String key, String deviceId) {
        this.key = key;
        this.deviceId = deviceId;
    }

    public String getKey() {
        return key;
    }

    public String getDeviceId() {
        return deviceId;
    }
}
