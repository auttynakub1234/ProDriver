package com.prodriver.modapk.utils;

import android.content.Context;
import android.content.SharedPreferences;
import androidx.security.crypto.EncryptedSharedPreferences;
import androidx.security.crypto.MasterKey;

public class SecurityHelper {

    private static final String PREFS_NAME = "ProDriverSecure";
    private static final String KEY_TOKEN = "jwt_token";
    private static final String KEY_DEVICE_ID = "device_id";
    private static final String KEY_PRODUCT_NAME = "product_name";

    /**
     * รับ Encrypted SharedPreferences
     */
    public static SharedPreferences getSecurePrefs(Context context) {
        try {
            MasterKey masterKey = new MasterKey.Builder(context)
                    .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
                    .build();

            return EncryptedSharedPreferences.create(
                    context,
                    PREFS_NAME,
                    masterKey,
                    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
                    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
            );
        } catch (Exception e) {
            e.printStackTrace();
            // Fallback to normal SharedPreferences
            return context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        }
    }

    /**
     * บันทึก Token
     */
    public static void saveToken(Context context, String token) {
        getSecurePrefs(context).edit()
                .putString(KEY_TOKEN, token)
                .apply();
    }

    /**
     * ดึง Token
     */
    public static String getToken(Context context) {
        return getSecurePrefs(context).getString(KEY_TOKEN, null);
    }

    /**
     * บันทึก Device ID
     */
    public static void saveDeviceId(Context context, String deviceId) {
        getSecurePrefs(context).edit()
                .putString(KEY_DEVICE_ID, deviceId)
                .apply();
    }

    /**
     * ดึง Device ID
     */
    public static String getDeviceId(Context context) {
        return getSecurePrefs(context).getString(KEY_DEVICE_ID, null);
    }

    /**
     * บันทึกชื่อสินค้า
     */
    public static void saveProductName(Context context, String productName) {
        getSecurePrefs(context).edit()
                .putString(KEY_PRODUCT_NAME, productName)
                .apply();
    }

    /**
     * ดึงชื่อสินค้า
     */
    public static String getProductName(Context context) {
        return getSecurePrefs(context).getString(KEY_PRODUCT_NAME, "ProDriver Premium");
    }

    /**
     * ล้างข้อมูลทั้งหมด (Logout)
     */
    public static void clearAll(Context context) {
        getSecurePrefs(context).edit().clear().apply();
    }

    /**
     * ตรวจสอบว่ามี Token หรือไม่
     */
    public static boolean isActivated(Context context) {
        return getToken(context) != null;
    }
}
