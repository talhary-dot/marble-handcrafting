package com.sangtarash.app.model;

import org.json.JSONArray;
import org.json.JSONObject;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class ProductSize implements Serializable {
    public String id;
    public String productId;
    public String sizeName;
    public String dimensions;
    public String weight;
    public int price;
    public Integer originalPrice;
    public int stock;
    public String sku;
    public List<String> images = new ArrayList<>();
    public boolean isDefault;
    public int sortOrder;

    public static ProductSize fromJson(JSONObject json) {
        ProductSize size = new ProductSize();
        if (json == null) return size;

        size.id = json.optString("id", "");
        size.productId = json.optString("productId", "");
        size.sizeName = json.optString("sizeName", "Standard Size");
        size.dimensions = json.optString("dimensions", "—");
        size.weight = json.optString("weight", "—");
        size.price = json.optInt("price", 0);
        if (json.has("originalPrice") && !json.isNull("originalPrice")) {
            size.originalPrice = json.optInt("originalPrice");
        }
        size.stock = json.optInt("stock", 10);
        size.sku = json.optString("sku", "ST-STONE");
        size.isDefault = json.optBoolean("isDefault", false);
        size.sortOrder = json.optInt("sortOrder", 0);

        Object imagesObj = json.opt("images");
        if (imagesObj instanceof JSONArray) {
            JSONArray arr = (JSONArray) imagesObj;
            for (int i = 0; i < arr.length(); i++) {
                size.images.add(arr.optString(i));
            }
        } else if (imagesObj instanceof String) {
            try {
                JSONArray arr = new JSONArray((String) imagesObj);
                for (int i = 0; i < arr.length(); i++) {
                    size.images.add(arr.optString(i));
                }
            } catch (Exception ignored) {}
        }
        return size;
    }

    public JSONObject toJson() {
        JSONObject obj = new JSONObject();
        try {
            obj.put("id", id);
            obj.put("productId", productId);
            obj.put("sizeName", sizeName);
            obj.put("dimensions", dimensions);
            obj.put("weight", weight);
            obj.put("price", price);
            if (originalPrice != null) obj.put("originalPrice", originalPrice);
            obj.put("stock", stock);
            obj.put("sku", sku);
            obj.put("isDefault", isDefault);
            obj.put("sortOrder", sortOrder);
        } catch (Exception ignored) {}
        return obj;
    }
}
