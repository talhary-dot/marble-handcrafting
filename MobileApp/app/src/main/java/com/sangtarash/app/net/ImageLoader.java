package com.sangtarash.app.net;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Handler;
import android.os.Looper;
import android.util.LruCache;
import android.widget.ImageView;
import com.sangtarash.app.config.AppConfig;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ImageLoader {
    private static ImageLoader sInstance;
    private final LruCache<String, Bitmap> mMemoryCache;
    private final ExecutorService mExecutor;
    private final Handler mMainHandler;

    private ImageLoader() {
        int maxMemory = (int) (Runtime.getRuntime().maxMemory() / 1024);
        int cacheSize = maxMemory / 8; // 1/8th memory cache
        mMemoryCache = new LruCache<String, Bitmap>(cacheSize) {
            @Override
            protected int sizeOf(String key, Bitmap bitmap) {
                return bitmap.getByteCount() / 1024;
            }
        };
        mExecutor = Executors.newFixedThreadPool(4);
        mMainHandler = new Handler(Looper.getMainLooper());
    }

    public static synchronized ImageLoader getInstance() {
        if (sInstance == null) {
            sInstance = new ImageLoader();
        }
        return sInstance;
    }

    public void displayImage(final Context context, final String urlOrPath, final ImageView imageView) {
        if (imageView == null) return;
        if (urlOrPath == null || urlOrPath.trim().isEmpty()) {
            imageView.setImageDrawable(null);
            return;
        }

        final String resolvedUrl = AppConfig.resolveImageUrl(context, urlOrPath);
        imageView.setTag(resolvedUrl);

        // 1. Check in-memory LRU cache
        Bitmap cached = mMemoryCache.get(resolvedUrl);
        if (cached != null) {
            imageView.setImageBitmap(cached);
            return;
        }

        // Placeholder / clear current
        imageView.setImageDrawable(null);

        // 2. Load asynchronously in background thread
        mExecutor.execute(new Runnable() {
            @Override
            public void run() {
                final Bitmap bitmap = downloadSampledBitmap(resolvedUrl, 400, 400);
                if (bitmap != null) {
                    mMemoryCache.put(resolvedUrl, bitmap);

                    mMainHandler.post(new Runnable() {
                        @Override
                        public void run() {
                            // Verify view wasn't recycled for a different image
                            Object currentTag = imageView.getTag();
                            if (resolvedUrl.equals(currentTag)) {
                                imageView.setImageBitmap(bitmap);
                            }
                        }
                    });
                }
            }
        });
    }

    private Bitmap downloadSampledBitmap(String urlStr, int reqWidth, int reqHeight) {
        try {
            URL url = new URL(urlStr);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setConnectTimeout(8000);
            conn.setReadTimeout(10000);
            conn.setDoInput(true);
            conn.connect();

            int code = conn.getResponseCode();
            if (code != 200) {
                conn.disconnect();
                return null;
            }

            InputStream is = conn.getInputStream();
            byte[] bytes = readAllBytes(is);
            is.close();
            conn.disconnect();

            if (bytes == null || bytes.length == 0) return null;

            // First decode with inJustDecodeBounds=true to check dimensions
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inJustDecodeBounds = true;
            BitmapFactory.decodeByteArray(bytes, 0, bytes.length, options);

            // Calculate inSampleSize
            options.inSampleSize = calculateInSampleSize(options, reqWidth, reqHeight);
            options.inJustDecodeBounds = false;

            return BitmapFactory.decodeByteArray(bytes, 0, bytes.length, options);
        } catch (Exception e) {
            return null;
        }
    }

    private static int calculateInSampleSize(BitmapFactory.Options options, int reqWidth, int reqHeight) {
        int height = options.outHeight;
        int width = options.outWidth;
        int inSampleSize = 1;

        if (height > reqHeight || width > reqWidth) {
            final int halfHeight = height / 2;
            final int halfWidth = width / 2;
            while ((halfHeight / inSampleSize) >= reqHeight && (halfWidth / inSampleSize) >= reqWidth) {
                inSampleSize *= 2;
            }
        }
        return inSampleSize;
    }

    private static byte[] readAllBytes(InputStream is) {
        try {
            java.io.ByteArrayOutputStream buffer = new java.io.ByteArrayOutputStream();
            int nRead;
            byte[] data = new byte[8192];
            while ((nRead = is.read(data, 0, data.length)) != -1) {
                buffer.write(data, 0, nRead);
            }
            buffer.flush();
            return buffer.toByteArray();
        } catch (Exception e) {
            return null;
        }
    }
}
