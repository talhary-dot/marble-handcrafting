package com.sangtarash.app.net;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Handler;
import android.os.Looper;
import android.util.LruCache;
import android.widget.ImageView;
import com.sangtarash.app.config.AppConfig;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.MessageDigest;
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

        // 1. Check in-memory LRU cache (L1)
        Bitmap cached = mMemoryCache.get(resolvedUrl);
        if (cached != null) {
            imageView.setImageBitmap(cached);
            return;
        }

        // Placeholder / clear current
        imageView.setImageDrawable(null);

        // 2. Load asynchronously with L2 Disk Cache fallback
        mExecutor.execute(new Runnable() {
            @Override
            public void run() {
                // Check Disk Cache (L2)
                File diskFile = getDiskCacheFile(context, resolvedUrl);
                byte[] bytes = null;

                if (diskFile != null && diskFile.exists() && diskFile.length() > 0) {
                    bytes = readFileBytes(diskFile);
                }

                // If cache miss, download from network and persist to disk
                if (bytes == null || bytes.length == 0) {
                    bytes = downloadBytes(resolvedUrl);
                    if (bytes != null && bytes.length > 0 && diskFile != null) {
                        writeFileBytes(diskFile, bytes);
                    }
                }

                if (bytes == null || bytes.length == 0) return;

                final Bitmap bitmap = decodeSampledBitmap(bytes, 400, 400);
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

    private static File getDiskCacheFile(Context context, String urlStr) {
        try {
            if (context == null) return null;
            File cacheDir = new File(context.getCacheDir(), "stone_cache");
            if (!cacheDir.exists()) {
                cacheDir.mkdirs();
            }
            String key = hashKey(urlStr);
            return new File(cacheDir, key + ".stone");
        } catch (Exception e) {
            return null;
        }
    }

    private static String hashKey(String key) {
        try {
            MessageDigest digest = MessageDigest.getInstance("MD5");
            digest.update(key.getBytes("UTF-8"));
            byte[] messageDigest = digest.digest();
            StringBuilder hexString = new StringBuilder();
            for (byte b : messageDigest) {
                String hex = Integer.toHexString(0xFF & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            return String.valueOf(key.hashCode());
        }
    }

    private static byte[] downloadBytes(String urlStr) {
        try {
            URL url = new URL(urlStr);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setConnectTimeout(8000);
            conn.setReadTimeout(12000);
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
            return bytes;
        } catch (Exception e) {
            return null;
        }
    }

    private static byte[] readFileBytes(File file) {
        try {
            FileInputStream fis = new FileInputStream(file);
            byte[] data = readAllBytes(fis);
            fis.close();
            return data;
        } catch (Exception e) {
            return null;
        }
    }

    private static void writeFileBytes(File file, byte[] data) {
        try {
            FileOutputStream fos = new FileOutputStream(file);
            fos.write(data);
            fos.flush();
            fos.close();
        } catch (Exception ignored) {}
    }

    private static Bitmap decodeSampledBitmap(byte[] bytes, int reqWidth, int reqHeight) {
        try {
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inJustDecodeBounds = true;
            BitmapFactory.decodeByteArray(bytes, 0, bytes.length, options);

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
            ByteArrayOutputStream buffer = new ByteArrayOutputStream();
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
