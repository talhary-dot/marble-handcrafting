package com.sangtarash.app;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Typeface;
import android.net.Uri;
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
import com.sangtarash.app.storage.WishlistManager;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
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

    // Secondary Filter Controls: Wishlist, Stone Variety, Sorting
    private LinearLayout mLlFilterWishlist;
    private ImageView mIvFilterWishlist;
    private TextView mTvFilterWishlist;
    private TextView mTvFilterStone;
    private TextView mTvFilterSort;

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

    // Atelier Additions: Bespoke Commissions & Stone Care
    private LinearLayout mLlAtelierBespoke;
    private TextView mTvBespokeTitle;
    private TextView mTvBespokeDesc;
    private Button mBtnAtelierBespoke;
    private LinearLayout mLlAtelierCare;
    private TextView mTvCareTitle;
    private TextView mTvCareDesc;
    private Button mBtnAtelierCare;

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

    // Advanced Filtering & Sorting State
    private boolean mShowWishlistOnly = false;
    private String mActiveStoneType = "all";
    private String mActiveSort = "curated";

    private static final String[] CATEGORIES = {"all", "home", "tableware", "sculptures"};
    private static final String[] CATEGORY_LABELS = {"All Pieces", "Home Objects", "Tableware", "Sculptures"};

    private static final String[] STONE_KEYS = {"all", "carrara", "travertine", "nero marquina", "calacatta", "onyx"};
    private static final String[] STONE_LABELS = {"All Stone Varieties", "Carrara White", "Roman Travertine", "Nero Marquina", "Calacatta Monolith", "Green Onyx"};

    private static final String[] SORT_KEYS = {"curated", "price_asc", "price_desc", "name_asc"};
    private static final String[] SORT_LABELS = {"Atelier Curated", "Price: Low to High", "Price: High to Low", "Alphabetical: A to Z"};

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initViews();
        setupNavigation();
        setupCategories();
        setupSecondaryFilters();
        setupSearchAndActions();
        setupAtelierActions();

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
        updateWishlistUI();
        if (mCurrentTab == 0 && !mAllProducts.isEmpty()) {
            filterAndRender();
        } else if (mCurrentTab == 2) {
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

        // Secondary Filters
        mLlFilterWishlist = findViewById(R.id.ll_filter_wishlist);
        mIvFilterWishlist = findViewById(R.id.iv_filter_wishlist);
        mTvFilterWishlist = findViewById(R.id.tv_filter_wishlist);
        mTvFilterStone = findViewById(R.id.tv_filter_stone);
        mTvFilterSort = findViewById(R.id.tv_filter_sort);

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

        mLlAtelierBespoke = findViewById(R.id.ll_atelier_bespoke);
        mTvBespokeTitle = findViewById(R.id.tv_bespoke_title);
        mTvBespokeDesc = findViewById(R.id.tv_bespoke_desc);
        mBtnAtelierBespoke = findViewById(R.id.btn_atelier_bespoke);

        mLlAtelierCare = findViewById(R.id.ll_atelier_care);
        mTvCareTitle = findViewById(R.id.tv_care_title);
        mTvCareDesc = findViewById(R.id.tv_care_desc);
        mBtnAtelierCare = findViewById(R.id.btn_atelier_care);

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

    private void setupSecondaryFilters() {
        // Wishlist Toggle
        mLlFilterWishlist.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mShowWishlistOnly = !mShowWishlistOnly;
                updateWishlistUI();
                filterAndRender();
            }
        });

        // Stone Variety Dialog
        mTvFilterStone.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int selectedIndex = 0;
                for (int i = 0; i < STONE_KEYS.length; i++) {
                    if (STONE_KEYS[i].equalsIgnoreCase(mActiveStoneType)) {
                        selectedIndex = i;
                        break;
                    }
                }

                new AlertDialog.Builder(MainActivity.this)
                        .setTitle("Select Stone Variety")
                        .setSingleChoiceItems(STONE_LABELS, selectedIndex, new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                mActiveStoneType = STONE_KEYS[which];
                                if (which == 0) {
                                    mTvFilterStone.setText("Stone: All");
                                } else {
                                    mTvFilterStone.setText("Stone: " + STONE_LABELS[which]);
                                }
                                dialog.dismiss();
                                filterAndRender();
                            }
                        })
                        .setNegativeButton("Cancel", null)
                        .show();
            }
        });

        // Sort Order Dialog
        mTvFilterSort.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int selectedIndex = 0;
                for (int i = 0; i < SORT_KEYS.length; i++) {
                    if (SORT_KEYS[i].equalsIgnoreCase(mActiveSort)) {
                        selectedIndex = i;
                        break;
                    }
                }

                new AlertDialog.Builder(MainActivity.this)
                        .setTitle("Sort Collection")
                        .setSingleChoiceItems(SORT_LABELS, selectedIndex, new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                mActiveSort = SORT_KEYS[which];
                                mTvFilterSort.setText("Sort: " + SORT_LABELS[which]);
                                dialog.dismiss();
                                filterAndRender();
                            }
                        })
                        .setNegativeButton("Cancel", null)
                        .show();
            }
        });
    }

    private void updateWishlistUI() {
        int count = WishlistManager.getWishlistCount(this);
        mTvFilterWishlist.setText("Saved (" + count + ")");
        boolean isDark = ThemeManager.isDarkMode(this);
        int chipRadius = ThemeManager.dpToPx(this, 14);

        if (mShowWishlistOnly) {
            mLlFilterWishlist.setBackground(ThemeManager.createChipDrawable(isDark, true, chipRadius));
            mIvFilterWishlist.setImageResource(R.drawable.ic_heart_filled);
            mIvFilterWishlist.setColorFilter(ThemeManager.getBronze(isDark));
            mTvFilterWishlist.setTextColor(ThemeManager.getBronze(isDark));
            mTvFilterWishlist.setTypeface(null, Typeface.BOLD);
        } else {
            mLlFilterWishlist.setBackground(ThemeManager.createChipDrawable(isDark, false, chipRadius));
            mIvFilterWishlist.setImageResource(count > 0 ? R.drawable.ic_heart_filled : R.drawable.ic_heart);
            mIvFilterWishlist.setColorFilter(count > 0 ? ThemeManager.getBronze(isDark) : ThemeManager.getTextMuted(isDark));
            mTvFilterWishlist.setTextColor(count > 0 ? ThemeManager.getBronze(isDark) : ThemeManager.getTextSecondary(isDark));
            mTvFilterWishlist.setTypeface(null, Typeface.NORMAL);
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

        // Launch full dedicated Cart & Luxury Acquisition Experience
        mBtnTabCheckoutInquiry.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(MainActivity.this, CartActivity.class));
            }
        });
    }

    private void setupAtelierActions() {
        if (mBtnAtelierBespoke != null) {
            mBtnAtelierBespoke.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    showBespokeCommissionDialog();
                }
            });
        }

        if (mBtnAtelierCare != null) {
            mBtnAtelierCare.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    showStoneCareGuideDialog();
                }
            });
        }
    }

    private void showBespokeCommissionDialog() {
        boolean isDark = ThemeManager.isDarkMode(this);
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        ScrollView sv = new ScrollView(this);
        LinearLayout container = new LinearLayout(this);
        container.setOrientation(LinearLayout.VERTICAL);
        container.setPadding(48, 36, 48, 36);
        container.setBackgroundColor(ThemeManager.getSurfaceColor(isDark));

        TextView title = new TextView(this);
        title.setText("BESPOKE ARCHITECTURAL COMMISSION");
        title.setTextSize(15);
        title.setTextColor(ThemeManager.getBronze(isDark));
        title.setTypeface(null, Typeface.BOLD);
        title.setLetterSpacing(0.08f);
        container.addView(title);

        TextView sub = new TextView(this);
        sub.setText("From monolithic stone bathtubs and fluted vanities to architectural consoles and private dining monoliths. Carved from single quarried blocks.");
        sub.setTextSize(12);
        sub.setTextColor(ThemeManager.getTextMuted(isDark));
        sub.setPadding(0, 8, 0, 20);
        sub.setLineSpacing(0, 1.2f);
        container.addView(sub);

        int inputRadius = ThemeManager.dpToPx(this, 6);

        final EditText etClient = new EditText(this);
        etClient.setHint("Client Name / Architecture Firm");
        etClient.setTextColor(ThemeManager.getTextPrimary(isDark));
        etClient.setHintTextColor(ThemeManager.getTextMuted(isDark));
        etClient.setBackground(ThemeManager.createSearchDrawable(isDark, inputRadius));
        etClient.setPadding(24, 18, 24, 18);
        container.addView(etClient);

        final EditText etContact = new EditText(this);
        etContact.setHint("Email or Phone Number");
        etContact.setTextColor(ThemeManager.getTextPrimary(isDark));
        etContact.setHintTextColor(ThemeManager.getTextMuted(isDark));
        etContact.setBackground(ThemeManager.createSearchDrawable(isDark, inputRadius));
        etContact.setPadding(24, 18, 24, 18);
        LinearLayout.LayoutParams lpContact = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        lpContact.setMargins(0, 12, 0, 0);
        etContact.setLayoutParams(lpContact);
        container.addView(etContact);

        final EditText etStone = new EditText(this);
        etStone.setHint("Stone Preference & Dimensions (e.g., Carrara 220x60x85cm)");
        etStone.setTextColor(ThemeManager.getTextPrimary(isDark));
        etStone.setHintTextColor(ThemeManager.getTextMuted(isDark));
        etStone.setBackground(ThemeManager.createSearchDrawable(isDark, inputRadius));
        etStone.setPadding(24, 18, 24, 18);
        LinearLayout.LayoutParams lpStone = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        lpStone.setMargins(0, 12, 0, 0);
        etStone.setLayoutParams(lpStone);
        container.addView(etStone);

        final EditText etBrief = new EditText(this);
        etBrief.setHint("Architectural Scope / Design Brief Notes");
        etBrief.setTextColor(ThemeManager.getTextPrimary(isDark));
        etBrief.setHintTextColor(ThemeManager.getTextMuted(isDark));
        etBrief.setBackground(ThemeManager.createSearchDrawable(isDark, inputRadius));
        etBrief.setPadding(24, 18, 24, 18);
        etBrief.setMinLines(3);
        LinearLayout.LayoutParams lpBrief = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        lpBrief.setMargins(0, 12, 0, 20);
        etBrief.setLayoutParams(lpBrief);
        container.addView(etBrief);

        Button btnSubmit = new Button(this);
        btnSubmit.setText("Transmit Commission Brief");
        btnSubmit.setBackgroundResource(R.drawable.bg_btn_gold);
        btnSubmit.setTextColor(0xFF0D0D0D);
        btnSubmit.setTypeface(null, Typeface.BOLD);
        container.addView(btnSubmit);

        Button btnWhatsApp = new Button(this);
        btnWhatsApp.setText("Consult Senior Mason via WhatsApp");
        btnWhatsApp.setBackgroundResource(R.drawable.bg_btn_secondary);
        btnWhatsApp.setTextColor(ThemeManager.getBronze(isDark));
        btnWhatsApp.setTypeface(null, Typeface.BOLD);
        LinearLayout.LayoutParams lpWa = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        lpWa.setMargins(0, 10, 0, 0);
        btnWhatsApp.setLayoutParams(lpWa);
        container.addView(btnWhatsApp);

        sv.addView(container);
        builder.setView(sv);
        final AlertDialog dialog = builder.create();

        btnSubmit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String name = etClient.getText().toString().trim();
                String contact = etContact.getText().toString().trim();
                if (name.isEmpty() || contact.isEmpty()) {
                    Toast.makeText(MainActivity.this, "Please enter your name and contact info.", Toast.LENGTH_SHORT).show();
                    return;
                }
                dialog.dismiss();
                new AlertDialog.Builder(MainActivity.this)
                        .setTitle("Bespoke Brief Registered")
                        .setMessage("Thank you, " + name + ". Our senior stonemason and architectural drafting team will examine your commission specifications and reach out within 24 hours.")
                        .setPositiveButton("Understood", null)
                        .show();
            }
        });

        btnWhatsApp.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                try {
                    String text = "Hello Sang Tarash Atelier, I would like to inquire about a custom architectural monolithic stone commission.";
                    String url = "https://wa.me/923284000300?text=" + URLEncoder.encode(text, "UTF-8");
                    Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(i);
                } catch (Exception e) {
                    Toast.makeText(MainActivity.this, "Unable to launch WhatsApp.", Toast.LENGTH_SHORT).show();
                }
            }
        });

        dialog.show();
    }

    private void showStoneCareGuideDialog() {
        boolean isDark = ThemeManager.isDarkMode(this);
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        ScrollView sv = new ScrollView(this);
        LinearLayout container = new LinearLayout(this);
        container.setOrientation(LinearLayout.VERTICAL);
        container.setPadding(48, 36, 48, 36);
        container.setBackgroundColor(ThemeManager.getSurfaceColor(isDark));

        TextView title = new TextView(this);
        title.setText("ATELIER STONE CARE & PRESERVATION");
        title.setTextSize(15);
        title.setTextColor(ThemeManager.getBronze(isDark));
        title.setTypeface(null, Typeface.BOLD);
        title.setLetterSpacing(0.08f);
        container.addView(title);

        TextView intro = new TextView(this);
        intro.setText("Solid metamorphic marble and travertine live and develop character over centuries. Following these protocols will ensure your heirloom piece endures for generations.");
        intro.setTextSize(12);
        intro.setTextColor(ThemeManager.getTextSecondary(isDark));
        intro.setPadding(0, 8, 0, 20);
        intro.setLineSpacing(0, 1.2f);
        container.addView(intro);

        String[][] pillars = {
            {"01. pH-Neutral Cleansing Only", "Never apply acidic cleaners, vinegar, citrus solutions, or bleach. Natural marble is composed of calcium carbonate, which chemically etches upon acidic contact. Cleanse exclusively with lukewarm water and mild, pH-neutral specialized stone soap."},
            {"02. Annual Penetrating Sealer", "Every Sang Tarash acquisition arrives hand-sealed with food-safe fluoropolymer sealer. For high-use surfaces (vanities, vessels, and dining trays), apply an impregnating stone sealant every 12 to 18 months."},
            {"03. Immediate Blotting Protocol", "Blot organic liquids (coffee, red wine, turmeric, citrus oils) immediately with a soft microfiber cloth. Do not rub aggressively into pores, as friction can drive pigment deeper into stone capillaries."},
            {"04. Thermal & Impact Safeguards", "While solid stone possesses immense structural density, rapid thermal shock can induce internal tension. Always utilize coasters, felt pads, and trivets under hot cookware or heavy metal objects."}
        };

        for (String[] p : pillars) {
            TextView pTitle = new TextView(this);
            pTitle.setText(p[0]);
            pTitle.setTextSize(13);
            pTitle.setTextColor(ThemeManager.getGold(isDark));
            pTitle.setTypeface(null, Typeface.BOLD);
            pTitle.setPadding(0, 10, 0, 2);
            container.addView(pTitle);

            TextView pBody = new TextView(this);
            pBody.setText(p[1]);
            pBody.setTextSize(12);
            pBody.setTextColor(ThemeManager.getTextMuted(isDark));
            pBody.setLineSpacing(0, 1.2f);
            pBody.setPadding(0, 0, 0, 12);
            container.addView(pBody);
        }

        Button btnClose = new Button(this);
        btnClose.setText("Close Care Guide");
        btnClose.setBackgroundResource(R.drawable.bg_btn_gold);
        btnClose.setTextColor(0xFF0D0D0D);
        btnClose.setTypeface(null, Typeface.BOLD);
        container.addView(btnClose);

        sv.addView(container);
        builder.setView(sv);
        final AlertDialog dialog = builder.create();

        btnClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();
            }
        });

        dialog.show();
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

        // Secondary Filters
        int chipRadius = ThemeManager.dpToPx(this, 14);
        mTvFilterStone.setBackground(ThemeManager.createChipDrawable(isDark, false, chipRadius));
        mTvFilterStone.setTextColor(ThemeManager.getTextSecondary(isDark));

        mTvFilterSort.setBackground(ThemeManager.createChipDrawable(isDark, false, chipRadius));
        mTvFilterSort.setTextColor(ThemeManager.getTextSecondary(isDark));

        updateWishlistUI();

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

            if (mLlAtelierBespoke != null) {
                mLlAtelierBespoke.setBackground(ThemeManager.createCardDrawable(isDark, cardRadius));
                mTvBespokeTitle.setTextColor(ThemeManager.getTextPrimary(isDark));
                mTvBespokeDesc.setTextColor(ThemeManager.getTextSecondary(isDark));
            }

            if (mLlAtelierCare != null) {
                mLlAtelierCare.setBackground(ThemeManager.createCardDrawable(isDark, cardRadius));
                mTvCareTitle.setTextColor(ThemeManager.getTextPrimary(isDark));
                mTvCareDesc.setTextColor(ThemeManager.getTextSecondary(isDark));
                mBtnAtelierCare.setTextColor(ThemeManager.getBronze(isDark));
            }
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

        // Hide heritage banner when user is searching, filtering, or viewing saved pieces
        if (mLlAtelierShowcase != null) {
            boolean isDefaultView = mActiveCategory.equals("all") && mSearchQuery.isEmpty() && !mShowWishlistOnly && mActiveStoneType.equals("all");
            mLlAtelierShowcase.setVisibility(isDefaultView ? View.VISIBLE : View.GONE);
        }

        for (Product p : mAllProducts) {
            // Category check
            boolean matchesCat = mActiveCategory.equals("all") || p.category.equalsIgnoreCase(mActiveCategory);
            if (!matchesCat) continue;

            // Stone type check
            if (!mActiveStoneType.equals("all")) {
                if (p.stoneType == null || !p.stoneType.toLowerCase().contains(mActiveStoneType.toLowerCase())) {
                    continue;
                }
            }

            // Wishlist check
            if (mShowWishlistOnly) {
                if (!WishlistManager.isWishlisted(this, p.id)) {
                    continue;
                }
            }

            // Search query check
            if (!mSearchQuery.isEmpty()) {
                boolean matchesSearch = (p.name != null && p.name.toLowerCase().contains(mSearchQuery))
                        || (p.stoneType != null && p.stoneType.toLowerCase().contains(mSearchQuery))
                        || (p.origin != null && p.origin.toLowerCase().contains(mSearchQuery))
                        || (p.tagline != null && p.tagline.toLowerCase().contains(mSearchQuery));
                if (!matchesSearch) continue;
            }
            filtered.add(p);
        }

        // Sorting
        if ("price_asc".equals(mActiveSort)) {
            Collections.sort(filtered, new Comparator<Product>() {
                @Override
                public int compare(Product o1, Product o2) {
                    return Integer.compare(o1.getMinPrice(), o2.getMinPrice());
                }
            });
        } else if ("price_desc".equals(mActiveSort)) {
            Collections.sort(filtered, new Comparator<Product>() {
                @Override
                public int compare(Product o1, Product o2) {
                    return Integer.compare(o2.getMinPrice(), o1.getMinPrice());
                }
            });
        } else if ("name_asc".equals(mActiveSort)) {
            Collections.sort(filtered, new Comparator<Product>() {
                @Override
                public int compare(Product o1, Product o2) {
                    return o1.name.compareToIgnoreCase(o2.name);
                }
            });
        }

        if (filtered.isEmpty()) {
            TextView emptyView = new TextView(this);
            if (mShowWishlistOnly) {
                emptyView.setText("No saved pieces yet.\nTap the heart icon on any artwork to save it to your private collection.");
            } else {
                emptyView.setText("No stone pieces found matching your criteria.");
            }
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
            final ImageView btnCardWishlist = card.findViewById(R.id.btn_card_wishlist);

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

            // Wishlist binding
            if (btnCardWishlist != null) {
                boolean isSaved = WishlistManager.isWishlisted(this, product.id);
                btnCardWishlist.setImageResource(isSaved ? R.drawable.ic_heart_filled : R.drawable.ic_heart);
                btnCardWishlist.setColorFilter(isSaved ? ThemeManager.getGold(isDark) : ThemeManager.getTextMuted(isDark));

                btnCardWishlist.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        boolean nowSaved = WishlistManager.toggle(MainActivity.this, product.id);
                        btnCardWishlist.setImageResource(nowSaved ? R.drawable.ic_heart_filled : R.drawable.ic_heart);
                        btnCardWishlist.setColorFilter(nowSaved ? ThemeManager.getGold(ThemeManager.isDarkMode(MainActivity.this)) : ThemeManager.getTextMuted(ThemeManager.isDarkMode(MainActivity.this)));
                        Toast.makeText(MainActivity.this, nowSaved ? "Added to Saved Pieces" : "Removed from Saved Pieces", Toast.LENGTH_SHORT).show();
                        updateWishlistUI();
                        if (mShowWishlistOnly) {
                            filterAndRender();
                        }
                    }
                });
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
}
