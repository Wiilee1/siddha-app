# Implementation Plan: System Back Gesture & Reflection UI Fix

This plan handles the **system back gesture** (swipe from the side on Android/iOS) to ensure it navigates to the Home screen before exiting. It also lowers the header on the **Reflection** screen so it doesn't overlap with the status bar.

## User Review Required

> [!IMPORTANT]
> - **System Back Gesture (Swipe):** I will link into the system-level "Back" event. When you swipe back or press the Android back key:
>   1. It will first **close any open overlays** (like the Wisdom Reader or Journey Mission list).
>   2. If you are on a tab like **Journey** or **Wisdom**, it will take you to **Home** instead of closing the app.
>   3. Swiping back while on the **Home** screen will exit the app as normal.
> - **Lower Reflection Screen:** I will increase the top padding *only* on the Reflection screen to push the "Back" and "Skip" buttons down safely below the status bar.

## Proposed Changes

### 1. [MODIFY] [main.js](file:///Users/kami/Documents/Siddha Meditation App/siddha-app/src/main.js)
- Add a Capacitor `backButton` listener to capture system gestures.
- Implement logic to:
    - Close the **Wisdom Reader** if open.
    - Close the **Journey Mission Modal** if open.
    - Close the **Intention Picker** if open.
    - Navigate to **Home** if on any other sub-screen.

### 2. [MODIFY] [new_reflection.js](file:///Users/kami/Documents/Siddha Meditation App/siddha-app/src/screens/new_reflection.js)
- Increase top padding in `.new-reflection-screen` to `calc(32px + env(safe-area-inset-top, 0px))`.
- This ensures the "Back" and "Skip" buttons are clearly visible and reachable.

## Verification Plan

### Manual Verification
1. **Swipe Gesture:**
   - Open **Wisdom** -> Swipe back from the edge of your screen -> Verify it goes to **Home**.
   - Open **Journey** -> Tap a mission to open the list -> Swipe back -> Verify only the list closes.
2. **Reflection Padding:**
   - Open **Reflection**. Confirm the header is lowered and looks correct compared to the other screens.
