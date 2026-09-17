package com.sangtarash.app.net;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import com.sangtarash.app.config.AppConfig;
import com.sangtarash.app.model.Product;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ApiClient {
    private static final ExecutorService sExecutor = Executors.newCachedThreadPool();
    private static final Handler sMainHandler = new Handler(Looper.getMainLooper());

    public interface Callback<T> {
        void onSuccess(T result);
        void onError(String message);
    }

    public static void fetchProducts(final Context context, final String category, final Callback<List<Product>> callback) {
        sExecutor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    String base = AppConfig.getBaseUrl(context);
                    StringBuilder urlBuilder = new StringBuilder(base).append("/api/products");
                    if (category != null && !category.isEmpty() && !category.equalsIgnoreCase("all")) {
                        urlBuilder.append("?category=").append(URLEncoder.encode(category, "UTF-8"));
                    }

                    URL url = new URL(urlBuilder.toString());
                    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                    conn.setRequestMethod("GET");
                    int timeout = AppConfig.getTimeoutMs();
                    conn.setConnectTimeout(timeout);
                    conn.setReadTimeout((int)(timeout * 1.5));
                    conn.setRequestProperty("Accept", "application/json");

                    int responseCode = conn.getResponseCode();
                    InputStream is = (responseCode >= 200 && responseCode < 400) ? conn.getInputStream() : conn.getErrorStream();
                    if (is == null) {
                        postError(callback, "HTTP " + responseCode + " - No response from server");
                        return;
                    }

                    BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8));
                    StringBuilder sb = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        sb.append(line);
                    }
                    reader.close();
                    conn.disconnect();

                    if (responseCode >= 200 && responseCode < 300) {
                        JSONObject root = new JSONObject(sb.toString());
                        JSONArray productsArr = root.optJSONArray("products");
                        final List<Product> list = new ArrayList<>();
                        if (productsArr != null) {
                            for (int i = 0; i < productsArr.length(); i++) {
                                JSONObject pObj = productsArr.optJSONObject(i);
                                if (pObj != null) {
                                    list.add(Product.fromJson(pObj));
                                }
                            }
                        }
                        postSuccess(callback, list);
                    } else {
                        postError(callback, "Server returned status " + responseCode + ": " + sb.toString());
                    }
                } catch (final Exception e) {
                    postError(callback, "Network failure: " + e.getLocalizedMessage());
                }
            }
        });
    }

    public static void fetchProduct(final Context context, final String idOrSlug, final Callback<Product> callback) {
        sExecutor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    String base = AppConfig.getBaseUrl(context);
                    String urlStr = base + "/api/products/" + URLEncoder.encode(idOrSlug, "UTF-8");

                    URL url = new URL(urlStr);
                    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                    conn.setRequestMethod("GET");
                    int timeout = AppConfig.getTimeoutMs();
                    conn.setConnectTimeout(timeout);
                    conn.setReadTimeout((int)(timeout * 1.5));
                    conn.setRequestProperty("Accept", "application/json");

                    int responseCode = conn.getResponseCode();
                    InputStream is = (responseCode >= 200 && responseCode < 400) ? conn.getInputStream() : conn.getErrorStream();
                    if (is == null) {
                        postError(callback, "HTTP " + responseCode + " - No response");
                        return;
                    }

                    BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8));
                    StringBuilder sb = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        sb.append(line);
                    }
                    reader.close();
                    conn.disconnect();

                    if (responseCode >= 200 && responseCode < 300) {
                        JSONObject root = new JSONObject(sb.toString());
                        JSONObject pObj = root.optJSONObject("product");
                        if (pObj != null) {
                            postSuccess(callback, Product.fromJson(pObj));
                        } else {
                            postError(callback, "Product not found");
                        }
                    } else {
                        postError(callback, "Error " + responseCode);
                    }
                } catch (final Exception e) {
                    postError(callback, e.getLocalizedMessage());
                }
            }
        });
    }

    private static <T> void postSuccess(final Callback<T> callback, final T data) {
        if (callback == null) return;
        sMainHandler.post(new Runnable() {
            @Override
            public void run() {
                callback.onSuccess(data);
            }
        });
    }

    private static <T> void postError(final Callback<T> callback, final String error) {
        if (callback == null) return;
        sMainHandler.post(new Runnable() {
            @Override
            public void run() {
                callback.onError(error);
            }
        });
    }
}
