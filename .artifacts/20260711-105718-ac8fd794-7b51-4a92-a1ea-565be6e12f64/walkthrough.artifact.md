# Walkthrough: Version 1.6.8 Release (Alarm Permission Removal)

I have successfully removed the remaining alarm permissions and iterated the app version to 1.6.8 (v28).

## Changes Made

### Permission Cleanup
- **[AndroidManifest.xml](file:///Users/kami/Documents/Siddha Meditation App/siddha-app/android/app/src/main/AndroidManifest.xml)**:
    - Removed `android.permission.SCHEDULE_EXACT_ALARM` to complete the permission reduction.

### Versioning & Build
- **[build.gradle](file:///Users/kami/Documents/Siddha Meditation App/siddha-app/android/app/build.gradle)** & **[package.json](file:///Users/kami/Documents/Siddha Meditation App/siddha-app/package.json)**:
    - Incremented version to **1.6.8 (v28)**.
- Performed a clean release build.

## Verification Results

### Build Status
- [x] **Success**: Release Bundle build finished successfully.

> [!TIP]
> The new bundle (v28) is available at `android/app/build/outputs/bundle/release/app-release.aab`.
