package com.sangtarash.app;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.graphics.Typeface;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;
import com.sangtarash.app.config.ThemeManager;
import com.sangtarash.app.model.CartItem;
import com.sangtarash.app.net.ApiClient;
import com.sangtarash.app.net.ImageLoader;
import com.sangtarash.app.storage.CartManager;
import org.json.JSONArray;
import org.json.JSONObject;
import java.net.URLEncoder;
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
        if (mTvEmptySub != null) mTvEmptySub.setTextColor(ThemeManager.getTextMuted(isDark));
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
        int totalCount = CartManager.getTotalCount(this);
        int subtotal = CartManager.getSubtotal(this);

        boolean isDark = ThemeManager.isDarkMode(this);

        mTvHeaderCount.setText(totalCount == 1 ? "1 PIECE" : totalCount + " PIECES");
        mTvTotal.setText("$" + subtotal);

        if (items.isEmpty()) {
            mSvItems.setVisibility(View.GONE);
            mLlCheckoutBar.setVisibility(View.GONE);
            mLlEmpty.setVisibility(View.VISIBLE);
        } else {
            mLlEmpty.setVisibility(View.GONE);
            mSvItems.setVisibility(View.VISIBLE);
            mLlCheckoutBar.setVisibility(View.VISIBLE);
            populateRows(items, isDark);
        }
    }

    private void populateRows(List<CartItem> items, boolean isDark) {
        mLlItems.removeAllViews();
        LayoutInflater inflater = LayoutInflater.from(this);
        int cardRadius = ThemeManager.dpToPx(this, 8);

        for (final CartItem item : items) {
            View row = inflater.inflate(R.layout.item_cart_row, mLlItems, false);
            row.setBackground(ThemeManager.createCardDrawable(isDark, cardRadius));

            ImageView ivThumb = row.findViewById(R.id.iv_cart_thumb);
            TextView tvName = row.findViewById(R.id.tv_cart_item_name);
            TextView tvVariant = row.findViewById(R.id.tv_cart_item_variant);
            TextView tvUnitPrice = row.findViewById(R.id.tv_cart_item_unit_price);
            TextView tvSubtotal = row.findViewById(R.id.tv_cart_item_subtotal);
            TextView btnMinus = row.findViewById(R.id.btn_cart_minus);
            TextView tvQty = row.findViewById(R.id.tv_cart_item_qty);
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
        final boolean isDark = ThemeManager.isDarkMode(this);
        final int subtotal = CartManager.getSubtotal(this);

        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        ScrollView scrollView = new ScrollView(this);
        LinearLayout container = new LinearLayout(this);
        container.setOrientation(LinearLayout.VERTICAL);
        container.setPadding(40, 32, 40, 32);
        container.setBackgroundColor(ThemeManager.getSurfaceColor(isDark));
        scrollView.addView(container);

        // Header
        TextView title = new TextView(this);
        title.setText("ATELIER ACQUISITION CHECKOUT");
        title.setTextSize(16);
        title.setTextColor(ThemeManager.getBronze(isDark));
        title.setTypeface(null, Typeface.BOLD);
        container.addView(title);

        TextView sub = new TextView(this);
        sub.setText("Recorded into the Sang Tarash archives with insured high-density foam crating.");
        sub.setTextSize(11);
        sub.setTextColor(ThemeManager.getTextMuted(isDark));
        sub.setPadding(0, 6, 0, 16);
        container.addView(sub);

        int inputRadius = ThemeManager.dpToPx(this, 8);

        // Name
        final EditText etName = new EditText(this);
        etName.setHint("Patron Full Name *");
        etName.setTextColor(ThemeManager.getTextPrimary(isDark));
        etName.setHintTextColor(ThemeManager.getTextMuted(isDark));
        etName.setBackground(ThemeManager.createSearchDrawable(isDark, inputRadius));
        etName.setPadding(24, 18, 24, 18);
        etName.setTextSize(12);
        container.addView(etName);

        // Email
        final EditText etEmail = new EditText(this);
        etEmail.setHint("Email Address *");
        etEmail.setTextColor(ThemeManager.getTextPrimary(isDark));
        etEmail.setHintTextColor(ThemeManager.getTextMuted(isDark));
        etEmail.setBackground(ThemeManager.createSearchDrawable(isDark, inputRadius));
        etEmail.setPadding(24, 18, 24, 18);
        etEmail.setTextSize(12);
        LinearLayout.LayoutParams lpEmail = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        lpEmail.setMargins(0, 12, 0, 0);
        etEmail.setLayoutParams(lpEmail);
        container.addView(etEmail);

        // Phone
        final EditText etPhone = new EditText(this);
        etPhone.setHint("Phone / WhatsApp (For Transit Updates) *");
        etPhone.setTextColor(ThemeManager.getTextPrimary(isDark));
        etPhone.setHintTextColor(ThemeManager.getTextMuted(isDark));
        etPhone.setBackground(ThemeManager.createSearchDrawable(isDark, inputRadius));
        etPhone.setPadding(24, 18, 24, 18);
        etPhone.setTextSize(12);
        LinearLayout.LayoutParams lpPhone = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        lpPhone.setMargins(0, 12, 0, 0);
        etPhone.setLayoutParams(lpPhone);
        container.addView(etPhone);

        // Street Address
        final EditText etAddress = new EditText(this);
        etAddress.setHint("Crated Delivery Street Address *");
        etAddress.setTextColor(ThemeManager.getTextPrimary(isDark));
        etAddress.setHintTextColor(ThemeManager.getTextMuted(isDark));
        etAddress.setBackground(ThemeManager.createSearchDrawable(isDark, inputRadius));
        etAddress.setPadding(24, 18, 24, 18);
        etAddress.setTextSize(12);
        LinearLayout.LayoutParams lpAddr = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        lpAddr.setMargins(0, 12, 0, 0);
        etAddress.setLayoutParams(lpAddr);
        container.addView(etAddress);

        // City & Country
        final EditText etCity = new EditText(this);
        etCity.setHint("City & Country *");
        etCity.setText("New York, United States");
        etCity.setTextColor(ThemeManager.getTextPrimary(isDark));
        etCity.setHintTextColor(ThemeManager.getTextMuted(isDark));
        etCity.setBackground(ThemeManager.createSearchDrawable(isDark, inputRadius));
        etCity.setPadding(24, 18, 24, 18);
        etCity.setTextSize(12);
        LinearLayout.LayoutParams lpCity = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        lpCity.setMargins(0, 12, 0, 16);
        etCity.setLayoutParams(lpCity);
        container.addView(etCity);

        // Delivery Method Header
        TextView tvDelivH = new TextView(this);
        tvDelivH.setText("HANDLING & FREIGHT TIER");
        tvDelivH.setTextSize(11);
        tvDelivH.setTextColor(ThemeManager.getBronze(isDark));
        tvDelivH.setTypeface(null, Typeface.BOLD);
        container.addView(tvDelivH);

        final RadioGroup rgDelivery = new RadioGroup(this);
        rgDelivery.setOrientation(RadioGroup.VERTICAL);
        rgDelivery.setPadding(0, 6, 0, 16);

        final RadioButton rbCrate = new RadioButton(this);
        rbCrate.setText("Insured Reinforced Timber Crate (Complimentary, $0)");
        rbCrate.setTextColor(ThemeManager.getTextPrimary(isDark));
        rbCrate.setTextSize(11);
        rbCrate.setChecked(true);
        rgDelivery.addView(rbCrate);

        final RadioButton rbWhiteGlove = new RadioButton(this);
        rbWhiteGlove.setText("White-Glove In-Home Placement (+$85)");
        rbWhiteGlove.setTextColor(ThemeManager.getTextPrimary(isDark));
        rbWhiteGlove.setTextSize(11);
        rgDelivery.addView(rbWhiteGlove);

        final RadioButton rbPickup = new RadioButton(this);
        rbPickup.setText("Atelier Workshop Collection ($0)");
        rbPickup.setTextColor(ThemeManager.getTextPrimary(isDark));
        rbPickup.setTextSize(11);
        rgDelivery.addView(rbPickup);

        container.addView(rgDelivery);

        // Custom Inscription Note
        final EditText etInscription = new EditText(this);
        etInscription.setHint("Complimentary Inscription / Dedication Note (Optional)");
        etInscription.setTextColor(ThemeManager.getTextPrimary(isDark));
        etInscription.setHintTextColor(ThemeManager.getTextMuted(isDark));
        etInscription.setBackground(ThemeManager.createSearchDrawable(isDark, inputRadius));
        etInscription.setPadding(24, 18, 24, 18);
        etInscription.setTextSize(11);
        LinearLayout.LayoutParams lpInsc = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        lpInsc.setMargins(0, 0, 0, 16);
        etInscription.setLayoutParams(lpInsc);
        container.addView(etInscription);

        // Settlement Method Header
        TextView tvPayH = new TextView(this);
        tvPayH.setText("SETTLEMENT AVENUE");
        tvPayH.setTextSize(11);
        tvPayH.setTextColor(ThemeManager.getBronze(isDark));
        tvPayH.setTypeface(null, Typeface.BOLD);
        container.addView(tvPayH);

        final RadioGroup rgPayment = new RadioGroup(this);
        rgPayment.setOrientation(RadioGroup.VERTICAL);
        rgPayment.setPadding(0, 6, 0, 24);

        final RadioButton rbWa = new RadioButton(this);
        rbWa.setText("WhatsApp Direct Concierge Acquisition");
        rbWa.setTextColor(ThemeManager.getTextPrimary(isDark));
        rbWa.setTextSize(11);
        rbWa.setChecked(true);
        rgPayment.addView(rbWa);

        final RadioButton rbWire = new RadioButton(this);
        rbWire.setText("Direct Bank Wire / Pro-Forma Invoice");
        rbWire.setTextColor(ThemeManager.getTextPrimary(isDark));
        rbWire.setTextSize(11);
        rgPayment.addView(rbWire);

        final RadioButton rbCard = new RadioButton(this);
        rbCard.setText("Credit / Debit Card Simulation");
        rbCard.setTextColor(ThemeManager.getTextPrimary(isDark));
        rbCard.setTextSize(11);
        rgPayment.addView(rbCard);

        container.addView(rgPayment);

        // Submit Button
        final Button btnSubmit = new Button(this);
        btnSubmit.setText("Confirm Private Acquisition");
        btnSubmit.setBackgroundResource(R.drawable.bg_btn_gold);
        btnSubmit.setTextColor(0xFF0D0D0D);
        btnSubmit.setTypeface(null, Typeface.BOLD);
        container.addView(btnSubmit);

        builder.setView(scrollView);
        final AlertDialog dialog = builder.create();

        btnSubmit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                final String name = etName.getText().toString().trim();
                final String email = etEmail.getText().toString().trim();
                final String phone = etPhone.getText().toString().trim();
                final String address = etAddress.getText().toString().trim();
                final String city = etCity.getText().toString().trim();
                final String inscription = etInscription.getText().toString().trim();

                if (name.isEmpty() || email.isEmpty() || phone.isEmpty() || address.isEmpty() || city.isEmpty()) {
                    Toast.makeText(CartActivity.this, "Please complete all required patron and shipping fields.", Toast.LENGTH_SHORT).show();
                    return;
                }

                btnSubmit.setEnabled(false);
                btnSubmit.setText("Transmitting to Atelier...");

                String delivMethod = "insured_crate";
                int shippingCost = 0;
                if (rbWhiteGlove.isChecked()) {
                    delivMethod = "white_glove";
                    shippingCost = 85;
                } else if (rbPickup.isChecked()) {
                    delivMethod = "studio_pickup";
                }

                String payMethod = "whatsapp";
                if (rbWire.isChecked()) {
                    payMethod = "bank_wire";
                } else if (rbCard.isChecked()) {
                    payMethod = "card";
                }

                final int totalAmount = subtotal + shippingCost;
                final String finalDeliv = delivMethod;

                try {
                    JSONObject order = new JSONObject();
                    order.put("customerName", name);
                    order.put("customerEmail", email);
                    order.put("customerPhone", phone);
                    order.put("shippingAddress", address);
                    order.put("city", city);
                    order.put("country", "United States");
                    order.put("deliveryMethod", delivMethod);
                    order.put("paymentMethod", payMethod);
                    order.put("subtotal", subtotal);
                    order.put("shippingCost", shippingCost);
                    order.put("totalAmount", totalAmount);
                    if (!inscription.isEmpty()) {
                        order.put("customInscription", inscription);
                    }

                    JSONArray itemsArr = new JSONArray();
                    for (CartItem item : CartManager.getItems(CartActivity.this)) {
                        JSONObject it = new JSONObject();
                        it.put("id", item.productId);
                        it.put("name", item.productName);
                        it.put("description", item.sizeName + " (" + item.dimensions + ")");
                        it.put("price", item.unitPrice);
                        it.put("quantity", item.quantity);
                        it.put("image", item.featuredImage);
                        itemsArr.put(it);
                    }
                    order.put("items", itemsArr);

                    ApiClient.submitOrder(CartActivity.this, order, new ApiClient.Callback<JSONObject>() {
                        @Override
                        public void onSuccess(JSONObject result) {
                            dialog.dismiss();
                            CartManager.clear(CartActivity.this);

                            String orderId = "ST-" + System.currentTimeMillis();
                            try {
                                JSONObject orderObj = result.optJSONObject("order");
                                if (orderObj != null && orderObj.has("id")) {
                                    orderId = orderObj.getString("id");
                                }
                            } catch (Exception ignored) {}

                            final String finalOrderId = orderId;

                            // Show Certificate Dialog
                            AlertDialog.Builder certBuilder = new AlertDialog.Builder(CartActivity.this);
                            certBuilder.setTitle("CERTIFICATE OF ACQUISITION");
                            String msg = "Order Reference: #" + finalOrderId + "\n"
                                    + "Patron: " + name + "\n"
                                    + "Total Investment: $" + totalAmount + "\n"
                                    + "Handling Tier: " + finalDeliv.replace("_", " ") + "\n"
                                    + "Status: Pending Atelier Review\n\n"
                                    + "Your solid stone order has been recorded into the Sang Tarash archives.";

                            certBuilder.setMessage(msg);
                            certBuilder.setPositiveButton("WhatsApp Concierge", (d, which) -> {
                                try {
                                    String text = "Greetings Sang Tarash Atelier. I have placed an order #" + finalOrderId + " under the name " + name + " and would like to coordinate freight.";
                                    Intent wa = new Intent(Intent.ACTION_VIEW);
                                    wa.setData(Uri.parse("https://wa.me/?text=" + URLEncoder.encode(text, "UTF-8")));
                                    startActivity(wa);
                                } catch (Exception ignored) {}
                            });
                            certBuilder.setNegativeButton("Return to Gallery", null);
                            certBuilder.show();
                        }

                        @Override
                        public void onError(String message) {
                            btnSubmit.setEnabled(true);
                            btnSubmit.setText("Confirm Private Acquisition");
                            Toast.makeText(CartActivity.this, "Submission error: " + message, Toast.LENGTH_LONG).show();
                        }
                    });
                } catch (Exception e) {
                    btnSubmit.setEnabled(true);
                    btnSubmit.setText("Confirm Private Acquisition");
                    Toast.makeText(CartActivity.this, "Error: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                }
            }
        });

        dialog.show();
    }
}
