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
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;
import com.sangtarash.app.config.ThemeManager;
import com.sangtarash.app.model.CartItem;
import com.sangtarash.app.model.Product;
import com.sangtarash.app.model.ProductSize;
import com.sangtarash.app.net.ApiClient;
import com.sangtarash.app.net.ImageLoader;
import com.sangtarash.app.storage.CartManager;
import java.util.ArrayList;
import java.util.List;

public class ProductDetailActivity extends Activity implements CartManager.CartListener, ThemeManager.ThemeListener {

    // Root & Header
    private RelativeLayout mRlRoot;
    private RelativeLayout mRlTopBar;
    private ImageView mBtnBack;
    private TextView mTvTitleBar;
    private RelativeLayout mBtnCart;
    private ImageView mIvCartIcon;
    private TextView mTvCartBadge;

    // ScrollView & Hero
    private ScrollView mSvDetail;
    private ImageView mIvHero;
    private LinearLayout mLlThumbnails;

    // Info & Badges
    private TextView mTvOrigin;
    private TextView mTvStoneBadge;
    private TextView mTvName;
    private TextView mTvTagline;

    // Price Card
    private LinearLayout mLlPriceCard;
    private TextView mTvPriceLabel;
    private TextView mTvPrice;
    private TextView mTvStock;

    // Variant Selection
    private TextView mTvHeaderVariant;
    private LinearLayout mLlSizeOptions;

    // Narrative
    private TextView mTvHeaderNarrative;
    private TextView mTvDescription;

    // Specifications
    private LinearLayout mLlSpecCard;
    private TextView mTvHeaderSpec;
    private View mVSpecDivider;
    private TextView mTvSpecStone;
    private TextView mTvSpecOrigin;
    private TextView mTvSpecFinish;
    private TextView mTvSpecDimensions;
    private TextView mTvSpecWeight;
    private TextView mTvSpecSku;

    // Artisan Story, Care, Shipping
    private LinearLayout mLlArtisanStoryCard;
    private TextView mTvHeaderStory;
    private TextView mTvArtisanStory;

    private LinearLayout mLlCareCard;
    private TextView mTvHeaderCare;
    private TextView mTvCare;

    private LinearLayout mLlShippingCard;
    private TextView mTvHeaderShipping;
    private TextView mTvShipping;

    // Sticky Bottom Bar
    private LinearLayout mLlBottomBar;
    private LinearLayout mLlQtyContainer;
    private TextView mBtnQtyMinus;
    private TextView mTvQty;
    private TextView mBtnQtyPlus;
    private Button mBtnAddToCart;

    // State
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
        ThemeManager.addListener(this);

        applyTheme(ThemeManager.isDarkMode(this));

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
        ThemeManager.removeListener(this);
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
        int cardRadius = ThemeManager.dpToPx(this, 8);
        int badgeRadius = ThemeManager.dpToPx(this, 12);
        int qtyRadius = ThemeManager.dpToPx(this, 6);

        // Root Background
        if (mRlRoot != null) mRlRoot.setBackgroundColor(ThemeManager.getBgColor(isDark));
        if (mSvDetail != null) mSvDetail.setBackgroundColor(ThemeManager.getBgColor(isDark));

        // Top Bar
        if (mRlTopBar != null) mRlTopBar.setBackgroundColor(ThemeManager.getSurfaceColor(isDark));
        if (mBtnBack != null) mBtnBack.setColorFilter(ThemeManager.getTextPrimary(isDark));
        if (mTvTitleBar != null) mTvTitleBar.setTextColor(ThemeManager.getBronze(isDark));
        if (mIvCartIcon != null) mIvCartIcon.setColorFilter(ThemeManager.getTextPrimary(isDark));

        // Hero Image
        if (mIvHero != null) mIvHero.setBackgroundColor(ThemeManager.getSurfaceColor(isDark));

        // Badges & Product Titles
        if (mTvOrigin != null) {
            mTvOrigin.setBackground(ThemeManager.createChipDrawable(isDark, true, badgeRadius));
            mTvOrigin.setTextColor(ThemeManager.getBronze(isDark));
        }
        if (mTvStoneBadge != null) {
            mTvStoneBadge.setBackground(ThemeManager.createChipDrawable(isDark, false, badgeRadius));
            mTvStoneBadge.setTextColor(ThemeManager.getTextSecondary(isDark));
        }
        if (mTvName != null) mTvName.setTextColor(ThemeManager.getTextPrimary(isDark));
        if (mTvTagline != null) mTvTagline.setTextColor(ThemeManager.getTextSecondary(isDark));

