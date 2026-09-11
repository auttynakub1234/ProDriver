# Android Client - ProDriver

โค้ด Android สำหรับเชื่อมต่อกับ ProDriver API

## 📁 โครงสร้างไฟล์

```
android-client/
├── AndroidManifest.xml              # Manifest ของแอป
├── build.gradle                     # Dependencies
├── proguard-rules.pro              # การปกป้องโค้ด
├── ApiClient.java                  # HTTP Client
├── models/
│   ├── ActivationRequest.java      # Request model
│   └── ActivationResponse.java     # Response model
├── utils/
│   └── SecurityHelper.java         # บันทึก Token แบบปลอดภัย
├── ActivationActivity.java         # หน้าเปิดใช้งาน (Java)
├── ActivationActivity.kt           # หน้าเปิดใช้งาน (Kotlin)
└── activity_activation.xml         # Layout

```

## 🛠️ การติดตั้ง

### 1. สร้างโปรเจกต์ Android ใหม่
- Android Studio → New Project
- Empty Activity
- Language: เลือก **Java** หรือ **Kotlin**
- Minimum SDK: **API 21** (Android 5.0)

### 2. คัดลอกไฟล์
```
android-client/AndroidManifest.xml → app/src/main/AndroidManifest.xml
android-client/build.gradle → app/build.gradle
android-client/proguard-rules.pro → app/proguard-rules.pro
```

### 3. สร้าง Package Structure
```
app/src/main/java/com/prodriver/modapk/
├── api/
│   └── ApiClient.java
├── models/
│   ├── ActivationRequest.java
│   └── ActivationResponse.java
├── utils/
│   └── SecurityHelper.java
├── ActivationActivity.java (หรือ .kt)
└── MainActivity.java (หรือ .kt)
```

### 4. แก้ไข API URL
เปิดไฟล์ `ApiClient.java` และเปลี่ยน URL:
```java
public static final String BASE_URL = "https://your-domain.vercel.app";
```

### 5. Sync Gradle
คลิก **Sync Now** ใน Android Studio

## 🔐 ความปลอดภัย

### ProGuard/R8 Obfuscation
ไฟล์ `proguard-rules.pro` ป้องกัน:
- ✅ Decompile โค้ด
- ✅ แกะ API endpoints
- ✅ ดู Device ID logic

### Encrypted SharedPreferences
ใช้ `androidx.security.crypto` เข้ารหัส:
- Token
- Device ID
- ข้อมูลสินค้า

## 📱 การใช้งาน

### Flow
1. แอปเปิด → ตรวจสอบ Token
2. ถ้าไม่มี → แสดงหน้า Activation
3. ผู้ใช้กรอก License Key
4. แอปส่ง Key + Device ID → API
5. รับ Token → บันทึกแบบเข้ารหัส
6. ไปหน้าหลัก

### ทดสอบ
```bash
# Build APK
./gradlew assembleDebug

# APK จะอยู่ที่
app/build/outputs/apk/debug/app-debug.apk
```

## 🚀 Release Build

```bash
# สร้าง Signed APK
./gradlew assembleRelease

# หรือใน Android Studio:
# Build → Generate Signed Bundle / APK
```

## 📝 หมายเหตุ

- **Device ID** = Android ID (เปลี่ยนเมื่อ Factory Reset)
- **Token** เก็บในรูปแบบเข้ารหัส
- **ProGuard** ทำงานใน Release build เท่านั้น

## 🆘 Troubleshooting

### Build Failed
```bash
# ล้าง cache
./gradlew clean
./gradlew build --refresh-dependencies
```

### Network Error
- ตรวจสอบ `AndroidManifest.xml` มี `INTERNET` permission
- ตรวจสอบ URL ใน `ApiClient.java` ถูกต้อง
- ทดสอบ API ด้วย Postman ก่อน

### Token ไม่ถูกบันทึก
- ตรวจสอบ `SecurityHelper.java` import ถูกต้อง
- เพิ่ม dependency `androidx.security:security-crypto`
