package com.sangtarash.app.model;

import org.json.JSONArray;
import org.json.JSONObject;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class Product implements Serializable {
    public String id;
    public String slug;
    public String name;
    public String tagline;
    public String description;
    public String category;
    public String badge;
    public String stoneType;
    public String origin;
    public String finish;
    public String details;
    public String careInstructions;
    public String artisanStory;
    public String shipping;
    public String featuredImage;
    public List<String> gallery = new ArrayList<>();
    public List<ProductSize> sizes = new ArrayList<>();

    public static Product fromJson(JSONObject json) {
        Product p = new Product();
        if (json == null) return p;

        p.id = json.optString("id", "");
        p.slug = json.optString("slug", "");
        p.name = json.optString("name", "Handcrafted Stone Piece");
        p.tagline = json.optString("tagline", "");
        p.description = json.optString("description", "");
        p.category = json.optString("category", "home");
        if (json.has("badge") && !json.isNull("badge")) {
            p.badge = json.optString("badge");
        }
        p.stoneType = json.optString("stoneType", "Natural Monolith Stone");
        p.origin = json.optString("origin", "Atelier Quarry");
        p.finish = json.optString("finish", "Hand-honed satin");
        p.details = json.optString("details", "");
        p.careInstructions = json.optString("careInstructions", "");
        p.artisanStory = json.optString("artisanStory", "");
        p.shipping = json.optString("shipping", "");
        p.featuredImage = json.optString("featuredImage", "");

        // Parse gallery
        Object galleryObj = json.opt("gallery");
        if (galleryObj instanceof JSONArray) {
            JSONArray arr = (JSONArray) galleryObj;
            for (int i = 0; i < arr.length(); i++) {
                p.gallery.add(arr.optString(i));
            }
        } else if (galleryObj instanceof String) {
            try {
                JSONArray arr = new JSONArray((String) galleryObj);
                for (int i = 0; i < arr.length(); i++) {
                    p.gallery.add(arr.optString(i));
                }
            } catch (Exception ignored) {}
        }

        // Parse sizes
        JSONArray sizesArr = json.optJSONArray("sizes");
        if (sizesArr != null) {
            for (int i = 0; i < sizesArr.length(); i++) {
                JSONObject sObj = sizesArr.optJSONObject(i);
                if (sObj != null) {
                    p.sizes.add(ProductSize.fromJson(sObj));
                }
            }
        }

        return p;
    }

    public ProductSize getDefaultSize() {
        if (sizes.isEmpty()) return null;
        for (ProductSize s : sizes) {
            if (s.isDefault) return s;
        }
        return sizes.get(0);
    }

    public int getMinPrice() {
        if (sizes.isEmpty()) return 0;
        int min = Integer.MAX_VALUE;
        for (ProductSize s : sizes) {
            if (s.price < min) min = s.price;
        }
        return min == Integer.MAX_VALUE ? 0 : min;
    }

    public int getMaxPrice() {
        if (sizes.isEmpty()) return 0;
        int max = 0;
        for (ProductSize s : sizes) {
            if (s.price > max) max = s.price;
        }
        return max;
    }

    public String getPriceDisplay() {
        if (sizes.isEmpty()) return "Inquire";
        int min = getMinPrice();
        int max = getMaxPrice();
        if (min == max) {
            return "$" + min;
        }
        return "From $" + min;
    }
}
