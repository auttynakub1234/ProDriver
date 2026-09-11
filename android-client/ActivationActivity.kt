package com.prodriver.modapk

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.gson.Gson
import com.prodriver.modapk.api.ApiClient
import com.prodriver.modapk.models.ActivationRequest
import com.prodriver.modapk.models.ActivationResponse
import com.prodriver.modapk.utils.SecurityHelper
import okhttp3.Call
import okhttp3.Callback
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response
import java.io.IOException

class ActivationActivity : AppCompatActivity() {

    private lateinit var editTextKey: EditText
    private lateinit var buttonActivate: Button
    private lateinit var progressBar: ProgressBar
    private lateinit var textViewStatus: TextView
    private lateinit var textViewDeviceId: TextView

    private val client: OkHttpClient by lazy { ApiClient.getClient() }
    private val gson = Gson()
    private lateinit var deviceId: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // ตรวจสอบว่าเปิดใช้งานแล้วหรือไม่
        if (SecurityHelper.isActivated(this)) {
            goToMainActivity()
            return
        }

        setContentView(R.layout.activity_activation)

        // Initialize views
        editTextKey = findViewById(R.id.editTextKey)
        buttonActivate = findViewById(R.id.buttonActivate)
        progressBar = findViewById(R.id.progressBar)
        textViewStatus = findViewById(R.id.textViewStatus)
        textViewDeviceId = findViewById(R.id.textViewDeviceId)

        // Get Device ID
        deviceId = getDeviceId(this)
        textViewDeviceId.text = "Device ID: $deviceId"

        // Button click
        buttonActivate.setOnClickListener {
            val key = editTextKey.text.toString().trim()
            if (key.isEmpty()) {
                Toast.makeText(this, "กรุณากรอก License Key", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            activateKey(key)
        }
    }

    /**
     * ดึง Device ID (Android ID)
     */
    private fun getDeviceId(context: Context): String {
        return Settings.Secure.getString(
            context.contentResolver,
            Settings.Secure.ANDROID_ID
        ) ?: "UNKNOWN_DEVICE"
    }

    /**
     * เปิดใช้งาน License Key
     */
    private fun activateKey(key: String) {
        setLoading(true)

        val request = ActivationRequest(key.uppercase(), deviceId)
        val json = gson.toJson(request)

        val mediaType = "application/json; charset=utf-8".toMediaType()
        val requestBody = json.toRequestBody(mediaType)

        val httpRequest = Request.Builder()
            .url(ApiClient.API_ACTIVATE)
            .post(requestBody)
            .build()

        client.newCall(httpRequest).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                runOnUiThread {
                    setLoading(false)
                    textViewStatus.text = "❌ เชื่อมต่อเซิร์ฟเวอร์ไม่สำเร็จ"
                    textViewStatus.setTextColor(resources.getColor(android.R.color.holo_red_dark))
                    Toast.makeText(
                        this@ActivationActivity,
                        "ไม่สามารถเชื่อมต่อได้: ${e.message}",
                        Toast.LENGTH_LONG
                    ).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                val responseBody = response.body?.string() ?: ""

                runOnUiThread {
                    setLoading(false)
                    handleActivationResponse(responseBody)
                }
            }
        })
    }

    /**
     * จัดการผลลัพธ์
     */
    private fun handleActivationResponse(responseBody: String) {
        try {
            val response = gson.fromJson(responseBody, ActivationResponse::class.java)

            if (response.isSuccess) {
                // บันทึกข้อมูล
                SecurityHelper.saveToken(this, response.token)
                SecurityHelper.saveDeviceId(this, deviceId)

                response.product?.let {
                    SecurityHelper.saveProductName(this, it.name)
                }

                textViewStatus.text = "✓ ${response.message}"
                textViewStatus.setTextColor(resources.getColor(android.R.color.holo_green_dark))

                Toast.makeText(this, "เปิดใช้งานสำเร็จ!", Toast.LENGTH_SHORT).show()

                // ไปหน้าหลัก
                android.os.Handler().postDelayed({ goToMainActivity() }, 1500)

            } else {
                textViewStatus.text = "❌ ${response.message}"
                textViewStatus.setTextColor(resources.getColor(android.R.color.holo_red_dark))
                Toast.makeText(this, response.message, Toast.LENGTH_LONG).show()
            }

        } catch (e: Exception) {
            textViewStatus.text = "❌ เกิดข้อผิดพลาด"
            textViewStatus.setTextColor(resources.getColor(android.R.color.holo_red_dark))
            Toast.makeText(this, "ไม่สามารถอ่านข้อมูลได้", Toast.LENGTH_SHORT).show()
        }
    }

    /**
     * แสดง/ซ่อน Loading
     */
    private fun setLoading(loading: Boolean) {
        progressBar.visibility = if (loading) View.VISIBLE else View.GONE
        buttonActivate.isEnabled = !loading
        editTextKey.isEnabled = !loading
    }

    /**
     * ไปหน้าหลัก
     */
    private fun goToMainActivity() {
        val intent = Intent(this, MainActivity::class.java)
        startActivity(intent)
        finish()
    }
}
