package com.prodriver.modapk;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.provider.Settings;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.gson.Gson;
import com.prodriver.modapk.api.ApiClient;
import com.prodriver.modapk.models.ActivationRequest;
import com.prodriver.modapk.models.ActivationResponse;
import com.prodriver.modapk.utils.SecurityHelper;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class ActivationActivity extends AppCompatActivity {

    private EditText editTextKey;
    private Button buttonActivate;
    private ProgressBar progressBar;
    private TextView textViewStatus;
    private TextView textViewDeviceId;

    private OkHttpClient client;
    private Gson gson;
    private String deviceId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // ตรวจสอบว่าเปิดใช้งานแล้วหรือไม่
        if (SecurityHelper.isActivated(this)) {
            goToMainActivity();
            return;
        }

        setContentView(R.layout.activity_activation);

        // Initialize
        client = ApiClient.getClient();
        gson = new Gson();

        // Find views
        editTextKey = findViewById(R.id.editTextKey);
        buttonActivate = findViewById(R.id.buttonActivate);
        progressBar = findViewById(R.id.progressBar);
        textViewStatus = findViewById(R.id.textViewStatus);
        textViewDeviceId = findViewById(R.id.textViewDeviceId);

        // Get Device ID
        deviceId = getDeviceId(this);
        textViewDeviceId.setText("Device ID: " + deviceId);

        // Button click
        buttonActivate.setOnClickListener(v -> {
            String key = editTextKey.getText().toString().trim();
            if (key.isEmpty()) {
                Toast.makeText(this, "กรุณากรอก License Key", Toast.LENGTH_SHORT).show();
                return;
            }
            activateKey(key);
        });
    }

    /**
     * ดึง Device ID (Android ID)
     */
    private String getDeviceId(Context context) {
        String id = Settings.Secure.getString(
                context.getContentResolver(),
                Settings.Secure.ANDROID_ID
        );
        return (id != null) ? id : "UNKNOWN_DEVICE";
    }

    /**
     * เปิดใช้งาน License Key
     */
    private void activateKey(String key) {
        setLoading(true);

        ActivationRequest request = new ActivationRequest(key.toUpperCase(), deviceId);
        String json = gson.toJson(request);

        MediaType mediaType = MediaType.parse("application/json; charset=utf-8");
        RequestBody requestBody = RequestBody.create(json, mediaType);

        Request httpRequest = new Request.Builder()
                .url(ApiClient.API_ACTIVATE)
                .post(requestBody)
                .build();

        client.newCall(httpRequest).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                runOnUiThread(() -> {
                    setLoading(false);
                    textViewStatus.setText("❌ เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ");
                    textViewStatus.setTextColor(getResources().getColor(android.R.color.holo_red_dark));
                    Toast.makeText(ActivationActivity.this,
                            "ไม่สามารถเชื่อมต่อได้: " + e.getMessage(),
                            Toast.LENGTH_LONG).show();
                });
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                final String responseBody = response.body().string();

                runOnUiThread(() -> {
                    setLoading(false);
                    handleActivationResponse(responseBody);
                });
            }
        });
    }

    /**
     * จัดการผลลัพธ์
     */
    private void handleActivationResponse(String responseBody) {
        try {
            ActivationResponse response = gson.fromJson(responseBody, ActivationResponse.class);

            if (response.isSuccess()) {
                // บันทึกข้อมูล
                SecurityHelper.saveToken(this, response.getToken());
                SecurityHelper.saveDeviceId(this, deviceId);

                if (response.getProduct() != null) {
                    SecurityHelper.saveProductName(this, response.getProduct().getName());
                }

                textViewStatus.setText("✓ " + response.getMessage());
                textViewStatus.setTextColor(getResources().getColor(android.R.color.holo_green_dark));

                Toast.makeText(this, "เปิดใช้งานสำเร็จ!", Toast.LENGTH_SHORT).show();

                // ไปหน้าหลัก
                new android.os.Handler().postDelayed(this::goToMainActivity, 1500);

            } else {
                textViewStatus.setText("❌ " + response.getMessage());
                textViewStatus.setTextColor(getResources().getColor(android.R.color.holo_red_dark));
                Toast.makeText(this, response.getMessage(), Toast.LENGTH_LONG).show();
            }

        } catch (Exception e) {
            textViewStatus.setText("❌ เกิดข้อผิดพลาด");
            textViewStatus.setTextColor(getResources().getColor(android.R.color.holo_red_dark));
            Toast.makeText(this, "ไม่สามารถอ่านข้อมูลได้", Toast.LENGTH_SHORT).show();
        }
    }

    /**
     * แสดง/ซ่อน Loading
     */
    private void setLoading(boolean loading) {
        progressBar.setVisibility(loading ? View.VISIBLE : View.GONE);
        buttonActivate.setEnabled(!loading);
        editTextKey.setEnabled(!loading);
    }

    /**
     * ไปหน้าหลัก
     */
    private void goToMainActivity() {
        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
        finish();
    }
}
