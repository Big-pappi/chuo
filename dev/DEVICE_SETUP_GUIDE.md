# ChuoApp - Running Project on Other Devices

This guide explains how to set up and run the ChuoApp project on different devices and share it with other developers.

---

## Table of Contents
1. [Sharing the Project with Other Developers](#sharing-the-project-with-other-developers)
2. [Setting Up on a New Machine](#setting-up-on-a-new-machine)
3. [Running on Physical Android Devices](#running-on-physical-android-devices)
4. [Sharing APK Files](#sharing-apk-files)
5. [Team Collaboration Workflow](#team-collaboration-workflow)
6. [Troubleshooting Device Issues](#troubleshooting-device-issues)

---

## Sharing the Project with Other Developers

### Option 1: Git Repository (Recommended)

#### Initial Git Setup
```bash
# Initialize Git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: ChuoApp React Native project"

# Add remote repository
git remote add origin <your-repository-url>

# Push to remote
git push -u origin main
```

#### Create .gitignore File
Create a `.gitignore` file in the root directory:
```gitignore
# Dependencies
node_modules/
package-lock.json

# Android
android/.gradle/
android/app/build/
android/build/
android/local.properties
android/.idea/
*.iml

# iOS (future)
ios/Pods/
ios/build/
*.xcworkspace

# Environment
.env
.env.local

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
```

#### Clone on Other Machine
```bash
# Clone the repository
git clone <repository-url>
cd chuo-app

# Install dependencies
npm install

# Run the app
npm start
```

### Option 2: Direct File Sharing

#### Zip the Project
```bash
# Exclude node_modules and build files
# Create a zip file excluding unnecessary files
```

#### Share Instructions
1. Send the project folder (excluding `node_modules` and `android/.gradle`)
2. Recipient should run:
```bash
cd chuo-app
npm install
npm start
```

---

## Setting Up on a New Machine

### Prerequisites Checklist

#### Required Software
- **Node.js** (18.x or higher)
- **npm** (9.x or higher)
- **Java JDK 17**
- **Android Studio** (latest stable)
- **Git** (latest)

#### System Requirements
- **Windows**: Windows 10/11
- **macOS**: macOS Monterey or later
- **Linux**: Ubuntu 20.04 or later
- **RAM**: 8GB minimum, 16GB recommended
- **Disk Space**: 10GB free space

### Step-by-Step Setup

#### 1. Install Node.js
```bash
# Download from: https://nodejs.org/
# Verify installation
node --version
npm --version
```

#### 2. Install Java JDK 17
```bash
# Download from: https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
# Verify installation
java -version
```

#### 3. Install Android Studio
```bash
# Download from: https://developer.android.com/studio
# Install with default settings
# Install Android SDK 34
# Install Android SDK Build-Tools 34.0.0
# Install Android NDK 23.1.7779620
```

#### 4. Set Environment Variables

**Windows (PowerShell):**
```powershell
# Set JAVA_HOME
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Java\jdk-17', 'Machine')

# Set ANDROID_HOME
$env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', 'C:\Users\$env:USERNAME\AppData\Local\Android\Sdk', 'Machine')

# Add to PATH
$env:PATH = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:PATH"
```

**macOS/Linux:**
```bash
# Add to ~/.bash_profile or ~/.zshrc
export JAVA_HOME=/path/to/jdk-17
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator

# Reload shell
source ~/.bash_profile
```

#### 5. Clone or Copy Project
```bash
# If using Git
git clone <repository-url>
cd chuo-app

# If using zip file
# Extract and navigate to folder
cd chuo-app
```

#### 6. Install Dependencies
```bash
# Install Node dependencies
npm install

# If you encounter issues, try:
npm install --legacy-peer-deps
```

#### 7. Accept Android Licenses
```bash
cd android
./gradlew --version
# Follow prompts to accept licenses
```

#### 8. Clean and Build
```bash
cd android
./gradlew clean
cd ..
```

#### 9. Run the App
```bash
# Start Metro bundler
npm start

# In another terminal, run on Android
npm run android
```

---

## Running on Physical Android Devices

### Enable Developer Options on Device

#### For Most Android Devices
1. Go to **Settings** → **About Phone**
2. Tap **Build Number** 7 times
3. Go back to **Settings** → **Developer Options**
4. Enable **USB Debugging**

#### For Samsung Devices
1. Settings → About Device → Software Information
2. Tap Build Number 7 times
3. Settings → Developer Options → Enable USB Debugging

### Connect Device via USB

#### Step 1: Connect Device
```bash
# Connect device via USB cable
# Check if device is recognized
adb devices
```

#### Step 2: Accept Authorization
- On your device, accept the USB debugging authorization prompt
- Check again:
```bash
adb devices
# Should show your device
```

#### Step 3: Install and Run App
```bash
# Start Metro bundler
npm start

# In another terminal
npm run android

# Or use Gradle directly
cd android
./gradlew installDebug
adb shell am start -n com.chuoapp/com.chuoapp.SplashActivity
```

### Connect Device Wirelessly (Android 11+)

#### Step 1: Enable Wireless Debugging
1. Enable Developer Options
2. Enable USB Debugging
3. Connect via USB first
4. Enable **Wireless Debugging** in Developer Options

#### Step 2: Pair Device
```bash
# Get pairing code from device
adb pair <device-ip>:<port>

# Example
adb pair 192.168.1.100:37123

# Connect wirelessly
adb connect <device-ip>:<port>
```

#### Step 3: Run App
```bash
npm run android
```

### Device-Specific Considerations

#### Samsung Devices
- May need to install Samsung USB drivers
- Disable "Smart Switch" if it interferes

#### Xiaomi Devices
- Enable "USB Installation" in Developer Options
- Disable "MIUI Optimization" if needed

#### Oppo/Vivo Devices
- Enable "Allow USB Debugging in charge only mode"
- May need to enable "Install via USB" in security settings

---

## Sharing APK Files

### Build Debug APK
```bash
cd android
./gradlew assembleDebug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`

### Build Release APK
```bash
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

### Share APK with Others

#### Method 1: Direct File Transfer
```bash
# Locate the APK file
# Send via:
# - Email
# - Cloud storage (Google Drive, Dropbox)
# - USB drive
# - Messaging apps (WhatsApp, Telegram)
```

#### Method 2: Install via ADB
```bash
# On recipient's machine with device connected
adb install app-debug.apk

# Launch the app
adb shell am start -n com.chuoapp/com.chuoapp.SplashActivity
```

#### Method 3: Upload to Cloud Storage
```bash
# Upload APK to:
# - Google Drive
# - Dropbox
# - OneDrive
# - GitHub Releases
```

### Install APK on Device

#### Method 1: Direct Installation
1. Enable "Install Unknown Apps" from your browser or file manager
2. Download APK
3. Tap to install
4. Follow prompts

#### Method 2: Using ADB
```bash
# Enable USB debugging on device
adb install app-debug.apk
```

---

## Team Collaboration Workflow

### Git Branching Strategy

#### Main Branch Structure
```
main          # Production-ready code
develop       # Integration branch
feature/*     # Feature branches
hotfix/*      # Hotfix branches
```

#### Workflow Example
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request
# Merge to develop after review
```

### Code Review Process

#### Pull Request Checklist
- [ ] Code follows project style guidelines
- [ ] No console.log statements
- [ ] All tests pass
- [ ] Documentation updated
- [ ] No breaking changes

#### Review Commands
```bash
# Check for issues
npm run lint
npm run type-check

# Run tests
npm test
```

### Environment Variables

#### Shared .env.example
Create `.env.example` file:
```env
# API Configuration
API_BASE_URL=https://api.chuoapp.com
API_TIMEOUT=30000

# Feature Flags
ENABLE_BIOMETRICS=true
ENABLE_NOTIFICATIONS=true

# Analytics
ANALYTICS_ENABLED=true
```

#### Individual .env Files
Each developer creates their own `.env` file from `.env.example`:
```bash
cp .env.example .env
# Edit .env with local configuration
```

### Dependency Management

#### Updating Dependencies
```bash
# Check for outdated packages
npm outdated

# Update specific package
npm install package-name@latest

# Update all packages
npm update

# Audit for vulnerabilities
npm audit
npm audit fix
```

#### Lock File Management
```bash
# Always commit package-lock.json
# This ensures consistent installs across machines
```

---

## Troubleshooting Device Issues

### Device Not Recognized

#### Problem: adb devices shows no devices
```bash
# Solution 1: Restart ADB
adb kill-server
adb start-server
adb devices

# Solution 2: Check USB cable
# Try different USB cable
# Try different USB port

# Solution 3: Check device settings
# Ensure USB debugging is enabled
# Try changing USB mode (MTP, PTP, Charging)
```

#### Problem: unauthorized device
```bash
# Solution: Revoke USB debugging authorization
# On device: Developer Options → Revoke USB debugging
# Reconnect and accept authorization again
```

### Installation Failed

#### Problem: INSTALL_FAILED_UPDATE_INCOMPATIBLE
```bash
# Solution: Uninstall existing app
adb uninstall com.chuoapp

# Reinstall
adb install app-debug.apk
```

#### Problem: INSTALL_FAILED_INSUFFICIENT_STORAGE
```bash
# Solution: Free up space on device
# Or install on SD card if supported
adb install -s app-debug.apk
```

### App Crashes on Device

#### Problem: App crashes immediately
```bash
# Check logs
adb logcat | grep chuoapp

# Check for specific errors
adb logcat | grep -E "FATAL|AndroidRuntime"

# Clear app data
adb shell pm clear com.chuoapp
```

#### Problem: Metro bundler connection issues
```bash
# Ensure Metro is running
npm start

# Set up ADB reverse
adb reverse tcp:8081 tcp:8081

# Check network connection
# Ensure device and dev machine are on same network
```

### Build Issues on Different Machines

#### Problem: Gradle sync fails
```bash
# Clean Gradle cache
cd android
./gradlew clean

# Delete .gradle folder
rm -rf .gradle

# Sync again
./gradlew build
```

#### Problem: Node modules issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

## Quick Reference Commands

### Device Management
```bash
# List connected devices
adb devices

# Install APK
adb install app-debug.apk

# Uninstall app
adb uninstall com.chuoapp

# Launch app
adb shell am start -n com.chuoapp/com.chuoapp.SplashActivity

# Clear app data
adb shell pm clear com.chuoapp

# View logs
adb logcat | grep chuoapp
```

### Build Commands
```bash
# Debug APK
cd android && ./gradlew assembleDebug

# Release APK
cd android && ./gradlew assembleRelease

# Install on connected device
cd android && ./gradlew installDebug
```

### Development Commands
```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS (future)
npm run ios

# Clean build
cd android && ./gradlew clean
```

---

## Security Considerations

### Sensitive Data
- Never commit `.env` files
- Never commit signing keys
- Use `.gitignore` properly
- Rotate API keys regularly

### Release Builds
- Use proper signing for release APKs
- Remove debug code before release
- Disable logging in production
- Use ProGuard/R8 for code obfuscation

---

## Support and Resources

### Documentation
- **React Native Docs**: https://reactnative.dev/
- **Android Studio Docs**: https://developer.android.com/studio
- **ADB Documentation**: https://developer.android.com/studio/command-line/adb

### Community
- **React Native Community**: https://react-native-community.github.io/
- **Stack Overflow**: https://stackoverflow.com/questions/tagged/react-native
- **GitHub Issues**: https://github.com/facebook/react-native/issues

---

**Last Updated**: July 24, 2026
**Document Version**: 1.0.0