        // Price Card
        if (mLlPriceCard != null) mLlPriceCard.setBackground(ThemeManager.createCardDrawable(isDark, cardRadius));
        if (mTvPriceLabel != null) mTvPriceLabel.setTextColor(ThemeManager.getTextMuted(isDark));
        if (mTvPrice != null) mTvPrice.setTextColor(ThemeManager.getGold(isDark));

        // Section Headers
        if (mTvHeaderVariant != null) mTvHeaderVariant.setTextColor(ThemeManager.getBronze(isDark));
        if (mTvHeaderNarrative != null) mTvHeaderNarrative.setTextColor(ThemeManager.getBronze(isDark));
        if (mTvDescription != null) mTvDescription.setTextColor(ThemeManager.getTextSecondary(isDark));

        // Specifications Card
        if (mLlSpecCard != null) mLlSpecCard.setBackground(ThemeManager.createCardDrawable(isDark, cardRadius));
        if (mTvHeaderSpec != null) mTvHeaderSpec.setTextColor(ThemeManager.getBronze(isDark));
        if (mVSpecDivider != null) mVSpecDivider.setBackgroundColor(ThemeManager.getBorderColor(isDark));
        if (mTvSpecStone != null) mTvSpecStone.setTextColor(ThemeManager.getTextPrimary(isDark));
        if (mTvSpecOrigin != null) mTvSpecOrigin.setTextColor(ThemeManager.getTextPrimary(isDark));
        if (mTvSpecFinish != null) mTvSpecFinish.setTextColor(ThemeManager.getTextPrimary(isDark));
        if (mTvSpecDimensions != null) mTvSpecDimensions.setTextColor(ThemeManager.getTextPrimary(isDark));
        if (mTvSpecWeight != null) mTvSpecWeight.setTextColor(ThemeManager.getTextPrimary(isDark));
        if (mTvSpecSku != null) mTvSpecSku.setTextColor(ThemeManager.getTextMuted(isDark));

        // Artisan Story, Care, Shipping Cards
        if (mLlArtisanStoryCard != null) mLlArtisanStoryCard.setBackground(ThemeManager.createCardDrawable(isDark, cardRadius));
        if (mTvHeaderStory != null) mTvHeaderStory.setTextColor(ThemeManager.getBronze(isDark));
        if (mTvArtisanStory != null) mTvArtisanStory.setTextColor(ThemeManager.getTextSecondary(isDark));

        if (mLlCareCard != null) mLlCareCard.setBackground(ThemeManager.createCardDrawable(isDark, cardRadius));
        if (mTvHeaderCare != null) mTvHeaderCare.setTextColor(ThemeManager.getBronze(isDark));
        if (mTvCare != null) mTvCare.setTextColor(ThemeManager.getTextSecondary(isDark));

        if (mLlShippingCard != null) mLlShippingCard.setBackground(ThemeManager.createCardDrawable(isDark, cardRadius));
        if (mTvHeaderShipping != null) mTvHeaderShipping.setTextColor(ThemeManager.getBronze(isDark));
        if (mTvShipping != null) mTvShipping.setTextColor(ThemeManager.getTextSecondary(isDark));

        // Bottom Bar & Quantity Selector
        if (mLlBottomBar != null) mLlBottomBar.setBackgroundColor(ThemeManager.getSurfaceColor(isDark));
        if (mLlQtyContainer != null) mLlQtyContainer.setBackground(ThemeManager.createSecondaryButtonDrawable(isDark, qtyRadius));
        if (mBtnQtyMinus != null) mBtnQtyMinus.setTextColor(ThemeManager.getBronze(isDark));
        if (mBtnQtyPlus != null) mBtnQtyPlus.setTextColor(ThemeManager.getBronze(isDark));
        if (mTvQty != null) mTvQty.setTextColor(ThemeManager.getTextPrimary(isDark));

