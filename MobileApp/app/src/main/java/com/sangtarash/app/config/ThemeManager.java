package com.sangtarash.app.config;

import android.content.Context;
import android.content.SharedPreferences;
import java.util.ArrayList;
import java.util.List;

public class ThemeManager {
    private static final String PREF_NAME = "sang_tarash_theme";
    private static final String KEY_IS_DARK = "is_dark_mode";

    public interface ThemeListener {
        void onThemeChanged(boolean isDark);
    }

    private static final List<ThemeListener> sListeners = new ArrayList<>();

    public static void addListener(ThemeListener listener) {
        if (listener != null && !sListeners.contains(listener)) {
            sListeners.add(listener);
        }
    }

    public static void removeListener(ThemeListener listener) {
        if (listener != null) {
            sListeners.remove(listener);
        }
    }

    /**
     * Defaults to Light Theme (false) as requested, while supporting instant Dark Mode toggle.
     */
    public static boolean isDarkMode(Context context) {
        if (context == null) return false;
        SharedPreferences prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        return prefs.getBoolean(KEY_IS_DARK, false);
    }

    public static void setDarkMode(Context context, boolean isDark) {
        if (context == null) return;
        SharedPreferences prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        prefs.edit().putBoolean(KEY_IS_DARK, isDark).apply();

        for (ThemeListener l : sListeners) {
            try {
                l.onThemeChanged(isDark);
            } catch (Exception ignored) {}
        }
    }

    public static void toggleTheme(Context context) {
        setDarkMode(context, !isDarkMode(context));
    }

    // Dynamic Color Palette Tokens
    public static int getBgColor(boolean isDark) {
        return isDark ? 0xFF0D0D0D : 0xFFF9F8F5; // Dark obsidian vs warm alabaster marble
    }

    public static int getSurfaceColor(boolean isDark) {
        return isDark ? 0xFF161616 : 0xFFFFFFFF; // Dark surface vs pure white
    }

    public static int getCardColor(boolean isDark) {
        return isDark ? 0xFF1E1E1E : 0xFFFFFFFF; // Dark card vs white card
    }

    public static int getBorderColor(boolean isDark) {
        return isDark ? 0xFF2C2C2C : 0xFFE5E2DA; // Dark border vs warm stone border
    }

    public static int getTextPrimary(boolean isDark) {
        return isDark ? 0xFFF5F5F0 : 0xFF181714; // Light text vs rich deep charcoal
    }

    public static int getTextSecondary(boolean isDark) {
        return isDark ? 0xFFA0A09B : 0xFF5C5A54; // Mid-tone stone gray
    }

    public static int getTextMuted(boolean isDark) {
        return isDark ? 0xFF686862 : 0xFF8C8A82; // Soft pebble gray
    }

    public static int getBronze(boolean isDark) {
        return isDark ? 0xFFC5A059 : 0xFF8C6D37; // Bronze gold
    }

    public static int getGold(boolean isDark) {
        return isDark ? 0xFFD4AF37 : 0xFFA87C28;
    }

    public static int getSearchBg(boolean isDark) {
        return isDark ? 0xFF161616 : 0xFFEDEAE3;
    }

    public static int getChipInactiveBg(boolean isDark) {
        return isDark ? 0xFF1A1A1A : 0xFFECE9E2;
    }

    public static int getChipActiveBg(boolean isDark) {
        return isDark ? 0xFF2D2416 : 0xFFF5EEDD;
    }

    public static int dpToPx(Context context, float dp) {
        if (context == null) return (int) dp;
        return (int) (dp * context.getResources().getDisplayMetrics().density + 0.5f);
    }

    public static int getSecondaryBtnBg(boolean isDark) {
        return isDark ? 0xFF161616 : 0xFFEDEAE3;
    }

    public static android.graphics.drawable.GradientDrawable createSecondaryButtonDrawable(boolean isDark, float cornerRadiusPx) {
        android.graphics.drawable.GradientDrawable gd = new android.graphics.drawable.GradientDrawable();
        gd.setColor(getSecondaryBtnBg(isDark));
        gd.setCornerRadius(cornerRadiusPx);
        gd.setStroke(1, getBorderColor(isDark));
        return gd;
    }

    public static android.graphics.drawable.GradientDrawable createVariantCardDrawable(boolean isDark, boolean isSelected, float cornerRadiusPx) {
        android.graphics.drawable.GradientDrawable gd = new android.graphics.drawable.GradientDrawable();
        if (isSelected) {
            gd.setColor(isDark ? 0xFF2D2416 : 0xFFF5EEDD);
            gd.setCornerRadius(cornerRadiusPx);
            gd.setStroke(3, isDark ? 0xFFC5A059 : 0xFF8C6D37);
        } else {
            gd.setColor(getCardColor(isDark));
            gd.setCornerRadius(cornerRadiusPx);
            gd.setStroke(1, getBorderColor(isDark));
        }
        return gd;
    }

    public static android.graphics.drawable.GradientDrawable createCardDrawable(boolean isDark, float cornerRadiusPx) {
        android.graphics.drawable.GradientDrawable gd = new android.graphics.drawable.GradientDrawable();
        gd.setColor(getCardColor(isDark));
        gd.setCornerRadius(cornerRadiusPx);
        gd.setStroke(2, getBorderColor(isDark));
        return gd;
    }

    public static android.graphics.drawable.GradientDrawable createSearchDrawable(boolean isDark, float cornerRadiusPx) {
        android.graphics.drawable.GradientDrawable gd = new android.graphics.drawable.GradientDrawable();
        gd.setColor(getSearchBg(isDark));
        gd.setCornerRadius(cornerRadiusPx);
        gd.setStroke(2, getBorderColor(isDark));
        return gd;
    }

    public static android.graphics.drawable.GradientDrawable createChipDrawable(boolean isDark, boolean isActive, float cornerRadiusPx) {
        android.graphics.drawable.GradientDrawable gd = new android.graphics.drawable.GradientDrawable();
        if (isActive) {
            gd.setColor(getChipActiveBg(isDark));
            gd.setCornerRadius(cornerRadiusPx);
            gd.setStroke(2, getBronze(isDark));
        } else {
            gd.setColor(getChipInactiveBg(isDark));
            gd.setCornerRadius(cornerRadiusPx);
            gd.setStroke(1, getBorderColor(isDark));
        }
        return gd;
    }
}
