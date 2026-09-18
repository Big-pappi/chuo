# ChuoApp - Technical Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Development Environment Setup](#development-environment-setup)
4. [Project Structure](#project-structure)
5. [API Integration](#api-integration)
6. [Build & Deployment](#build--deployment)
7. [Google Play Store Publishing](#google-play-store-publishing)
8. [Apple App Store Publishing](#apple-app-store-publishing)
9. [Hosting & CI/CD](#hosting--cicd)
10. [Security Considerations](#security-considerations)
11. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

### Application Architecture
ChuoApp follows a modern React Native architecture with a focus on modularity, scalability, and maintainability.

```
┌─────────────────────────────────────────────────────────────┐
│                      Presentation Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Screens    │  │  Components  │  │   Hooks      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      Business Logic Layer                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Redux      │  │  Services    │  │  Utils       │      │
│  │   Store      │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      Data Access Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  API Client  │  │  Storage     │  │  Cache       │      │
│  │  (Axios)     │  │  (MMKV)      │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    External Services Layer                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  University  │  │  Firebase    │  │  Analytics   │      │
│  │  APIs        │  │  Services    │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Key Architectural Patterns
- **Redux Toolkit**: State management with predictable state containers
- **Service-Oriented Architecture**: Modular API services for different universities
- **Component-Based UI**: Reusable React Native components
- **Custom Hooks**: Encapsulated business logic and side effects
- **TypeScript**: Type safety and better developer experience

---

## Technology Stack

### Frontend
- **Expo SDK**: 51.0.0
- **React Native**: 0.74.5
- **React**: 18.2.0
- **TypeScript**: 5.2.2
- **Redux Toolkit**: Latest
- **React Navigation**: 6.x
- **React Native Paper**: 5.11.3 (Material Design components)

### Backend Integration
- **Axios**: HTTP client for API requests
- **Expo Secure Store**: Secure key-value storage
- **Firebase**: Authentication, Cloud Messaging (optional)

### Development Tools
- **Expo CLI**: Development and build tooling
- **Expo Go**: Development app for testing
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks

### Platform Support
- **Android**: Via Expo Go or Development Builds (no Android Studio required)
- **iOS**: Via Expo Go or Development Builds (no Xcode required)
- **Web**: Via Expo web support

---

## Development Environment Setup

### Prerequisites

#### For All Platforms
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Git**: Latest version
- **Expo Go App**: Install on your mobile device (Android/iOS)

### Installation Steps

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd chuo-app
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Environment Configuration
Create a `.env` file in the root directory:
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

### Running the App

#### Development Mode (Expo Go - Recommended)
```bash
# Start Expo development server
npm start

# Scan the QR code with Expo Go app on your device
# or press 'a' for Android emulator
# or press 'i' for iOS simulator
# or press 'w' for web browser
```

#### Development Mode (Web)
```bash
npm run web
```

#### Development Mode (Android Emulator)
```bash
# Start Expo development server
npm start

# Press 'a' to run on Android emulator
# Ensure Android emulator is running first
```

#### Development Mode (iOS Simulator - macOS only)
```bash
# Start Expo development server
npm start

# Press 'i' to run on iOS simulator
# Requires macOS with Xcode Command Line Tools
```

---

## Project Structure

```
chuo-app/
├── src/                              # React Native source code
│   ├── api/                          # API integration layer
│   │   ├── client.ts                 # Axios configuration
│   │   ├── universities/             # University-specific APIs
│   │   │   ├── udsm.ts
│   │   │   ├── udom.ts
│   │   │   └── ...
│   │   └── types.ts                  # API type definitions
│   ├── components/                   # Reusable UI components
│   │   ├── common/
│   │   ├── forms/
│   │   └── layout/
│   ├── features/                      # Feature-based modules
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types.ts
│   │   ├── dashboard/
│   │   ├── results/
│   │   ├── fees/
│   │   ├── timetable/
│   │   └── ...
│   ├── navigation/                    # Navigation configuration
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── MainNavigator.tsx
│   ├── store/                        # Redux store configuration
│   │   ├── slices/
│   │   ├── hooks.ts
│   │   └── index.ts
│   ├── theme/                        # App theming
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── index.ts
│   ├── utils/                        # Utility functions
│   │   ├── helpers.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   ├── hooks/                        # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   └── ...
│   ├── types/                        # TypeScript type definitions
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── ...
│   └── App.tsx                       # Root component
├── assets/                           # Static assets
│   ├── images/
│   ├── fonts/
│   └── icons/
├── docs/                             # Documentation
├── scripts/                          # Build and utility scripts
├── .env                              # Environment variables
├── .eslintrc.js                      # ESLint configuration
├── .prettierrc                       # Prettier configuration
├── babel.config.js                   # Babel configuration
├── metro.config.js                   # Metro bundler configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Node dependencies
└── README.md                         # Project README
```

---

## API Integration

### University API Architecture

The app supports multiple Tanzanian universities through a unified API client architecture.

#### API Client Configuration
```typescript
// src/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Redirect to login
    }
    return Promise.reject(error);
  }
);
```

#### University-Specific Services
```typescript
// src/api/universities/udsm.ts
import { apiClient } from '../client';

export const udsmService = {
  login: (credentials: LoginCredentials) =>
    apiClient.post('/udsm/auth/login', credentials),
  
  getResults: (studentId: string) =>
    apiClient.get(`/udsm/students/${studentId}/results`),
  
  getFees: (studentId: string) =>
    apiClient.get(`/udsm/students/${studentId}/fees`),
  
  getTimetable: (studentId: string, semester: string) =>
    apiClient.get(`/udsm/students/${studentId}/timetable/${semester}`),
};
```

#### Supported Universities
- **UDSM** (University of Dar es Salaam)
- **UDOM** (University of Dodoma)
- **SUZA** (State University of Zanzibar)
- **MUCE** (Mkwawa University College of Education)
- **Other Tanzanian universities** (extensible architecture)

---

## Build & Deployment

### Android Build Process

#### Debug Build
```bash
cd android
./gradlew assembleDebug
```
Output: `android/app/build/outputs/apk/debug/app-debug.apk`

#### Release Build
```bash
cd android
./gradlew assembleRelease
```
Output: `android/app/build/outputs/apk/release/app-release.apk`

#### Signed APK
1. Generate a keystore:
```bash
keytool -genkey -v -keystore chuoapp-release.keystore -alias chuoapp-key-alias -keyalg RSA -keysize 2048 validity 10000
```

2. Configure signing in `android/app/build.gradle`:
```gradle
android {
    signingConfigs {
        release {
            storeFile file('chuoapp-release.keystore')
            storePassword 'your-store-password'
            keyAlias 'chuoapp-key-alias'
            keyPassword 'your-key-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

3. Build signed release:
```bash
./gradlew assembleRelease
```

#### Android App Bundle (AAB)
```bash
./gradlew bundleRelease
```
Output: `android/app/build/outputs/bundle/release/app-release.aab`

### iOS Build Process (Future)

#### Debug Build
```bash
npm run ios
```

#### Release Build
1. Open `ios/ChuoApp.xcworkspace` in Xcode
2. Select "Any iOS Device" as target
3. Product → Archive
4. Follow Xcode's distribution workflow

---

## Google Play Store Publishing

### Prerequisites
1. **Google Play Developer Account**: $25 one-time fee
2. **Google Play Console Access**
3. **Signed Release APK or AAB**

### Publishing Steps

#### 1. Prepare Release Build
```bash
cd android
./gradlew clean
./gradlew bundleRelease
```

#### 2. App Bundle Upload
- Navigate to Google Play Console
- Create new app or select existing
- Go to "Release & Deployment" → "App bundles"
- Upload the generated AAB file

#### 3. Store Listing
- **App Name**: ChuoApp
- **Short Description**: Brief app description (80 characters)
- **Full Description**: Detailed app features and benefits
- **Screenshots**: At least 2 screenshots (phone and 7-inch tablet)
- **Icon**: 512x512 high-resolution icon
- **Feature Graphic**: 1024x500 banner
- **Promo Graphics**: Optional promotional materials

#### 4. Content Rating
- Complete the content rating questionnaire
- Select appropriate rating for your target audience

#### 5. Pricing & Distribution
- **Free or Paid**: Select pricing model
- **Countries**: Select target countries
- **Device Compatibility**: Set minimum SDK requirements

#### 6. Release Management
- **Internal Testing**: Upload for internal team testing
- **Closed Testing**: Beta testing with selected users
- **Open Testing**: Public beta testing
- **Production**: Full public release

#### 7. Review Process
- Google Play review typically takes 1-3 days
- Ensure compliance with Play Store policies
- Address any review feedback promptly

### Play Store Best Practices
- **AAB Format**: Use Android App Bundle for optimized delivery
- **64-bit Requirement**: Include 64-bit native libraries
- **Target SDK**: Target latest API level (currently 34)
- **Privacy Policy**: Include comprehensive privacy policy
- **Permissions**: Minimize requested permissions
- **Testing**: Test on multiple devices and Android versions

---

## Apple App Store Publishing (Future)

### Prerequisites
1. **Apple Developer Account**: $99/year
2. **Mac Computer**: Required for iOS builds
3. **Xcode**: Latest version
4. **TestFlight**: For beta testing

### Publishing Steps

#### 1. App Registration
- Log in to App Store Connect
- Register new app with bundle identifier
- Select platform (iOS/iPadOS)

#### 2. Build Configuration
- Configure signing certificates and provisioning profiles
- Set bundle identifier, version, and build number
- Configure app icons and launch screens

#### 3. Archive & Upload
```bash
# Open in Xcode
open ios/ChuoApp.xcworkspace

# Build archive
Product → Archive

# Upload to App Store Connect
Distribute App → App Store Connect
```

#### 4. App Store Information
- **App Information**: Name, subtitle, keywords
- **Screenshots**: Required for all device sizes
- **App Preview Videos**: Optional but recommended
- **Description**: Detailed app description
- **Support URL**: Customer support website
- **Marketing URL**: App marketing website
- **Privacy Policy URL**: Privacy policy document

#### 5. Pricing & Availability
- **Price Tier**: Select appropriate pricing
- **Availability**: Select countries/regions
- **Date**: Set release date or manual release

#### 6. Submit for Review
- Complete all required information
- Submit for App Store review
- Review typically takes 1-2 days

#### 7. TestFlight Beta Testing
- **Internal Testing**: Test with internal team
- **External Testing**: Test with selected beta users
- Collect feedback and fix issues

### App Store Best Practices
- **Human Interface Guidelines**: Follow Apple's design guidelines
- **App Store Review Guidelines**: Ensure compliance
- **Performance**: Optimize app performance and battery usage
- **Privacy**: Handle user data responsibly
- **Testing**: Test on multiple iOS devices

---

## Hosting & CI/CD

### CI/CD Pipeline Options

#### GitHub Actions
```yaml
# .github/workflows/android.yml
name: Android CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
    
    - name: Cache Gradle packages
      uses: actions/cache@v3
      with:
        path: |
          ~/.gradle/caches
          ~/.gradle/wrapper
        key: ${{ runner.os }}-gradle-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
    
    - name: Build Android APK
      run: |
        cd android
        ./gradlew assembleDebug
    
    - name: Upload APK
      uses: actions/upload-artifact@v3
      with:
        name: app-debug
        path: android/app/build/outputs/apk/debug/app-debug.apk
```

#### Firebase App Distribution
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Distribute to testers
cd android
./gradlew assembleDebug
firebase appdistribution:distribute app/build/outputs/apk/debug/app-debug.apk \
  --app 1:1234567890:android:abcdef \
  --groups "testers" \
  --release-notes "Bug fixes and improvements"
```

### Hosting Options

#### Backend API Hosting
- **Firebase**: Authentication, Real-time Database, Cloud Functions
- **AWS**: EC2, API Gateway, Lambda
- **Google Cloud**: App Engine, Cloud Run, Cloud Functions
- **Heroku**: Simple deployment option
- **DigitalOcean**: Affordable VPS hosting

#### CDN & Static Assets
- **Firebase Storage**: User uploads and static assets
- **AWS S3 + CloudFront**: Scalable storage and CDN
- **Cloudflare**: CDN and DDoS protection

### Monitoring & Analytics
- **Firebase Crashlytics**: Crash reporting
- **Google Analytics**: User analytics
- **Sentry**: Error tracking and performance monitoring
- **Mixpanel**: User behavior analytics

---

## Security Considerations

### Data Security
- **HTTPS Only**: All API communications over HTTPS
- **Token Storage**: Secure token storage using MMKV
- **Encryption**: Sensitive data encryption at rest
- **Certificate Pinning**: Prevent MITM attacks (optional)

### Authentication
- **JWT Tokens**: Secure token-based authentication
- **Biometric Auth**: Fingerprint/Face ID support
- **Session Management**: Proper session timeout handling
- **Token Refresh**: Automatic token refresh mechanism

### Code Security
- **ProGuard/R8**: Code obfuscation for release builds
- **Environment Variables**: Sensitive data in environment files
- **Dependency Scanning**: Regular security audits
- **API Key Protection**: Never expose API keys in client code

### Privacy Compliance
- **GDPR Compliance**: User data handling and consent
- **Privacy Policy**: Clear privacy policy document
- **Data Minimization**: Collect only necessary data
- **User Consent**: Proper consent mechanisms

---

## Troubleshooting

### Common Issues

#### Build Failures
**Problem**: Gradle build fails with dependency errors
```bash
# Solution: Clean and rebuild
cd android
./gradlew clean
./gradlew build --refresh-dependencies
```

#### Metro Bundler Issues
**Problem**: Metro bundler won't start or hangs
```bash
# Solution: Clear cache and restart
npm start -- --reset-cache
# or
rm -rf node_modules
npm install
```

#### Android Emulator Issues
**Problem**: App won't install on emulator
```bash
# Solution: Check ADB connection
adb devices
adb kill-server
adb start-server
```

#### iOS Build Issues (Future)
**Problem**: iOS build fails with CocoaPods errors
```bash
# Solution: Reinstall pods
cd ios
pod deintegrate
pod install
```

#### Package Installation Issues
**Problem**: npm install fails
```bash
# Solution: Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Performance Issues

#### Slow Build Times
- Enable Gradle build cache
- Use incremental compilation
- Parallelize builds where possible

#### App Performance
- Profile with React Native Debugger
- Optimize re-renders with React.memo
- Use FlatList for long lists
- Lazy load heavy components

### Debugging Tools

#### React Native Debugger
```bash
# Install
npm install -g react-native-debugger

# Run
react-native-debugger
```

#### Flipper
- Built-in React Native debugging tool
- Network inspection
- Layout inspection
- Database inspection

#### Android Studio Profiler
- CPU profiling
- Memory profiling
- Network profiling

---

## Version Control

### Git Workflow
- **Main Branch**: Production-ready code
- **Develop Branch**: Integration branch for features
- **Feature Branches**: `feature/feature-name`
- **Hotfix Branches**: `hotfix/issue-name`

### Commit Message Convention
```
feat: add university selection feature
fix: resolve login authentication issue
docs: update API documentation
style: format code with prettier
refactor: simplify API client structure
test: add unit tests for auth service
chore: update dependencies
```

---

## Support & Maintenance

### Regular Maintenance Tasks
- **Dependency Updates**: Monthly security updates
- **Code Review**: Regular code quality checks
- **Performance Monitoring**: Continuous performance tracking
- **User Feedback**: Collect and address user feedback
- **Analytics Review**: Analyze usage patterns

### Emergency Procedures
- **Critical Bugs**: Hotfix release process
- **Security Issues**: Immediate patch deployment
- **Service Outages**: Fallback mechanisms
- **Data Breaches**: Incident response plan

---

## Contact & Resources

### Development Team
- **Project Lead**: [Contact Information]
- **Android Developer**: [Contact Information]
- **iOS Developer**: [Contact Information] (Future)
- **Backend Developer**: [Contact Information]

### External Resources
- **React Native Documentation**: https://reactnative.dev/
- **Android Developers**: https://developer.android.com/
- **iOS Developers**: https://developer.apple.com/ios/
- **Google Play Console**: https://play.google.com/console
- **App Store Connect**: https://appstoreconnect.apple.com/

### License
[Specify your license here]

---

**Last Updated**: July 24, 2026
**Document Version**: 1.0.0
