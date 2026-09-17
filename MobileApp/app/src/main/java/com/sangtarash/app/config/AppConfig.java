package com.sangtarash.app.config;

import android.content.Context;
import android.content.SharedPreferences;

/**
 * Global Configuration for Sang Tarash Mobile Client.
 *
 * Defaults are ingested directly from .env at build time (via EnvConfig),
 * while supporting runtime overrides persisted in private SharedPreferences.
 * Zero hardcoded secrets.
 */
public class AppConfig {
    private static final String PREF_NAME = "sang_tarash_config";
    private static final String KEY_BASE_URL = "api_base_url";

    public static final String DEFAULT_EMULATOR_URL = "http://10.0.2.2:3000";
    public static final String DEFAULT_LOCALHOST_URL = "http://localhost:3000";

    public static String getBaseUrl(Context context) {
        if (context == null) return EnvConfig.BACKEND_URL;
        SharedPreferences prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        return prefs.getString(KEY_BASE_URL, EnvConfig.BACKEND_URL);
    }

    public static void setBaseUrl(Context context, String url) {
        if (context == null || url == null) return;
        String clean = url.trim();
        while (clean.endsWith("/")) {
            clean = clean.substring(0, clean.length() - 1);
        }
        SharedPreferences prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        prefs.edit().putString(KEY_BASE_URL, clean).apply();
    }

    public static String resolveImageUrl(Context context, String path) {
        if (path == null || path.trim().isEmpty()) {
            return "";
        }
        String trimmed = path.trim();
        if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
            return trimmed;
        }
        String base = getBaseUrl(context);
        if (trimmed.startsWith("/")) {
            return base + trimmed;
        }
        return base + "/" + trimmed;
    }

    public static int getTimeoutMs() {
        return EnvConfig.REQUEST_TIMEOUT_MS;
    }

    public static String getEnvironment() {
        return EnvConfig.APP_ENVIRONMENT;
    }
}
