# Sang Tarash — High-Performance Native Android App

An ultra-lightweight, blazing-fast, and hardened native Android application built specifically for **Sang Tarash — Marble Handicrafts & Architectural Stoneware**.

---

## Key Highlights

- **Ultra-Compact Binary**: Total signed APK size is **~54 KB** (self-contained, zero external runtime bloat, zero Gradle daemon overhead).
- **Gradle-Free Direct Pipeline**: Direct compilation using the host system's OpenJDK 17, Android SDK 34 Platform (`android.jar`), AAPT2, Google R8 bytecode optimizer, 4-byte zipalign, and Apksigner (v1, v2, v3).
- **Zero Hardcoded Secrets**: Endpoint resolution dynamically defaults to `http://10.0.2.2:3000` (Android Emulator loopback) or `http://localhost:3000`, with in-app configuration and private persistence.
- **Bespoke Luxury Stone Aesthetic**: Custom dark theme styled in Obsidian (`#0D0D0D`), Stone Card (`#1E1E1E`), Copper Bronze (`#C5A059`), and Antique Gold (`#D4AF37`).
- **High-Performance Memory Engine**: In-memory `LruCache<String, Bitmap>` with multi-threaded asynchronous image loading and sample-size downscaling preventing `OutOfMemoryError` on high-resolution stone photography.

---

## Features & Screens

1. **Catalog & Search (`MainActivity`)**:
   - Atelier header branding with live acquisition tray badge.
   - Dynamic Category filter chips (*All Pieces*, *Home Objects*, *Tableware*, *Sculptures*).
   - Real-time search by piece title, stone type, or geographical origin.
   - Luxury product cards with thumbnail, stone origin badge, pricing, and quick inspect trigger.
   - In-app endpoint configuration dialog with quick emulator/localhost presets.
2. **Piece Inspection & Variant Selector (`ProductDetailActivity`)**:
   - Hero stone viewer with interactive gallery thumbnail switcher.
   - Geological specifications panel (Stone Variety, Geological Origin, Surface Finish, Dimensions, Weight, Atelier SKU).
   - Dynamic variant picker: selectable chips adjusting dimensions, weight, stock status, and live pricing.
   - Artisan Story and Care Instructions.
   - Quantity modifier and sticky "Acquire Piece" action.
3. **Acquisition Tray & Inquiry (`CartActivity`)**:
   - Variant-aware item rows displaying selected dimensions, weights, and unit pricing.
   - Live subtotal and total acquisition value computation.
   - Quantity decrement/increment and item removal.
   - "Submit Acquisition Inquiry" dialog capturing collector name and contact details.

---

---

## Environment Configuration (`.env`)

The app ingests its backend endpoint and runtime settings from [`MobileApp/.env`](file:///c:/Users/Sorcim%20computer/Downloads/marble-handicrafts/MobileApp/.env) at build time, with zero hardcoded secrets in version control:

```properties
# Backend API server address
BACKEND_URL=http://10.0.2.2:3000

# Application branding & environment tag
APP_NAME=Sang Tarash
APP_ENVIRONMENT=development

# Network socket timeout in milliseconds
REQUEST_TIMEOUT_MS=10000

# Offline cache toggle
ENABLE_OFFLINE_CACHE=true
```

- **For Android Emulator**: Use `http://10.0.2.2:3000`.
- **For Physical Devices via USB reverse**: Run `adb reverse tcp:3000 tcp:3000` and use `http://localhost:3000`.
- **For Local Wi-Fi Testing**: Use `http://192.168.x.x:3000`.
- **For Production**: Set your live domain (e.g. `https://your-domain.com`).

---

## Building the APK

Run the automated PowerShell build script from the `MobileApp` directory:

```powershell
cd "c:\Users\Sorcim computer\Downloads\marble-handicrafts\MobileApp"
.\build.ps1
```

The script will automatically:
1. Verify system toolchains (`javac`, `aapt2`, `d8.jar`, `zipalign`, `apksigner`).
2. Generate an RSA-2048 signing keystore (`release.keystore`) if not present.
3. Compile and link all vector and layout resources with `aapt2`.
4. Compile Java sources with OpenJDK 17 `javac` (debug stripped with `-g:none`).
5. Run Google R8 for aggressive member inlining, dead-code stripping, and DEX generation.
6. Package, 4-byte page-align, and cryptographically sign the production APK to:
   `bin/SangTarash-release.apk` (~54 KB).

---

## Installing on an Android Device or Emulator

With USB debugging or an active emulator running:

```powershell
adb install -r bin\SangTarash-release.apk
```