        // Re-render dynamic list items
        if (mProduct != null) {
            renderSizeOptions();
            if (mProduct.gallery != null) {
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
            }
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
        // Root & Top Bar
        mRlRoot = findViewById(R.id.rl_product_detail_root);
        mRlTopBar = findViewById(R.id.rl_top_bar);
        mBtnBack = findViewById(R.id.btn_back);
        mTvTitleBar = findViewById(R.id.tv_detail_title_bar);
        mBtnCart = findViewById(R.id.btn_detail_cart);
        mIvCartIcon = findViewById(R.id.iv_detail_cart_icon);
        mTvCartBadge = findViewById(R.id.tv_detail_cart_badge);

        // Scrollable content & Hero
        mSvDetail = findViewById(R.id.sv_detail);
        mIvHero = findViewById(R.id.iv_detail_hero);
        mLlThumbnails = findViewById(R.id.ll_thumbnails);

        // Badges & Titles
        mTvOrigin = findViewById(R.id.tv_detail_origin);
        mTvStoneBadge = findViewById(R.id.tv_detail_stone_badge);
        mTvName = findViewById(R.id.tv_detail_name);
        mTvTagline = findViewById(R.id.tv_detail_tagline);

        // Price Card
        mLlPriceCard = findViewById(R.id.ll_detail_price_card);
        mTvPriceLabel = findViewById(R.id.tv_price_label);
        mTvPrice = findViewById(R.id.tv_detail_price);
        mTvStock = findViewById(R.id.tv_detail_stock);

        // Variant Selection
        mTvHeaderVariant = findViewById(R.id.tv_header_variant);
        mLlSizeOptions = findViewById(R.id.ll_size_options);

        // Narrative
        mTvHeaderNarrative = findViewById(R.id.tv_header_narrative);
        mTvDescription = findViewById(R.id.tv_detail_description);

        // Specifications
        mLlSpecCard = findViewById(R.id.ll_spec_card);
        mTvHeaderSpec = findViewById(R.id.tv_header_spec);
        mVSpecDivider = findViewById(R.id.v_spec_divider);
        mTvSpecStone = findViewById(R.id.tv_spec_stone);
        mTvSpecOrigin = findViewById(R.id.tv_spec_origin);
        mTvSpecFinish = findViewById(R.id.tv_spec_finish);
        mTvSpecDimensions = findViewById(R.id.tv_spec_dimensions);
        mTvSpecWeight = findViewById(R.id.tv_spec_weight);
        mTvSpecSku = findViewById(R.id.tv_spec_sku);

        // Artisan Story, Care, Shipping
        mLlArtisanStoryCard = findViewById(R.id.ll_artisan_story_card);
        mTvHeaderStory = findViewById(R.id.tv_header_story);
        mTvArtisanStory = findViewById(R.id.tv_detail_artisan_story);

        mLlCareCard = findViewById(R.id.ll_care_card);
        mTvHeaderCare = findViewById(R.id.tv_header_care);
        mTvCare = findViewById(R.id.tv_detail_care);

        mLlShippingCard = findViewById(R.id.ll_shipping_card);
        mTvHeaderShipping = findViewById(R.id.tv_header_shipping);
        mTvShipping = findViewById(R.id.tv_detail_shipping);

        // Sticky Bottom Bar
        mLlBottomBar = findViewById(R.id.ll_bottom_bar);
        mLlQtyContainer = findViewById(R.id.ll_qty_container);
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
        String cleanDesc = mProduct.description != null ? mProduct.description.replaceAll("<[^>]*>", "").trim() : "";
        mTvDescription.setText(cleanDesc);

        // Hero image
        ImageLoader.getInstance().displayImage(this, mProduct.featuredImage, mIvHero);

        // Build gallery thumbnails list
        List<String> allImages = new ArrayList<>();
        if (mProduct.featuredImage != null && !mProduct.featuredImage.isEmpty()) {
            allImages.add(mProduct.featuredImage);
        }
        if (mProduct.gallery != null) {
            for (String g : mProduct.gallery) {
                if (!allImages.contains(g)) {
                    allImages.add(g);
                }
            }
        }

        setupGallery(allImages);

        // Specifications
        mTvSpecStone.setText("Stone Variety: " + (mProduct.stoneType != null ? mProduct.stoneType : "Natural Stone"));
        mTvSpecOrigin.setText("Geological Origin: " + (mProduct.origin != null ? mProduct.origin : "Artisan Quarry"));
        mTvSpecFinish.setText("Surface Finish: " + (mProduct.finish != null ? mProduct.finish : "Honed Matte"));

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
        if (images == null || images.size() <= 1) {
            return;
        }

        boolean isDark = ThemeManager.isDarkMode(this);
        int cardRadius = ThemeManager.dpToPx(this, 6);

        for (final String imgUrl : images) {
            final ImageView thumb = new ImageView(this);
            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
                    ThemeManager.dpToPx(this, 56),
                    ThemeManager.dpToPx(this, 56)
            );
            lp.setMarginEnd(ThemeManager.dpToPx(this, 10));
            thumb.setLayoutParams(lp);
            thumb.setBackground(ThemeManager.createCardDrawable(isDark, cardRadius));
            thumb.setScaleType(ImageView.ScaleType.CENTER_CROP);
            int pad = ThemeManager.dpToPx(this, 2);
            thumb.setPadding(pad, pad, pad, pad);

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
        if (mProduct == null || mProduct.sizes == null) return;

        LayoutInflater inflater = LayoutInflater.from(this);
        boolean isDark = ThemeManager.isDarkMode(this);
        int cardRadius = ThemeManager.dpToPx(this, 8);
        int badgeRadius = ThemeManager.dpToPx(this, 10);

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
            tvName.setTextColor(ThemeManager.getTextPrimary(isDark));
            tvSpecs.setText(size.dimensions + " • " + size.weight);
            tvSpecs.setTextColor(ThemeManager.getTextSecondary(isDark));

            if (size.sku != null && !size.sku.isEmpty()) {
                tvSku.setVisibility(View.VISIBLE);
                tvSku.setText("SKU: " + size.sku);
                tvSku.setTextColor(ThemeManager.getTextMuted(isDark));
            } else {
                tvSku.setVisibility(View.GONE);
            }

            if (size.stock <= 3 && size.stock > 0) {
                tvStockBadge.setVisibility(View.VISIBLE);
                tvStockBadge.setText("Only " + size.stock + " left");
                tvStockBadge.setTextColor(getResources().getColor(R.color.status_lowstock));
                tvStockBadge.setBackground(ThemeManager.createChipDrawable(isDark, true, badgeRadius));
            } else if (size.stock > 3) {
                tvStockBadge.setVisibility(View.VISIBLE);
                tvStockBadge.setText(size.stock + " in stock");
                tvStockBadge.setTextColor(getResources().getColor(R.color.status_instock));
                tvStockBadge.setBackground(ThemeManager.createChipDrawable(isDark, false, badgeRadius));
            } else {
                tvStockBadge.setVisibility(View.VISIBLE);
                tvStockBadge.setText("Sold Out");
                tvStockBadge.setTextColor(ThemeManager.getTextMuted(isDark));
                tvStockBadge.setBackground(ThemeManager.createChipDrawable(isDark, false, badgeRadius));
            }

            if (size.originalPrice != null && size.originalPrice > size.price) {
                tvOriginalPrice.setVisibility(View.VISIBLE);
                tvOriginalPrice.setText("$" + size.originalPrice);
                tvOriginalPrice.setTextColor(ThemeManager.getTextMuted(isDark));
                tvOriginalPrice.setPaintFlags(tvOriginalPrice.getPaintFlags() | android.graphics.Paint.STRIKE_THRU_TEXT_FLAG);
            } else {
                tvOriginalPrice.setVisibility(View.GONE);
            }

            tvPrice.setText("$" + size.price);
            tvPrice.setTextColor(ThemeManager.getGold(isDark));

            boolean isSelected = (mSelectedSize != null && mSelectedSize.id.equals(size.id));
            card.setBackground(ThemeManager.createVariantCardDrawable(isDark, isSelected, cardRadius));

            if (isSelected) {
                ivRadio.setImageResource(R.drawable.ic_radio_selected);
                ivRadio.clearColorFilter();
            } else {
                ivRadio.setImageResource(R.drawable.ic_radio_unselected);
                ivRadio.setColorFilter(ThemeManager.getTextMuted(isDark));
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
