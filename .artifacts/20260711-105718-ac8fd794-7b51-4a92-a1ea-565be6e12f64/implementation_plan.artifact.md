# Implementation Plan: App Size Optimization & Version Update

This plan aims to reduce the app's installation size and iterate to a new version for release.

## User Review Required

> [!IMPORTANT]
> - **Asset Cleanup:** I will optimize the build process to ensure no duplicate assets are being bundled.
> - **Resource Shrinking:** I will enable Android's resource shrinking to automatically remove unused icons and layout files from the final bundle.
> - **Version Bump:** The app will be updated to **1.6.6 (v26)**.

## Proposed Changes

### 1. [MODIFY] [build.gradle](file:///Users/kami/Documents/Siddha Meditation App/siddha-app/android/app/build.gradle)
- Enable `shrinkResources true` in the release build block.
- Update `versionCode` to **26**.
- Update `versionName` to **"1.6.6"**.

### 2. [MODIFY] [package.json](file:///Users/kami/Documents/Siddha Meditation App/siddha-app/package.json)
- Update `version` to **"1.6.6"**.

### 3. Build & Clean
- Run `./gradlew clean` to remove bulky temporary build files (currently taking up ~1GB of disk space).
- Run the web build and sync to ensure the Android `assets/public` folder is clean and optimized.
- Generate a new **Release Bundle (.aab)**.

## Verification Plan

### Automated Tests
- Compare the size of the new `app-release.aab` with the previous version (~144MB).

### Manual Verification
- Verify that the app still launches correctly and all audio/images are present.
