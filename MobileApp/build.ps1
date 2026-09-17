# Automated Build Script for Sang Tarash Android App
# Zero-Gradle ultra-fast native build pipeline with .env environment ingestion

$ErrorActionPreference = "Stop"

$AppDir = $PSScriptRoot
$SdkRoot = "C:\android"
$PlatformJar = "$SdkRoot\platforms\android-34\android.jar"
$BuildTools = "$SdkRoot\build-tools\34.0.0"
$Aapt2 = "$BuildTools\aapt2.exe"
$Zipalign = "$BuildTools\zipalign.exe"
$ApkSigner = "$BuildTools\apksigner.bat"
$R8Jar = "$BuildTools\lib\d8.jar"

$JdkBin = "C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot\bin"
$Javac = "$JdkBin\javac.exe"
$JarTool = "$JdkBin\jar.exe"
$Keytool = "$JdkBin\keytool.exe"

Write-Host "=========================================================" -ForegroundColor Yellow
Write-Host " SANG TARASH -- HIGH-PERFORMANCE ANDROID BUILD PIPELINE   " -ForegroundColor Yellow
Write-Host "=========================================================" -ForegroundColor Yellow

# [1/7] Validate Tools
Write-Host "[1/7] Validating Android SDK and JDK Toolchain..." -ForegroundColor Cyan
if (-not (Test-Path $PlatformJar)) { Write-Error "Android Platform Jar not found at: $PlatformJar" }
if (-not (Test-Path $Aapt2)) { Write-Error "AAPT2 not found at: $Aapt2" }
if (-not (Test-Path $R8Jar)) { Write-Error "R8 / D8 jar not found at: $R8Jar" }
if (-not (Test-Path $Javac)) { Write-Error "JDK javac not found at: $Javac" }

# [2/7] Ingest Configuration from .env
Write-Host "[2/7] Ingesting environment configuration from .env..." -ForegroundColor Cyan
$BackendUrl = "http://10.0.2.2:3000"
$AppName = "Sang Tarash"
$AppEnv = "development"
$TimeoutMs = 10000

$EnvFile = "$AppDir\.env"
if (-not (Test-Path $EnvFile)) {
    $EnvFile = (Split-Path $AppDir -Parent) + "\.env"
}

if (Test-Path $EnvFile) {
    Write-Host "  Reading: $EnvFile"
    Get-Content $EnvFile | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#") -and ($line -match '^([^=]+)=(.*)$')) {
            $key = $Matches[1].Trim()
            $val = $Matches[2].Trim().Trim('"').Trim("'")
            if ($key -eq "BACKEND_URL" -and $val) { $BackendUrl = $val }
            if ($key -eq "APP_NAME" -and $val) { $AppName = $val }
            if ($key -eq "APP_ENVIRONMENT" -and $val) { $AppEnv = $val }
            if ($key -eq "REQUEST_TIMEOUT_MS" -and $val) { $TimeoutMs = [int]$val }
        }
    }
    Write-Host "  -> BACKEND_URL: $BackendUrl" -ForegroundColor Green
    Write-Host "  -> APP_NAME: $AppName" -ForegroundColor Green
    Write-Host "  -> APP_ENVIRONMENT: $AppEnv" -ForegroundColor Green
    Write-Host "  -> REQUEST_TIMEOUT_MS: $TimeoutMs" -ForegroundColor Green
} else {
    Write-Host "  No .env file located. Using default emulator endpoint ($BackendUrl)" -ForegroundColor Yellow
}

# [3/7] Ensure Keystore Exists
$Keystore = "$AppDir\release.keystore"
if (-not (Test-Path $Keystore)) {
    Write-Host "[3/7] Generating release signing keystore..." -ForegroundColor Cyan
    & $Keytool -genkeypair -keystore $Keystore -storepass sangtarash123 -keypass sangtarash123 -alias sangtarash -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=SangTarash, O=SangTarash, C=PK"
} else {
    Write-Host "[3/7] Using existing keystore: $Keystore" -ForegroundColor Cyan
}

# Clean and create build workspaces
$BuildDir = "$AppDir\build"
$BinDir = "$AppDir\bin"
if (Test-Path $BuildDir) { Remove-Item $BuildDir -Recurse -Force }
New-Item -ItemType Directory -Path "$BuildDir\compiled_res" -Force | Out-Null
New-Item -ItemType Directory -Path "$BuildDir\gen\com\sangtarash\app\config" -Force | Out-Null
New-Item -ItemType Directory -Path "$BuildDir\classes" -Force | Out-Null
New-Item -ItemType Directory -Path "$BuildDir\dex" -Force | Out-Null
if (-not (Test-Path $BinDir)) { New-Item -ItemType Directory -Path $BinDir -Force | Out-Null }

