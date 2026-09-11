# ความปลอดภัย - ProGuard Rules

# Keep OkHttp
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }

# Keep Gson
-keepattributes Signature
-keepattributes *Annotation*
-keep class com.google.gson.** { *; }
-keep class * implements com.google.gson.TypeAdapter
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer

# Keep Models
-keep class com.prodriver.modapk.models.** { *; }
-keep class com.prodriver.modapk.api.** { *; }

# ป้องกันโค้ดสำคัญ
-keep class com.prodriver.modapk.ActivationActivity {
    private java.lang.String getDeviceId(android.content.Context);
    private void activateKey(java.lang.String);
}

-keep class com.prodriver.modapk.utils.SecurityHelper { *; }
-keep class com.prodriver.modapk.api.ApiClient { *; }

# เก็บ native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# เก็บ View constructors
-keepclasseswithmembers class * {
    public <init>(android.content.Context, android.util.AttributeSet);
}

# เก็บ Parcelable
-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}

# เก็บ Serializable
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}
