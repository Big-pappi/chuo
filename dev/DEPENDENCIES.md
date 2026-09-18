# Project Dependencies

This document tracks the dependencies installed in the CHUO University App project and their purposes.

## Core Dependencies

### @react-native-async-storage/async-storage
- **Purpose**: Persistent local storage for app data
- **Installed**: 2026-09-09
- **Usage**: Used for theme persistence (dark mode preferences) and other local data storage needs
- **Why needed**: Allows users' theme choices to persist across app restarts

## Theme System Updates

### Dark Mode Theme (2026-09-09)
- **Primary Color**: Blue (#0B4DA8) - matches brand colors
- **Accent Color**: Yellow/Gold (#FDBB22) - for highlights and secondary elements
- **Background**: Dark (#0A0A0A) - pure dark background
- **Text**: White (#FFFFFF) - for high contrast on dark backgrounds
- **Design Approach**: Cool dark theme with brand-consistent colors and excellent readability

## React Native Core Dependencies

These are part of the original Expo/React Native setup:

- `expo` ~57.0.0 - Expo SDK for React Native development
- `react` 19.2.3 - React framework
- `react-native` 0.86.3 - React Native framework
- `@expo/vector-icons` ^15.0.3 - Icon library
- `expo-status-bar` ~57.0.1 - Status bar control
- `expo-secure-store` ~57.0.3 - Secure storage for sensitive data
- `expo-crypto` ~57.0.2 - Cryptographic functions
- `expo-local-authentication` ~57.0.2 - Biometric authentication
- `expo-linear-gradient` ~57.0.1 - Gradient components

## Navigation & State Management

- `@react-navigation/native` ^7.0.14 - React Navigation
- `@react-navigation/native-stack` ^7.2.0 - Stack navigation
- `@react-navigation/bottom-tabs` ^7.1.0 - Bottom tab navigation
- `@reduxjs/toolkit` ^2.5.0 - State management
- `react-redux` ^9.1.2 - React Redux bindings

## UI Components & Styling

- `react-native-paper` ^5.12.5 - Material Design components
- `react-native-gesture-handler` ~2.32.0 - Gesture handling
- `react-native-safe-area-context` ~5.7.0 - Safe area handling
- `react-native-screens` ~4.26.0 - Optimized screen components
- `react-native-svg` 15.15.4 - SVG support

## Forms & Validation

- `react-hook-form` ^7.47.0 - Form management
- `@hookform/resolvers` ^3.3.2 - Form validation resolvers
- `zod` ^3.22.4 - Schema validation

## Networking

- `axios` ^1.6.0 - HTTP client for API calls
- `buffer` ^6.0.3 - Buffer polyfill for react-native-svg

## Development Dependencies

These are used during development and testing:

- `typescript` ~6.0.3 - TypeScript compiler
- `@types/react` ~19.2.4 - React type definitions
- `eslint` ^8.19.0 - Code linting
- `prettier` ^3.0.3 - Code formatting
- `jest` ^29.2.1 - Testing framework
- `jest-expo` ~57.0.5 - Expo Jest adapter

## Notes

- All dependencies are managed via npm
- Package versions are locked in package-lock.json
- New dependencies should be documented here with purpose and installation date
- When removing dependencies, update this file accordingly
