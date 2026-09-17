package com.sangtarash.app;

import android.app.Activity;
import android.app.AlertDialog;
import android.graphics.Typeface;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;
import com.sangtarash.app.config.ThemeManager;
import com.sangtarash.app.model.CartItem;
import com.sangtarash.app.net.ImageLoader;
import com.sangtarash.app.storage.CartManager;
import java.util.List;

public class CartActivity extends Activity implements CartManager.CartListener, ThemeManager.ThemeListener {

    private RelativeLayout mRlRoot;
    private RelativeLayout mRlTopBar;
    private ImageView mBtnBack;
    private TextView mTvTitleBar;
    private TextView mTvHeaderCount;

    private ScrollView mSvItems;
    private LinearLayout mLlItems;

    private LinearLayout mLlEmpty;
    private ImageView mIvEmptyIcon;
    private TextView mTvEmptyTitle;
    private TextView mTvEmptySub;
    private Button mBtnBrowseCatalog;

    private LinearLayout mLlCheckoutBar;
    private TextView mTvTotalLabel;
    private TextView mTvTotal;
    private TextView mTvFreightNote;
    private Button mBtnCheckoutInquiry;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_cart);

        initViews();
        setupListeners();
        CartManager.addListener(this);
        ThemeManager.addListener(this);

        applyTheme(ThemeManager.isDarkMode(this));
        renderCart();
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
        if (mRlRoot != null) mRlRoot.setBackgroundColor(ThemeManager.getBgColor(isDark));
        if (mSvItems != null) mSvItems.setBackgroundColor(ThemeManager.getBgColor(isDark));

        if (mRlTopBar != null) mRlTopBar.setBackgroundColor(ThemeManager.getSurfaceColor(isDark));
        if (mBtnBack != null) mBtnBack.setColorFilter(ThemeManager.getTextPrimary(isDark));
        if (mTvTitleBar != null) mTvTitleBar.setTextColor(ThemeManager.getBronze(isDark));
        if (mTvHeaderCount != null) mTvHeaderCount.setTextColor(ThemeManager.getTextMuted(isDark));

        if (mLlCheckoutBar != null) mLlCheckoutBar.setBackgroundColor(ThemeManager.getSurfaceColor(isDark));
        if (mTvTotalLabel != null) mTvTotalLabel.setTextColor(ThemeManager.getTextSecondary(isDark));
        if (mTvTotal != null) mTvTotal.setTextColor(ThemeManager.getGold(isDark));
        if (mTvFreightNote != null) mTvFreightNote.setTextColor(ThemeManager.getTextMuted(isDark));

        if (mTvEmptyTitle != null) mTvEmptyTitle.setTextColor(ThemeManager.getTextPrimary(isDark));
        if (mTvEmptySub != null) mTvEmptySub.setTextColor(ThemeManager.getTextSecondary(isDark));
        if (mIvEmptyIcon != null) mIvEmptyIcon.setColorFilter(ThemeManager.getBronze(isDark));
    }

    private void initViews() {
        mRlRoot = findViewById(R.id.rl_cart_root);
        mRlTopBar = findViewById(R.id.rl_cart_top_bar);
        mBtnBack = findViewById(R.id.btn_cart_back);
        mTvTitleBar = findViewById(R.id.tv_cart_title_bar);
        mTvHeaderCount = findViewById(R.id.tv_cart_count_header);

        mSvItems = findViewById(R.id.sv_cart_items);
        mLlItems = findViewById(R.id.ll_cart_items);

        mLlEmpty = findViewById(R.id.ll_cart_empty);
        mIvEmptyIcon = findViewById(R.id.iv_cart_empty_icon);
        mTvEmptyTitle = findViewById(R.id.tv_cart_empty_title);
        mTvEmptySub = findViewById(R.id.tv_cart_empty_sub);
        mBtnBrowseCatalog = findViewById(R.id.btn_browse_catalog);

        mLlCheckoutBar = findViewById(R.id.ll_cart_checkout_bar);
        mTvTotalLabel = findViewById(R.id.tv_cart_total_label);
        mTvTotal = findViewById(R.id.tv_cart_total);
        mTvFreightNote = findViewById(R.id.tv_cart_freight_note);
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
        boolean isDark = ThemeManager.isDarkMode(this);
        int cardRadius = ThemeManager.dpToPx(this, 8);

        for (final CartItem item : items) {
            View row = inflater.inflate(R.layout.item_cart_row, mLlItems, false);
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
            tvSubtotal.setTextColor(ThemeManager.getGold(isDark));

            tvQty.setText(String.valueOf(item.quantity));
            tvQty.setTextColor(ThemeManager.getTextPrimary(isDark));

            btnMinus.setTextColor(ThemeManager.getBronze(isDark));
            btnPlus.setTextColor(ThemeManager.getBronze(isDark));

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
        sub.setText("Our master stonemasons will verify block selection and crating logistics for your order.");
        sub.setTextSize(12);
        sub.setTextColor(ThemeManager.getTextMuted(isDark));
        sub.setPadding(0, 8, 0, 24);
        container.addView(sub);

        int inputRadius = ThemeManager.dpToPx(this, 6);

        final EditText etName = new EditText(this);
        etName.setHint("Your Full Name");
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
