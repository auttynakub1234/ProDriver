package com.prodriver.modapk.models;

public class ActivationResponse {
    private boolean success;
    private String message;
    private String token;
    private Product product;

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public String getToken() {
        return token;
    }

    public Product getProduct() {
        return product;
    }

    public static class Product {
        private String name;
        private String downloadUrl;

        public String getName() {
            return name;
        }

        public String getDownloadUrl() {
            return downloadUrl;
        }
    }
}
