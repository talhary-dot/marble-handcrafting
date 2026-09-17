package com.sangtarash.app.storage;

import android.content.Context;
import android.content.SharedPreferences;
import com.sangtarash.app.model.CartItem;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.List;

public class CartManager {
    private static final String PREF_NAME = "sang_tarash_cart";
    private static final String KEY_ITEMS = "cart_items_json";

    public interface CartListener {
        void onCartChanged();
    }

    private static final List<CartListener> sListeners = new ArrayList<>();

    public static void addListener(CartListener listener) {
        if (listener != null && !sListeners.contains(listener)) {
            sListeners.add(listener);
        }
    }

    public static void removeListener(CartListener listener) {
        if (listener != null) {
            sListeners.remove(listener);
        }
    }

    private static void notifyChanged() {
        for (CartListener l : sListeners) {
            try {
                l.onCartChanged();
            } catch (Exception ignored) {}
        }
    }

    public static synchronized List<CartItem> getItems(Context context) {
        List<CartItem> list = new ArrayList<>();
        if (context == null) return list;

        SharedPreferences prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        String raw = prefs.getString(KEY_ITEMS, "[]");
        try {
            JSONArray arr = new JSONArray(raw);
            for (int i = 0; i < arr.length(); i++) {
                JSONObject obj = arr.optJSONObject(i);
                if (obj != null) {
                    list.add(CartItem.fromJson(obj));
                }
            }
        } catch (Exception ignored) {}
        return list;
    }

    public static synchronized void saveItems(Context context, List<CartItem> items) {
        if (context == null) return;
        JSONArray arr = new JSONArray();
        for (CartItem item : items) {
            arr.put(item.toJson());
        }
        SharedPreferences prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        prefs.edit().putString(KEY_ITEMS, arr.toString()).apply();
        notifyChanged();
    }

    public static synchronized void addItem(Context context, CartItem newItem) {
        if (context == null || newItem == null) return;
        List<CartItem> current = getItems(context);
        boolean merged = false;
        for (CartItem item : current) {
            if (item.getKey().equals(newItem.getKey())) {
                item.quantity += newItem.quantity;
                merged = true;
                break;
            }
        }
        if (!merged) {
            current.add(newItem);
        }
        saveItems(context, current);
    }

    public static synchronized void updateQuantity(Context context, String key, int delta) {
        if (context == null || key == null) return;
        List<CartItem> current = getItems(context);
        List<CartItem> updated = new ArrayList<>();
        for (CartItem item : current) {
            if (item.getKey().equals(key)) {
                int newQty = item.quantity + delta;
                if (newQty > 0) {
                    item.quantity = newQty;
                    updated.add(item);
                }
            } else {
                updated.add(item);
            }
        }
        saveItems(context, updated);
    }

    public static synchronized void removeItem(Context context, String key) {
        if (context == null || key == null) return;
        List<CartItem> current = getItems(context);
        List<CartItem> updated = new ArrayList<>();
        for (CartItem item : current) {
            if (!item.getKey().equals(key)) {
                updated.add(item);
            }
        }
        saveItems(context, updated);
    }

    public static synchronized void clear(Context context) {
        if (context == null) return;
        SharedPreferences prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        prefs.edit().remove(KEY_ITEMS).apply();
        notifyChanged();
    }

    public static int getTotalCount(Context context) {
        int count = 0;
        for (CartItem item : getItems(context)) {
            count += item.quantity;
        }
        return count;
    }

    public static int getTotalPrice(Context context) {
        int total = 0;
        for (CartItem item : getItems(context)) {
            total += item.getSubtotal();
        }
        return total;
    }
}