# Generate EnvConfig.java from .env
$EnvConfigJava = @"
package com.sangtarash.app.config;

/**
 * Dynamically generated from .env at build time.
 * Do not edit manually.
 */
public final class EnvConfig {
    public static final String BACKEND_URL = "$BackendUrl";
    public static final String APP_NAME = "$AppName";
    public static final String APP_ENVIRONMENT = "$AppEnv";
    public static final int REQUEST_TIMEOUT_MS = $TimeoutMs;
}
"@
$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText("$BuildDir\gen\com\sangtarash\app\config\EnvConfig.java", $EnvConfigJava, $Utf8NoBom)

# [4/7] Compile and Link Resources with AAPT2
Write-Host "[4/7] Compiling Android resources with AAPT2..." -ForegroundColor Cyan
& $Aapt2 compile --dir "$AppDir\app\src\main\res" -o "$BuildDir\compiled_res.zip"
if ($LASTEXITCODE -ne 0) { Write-Error "AAPT2 resource compile failed" }

& $Aapt2 link -o "$BuildDir\app-base.apk" `
    -I $PlatformJar `
    --manifest "$AppDir\app\src\main\AndroidManifest.xml" `
    --java "$BuildDir\gen" `
    "$BuildDir\compiled_res.zip" `
    --auto-add-overlay
if ($LASTEXITCODE -ne 0) { Write-Error "AAPT2 link failed" }

# [5/7] Compile Java Sources with Javac (-g:none for size stripping)
Write-Host "[5/7] Compiling Java source files (stripping debug info)..." -ForegroundColor Cyan
$JavaFiles = (Get-ChildItem -Path "$AppDir\app\src\main\java", "$BuildDir\gen" -Filter *.java -Recurse).FullName
$SourcesListFile = "$BuildDir\sources.txt"
$QuotedFiles = $JavaFiles | ForEach-Object { '"' + $_.Replace('\', '/') + '"' }
[System.IO.File]::WriteAllLines($SourcesListFile, $QuotedFiles, [System.Text.Encoding]::ASCII)

$Cp = "$PlatformJar;$BuildDir\gen"
& $Javac -g:none -encoding UTF-8 -cp $Cp -d "$BuildDir\classes" "@$SourcesListFile"
if ($LASTEXITCODE -ne 0) { Write-Error "Java compilation failed" }

# [6/7] Bytecode Optimization and Dead-Code Stripping with R8
Write-Host "[6/7] Optimizing and shrinking bytecode with Google R8..." -ForegroundColor Cyan
$ClassFiles = (Get-ChildItem -Path "$BuildDir\classes" -Filter *.class -Recurse).FullName
$PgConf = "$AppDir\proguard-rules.pro"
java -cp $R8Jar com.android.tools.r8.R8 --release --min-api 21 --lib $PlatformJar --pg-conf $PgConf --output "$BuildDir\dex" $ClassFiles
if ($LASTEXITCODE -ne 0) { Write-Error "R8 optimization failed" }

# [7/7] Assembly, 4-Byte Page Alignment and Cryptographic Signing
Write-Host "[7/7] Packaging, aligning, and signing release APK..." -ForegroundColor Cyan
Copy-Item "$BuildDir\app-base.apk" "$BuildDir\app-unsigned.apk"

# Inject classes.dex into APK container
Push-Location "$BuildDir\dex"
& $JarTool -uf "$BuildDir\app-unsigned.apk" classes.dex
Pop-Location

# 4-byte Page Alignment
& $Zipalign -p -f -v 4 "$BuildDir\app-unsigned.apk" "$BuildDir\app-aligned.apk" | Out-Null
if ($LASTEXITCODE -ne 0) { Write-Error "Zipalign failed" }

# Sign with apksigner (v1, v2, v3 schemes)
$OutputApk = "$BinDir\SangTarash-release.apk"
& $ApkSigner sign --ks $Keystore --ks-pass "pass:sangtarash123" --out $OutputApk "$BuildDir\app-aligned.apk"
if ($LASTEXITCODE -ne 0) { Write-Error "Apksigner failed" }

# Verify signature
Write-Host "Verifying APK cryptographic signature..."
& $ApkSigner verify --verbose $OutputApk

$ApkSizeKb = [math]::Round((Get-Item $OutputApk).Length / 1KB, 2)

Write-Host ""
Write-Host "=========================================================" -ForegroundColor Green
Write-Host " SUCCESS! Built Sang Tarash production release APK:      " -ForegroundColor Green
Write-Host " Output:  $OutputApk" -ForegroundColor Cyan
Write-Host " Size:    $ApkSizeKb KB (Ultra-compact)" -ForegroundColor Cyan
Write-Host " Backend: $BackendUrl" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Green
