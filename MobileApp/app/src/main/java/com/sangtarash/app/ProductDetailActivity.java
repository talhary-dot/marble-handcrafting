package com.sangtarash.app;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;
import com.sangtarash.app.model.CartItem;
import com.sangtarash.app.model.Product;
import com.sangtarash.app.model.ProductSize;
import com.sangtarash.app.net.ApiClient;
import com.sangtarash.app.net.ImageLoader;
import com.sangtarash.app.storage.CartManager;
import java.util.ArrayList;
import java.util.List;

public class ProductDetailActivity extends Activity implements CartManager.CartListener, com.sangtarash.app.config.ThemeManager.ThemeListener {

    private ImageView mBtnBack;
    private RelativeLayout mBtnCart;
    private TextView mTvCartBadge;

    private ImageView mIvHero;
    private LinearLayout mLlThumbnails;

    private TextView mTvOrigin;
    private TextView mTvStoneBadge;
    private TextView mTvName;
    private TextView mTvTagline;
    private TextView mTvPrice;
    private TextView mTvStock;

    private LinearLayout mLlSizeOptions;
    private TextView mTvDescription;

    private TextView mTvSpecStone;
    private TextView mTvSpecOrigin;
    private TextView mTvSpecFinish;
    private TextView mTvSpecDimensions;
    private TextView mTvSpecWeight;
    private TextView mTvSpecSku;

    private LinearLayout mLlArtisanStoryCard;
    private TextView mTvArtisanStory;
    private LinearLayout mLlCareCard;
    private TextView mTvCare;
    private LinearLayout mLlShippingCard;
    private TextView mTvShipping;

    private TextView mBtnQtyMinus;
    private TextView mTvQty;
    private TextView mBtnQtyPlus;
    private Button mBtnAddToCart;

