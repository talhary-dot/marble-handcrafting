package com.sangtarash.app.storage;

import android.content.Context;
import android.content.SharedPreferences;
import org.json.JSONArray;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class WishlistManager {
    private static final String PREF_NAME = "sang_tarash_wishlist";
    private static final String KEY_IDS = "wishlist_product_ids";

    public interface WishlistListener {
        void onWishlistChanged();
    }

    private static final List<WishlistListener> sListeners = new ArrayList<>();

    public static void addListener(WishlistListener listener) {
        if (listener != null && !sListeners.contains(listener)) {
            sListeners.add(listener);
        }
    }

    public static void removeListener(WishlistListener listener) {
        if (listener != null) {
            sListeners.remove(listener);
        }
    }

    private static void notifyChanged() {
        for (WishlistListener l : sListeners) {
            try {
                l.onWishlistChanged();
            } catch (Exception ignored) {}
        }
    }

    public static synchronized Set<String> getWishlistIds(Context context) {
        Set<String> set = new HashSet<>();
        if (context == null) return set;

        SharedPreferences prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        String raw = prefs.getString(KEY_IDS, "[]");
        try {
            JSONArray arr = new JSONArray(raw);
            for (int i = 0; i < arr.length(); i++) {
                String id = arr.optString(i);
                if (id != null && !id.isEmpty()) {
                    set.add(id);
                }
            }
        } catch (Exception ignored) {}
        return set;
    }

    public static synchronized boolean isWishlisted(Context context, String productId) {
        if (productId == null) return false;
        return getWishlistIds(context).contains(productId);
    }

    public static synchronized boolean toggle(Context context, String productId) {
        if (context == null || productId == null) return false;

        Set<String> current = getWishlistIds(context);
        boolean nowFavorited;
        if (current.contains(productId)) {
            current.remove(productId);
            nowFavorited = false;
        } else {
            current.add(productId);
            nowFavorited = true;
        }

        JSONArray arr = new JSONArray();
        for (String id : current) {
            arr.put(id);
        }

        SharedPreferences prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        prefs.edit().putString(KEY_IDS, arr.toString()).apply();
        notifyChanged();
        return nowFavorited;
    }

    public static synchronized int getCount(Context context) {
        return getWishlistIds(context).size();
    }

    public static synchronized int getWishlistCount(Context context) {
        return getCount(context);
    }

    public static synchronized void clear(Context context) {
        if (context == null) return;
        SharedPreferences prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        prefs.edit().remove(KEY_IDS).apply();
        notifyChanged();
    }
}
