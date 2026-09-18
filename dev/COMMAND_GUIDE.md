# ChuoApp - Complete Command Guide (Expo)

This guide provides all commands needed to set up, develop, build, and publish the ChuoApp using Expo. No Android Studio or Xcode required!

---

## Table of Contents
1. [Initial Setup](#initial-setup)
2. [Environment Configuration](#environment-configuration)
3. [Dependency Installation](#dependency-installation)
4. [Running the App](#running-the-app)
5. [Building for Production](#building-for-production)
6. [Publishing to Google Play Store](#publishing-to-google-play-store)
7. [Publishing to Apple App Store](#publishing-to-apple-app-store)
8. [Troubleshooting Commands](#troubleshooting-commands)

---

## Initial Setup

### Clone the Repository
```bash
# Clone the repository
git clone <repository-url>
cd chuo-app
```

### Verify System Requirements
```bash
# Check Node.js version (should be 18.x or higher)
node --version

# Check npm version (should be 9.x or higher)
npm --version

# Check Git version
git --version
```

### Install Expo Go App
- **Android**: Download from Google Play Store
- **iOS**: Download from Apple App Store
- This is your development app for testing

---

## Environment Configuration

### Create Environment File
```bash
# Create .env file in the root directory
touch .env
```

Add the following content to `.env`:
```env
# API Configuration
API_BASE_URL=https://api.chuoapp.com
API_TIMEOUT=30000

# Feature Flags
ENABLE_BIOMETRICS=true
ENABLE_NOTIFICATIONS=true

# Analytics (Optional)
ANALYTICS_ENABLED=true
```

---

## Dependency Installation

### Install Node Dependencies
```bash
# Install all dependencies
npm install

# If you encounter issues, try:
npm install --legacy-peer-deps

# Or clear cache and reinstall:
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Verify Installation
```bash
# Check if React Native CLI is installed
npx react-native --version

# Should show React Native 0.73.6
```

---

## Running the App

### Option 1: Using Expo Go (Recommended - No Emulator Required)

#### Start Expo Development Server
```bash
# Start Expo development server
npm start
```

#### Run on Your Device
1. Install Expo Go app on your phone (Android/iOS)
2. Scan the QR code displayed in terminal
3. App will load on your device

#### Run on Android Emulator
```bash
# Start Expo development server
npm start

# Press 'a' to run on Android emulator
# Ensure Android emulator is running first
```

#### Run on iOS Simulator (macOS only)
```bash
# Start Expo development server
npm start

# Press 'i' to run on iOS simulator
# Requires macOS with Xcode Command Line Tools
```

#### Run on Web Browser
```bash
npm run web
```

### Option 2: Using Expo CLI Directly

#### Start with Specific Platform
```bash
# Android
npx expo start --android

# iOS (macOS only)
npx expo start --ios

# Web
npx expo start --web
```

### Clear Expo Cache
```bash
# Clear Expo cache and restart
npm start -c
```

---

## Building for Production

### Using EAS Build (Expo Application Services)

EAS Build is the cloud build service provided by Expo. It handles all the complex native build processes for you.

#### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

#### Step 2: Login to Expo
```bash
eas login
```

#### Step 3: Configure EAS
```bash
eas build:configure
```

#### Step 4: Build for Android
```bash
# Build APK for testing
eas build -p android --profile preview

# Build AAB for Play Store
eas build -p android --profile production
```

#### Step 5: Build for iOS
```bash
# Build for TestFlight
eas build -p ios --profile preview

# Build for App Store
eas build -p ios --profile production
```

### EAS Build Profiles

Create `eas.json` in project root:
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "autoIncrement": true
      }
    }
  }
}
```

---

## Publishing to Google Play Store

### Step 1: Create Google Play Developer Account
1. Go to: https://play.google.com/console
2. Pay $25 one-time fee
3. Complete account setup

### Step 2: Create App in Play Console
1. Log in to Google Play Console
2. Click "Create app"
3. Fill in app details:
   - App name: ChuoApp
   - App language: English
   - Free or Paid: Free

### Step 3: Prepare Release Build
```bash
# Build production AAB using EAS
eas build -p android --profile production
```

### Step 4: Upload App Bundle
1. Go to "Release & Deployment" → "App bundles"
2. Click "Create new release"
3. The AAB will be automatically uploaded from EAS
4. Add release notes

### Step 5: Complete Store Listing
Fill in the following:
- **App name**: ChuoApp
- **Short description** (80 chars max): Your university portal in one app
- **Full description**: Detailed description of features
- **Screenshots**: Upload at least 2 screenshots
- **Icon**: 512x512 high-resolution icon
- **Feature graphic**: 1024x500 banner

### Step 6: Content Rating
1. Complete the content rating questionnaire
2. Submit for rating

### Step 7: Pricing & Distribution
1. Set pricing (Free)
2. Select target countries
3. Set device compatibility (Android 7.0+)

### Step 8: Release Management
Choose release track:
- **Internal Testing**: For your team
- **Closed Testing**: For beta testers
- **Open Testing**: Public beta
- **Production**: Full release

### Step 9: Submit for Review
1. Review all information
2. Submit for Google Play review
3. Wait 1-3 days for approval

---

## Publishing to Apple App Store

### Step 1: Create Apple Developer Account
1. Go to: https://developer.apple.com/programs/
2. Enroll in Apple Developer Program ($99/year)
3. Complete enrollment process

### Step 2: Register App in App Store Connect
1. Log in to: https://appstoreconnect.apple.com
2. Click "My Apps" → "+"
3. Fill in app details:
   - Platform: iOS
   - Name: ChuoApp
   - Bundle ID: com.chuoapp
   - SKU: CHUO001

### Step 3: Prepare Release Build
```bash
# Build production IPA using EAS
eas build -p ios --profile production
```

### Step 4: Upload to App Store Connect
The IPA will be automatically uploaded to App Store Connect via EAS

### Step 5: Complete App Store Information
In App Store Connect, fill in:
- **App Information**: Name, subtitle, keywords
- **Screenshots**: Required for all device sizes
- **App Preview Videos**: Optional but recommended
- **Description**: Detailed app description
- **Support URL**: Customer support website
- **Marketing URL**: App marketing website
- **Privacy Policy URL**: Privacy policy document

### Step 7: Pricing & Availability
1. Set price tier
2. Select countries/regions
3. Set release date or manual release

### Step 8: Submit for Review
1. Review all information
2. Submit for App Store review
3. Wait 1-2 days for approval

### Step 9: TestFlight Beta Testing
```bash
# For internal testing:
# 1. Upload build in App Store Connect
# 2. Add internal testers
# 3. Send TestFlight invitations

# For external testing:
# 1. Create external testing group
# 2. Add beta testers
# 3. Submit for external testing review
```

---

## Troubleshooting Commands

### Clear All Caches and Rebuild
```bash
# Clear Metro cache
npm start -- --reset-cache

# Clear Android build
cd android
./gradlew clean
cd ..

# Clear node modules
rm -rf node_modules package-lock.json
npm install

# Rebuild Android
cd android
./gradlew assembleDebug
```

### Fix ADB Issues
```bash
# Kill ADB server
adb kill-server

# Start ADB server
adb start-server

# Check connected devices
adb devices

# If still issues, restart ADB with specific path
$env:ANDROID_HOME = "C:\Users\YourUsername\AppData\Local\Android\Sdk"
$env:PATH = "$env:ANDROID_HOME\platform-tools;$env:PATH"
adb kill-server
adb start-server
adb devices
```

### Fix Metro Bundler Issues
```bash
# Kill Metro process
npx react-native start -- --reset-cache

# Or manually kill port 8081
# On Windows:
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# On macOS/Linux:
lsof -ti:8081 | xargs kill -9

# Restart Metro
npm start
```

### Fix Gradle Build Issues
```bash
cd android

# Clean build
./gradlew clean

# Build with stacktrace
./gradlew assembleDebug --stacktrace

# Build with info
./gradlew assembleDebug --info

# Refresh dependencies
./gradlew build --refresh-dependencies
```

### Fix iOS Build Issues (Future)
```bash
cd ios

# Deintegrate pods
pod deintegrate

# Reinstall pods
pod install

# Clear Xcode derived data
rm -rf ~/Library/Developer/Xcode/DerivedData

# Clean build folder in Xcode
# Product → Clean Build Folder
```

### Check Environment Variables
```bash
# Check Java
echo $JAVA_HOME  # macOS/Linux
echo %JAVA_HOME% # Windows
java -version

# Check Android
echo $ANDROID_HOME  # macOS/Linux
echo %ANDROID_HOME% # Windows
adb version

# Check Node
node --version
npm --version
```

### Verify React Native Setup
```bash
# Check React Native version
npx react-native --version

# Check doctor
npx react-native doctor

# Check Android setup
npx react-native doctor-android

# Check iOS setup (future)
npx react-native doctor-ios
```

---

## Quick Reference Commands

### Development
```bash
# Start Metro
npm start

# Run Android
npm run android

# Run iOS (future)
npm run ios

# Clean build
cd android && ./gradlew clean && cd ..
```

### Building
```bash
# Debug APK
cd android && ./gradlew assembleDebug

# Release APK
cd android && ./gradlew assembleRelease

# Release AAB (Play Store)
cd android && ./gradlew bundleRelease
```

### Testing
```bash
# Run tests
npm test

# Run lint
npm run lint

# Type check
npm run type-check
```

### Git
```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Push to remote
git remote add origin <repository-url>
git push -u origin main
```

---

## Environment-Specific Commands

### Windows (PowerShell)
```powershell
# Set environment variables for session
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:ANDROID_HOME = "C:\Users\YourUsername\AppData\Local\Android\Sdk"
$env:PATH = "$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:PATH"

# Run Gradle
cd android
.\gradlew.bat assembleDebug

# Run ADB
adb devices
adb reverse tcp:8081 tcp:8081
```

### macOS/Linux
```bash
# Set environment variables
export JAVA_HOME=/path/to/jdk-17
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator

# Run Gradle
cd android
./gradlew assembleDebug

# Run ADB
adb devices
adb reverse tcp:8081 tcp:8081
```

---

## Complete Setup Script (One-Time)

### Windows Setup Script
```powershell
# Save as setup-windows.ps1 and run with PowerShell

# Set environment variables
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
$env:PATH = "$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:PATH"

# Install dependencies
npm install

# Clean Android build
cd android
.\gradlew.bat clean
cd ..

# Start Metro
npm start
```

### macOS/Linux Setup Script
```bash
#!/bin/bash
# Save as setup.sh and run with: chmod +x setup.sh && ./setup.sh

# Set environment variables
export JAVA_HOME=/path/to/jdk-17
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator

# Install dependencies
npm install

# Clean Android build
cd android
./gradlew clean
cd ..

# Start Metro
npm start
```

---

**Last Updated**: July 24, 2026
**Document Version**: 1.0.0
