package com.prodriver.modapk.api;

import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import java.util.concurrent.TimeUnit;

public class ApiClient {

    // ⚠️ เปลี่ยน URL นี้เป็น Domain ของคุณ
    public static final String BASE_URL = "https://your-domain.vercel.app";
    public static final String API_ACTIVATE = BASE_URL + "/api/activate";
    public static final String API_PRODUCTS = BASE_URL + "/api/products";

    private static OkHttpClient client;

    public static OkHttpClient getClient() {
        if (client == null) {
            HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
            logging.setLevel(HttpLoggingInterceptor.Level.BODY);

            client = new OkHttpClient.Builder()
                    .connectTimeout(30, TimeUnit.SECONDS)
                    .readTimeout(30, TimeUnit.SECONDS)
                    .writeTimeout(30, TimeUnit.SECONDS)
                    .addInterceptor(logging)
                    .build();
        }
        return client;
    }
}
