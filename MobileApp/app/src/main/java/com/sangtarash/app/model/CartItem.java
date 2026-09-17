package com.sangtarash.app.model;

import org.json.JSONObject;
import java.io.Serializable;

public class CartItem implements Serializable {
    public String productId;
    public String productSlug;
    public String productName;
    public String stoneType;
    public String featuredImage;
    public String sizeId;
    public String sizeName;
    public String dimensions;
    public String weight;
    public String sku;
    public int unitPrice;
    public int quantity;

    public CartItem() {}

    public CartItem(Product product, ProductSize size, int qty) {
        this.productId = product.id;
        this.productSlug = product.slug;
        this.productName = product.name;
        this.stoneType = product.stoneType;
        this.featuredImage = product.featuredImage;

        if (size != null) {
            this.sizeId = size.id;
            this.sizeName = size.sizeName;
            this.dimensions = size.dimensions;
            this.weight = size.weight;
            this.sku = size.sku;
            this.unitPrice = size.price;
        } else {
            this.sizeId = "";
            this.sizeName = "Standard";
            this.unitPrice = product.getMinPrice();
        }
        this.quantity = Math.max(1, qty);
    }

    public String getKey() {
        return productId + "_" + sizeId;
    }

    public int getSubtotal() {
        return unitPrice * quantity;
    }

    public JSONObject toJson() {
        JSONObject obj = new JSONObject();
        try {
            obj.put("productId", productId);
            obj.put("productSlug", productSlug);
            obj.put("productName", productName);
            obj.put("stoneType", stoneType);
            obj.put("featuredImage", featuredImage);
            obj.put("sizeId", sizeId);
            obj.put("sizeName", sizeName);
            obj.put("dimensions", dimensions);
            obj.put("weight", weight);
            obj.put("sku", sku);
            obj.put("unitPrice", unitPrice);
            obj.put("quantity", quantity);
        } catch (Exception ignored) {}
        return obj;
    }

    public static CartItem fromJson(JSONObject obj) {
        CartItem item = new CartItem();
        if (obj == null) return item;
        item.productId = obj.optString("productId", "");
        item.productSlug = obj.optString("productSlug", "");
        item.productName = obj.optString("productName", "");
        item.stoneType = obj.optString("stoneType", "");
        item.featuredImage = obj.optString("featuredImage", "");
        item.sizeId = obj.optString("sizeId", "");
        item.sizeName = obj.optString("sizeName", "");
        item.dimensions = obj.optString("dimensions", "");
        item.weight = obj.optString("weight", "");
        item.sku = obj.optString("sku", "");
        item.unitPrice = obj.optInt("unitPrice", 0);
        item.quantity = obj.optInt("quantity", 1);
        return item;
    }
}
