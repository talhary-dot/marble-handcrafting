package com.sangtarash.app;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;
import com.sangtarash.app.config.AppConfig;
import com.sangtarash.app.config.ThemeManager;
import com.sangtarash.app.model.CartItem;
import com.sangtarash.app.model.Product;
import com.sangtarash.app.net.ApiClient;
import com.sangtarash.app.net.ImageLoader;
import com.sangtarash.app.storage.CartManager;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends Activity implements CartManager.CartListener, ThemeManager.ThemeListener {

    // Root & Header
    private RelativeLayout mRlRoot;
    private RelativeLayout mRlHeader;
    private TextView mTvBrandName;
    private TextView mTvBrandSub;
    private ImageView mBtnThemeToggle;

    // Bottom Navigation Bar
    private LinearLayout mLlBottomNav;
    private LinearLayout mBtnTabCollection;
    private ImageView mIvTabCollection;
    private TextView mTvTabCollection;

    private LinearLayout mBtnTabAtelier;
    private ImageView mIvTabAtelier;
    private TextView mTvTabAtelier;

    private RelativeLayout mBtnTabCart;
    private ImageView mIvTabCart;
    private TextView mTvTabCart;
    private TextView mTvNavCartBadge;

    // Section 1: Collection
    private LinearLayout mLlSectionCollection;
    private LinearLayout mLlSearchBox;
    private ImageView mIvSearchIcon;
    private EditText mEtSearch;
    private LinearLayout mLlCategories;
    private ProgressBar mPbLoading;
    private LinearLayout mLlError;
    private TextView mTvError;
    private Button mBtnRetry;
    private ScrollView mSvProducts;
    private LinearLayout mLlAtelierShowcase;
    private TextView mTvShowcaseTitle;
    private TextView mTvShowcaseSub;
    private LinearLayout mLlProducts;

    // Section 2: The Atelier
    private ScrollView mSvSectionAtelier;
    private LinearLayout mLlAtelierCard1;
    private TextView mTvAtelierH1;
    private TextView mTvAtelierP1;
    private LinearLayout mLlStoneCarrara;
    private TextView mTvCarraraTitle;
    private TextView mTvCarraraDesc;
    private LinearLayout mLlStoneTravertine;
    private TextView mTvTravertineTitle;
    private TextView mTvTravertineDesc;
    private LinearLayout mLlStoneCalacatta;
    private TextView mTvCalacattaTitle;
    private TextView mTvCalacattaDesc;
    private LinearLayout mLlAtelierCrating;
    private TextView mTvCratingTitle;
    private TextView mTvCratingDesc;

    // Section 3: Acquisition Tray (Cart)
    private RelativeLayout mRlSectionCart;
    private ScrollView mSvTabCartItems;
    private LinearLayout mLlTabCartItems;
    private LinearLayout mLlTabCartEmpty;
    private TextView mTvEmptyTitle;
    private TextView mTvEmptySub;
    private Button mBtnTabBrowseCatalog;
    private LinearLayout mLlTabCartCheckoutBar;
    private TextView mTvTotalLabel;
    private TextView mTvTabCartTotal;
    private TextView mTvFreightNote;
    private Button mBtnTabCheckoutInquiry;

    // State Variables
    private List<Product> mAllProducts = new ArrayList<>();
    private String mActiveCategory = "all";
    private String mSearchQuery = "";
    private int mCurrentTab = 0; // 0 = Collection, 1 = Atelier, 2 = Cart

    private static final String[] CATEGORIES = {"all", "home", "tableware", "sculptures"};
    private static final String[] CATEGORY_LABELS = {"All Pieces", "Home Objects", "Tableware", "Sculptures"};

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initViews();
        setupNavigation();
        setupCategories();
        setupSearchAndActions();

        CartManager.addListener(this);
        ThemeManager.addListener(this);

        // Apply theme (defaults to Light Mode as configured in ThemeManager)
        applyTheme(ThemeManager.isDarkMode(this));
        switchTab(0);

        loadProducts();
    }

    @Override
    protected void onResume() {
        super.onResume();
        updateCartBadge();
        if (mCurrentTab == 2) {
            renderCartTab();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        CartManager.removeListener(this);
        ThemeManager.removeListener(this);
    }

    @Override
    public void onCartChanged() {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                updateCartBadge();
                if (mCurrentTab == 2) {
                    renderCartTab();
                }
            }
        });
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

    private void initViews() {
        // Root & Header
        mRlRoot = findViewById(R.id.rl_root);
        mRlHeader = findViewById(R.id.rl_header);
        mTvBrandName = findViewById(R.id.tv_brand_name);
        mTvBrandSub = findViewById(R.id.tv_brand_sub);
        mBtnThemeToggle = findViewById(R.id.btn_theme_toggle);

        // Bottom Navigation Bar
        mLlBottomNav = findViewById(R.id.ll_bottom_nav);
        mBtnTabCollection = findViewById(R.id.btn_tab_collection);
        mIvTabCollection = findViewById(R.id.iv_tab_collection);
        mTvTabCollection = findViewById(R.id.tv_tab_collection);

        mBtnTabAtelier = findViewById(R.id.btn_tab_atelier);
        mIvTabAtelier = findViewById(R.id.iv_tab_atelier);
        mTvTabAtelier = findViewById(R.id.tv_tab_atelier);

        mBtnTabCart = findViewById(R.id.btn_tab_cart);
        mIvTabCart = findViewById(R.id.iv_tab_cart);
        mTvTabCart = findViewById(R.id.tv_tab_cart);
        mTvNavCartBadge = findViewById(R.id.tv_nav_cart_badge);

        // Section 1: Collection
        mLlSectionCollection = findViewById(R.id.ll_section_collection);
        mLlSearchBox = findViewById(R.id.ll_search_box);
        mIvSearchIcon = findViewById(R.id.iv_search_icon);
        mEtSearch = findViewById(R.id.et_search);
        mLlCategories = findViewById(R.id.ll_categories);
        mPbLoading = findViewById(R.id.pb_loading);
        mLlError = findViewById(R.id.ll_error);
        mTvError = findViewById(R.id.tv_error);
        mBtnRetry = findViewById(R.id.btn_retry);
        mSvProducts = findViewById(R.id.sv_products);
        mLlAtelierShowcase = findViewById(R.id.ll_atelier_showcase);
        mTvShowcaseTitle = findViewById(R.id.tv_showcase_title);
        mTvShowcaseSub = findViewById(R.id.tv_showcase_sub);
        mLlProducts = findViewById(R.id.ll_products);

        // Section 2: The Atelier
        mSvSectionAtelier = findViewById(R.id.sv_section_atelier);
        mLlAtelierCard1 = findViewById(R.id.ll_atelier_card_1);
        mTvAtelierH1 = findViewById(R.id.tv_atelier_h1);
        mTvAtelierP1 = findViewById(R.id.tv_atelier_p1);
        mLlStoneCarrara = findViewById(R.id.ll_stone_carrara);
        mTvCarraraTitle = findViewById(R.id.tv_carrara_title);
        mTvCarraraDesc = findViewById(R.id.tv_carrara_desc);
        mLlStoneTravertine = findViewById(R.id.ll_stone_travertine);
        mTvTravertineTitle = findViewById(R.id.tv_travertine_title);
        mTvTravertineDesc = findViewById(R.id.tv_travertine_desc);
        mLlStoneCalacatta = findViewById(R.id.ll_stone_calacatta);
        mTvCalacattaTitle = findViewById(R.id.tv_calacatta_title);
        mTvCalacattaDesc = findViewById(R.id.tv_calacatta_desc);
        mLlAtelierCrating = findViewById(R.id.ll_atelier_crating);
        mTvCratingTitle = findViewById(R.id.tv_crating_title);
        mTvCratingDesc = findViewById(R.id.tv_crating_desc);

        // Section 3: Cart Tab
        mRlSectionCart = findViewById(R.id.rl_section_cart);
        mSvTabCartItems = findViewById(R.id.sv_tab_cart_items);
        mLlTabCartItems = findViewById(R.id.ll_tab_cart_items);
        mLlTabCartEmpty = findViewById(R.id.ll_tab_cart_empty);
        mTvEmptyTitle = findViewById(R.id.tv_empty_title);
        mTvEmptySub = findViewById(R.id.tv_empty_sub);
        mBtnTabBrowseCatalog = findViewById(R.id.btn_tab_browse_catalog);
        mLlTabCartCheckoutBar = findViewById(R.id.ll_tab_cart_checkout_bar);
        mTvTotalLabel = findViewById(R.id.tv_total_label);
        mTvTabCartTotal = findViewById(R.id.tv_tab_cart_total);
        mTvFreightNote = findViewById(R.id.tv_freight_note);
        mBtnTabCheckoutInquiry = findViewById(R.id.btn_tab_checkout_inquiry);
    }

    private void setupNavigation() {
        mBtnTabCollection.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                switchTab(0);
            }
        });

        mBtnTabAtelier.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                switchTab(1);
            }
        });

        mBtnTabCart.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                switchTab(2);
            }
        });

        mBtnTabBrowseCatalog.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                switchTab(0);
            }
        });
    }

    private void switchTab(int tabIndex) {
        mCurrentTab = tabIndex;

        mLlSectionCollection.setVisibility(tabIndex == 0 ? View.VISIBLE : View.GONE);
        mSvSectionAtelier.setVisibility(tabIndex == 1 ? View.VISIBLE : View.GONE);
        mRlSectionCart.setVisibility(tabIndex == 2 ? View.VISIBLE : View.GONE);

        boolean isDark = ThemeManager.isDarkMode(this);
        int activeColor = ThemeManager.getBronze(isDark);
        int inactiveColor = ThemeManager.getTextMuted(isDark);

        // Tab 0 Styling
        mIvTabCollection.setColorFilter(tabIndex == 0 ? activeColor : inactiveColor);
        mTvTabCollection.setTextColor(tabIndex == 0 ? activeColor : inactiveColor);
        mTvTabCollection.setTypeface(null, tabIndex == 0 ? Typeface.BOLD : Typeface.NORMAL);

        // Tab 1 Styling
        mIvTabAtelier.setColorFilter(tabIndex == 1 ? activeColor : inactiveColor);
        mTvTabAtelier.setTextColor(tabIndex == 1 ? activeColor : inactiveColor);
        mTvTabAtelier.setTypeface(null, tabIndex == 1 ? Typeface.BOLD : Typeface.NORMAL);

        // Tab 2 Styling
        mIvTabCart.setColorFilter(tabIndex == 2 ? activeColor : inactiveColor);
        mTvTabCart.setTextColor(tabIndex == 2 ? activeColor : inactiveColor);
        mTvTabCart.setTypeface(null, tabIndex == 2 ? Typeface.BOLD : Typeface.NORMAL);

        if (tabIndex == 2) {
            renderCartTab();
        }
    }

    private void setupCategories() {
        mLlCategories.removeAllViews();
        boolean isDark = ThemeManager.isDarkMode(this);
        int chipRadius = ThemeManager.dpToPx(this, 16);

        for (int i = 0; i < CATEGORIES.length; i++) {
            final String catKey = CATEGORIES[i];
            String label = CATEGORY_LABELS[i];
            boolean isActive = catKey.equals(mActiveCategory);

            final TextView chip = new TextView(this);
            chip.setText(label);
            chip.setTextSize(13);
            chip.setPadding(ThemeManager.dpToPx(this, 14), ThemeManager.dpToPx(this, 7),
                    ThemeManager.dpToPx(this, 14), ThemeManager.dpToPx(this, 7));

            LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
            );
            lp.setMarginEnd(ThemeManager.dpToPx(this, 8));
            chip.setLayoutParams(lp);

            chip.setBackground(ThemeManager.createChipDrawable(isDark, isActive, chipRadius));
            chip.setTextColor(isActive ? ThemeManager.getBronze(isDark) : ThemeManager.getTextSecondary(isDark));
            chip.setTypeface(null, isActive ? Typeface.BOLD : Typeface.NORMAL);

            chip.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    mActiveCategory = catKey;
                    setupCategories();
                    filterAndRender();
                }
            });

            mLlCategories.addView(chip);
        }
    }

    private void setupSearchAndActions() {
        mBtnThemeToggle.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ThemeManager.toggleTheme(MainActivity.this);
            }
        });

        mBtnRetry.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                loadProducts();
            }
        });

        mEtSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int count, int after) {
                mSearchQuery = s.toString().trim().toLowerCase();
                filterAndRender();
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });

        mBtnTabCheckoutInquiry.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showInquiryDialog();
            }
        });
    }

    private void applyTheme(boolean isDark) {
        // Toggle icon: sun for dark mode (click to light), moon for light mode (click to dark)
        mBtnThemeToggle.setImageResource(isDark ? R.drawable.ic_theme_sun : R.drawable.ic_theme_moon);

        // Root & Header
        mRlRoot.setBackgroundColor(ThemeManager.getBgColor(isDark));
        mRlHeader.setBackgroundColor(ThemeManager.getSurfaceColor(isDark));
        mTvBrandName.setTextColor(ThemeManager.getBronze(isDark));
        mTvBrandSub.setTextColor(ThemeManager.getTextMuted(isDark));

        // Bottom Nav Bar
        mLlBottomNav.setBackgroundColor(ThemeManager.getSurfaceColor(isDark));
        switchTab(mCurrentTab);

        // Search Box
        int searchRadius = ThemeManager.dpToPx(this, 8);
        mLlSearchBox.setBackground(ThemeManager.createSearchDrawable(isDark, searchRadius));
        mEtSearch.setTextColor(ThemeManager.getTextPrimary(isDark));
        mEtSearch.setHintTextColor(ThemeManager.getTextMuted(isDark));
        mIvSearchIcon.setColorFilter(ThemeManager.getTextMuted(isDark));

        // Atelier Showcase in Tab 1
        int cardRadius = ThemeManager.dpToPx(this, 8);
        if (mLlAtelierShowcase != null) {
            mLlAtelierShowcase.setBackground(ThemeManager.createCardDrawable(isDark, cardRadius));
            mTvShowcaseTitle.setTextColor(ThemeManager.getBronze(isDark));
            mTvShowcaseSub.setTextColor(ThemeManager.getTextSecondary(isDark));
        }

        // Section 2 Atelier Cards & Texts
        if (mLlAtelierCard1 != null) {
            mLlAtelierCard1.setBackground(ThemeManager.createCardDrawable(isDark, cardRadius));
            mTvAtelierH1.setTextColor(ThemeManager.getTextPrimary(isDark));
            mTvAtelierP1.setTextColor(ThemeManager.getTextSecondary(isDark));

            mLlStoneCarrara.setBackground(ThemeManager.createCardDrawable(isDark, cardRadius));
            mTvCarraraTitle.setTextColor(ThemeManager.getTextPrimary(isDark));
            mTvCarraraDesc.setTextColor(ThemeManager.getTextSecondary(isDark));

            mLlStoneTravertine.setBackground(ThemeManager.createCardDrawable(isDark, cardRadius));
            mTvTravertineTitle.setTextColor(ThemeManager.getTextPrimary(isDark));
            mTvTravertineDesc.setTextColor(ThemeManager.getTextSecondary(isDark));

            mLlStoneCalacatta.setBackground(ThemeManager.createCardDrawable(isDark, cardRadius));
            mTvCalacattaTitle.setTextColor(ThemeManager.getTextPrimary(isDark));
            mTvCalacattaDesc.setTextColor(ThemeManager.getTextSecondary(isDark));

            mLlAtelierCrating.setBackground(ThemeManager.createCardDrawable(isDark, cardRadius));
            mTvCratingTitle.setTextColor(ThemeManager.getTextPrimary(isDark));
            mTvCratingDesc.setTextColor(ThemeManager.getTextSecondary(isDark));
        }

        // Section 3 Cart Tab Elements
        if (mLlTabCartCheckoutBar != null) {
            mLlTabCartCheckoutBar.setBackgroundColor(ThemeManager.getSurfaceColor(isDark));
            mTvTotalLabel.setTextColor(ThemeManager.getTextSecondary(isDark));
            mTvFreightNote.setTextColor(ThemeManager.getTextMuted(isDark));
            mTvEmptyTitle.setTextColor(ThemeManager.getTextPrimary(isDark));
            mTvEmptySub.setTextColor(ThemeManager.getTextSecondary(isDark));
        }

        setupCategories();
        filterAndRender();
        if (mCurrentTab == 2) {
            renderCartTab();
        }
    }

    private void updateCartBadge() {
        int count = CartManager.getTotalCount(this);
        if (count > 0) {
            mTvNavCartBadge.setVisibility(View.VISIBLE);
            mTvNavCartBadge.setText(String.valueOf(count));
        } else {
            mTvNavCartBadge.setVisibility(View.GONE);
        }
    }

    private void loadProducts() {
        mPbLoading.setVisibility(View.VISIBLE);
        mLlError.setVisibility(View.GONE);
        mLlProducts.removeAllViews();

        ApiClient.fetchProducts(this, null, new ApiClient.Callback<List<Product>>() {
            @Override
            public void onSuccess(List<Product> result) {
                mPbLoading.setVisibility(View.GONE);
                mAllProducts = result;
                filterAndRender();
            }

            @Override
            public void onError(String message) {
                mPbLoading.setVisibility(View.GONE);
                mLlError.setVisibility(View.VISIBLE);
                mTvError.setText("Unable to connect to atelier server.\n" + message + "\n\nServer endpoint: " + AppConfig.getBaseUrl(MainActivity.this));
            }
        });
    }

    private void filterAndRender() {
        mLlProducts.removeAllViews();
        LayoutInflater inflater = LayoutInflater.from(this);
        List<Product> filtered = new ArrayList<>();
        boolean isDark = ThemeManager.isDarkMode(this);
        int cardRadius = ThemeManager.dpToPx(this, 8);

        // Hide heritage banner when user is searching or viewing a specific category
        if (mLlAtelierShowcase != null) {
            mLlAtelierShowcase.setVisibility((mActiveCategory.equals("all") && mSearchQuery.isEmpty()) ? View.VISIBLE : View.GONE);
        }

        for (Product p : mAllProducts) {
            // Category check
            boolean matchesCat = mActiveCategory.equals("all") || p.category.equalsIgnoreCase(mActiveCategory);
            if (!matchesCat) continue;

            // Search query check
            if (!mSearchQuery.isEmpty()) {
                boolean matchesSearch = p.name.toLowerCase().contains(mSearchQuery)
                        || p.stoneType.toLowerCase().contains(mSearchQuery)
                        || p.origin.toLowerCase().contains(mSearchQuery)
                        || p.tagline.toLowerCase().contains(mSearchQuery);
                if (!matchesSearch) continue;
            }
            filtered.add(p);
        }

        if (filtered.isEmpty()) {
            TextView emptyView = new TextView(this);
            emptyView.setText("No stone pieces found matching your criteria.");
            emptyView.setTextColor(ThemeManager.getTextSecondary(isDark));
            emptyView.setPadding(32, 64, 32, 64);
            emptyView.setTextSize(14);
            emptyView.setGravity(android.view.Gravity.CENTER);
            mLlProducts.addView(emptyView);
            return;
        }

        for (final Product product : filtered) {
            View card = inflater.inflate(R.layout.item_product_card, mLlProducts, false);
            card.setBackground(ThemeManager.createCardDrawable(isDark, cardRadius));

            ImageView ivProduct = card.findViewById(R.id.iv_product);
            TextView tvBadge = card.findViewById(R.id.tv_badge);
            TextView tvOrigin = card.findViewById(R.id.tv_origin_badge);
            TextView tvStoneType = card.findViewById(R.id.tv_stone_type);
            TextView tvVariantCount = card.findViewById(R.id.tv_variant_count);
            TextView tvName = card.findViewById(R.id.tv_name);
            TextView tvTagline = card.findViewById(R.id.tv_tagline);
            TextView tvPrice = card.findViewById(R.id.tv_price);
            View btnInspect = card.findViewById(R.id.btn_inspect);

            tvStoneType.setText(product.stoneType.toUpperCase());
            tvStoneType.setTextColor(ThemeManager.getBronze(isDark));

            if (tvVariantCount != null) {
                tvVariantCount.setTextColor(ThemeManager.getTextMuted(isDark));
                if (product.sizes != null && !product.sizes.isEmpty()) {
                    tvVariantCount.setText(product.sizes.size() == 1 ? "1 Size" : product.sizes.size() + " Sizes");
                } else {
                    tvVariantCount.setText("Single Edition");
                }
            }

            tvName.setText(product.name);
            tvName.setTextColor(ThemeManager.getTextPrimary(isDark));

            tvTagline.setText(product.tagline);
            tvTagline.setTextColor(ThemeManager.getTextSecondary(isDark));

            tvPrice.setText(product.getPriceDisplay());
            tvPrice.setTextColor(ThemeManager.getGold(isDark));

            if (btnInspect instanceof TextView) {
                btnInspect.setBackground(ThemeManager.createSecondaryButtonDrawable(isDark, ThemeManager.dpToPx(this, 6)));
                ((TextView) btnInspect).setTextColor(ThemeManager.getBronze(isDark));
            }

            if (product.origin != null && !product.origin.isEmpty()) {
                tvOrigin.setVisibility(View.VISIBLE);
                tvOrigin.setText(product.origin);
                tvOrigin.setBackground(ThemeManager.createChipDrawable(isDark, false, ThemeManager.dpToPx(this, 10)));
                tvOrigin.setTextColor(ThemeManager.getTextSecondary(isDark));
            } else {
                tvOrigin.setVisibility(View.GONE);
            }

            if (product.badge != null && !product.badge.isEmpty()) {
                tvBadge.setVisibility(View.VISIBLE);
                tvBadge.setText(product.badge);
                tvBadge.setBackground(ThemeManager.createChipDrawable(isDark, true, ThemeManager.dpToPx(this, 10)));
                tvBadge.setTextColor(ThemeManager.getBronze(isDark));
            } else {
                tvBadge.setVisibility(View.GONE);
            }

            // Load stone image
            ImageLoader.getInstance().displayImage(this, product.featuredImage, ivProduct);

            View.OnClickListener openDetail = new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intent = new Intent(MainActivity.this, ProductDetailActivity.class);
                    intent.putExtra("product_id", product.id);
                    intent.putExtra("product_obj", product);
                    startActivity(intent);
                }
            };

            card.setOnClickListener(openDetail);
            btnInspect.setOnClickListener(openDetail);

            mLlProducts.addView(card);
        }
    }

    private void renderCartTab() {
        List<CartItem> items = CartManager.getItems(this);
        mLlTabCartItems.removeAllViews();

        int totalCount = CartManager.getTotalCount(this);
        int totalPrice = CartManager.getTotalPrice(this);
        boolean isDark = ThemeManager.isDarkMode(this);
        int cardRadius = ThemeManager.dpToPx(this, 8);

        mTvTabCartTotal.setText("$" + totalPrice);

        if (items.isEmpty()) {
            mSvTabCartItems.setVisibility(View.GONE);
            mLlTabCartCheckoutBar.setVisibility(View.GONE);
            mLlTabCartEmpty.setVisibility(View.VISIBLE);
            return;
        }

        mSvTabCartItems.setVisibility(View.VISIBLE);
        mLlTabCartCheckoutBar.setVisibility(View.VISIBLE);
        mLlTabCartEmpty.setVisibility(View.GONE);

        LayoutInflater inflater = LayoutInflater.from(this);

        for (final CartItem item : items) {
            View row = inflater.inflate(R.layout.item_cart_row, mLlTabCartItems, false);
            row.setBackground(ThemeManager.createCardDrawable(isDark, cardRadius));

            ImageView ivThumb = row.findViewById(R.id.iv_cart_thumb);
            TextView tvName = row.findViewById(R.id.tv_cart_item_name);
            TextView tvVariant = row.findViewById(R.id.tv_cart_item_variant);
            TextView tvUnitPrice = row.findViewById(R.id.tv_cart_item_unit_price);
            TextView tvSubtotal = row.findViewById(R.id.tv_cart_item_subtotal);
            TextView tvQty = row.findViewById(R.id.tv_cart_item_qty);
            TextView btnMinus = row.findViewById(R.id.btn_cart_minus);
            TextView btnPlus = row.findViewById(R.id.btn_cart_plus);

            tvName.setText(item.productName);
            tvName.setTextColor(ThemeManager.getTextPrimary(isDark));

            tvVariant.setText(item.sizeName + " (" + item.dimensions + ")");
            tvVariant.setTextColor(ThemeManager.getBronze(isDark));

            tvUnitPrice.setText("$" + item.unitPrice + " each");
            tvUnitPrice.setTextColor(ThemeManager.getTextMuted(isDark));

            tvSubtotal.setText("$" + item.getSubtotal());

            tvQty.setText(String.valueOf(item.quantity));
            tvQty.setTextColor(ThemeManager.getTextPrimary(isDark));

            ImageLoader.getInstance().displayImage(this, item.featuredImage, ivThumb);

            btnMinus.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    CartManager.updateQuantity(MainActivity.this, item.getKey(), -1);
                }
            });

            btnPlus.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    CartManager.updateQuantity(MainActivity.this, item.getKey(), 1);
                }
            });

            mLlTabCartItems.addView(row);
        }
    }

    private void showInquiryDialog() {
        boolean isDark = ThemeManager.isDarkMode(this);
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        LinearLayout container = new LinearLayout(this);
        container.setOrientation(LinearLayout.VERTICAL);
        container.setPadding(48, 36, 48, 24);
        container.setBackgroundColor(ThemeManager.getSurfaceColor(isDark));

        TextView title = new TextView(this);
        title.setText("ACQUISITION INQUIRY");
        title.setTextSize(16);
        title.setTextColor(ThemeManager.getBronze(isDark));
        title.setTypeface(null, Typeface.BOLD);
        container.addView(title);

        TextView sub = new TextView(this);
        sub.setText("Our master stonemasons will verify quarry block selection and reinforced crating logistics for your order.");
        sub.setTextSize(12);
        sub.setTextColor(ThemeManager.getTextMuted(isDark));
        sub.setPadding(0, 8, 0, 24);
        container.addView(sub);

        int inputRadius = ThemeManager.dpToPx(this, 6);

        final EditText etName = new EditText(this);
        etName.setHint("Full Name");
        etName.setTextColor(ThemeManager.getTextPrimary(isDark));
        etName.setHintTextColor(ThemeManager.getTextMuted(isDark));
        etName.setBackground(ThemeManager.createSearchDrawable(isDark, inputRadius));
        etName.setPadding(24, 20, 24, 20);
        container.addView(etName);

        final EditText etContact = new EditText(this);
        etContact.setHint("Email or Phone Number");
        etContact.setTextColor(ThemeManager.getTextPrimary(isDark));
        etContact.setHintTextColor(ThemeManager.getTextMuted(isDark));
        etContact.setBackground(ThemeManager.createSearchDrawable(isDark, inputRadius));
        etContact.setPadding(24, 20, 24, 20);
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
        );
        lp.setMargins(0, 16, 0, 24);
        etContact.setLayoutParams(lp);
        container.addView(etContact);

        Button btnSubmit = new Button(this);
        btnSubmit.setText("Confirm Acquisition Order");
        btnSubmit.setBackgroundResource(R.drawable.bg_btn_gold);
        btnSubmit.setTextColor(0xFF0D0D0D);
        btnSubmit.setTypeface(null, Typeface.BOLD);
        container.addView(btnSubmit);

        builder.setView(container);
        final AlertDialog dialog = builder.create();

        btnSubmit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String name = etName.getText().toString().trim();
                String contact = etContact.getText().toString().trim();

                if (name.isEmpty() || contact.isEmpty()) {
                    Toast.makeText(MainActivity.this, "Please provide your name and contact details.", Toast.LENGTH_SHORT).show();
                    return;
                }

                dialog.dismiss();
                CartManager.clear(MainActivity.this);

                new AlertDialog.Builder(MainActivity.this)
                        .setTitle("Acquisition Registered")
                        .setMessage("Thank you, " + name + ". Your inquiry for solid stone architectural pieces has been received. Our atelier team will contact you shortly regarding freight and crating.")
                        .setPositiveButton("Return to Collection", null)
                        .show();
            }
        });

        dialog.show();
    }
}
