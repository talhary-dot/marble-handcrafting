# Proguard / R8 Optimization & Obfuscation Rules for Sang Tarash Mobile App

-dontwarn **
-allowaccessmodification
-overloadaggressively

# Strip debug source file and line numbers for maximum size reduction
-renamesourcefileattribute ""
-keepattributes !SourceFile,!LineNumberTable,!LocalVariableTable,!LocalVariableTypeTable

# Strip Android logging calls
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int d(...);
    public static int i(...);
    public static int w(...);
    public static int e(...);
}

# Preserve Activities for AndroidManifest
-keep public class com.sangtarash.app.MainActivity extends android.app.Activity {
    public *;
}
-keep public class com.sangtarash.app.ProductDetailActivity extends android.app.Activity {
    public *;
}
-keep public class com.sangtarash.app.CartActivity extends android.app.Activity {
    public *;
}

# Preserve Data Models
-keep class com.sangtarash.app.model.** {
    public *;
}

# Preserve Resource Identifier Fields
-keepclassmembers class **.R$* {
    public static <fields>;
}
