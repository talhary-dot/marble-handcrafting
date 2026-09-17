package com.sangtarash.app;

import android.app.Activity;
import android.app.AlertDialog;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;
import com.sangtarash.app.model.CartItem;
import com.sangtarash.app.net.ImageLoader;
import com.sangtarash.app.storage.CartManager;
import java.util.List;

public class CartActivity extends Activity implements CartManager.CartListener, com.sangtarash.app.config.ThemeManager.ThemeListener {

    private ImageView mBtnBack;
    private TextView mTvHeaderCount;
    private ScrollView mSvItems;
    private LinearLayout mLlItems;
    private LinearLayout mLlEmpty;
    private Button mBtnBrowseCatalog;
    private LinearLayout mLlCheckoutBar;
    private TextView mTvTotal;
    private Button mBtnCheckoutInquiry;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_cart);

        initViews();
        setupListeners();
        CartManager.addListener(this);
        com.sangtarash.app.config.ThemeManager.addListener(this);

        applyTheme(com.sangtarash.app.config.ThemeManager.isDarkMode(this));
        renderCart();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        CartManager.removeListener(this);
        com.sangtarash.app.config.ThemeManager.removeListener(this);
    }

    @Override
    public void onCartChanged() {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                renderCart();
            }
        });
    }

    @Override
    public void onThemeChanged(final boolean isDark) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                applyTheme(isDark);
                renderCart();
            }
        });
    }

    private void applyTheme(boolean isDark) {
        findViewById(android.R.id.content).setBackgroundColor(com.sangtarash.app.config.ThemeManager.getBgColor(isDark));
        View topBar = findViewById(R.id.rl_cart_top_bar);
        if (topBar != null) topBar.setBackgroundColor(com.sangtarash.app.config.ThemeManager.getSurfaceColor(isDark));
        if (mLlCheckoutBar != null) mLlCheckoutBar.setBackgroundColor(com.sangtarash.app.config.ThemeManager.getSurfaceColor(isDark));
        View emptyTitle = findViewById(R.id.tv_empty_title);
        if (emptyTitle instanceof TextView) ((TextView) emptyTitle).setTextColor(com.sangtarash.app.config.ThemeManager.getTextPrimary(isDark));
        View emptySub = findViewById(R.id.tv_empty_sub);
        if (emptySub instanceof TextView) ((TextView) emptySub).setTextColor(com.sangtarash.app.config.ThemeManager.getTextSecondary(isDark));
    }

    private void initViews() {
        mBtnBack = findViewById(R.id.btn_cart_back);
        mTvHeaderCount = findViewById(R.id.tv_cart_count_header);
        mSvItems = findViewById(R.id.sv_cart_items);
        mLlItems = findViewById(R.id.ll_cart_items);
        mLlEmpty = findViewById(R.id.ll_cart_empty);
        mBtnBrowseCatalog = findViewById(R.id.btn_browse_catalog);
        mLlCheckoutBar = findViewById(R.id.ll_cart_checkout_bar);
        mTvTotal = findViewById(R.id.tv_cart_total);
        mBtnCheckoutInquiry = findViewById(R.id.btn_checkout_inquiry);
    }

    private void setupListeners() {
        mBtnBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        mBtnBrowseCatalog.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        mBtnCheckoutInquiry.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showInquiryDialog();
            }
        });
    }

    private void renderCart() {
        List<CartItem> items = CartManager.getItems(this);
        mLlItems.removeAllViews();

        int totalCount = CartManager.getTotalCount(this);
        int totalPrice = CartManager.getTotalPrice(this);

        mTvHeaderCount.setText(totalCount + (totalCount == 1 ? " Piece" : " Pieces"));
        mTvTotal.setText("$" + totalPrice);

        if (items.isEmpty()) {
            mSvItems.setVisibility(View.GONE);
            mLlCheckoutBar.setVisibility(View.GONE);
            mLlEmpty.setVisibility(View.VISIBLE);
            return;
        }

        mSvItems.setVisibility(View.VISIBLE);
        mLlCheckoutBar.setVisibility(View.VISIBLE);
        mLlEmpty.setVisibility(View.GONE);

        LayoutInflater inflater = LayoutInflater.from(this);
        boolean isDark = com.sangtarash.app.config.ThemeManager.isDarkMode(this);
        int cardRadius = com.sangtarash.app.config.ThemeManager.dpToPx(this, 8);

        for (final CartItem item : items) {
            View row = inflater.inflate(R.layout.item_cart_row, mLlItems, false);
            row.setBackground(com.sangtarash.app.config.ThemeManager.createCardDrawable(isDark, cardRadius));

            ImageView ivThumb = row.findViewById(R.id.iv_cart_thumb);
            TextView tvName = row.findViewById(R.id.tv_cart_item_name);
            TextView tvVariant = row.findViewById(R.id.tv_cart_item_variant);
            TextView tvUnitPrice = row.findViewById(R.id.tv_cart_item_unit_price);
            TextView tvSubtotal = row.findViewById(R.id.tv_cart_item_subtotal);
            TextView tvQty = row.findViewById(R.id.tv_cart_item_qty);
            TextView btnMinus = row.findViewById(R.id.btn_cart_minus);
            TextView btnPlus = row.findViewById(R.id.btn_cart_plus);

            tvName.setText(item.productName);
            tvName.setTextColor(com.sangtarash.app.config.ThemeManager.getTextPrimary(isDark));

            tvVariant.setText(item.sizeName + " (" + item.dimensions + ")");
            tvVariant.setTextColor(com.sangtarash.app.config.ThemeManager.getBronze(isDark));

            tvUnitPrice.setText("$" + item.unitPrice + " each");
            tvUnitPrice.setTextColor(com.sangtarash.app.config.ThemeManager.getTextMuted(isDark));

            tvSubtotal.setText("$" + item.getSubtotal());
            tvSubtotal.setTextColor(com.sangtarash.app.config.ThemeManager.getGold(isDark));

            tvQty.setText(String.valueOf(item.quantity));
            tvQty.setTextColor(com.sangtarash.app.config.ThemeManager.getTextPrimary(isDark));

            ImageLoader.getInstance().displayImage(this, item.featuredImage, ivThumb);

            btnMinus.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    CartManager.updateQuantity(CartActivity.this, item.getKey(), -1);
                }
            });

            btnPlus.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    CartManager.updateQuantity(CartActivity.this, item.getKey(), 1);
                }
            });

            mLlItems.addView(row);
        }
    }

    private void showInquiryDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        LinearLayout container = new LinearLayout(this);
        container.setOrientation(LinearLayout.VERTICAL);
        container.setPadding(48, 36, 48, 24);
        container.setBackgroundColor(getResources().getColor(R.color.surface_card));

        TextView title = new TextView(this);
        title.setText("ACQUISITION INQUIRY");
        title.setTextSize(16);
        title.setTextColor(getResources().getColor(R.color.bronze_primary));
        title.setTypeface(null, android.graphics.Typeface.BOLD);
        container.addView(title);

        TextView sub = new TextView(this);
        sub.setText("Our master stonemasons will verify block selection and crating logistics for your order.");
        sub.setTextSize(12);
        sub.setTextColor(getResources().getColor(R.color.text_muted));
        sub.setPadding(0, 8, 0, 24);
        container.addView(sub);

        final EditText etName = new EditText(this);
        etName.setHint("Your Full Name");
        etName.setTextColor(getResources().getColor(R.color.text_primary));
        etName.setHintTextColor(getResources().getColor(R.color.text_muted));
        etName.setBackgroundResource(R.drawable.bg_search);
        etName.setPadding(24, 20, 24, 20);
        container.addView(etName);

        final EditText etContact = new EditText(this);
        etContact.setHint("Email or Phone Number");
        etContact.setTextColor(getResources().getColor(R.color.text_primary));
        etContact.setHintTextColor(getResources().getColor(R.color.text_muted));
        etContact.setBackgroundResource(R.drawable.bg_search);
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
        btnSubmit.setTextColor(getResources().getColor(R.color.bg_obsidian));
        btnSubmit.setTypeface(null, android.graphics.Typeface.BOLD);
        container.addView(btnSubmit);

        builder.setView(container);
        final AlertDialog dialog = builder.create();

        btnSubmit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String name = etName.getText().toString().trim();
                String contact = etContact.getText().toString().trim();

                if (name.isEmpty() || contact.isEmpty()) {
                    Toast.makeText(CartActivity.this, "Please provide your name and contact details.", Toast.LENGTH_SHORT).show();
                    return;
                }

                dialog.dismiss();
                CartManager.clear(CartActivity.this);

                new AlertDialog.Builder(CartActivity.this)
                        .setTitle("Acquisition Registered")
                        .setMessage("Thank you, " + name + ". Your inquiry for solid stone architectural pieces has been received. Our atelier team will contact you shortly regarding freight and crating.")
                        .setPositiveButton("Return to Gallery", null)
                        .show();
            }
        });

        dialog.show();
    }
}