    private Product mProduct;
    private ProductSize mSelectedSize;
    private int mQuantity = 1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_product_detail);

        initViews();
        setupListeners();
        CartManager.addListener(this);
        com.sangtarash.app.config.ThemeManager.addListener(this);

        applyTheme(com.sangtarash.app.config.ThemeManager.isDarkMode(this));

        Object passedProduct = getIntent().getSerializableExtra("product_obj");
        String passedId = getIntent().getStringExtra("product_id");

        if (passedProduct instanceof Product) {
            mProduct = (Product) passedProduct;
            bindProductData();
        } else if (passedId != null) {
            fetchProductData(passedId);
        } else {
            finish();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        updateCartBadge();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        CartManager.removeListener(this);
        com.sangtarash.app.config.ThemeManager.removeListener(this);
    }

    @Override
    public void onThemeChanged(final boolean isDark) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                applyTheme(isDark);
            }
        });
    }

    private void applyTheme(boolean isDark) {
        findViewById(android.R.id.content).setBackgroundColor(com.sangtarash.app.config.ThemeManager.getBgColor(isDark));
        View topBar = findViewById(R.id.rl_top_bar);
        if (topBar != null) topBar.setBackgroundColor(com.sangtarash.app.config.ThemeManager.getSurfaceColor(isDark));
        View bottomBar = findViewById(R.id.ll_bottom_bar);
        if (bottomBar != null) bottomBar.setBackgroundColor(com.sangtarash.app.config.ThemeManager.getSurfaceColor(isDark));

        if (mTvName != null) mTvName.setTextColor(com.sangtarash.app.config.ThemeManager.getTextPrimary(isDark));
        if (mTvTagline != null) mTvTagline.setTextColor(com.sangtarash.app.config.ThemeManager.getTextSecondary(isDark));
        if (mTvDescription != null) mTvDescription.setTextColor(com.sangtarash.app.config.ThemeManager.getTextSecondary(isDark));
        if (mTvQty != null) mTvQty.setTextColor(com.sangtarash.app.config.ThemeManager.getTextPrimary(isDark));

        int cardRadius = com.sangtarash.app.config.ThemeManager.dpToPx(this, 8);
        if (mLlArtisanStoryCard != null) mLlArtisanStoryCard.setBackground(com.sangtarash.app.config.ThemeManager.createCardDrawable(isDark, cardRadius));
        if (mLlCareCard != null) mLlCareCard.setBackground(com.sangtarash.app.config.ThemeManager.createCardDrawable(isDark, cardRadius));
        if (mLlShippingCard != null) mLlShippingCard.setBackground(com.sangtarash.app.config.ThemeManager.createCardDrawable(isDark, cardRadius));

        if (mProduct != null) {
            renderSizeOptions();
        }
    }

    @Override
    public void onCartChanged() {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                updateCartBadge();
            }
        });
    }

    private void initViews() {
        mBtnBack = findViewById(R.id.btn_back);
        mBtnCart = findViewById(R.id.btn_detail_cart);
        mTvCartBadge = findViewById(R.id.tv_detail_cart_badge);

        mIvHero = findViewById(R.id.iv_detail_hero);
        mLlThumbnails = findViewById(R.id.ll_thumbnails);

        mTvOrigin = findViewById(R.id.tv_detail_origin);
        mTvStoneBadge = findViewById(R.id.tv_detail_stone_badge);
        mTvName = findViewById(R.id.tv_detail_name);
        mTvTagline = findViewById(R.id.tv_detail_tagline);
        mTvPrice = findViewById(R.id.tv_detail_price);
        mTvStock = findViewById(R.id.tv_detail_stock);

        mLlSizeOptions = findViewById(R.id.ll_size_options);
        mTvDescription = findViewById(R.id.tv_detail_description);

        mTvSpecStone = findViewById(R.id.tv_spec_stone);
        mTvSpecOrigin = findViewById(R.id.tv_spec_origin);
        mTvSpecFinish = findViewById(R.id.tv_spec_finish);
        mTvSpecDimensions = findViewById(R.id.tv_spec_dimensions);
        mTvSpecWeight = findViewById(R.id.tv_spec_weight);
        mTvSpecSku = findViewById(R.id.tv_spec_sku);

        mLlArtisanStoryCard = findViewById(R.id.ll_artisan_story_card);
        mTvArtisanStory = findViewById(R.id.tv_detail_artisan_story);
        mLlCareCard = findViewById(R.id.ll_care_card);
        mTvCare = findViewById(R.id.tv_detail_care);
        mLlShippingCard = findViewById(R.id.ll_shipping_card);
        mTvShipping = findViewById(R.id.tv_detail_shipping);

        mBtnQtyMinus = findViewById(R.id.btn_qty_minus);
        mTvQty = findViewById(R.id.tv_qty);
        mBtnQtyPlus = findViewById(R.id.btn_qty_plus);
        mBtnAddToCart = findViewById(R.id.btn_add_to_cart);
    }

    private void setupListeners() {
        mBtnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        mBtnCart.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(ProductDetailActivity.this, CartActivity.class);
                startActivity(intent);
            }
        });

        mBtnQtyMinus.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (mQuantity > 1) {
                    mQuantity--;
                    mTvQty.setText(String.valueOf(mQuantity));
                }
            }
        });

        mBtnQtyPlus.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (mSelectedSize != null && mQuantity >= mSelectedSize.stock) {
                    Toast.makeText(ProductDetailActivity.this, "Maximum available stock reached (" + mSelectedSize.stock + ")", Toast.LENGTH_SHORT).show();
                    return;
                }
                mQuantity++;
                mTvQty.setText(String.valueOf(mQuantity));
            }
        });

        mBtnAddToCart.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (mProduct == null) return;
                CartItem item = new CartItem(mProduct, mSelectedSize, mQuantity);
                CartManager.addItem(ProductDetailActivity.this, item);
                Toast.makeText(ProductDetailActivity.this, "Piece added to acquisition tray", Toast.LENGTH_SHORT).show();
                updateCartBadge();
            }
        });
    }

    private void updateCartBadge() {
        int count = CartManager.getTotalCount(this);
        if (count > 0) {
            mTvCartBadge.setVisibility(View.VISIBLE);
            mTvCartBadge.setText(String.valueOf(count));
        } else {
            mTvCartBadge.setVisibility(View.GONE);
        }
    }

    private void fetchProductData(String id) {
        ApiClient.fetchProduct(this, id, new ApiClient.Callback<Product>() {
            @Override
            public void onSuccess(Product result) {
                mProduct = result;
                bindProductData();
            }

            @Override
            public void onError(String message) {
                Toast.makeText(ProductDetailActivity.this, "Failed to load piece: " + message, Toast.LENGTH_LONG).show();
            }
        });
    }

    private void bindProductData() {
        if (mProduct == null) return;

        mTvName.setText(mProduct.name);
        mTvTagline.setText(mProduct.tagline);
        mTvOrigin.setText(mProduct.origin);
        mTvStoneBadge.setText(mProduct.stoneType);

        // Strip HTML if description contains tags
        String cleanDesc = mProduct.description.replaceAll("<[^>]*>", "").trim();
        mTvDescription.setText(cleanDesc);

        // Hero image
        ImageLoader.getInstance().displayImage(this, mProduct.featuredImage, mIvHero);

        // Build gallery thumbnails list
        List<String> allImages = new ArrayList<>();
        if (mProduct.featuredImage != null && !mProduct.featuredImage.isEmpty()) {
            allImages.add(mProduct.featuredImage);
        }
        for (String g : mProduct.gallery) {
            if (!allImages.contains(g)) {
                allImages.add(g);
            }
        }

        setupGallery(allImages);

        // Specifications
        mTvSpecStone.setText("Stone Variety: " + mProduct.stoneType);
        mTvSpecOrigin.setText("Geological Origin: " + mProduct.origin);
        mTvSpecFinish.setText("Surface Finish: " + mProduct.finish);

        // Artisan Story
        if (mProduct.artisanStory != null && !mProduct.artisanStory.isEmpty()) {
            mLlArtisanStoryCard.setVisibility(View.VISIBLE);
            mTvArtisanStory.setText(mProduct.artisanStory);
        } else {
            mLlArtisanStoryCard.setVisibility(View.GONE);
        }

        // Care instructions
        if (mProduct.careInstructions != null && !mProduct.careInstructions.isEmpty()) {
            mLlCareCard.setVisibility(View.VISIBLE);
            mTvCare.setText(mProduct.careInstructions);
        } else {
            mLlCareCard.setVisibility(View.GONE);
        }

        // Shipping
        if (mProduct.shipping != null && !mProduct.shipping.isEmpty()) {
            mLlShippingCard.setVisibility(View.VISIBLE);
            mTvShipping.setText(mProduct.shipping);
        } else {
            mLlShippingCard.setVisibility(View.GONE);
        }

        // Select default size
        mSelectedSize = mProduct.getDefaultSize();
        renderSizeOptions();
        updateSelectedVariantDetails();
    }

    private void setupGallery(final List<String> images) {
        mLlThumbnails.removeAllViews();
        if (images.size() <= 1) {
            return;
        }

        for (final String imgUrl : images) {
            final ImageView thumb = new ImageView(this);
            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(130, 130);
            lp.setMarginEnd(16);
            thumb.setLayoutParams(lp);
            thumb.setBackgroundResource(R.drawable.bg_card);
            thumb.setScaleType(ImageView.ScaleType.CENTER_CROP);
            thumb.setPadding(4, 4, 4, 4);

            ImageLoader.getInstance().displayImage(this, imgUrl, thumb);

            thumb.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    ImageLoader.getInstance().displayImage(ProductDetailActivity.this, imgUrl, mIvHero);
                }
            });

            mLlThumbnails.addView(thumb);
        }
    }

    private void renderSizeOptions() {
        mLlSizeOptions.removeAllViews();
        LayoutInflater inflater = LayoutInflater.from(this);

        boolean isDark = com.sangtarash.app.config.ThemeManager.isDarkMode(this);
        for (final ProductSize size : mProduct.sizes) {
            View card = inflater.inflate(R.layout.item_size_chip, mLlSizeOptions, false);

            ImageView ivRadio = card.findViewById(R.id.iv_size_radio);
            TextView tvName = card.findViewById(R.id.tv_size_name);
            TextView tvStockBadge = card.findViewById(R.id.tv_size_stock_badge);
            TextView tvSpecs = card.findViewById(R.id.tv_size_specs);
            TextView tvSku = card.findViewById(R.id.tv_size_sku);
            TextView tvOriginalPrice = card.findViewById(R.id.tv_size_original_price);
            TextView tvPrice = card.findViewById(R.id.tv_size_price);

            tvName.setText(size.sizeName);
            tvName.setTextColor(com.sangtarash.app.config.ThemeManager.getTextPrimary(isDark));
            tvSpecs.setText(size.dimensions + " • " + size.weight);
            tvSpecs.setTextColor(com.sangtarash.app.config.ThemeManager.getTextSecondary(isDark));

            if (size.sku != null && !size.sku.isEmpty()) {
                tvSku.setVisibility(View.VISIBLE);
                tvSku.setText("SKU: " + size.sku);
            } else {
                tvSku.setVisibility(View.GONE);
            }

            if (size.stock <= 3 && size.stock > 0) {
                tvStockBadge.setVisibility(View.VISIBLE);
                tvStockBadge.setText("Only " + size.stock + " left");
                tvStockBadge.setTextColor(getResources().getColor(R.color.status_lowstock));
            } else if (size.stock > 3) {
                tvStockBadge.setVisibility(View.VISIBLE);
                tvStockBadge.setText(size.stock + " in stock");
                tvStockBadge.setTextColor(getResources().getColor(R.color.status_instock));
            } else {
                tvStockBadge.setVisibility(View.VISIBLE);
                tvStockBadge.setText("Sold Out");
                tvStockBadge.setTextColor(getResources().getColor(R.color.text_muted));
            }

            if (size.originalPrice != null && size.originalPrice > size.price) {
                tvOriginalPrice.setVisibility(View.VISIBLE);
                tvOriginalPrice.setText("$" + size.originalPrice);
                tvOriginalPrice.setPaintFlags(tvOriginalPrice.getPaintFlags() | android.graphics.Paint.STRIKE_THRU_TEXT_FLAG);
            } else {
                tvOriginalPrice.setVisibility(View.GONE);
            }

            tvPrice.setText("$" + size.price);
            tvPrice.setTextColor(com.sangtarash.app.config.ThemeManager.getGold(isDark));

            boolean isSelected = (mSelectedSize != null && mSelectedSize.id.equals(size.id));
            if (isSelected) {
                card.setBackgroundResource(R.drawable.bg_variant_card_selected);
                ivRadio.setImageResource(R.drawable.ic_radio_selected);
            } else {
                int cardRadius = com.sangtarash.app.config.ThemeManager.dpToPx(this, 8);
                card.setBackground(com.sangtarash.app.config.ThemeManager.createCardDrawable(isDark, cardRadius));
                ivRadio.setImageResource(R.drawable.ic_radio_unselected);
            }

            card.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    mSelectedSize = size;
                    renderSizeOptions();
                    updateSelectedVariantDetails();
                }
            });

            mLlSizeOptions.addView(card);
        }
    }

    private void updateSelectedVariantDetails() {
        if (mSelectedSize == null) return;

        mTvPrice.setText("$" + mSelectedSize.price);
        mTvSpecDimensions.setText("Dimensions: " + mSelectedSize.dimensions);
        mTvSpecWeight.setText("Weight: " + mSelectedSize.weight);
        mTvSpecSku.setText("Atelier SKU: " + (mSelectedSize.sku != null ? mSelectedSize.sku : "ST-PIECE"));

        if (mSelectedSize.stock > 0) {
            mTvStock.setText("In Stock (" + mSelectedSize.stock + " available)");
            mTvStock.setTextColor(getResources().getColor(R.color.status_instock));
            mBtnAddToCart.setEnabled(true);
            mBtnAddToCart.setText("Acquire Piece • $" + mSelectedSize.price);
        } else {
            mTvStock.setText("Sold Out — Commission Only");
            mTvStock.setTextColor(getResources().getColor(R.color.status_lowstock));
            mBtnAddToCart.setEnabled(false);
            mBtnAddToCart.setText("Currently Unavailable");
        }
    }
}
