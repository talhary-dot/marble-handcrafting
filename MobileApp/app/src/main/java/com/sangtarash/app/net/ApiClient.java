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

    public interface Callback<T> {
        void onSuccess(T result);
        void onError(String message);
    }

    private static final ExecutorService sExecutor = Executors.newFixedThreadPool(4);
    private static final Handler sMainHandler = new Handler(Looper.getMainLooper());
    private static final int MAX_GET_RETRIES = 3;

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
                    int timeout = AppConfig.getTimeoutMs();
                    String responseBody = executeGetWithRetry(url, timeout, MAX_GET_RETRIES);

                    JSONObject root = new JSONObject(responseBody);
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
                } catch (final Exception e) {
                    postError(callback, e.getLocalizedMessage() != null ? e.getLocalizedMessage() : "Network error");
                }
            }
        });
    }

    public static void fetchProduct(final Context context, final String id, final Callback<Product> callback) {
        sExecutor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    String base = AppConfig.getBaseUrl(context);
                    URL url = new URL(base + "/api/products/" + URLEncoder.encode(id, "UTF-8"));
                    int timeout = AppConfig.getTimeoutMs();
                    String responseBody = executeGetWithRetry(url, timeout, MAX_GET_RETRIES);

                    JSONObject root = new JSONObject(responseBody);
                    JSONObject pObj = root.optJSONObject("product");
                    if (pObj != null) {
                        postSuccess(callback, Product.fromJson(pObj));
                    } else {
                        postError(callback, "Product not found");
                    }
                } catch (final Exception e) {
                    postError(callback, e.getLocalizedMessage() != null ? e.getLocalizedMessage() : "Network error");
                }
            }
        });
    }

    public static void submitOrder(final Context context, final JSONObject orderPayload, final Callback<JSONObject> callback) {
        sExecutor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    String base = AppConfig.getBaseUrl(context);
                    URL url = new URL(base + "/api/orders");
                    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                    conn.setRequestMethod("POST");
                    int timeout = AppConfig.getTimeoutMs();
                    conn.setConnectTimeout(timeout);
                    conn.setReadTimeout((int)(timeout * 1.5));
                    conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
                    conn.setRequestProperty("Accept", "application/json");
                    conn.setDoOutput(true);

                    byte[] outputBytes = orderPayload.toString().getBytes(StandardCharsets.UTF_8);
                    conn.setFixedLengthStreamingMode(outputBytes.length);
                    conn.getOutputStream().write(outputBytes);
                    conn.getOutputStream().flush();
                    conn.getOutputStream().close();

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
                        JSONObject res = new JSONObject(sb.toString());
                        postSuccess(callback, res);
                    } else {
                        String errMsg = "Error " + responseCode;
                        try {
                            JSONObject errObj = new JSONObject(sb.toString());
                            if (errObj.has("error")) errMsg = errObj.getString("error");
                        } catch (Exception ignored) {}
                        postError(callback, errMsg);
                    }
                } catch (final Exception e) {
                    postError(callback, e.getLocalizedMessage() != null ? e.getLocalizedMessage() : "Order transmission error");
                }
            }
        });
    }

    private static String executeGetWithRetry(URL url, int timeoutMs, int maxRetries) throws Exception {
        Exception lastException = null;
        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            HttpURLConnection conn = null;
            try {
                conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setConnectTimeout(timeoutMs);
                conn.setReadTimeout((int)(timeoutMs * 1.5));
                conn.setRequestProperty("Accept", "application/json");

                int responseCode = conn.getResponseCode();
                InputStream is = (responseCode >= 200 && responseCode < 400) ? conn.getInputStream() : conn.getErrorStream();
                if (is == null) {
                    throw new Exception("HTTP " + responseCode + " - No response from atelier server");
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
                    return sb.toString();
                } else if (responseCode >= 500 && attempt < maxRetries) {
                    Thread.sleep(attempt * 500L);
                    continue;
                } else {
                    throw new Exception("Server status " + responseCode + ": " + sb.toString());
                }
            } catch (Exception e) {
                lastException = e;
                if (conn != null) {
                    try { conn.disconnect(); } catch (Exception ignored) {}
                }
                if (attempt < maxRetries) {
                    try {
                        Thread.sleep(attempt * 500L);
                    } catch (InterruptedException ignored) {}
                }
            }
        }
        if (lastException != null) throw lastException;
        throw new Exception("Connection failed after " + maxRetries + " attempts");
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
