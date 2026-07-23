# Google Play Console Submission Guide: Siddha Meditation

Use this guide to complete the **"LET US KNOW ABOUT THE CONTENT OF YOUR APP"** and **"MANAGE HOW YOUR APP IS ORGANIZED AND PRESENTED"** tasks in the Google Play Console.

---

## 📄 Task 1: Set Privacy Policy

### What to enter:
Provide the URL where your Privacy Policy is hosted. 
*If you don't have a hosting URL yet, you can host the generated `privacy_policy.html` file on GitHub Pages (free) or on your main landing website domain.*

### Privacy Policy Text (For your website/hosting):
> #### Privacy Policy for Siddha Meditation App
> Last updated: July 2026
>
> **1. Information Collection and Use**
> Siddha Meditation is designed with privacy as a core value. The app runs entirely client-side. All of your personal information (including your name), meditation logs, quest history, reflections, and streak statistics are stored locally on your device via standard browser storage (`localStorage`). We do not host any remote databases and do not collect, transmit, or store any of your data on external servers.
>
> **2. Third-Party Sharing**
> Because your data is completely local to your device, we do not share, sell, or distribute your personal information or meditation logs to any third-party entities.
>
> **3. Data Deletion**
> You have full control over your data. You can delete all of your personal data at any time by clicking the "Reset Progress" button in the app's Profile screen, or by clearing the storage/cache of the app in your device's settings.
>
> **4. Changes to This Policy**
> We may update our Privacy Policy from time to time. Any changes will be reflected by updating this document online.

---

## 🔑 Task 2: Sign-In Details (App Access)

### Select option:
* **"All functionality is available without special access restrictions."**

### Why:
Siddha runs entirely offline. There is no user registration lock, passcode screen, server-side authentication, or membership credentials required to access any part of the application.

---

## 🔞 Task 3: Content Rating

Complete the questionnaire as follows:

*   **Category**: select **Utility, Productivity, Communication, or Other / Lifestyle**.
*   **Violence**: *No* (The app contains no violent content or depictions).
*   **Sexuality**: *No* (No sexual content or references).
*   **Language**: *No* (No profanity or crude language).
*   **Controlled Substances**: *No* (No drug, alcohol, or tobacco references).
*   **Miscellaneous**:
    *   Does the app natively allow users to interact or exchange content? *No*.
    *   Does the app share the user's physical location? *No*.
    *   Does the app allow users to purchase digital goods? *No*.

---

## 🎯 Task 4: Target Audience

Select the age groups and options as follows:

*   **Target Age Groups**: Select **13-15**, **16-17**, and **18 and older** (or just **18 and older**).
    *   *Recommendation: Selecting 18 and older reduces compliance overhead and special child-directed UI checks.*
*   **Store Listing Appeal**: Does your store listing appeal to children?
    *   Select **No**. (The branding, calm styling, and mindfulness graphics are designed specifically for mature practitioners).

---

## 🔒 Task 5: Data Safety

Complete the Data Safety declarations exactly as follows:

1.  **Does your app collect or share any of the required user data types?**
    *   Select **No**. (Under Google's guidelines, data stored solely on the user's device locally that is not transmitted to a server does not count as "collected" or "shared").
2.  **Is all of the user data collected by your app encrypted in transit?**
    *   Select **Yes** (or N/A since no transit happens).
3.  **Do you provide a way for users to request that their data be deleted?**
    *   Select **Yes**. (Users can trigger this locally via Settings > Reset Progress).

---

## 🏛️ Task 6: Government Apps

### Select option:
* **"No"** (My app is not developed by or on behalf of a government agency).

---

## 💳 Task 7: Financial Features

### Select option:
* **"No"** (My app does not offer any financial features).
    *   *Note: Linking to external support pages like Ko-fi via a web browser does not classify the app itself as a financial features app.*

---

## 🩺 Task 8: Health Apps

### Select option:
* **"My app is not a health app or does not have health features"** (or select **"Fitness & Nutrition" / "Mindfulness"** if you want to declare it under lifestyle wellness, but choosing "No" minimizes regulatory audits unless you use medical diagnosis tools).

---

## 🏷️ Task 9: App Category & Contact Details

### Select settings:
*   **App Type**: App
*   **Category**: **Lifestyle** or **Health & Fitness**
*   **Tags**: *Meditation, Mindfulness, Productivity, Habit Tracker*
*   **Contact Email**: `kami@siddha.app` (or your personal support email)

---

## 🚀 Task 10: Set Up Store Listing

Copy and paste the following descriptions:

### App Name:
`Siddha: Mindful Journey`

### Short Description:
`A simple, gamified meditation tracker to build a consistent mindfulness habit.`

### Full Description:
```text
Build a lasting meditation habit with Siddha, a distraction-free mindfulness tracker designed to help you stay consistent.

Siddha is built on the philosophy of simplicity and progression. There are no expensive subscriptions, no endless content libraries to scroll through, and no intrusive notifications. Just a clean, intentional tool to support your practice.

KEY FEATURES:

• Multiple Journey Paths: Choose your focus from our introductory paths, including Anapana (breath focus), Vipassana (insight), Metta (loving-kindness), Zen (absorption), or TMI (The Mind Illuminated steps). Each path features progressive nodes and milestones.

• Achievements & Badges: Stay motivated by tracking consistency. Unlock milestone badges like First Steps, Daily Ritual, and Zen Master as your streak grows.

• Weekly Performance Chart: Visualize your weekly sitting minutes and session counts at a glance with a clean dashboard tracker.

• Mood Reflection Journal: Record your mental state and reflections after each meditation to observe how your mind transforms over time.

• Wisdom Knowledge Base: Explore articles, quotes, and lessons on the history, philosophy, and techniques of different meditation lineages to support your offline practice.

Practice on your own terms. Simple, local, and private. Start your mindful journey today with Siddha.
```

---

## 🎨 Task 11: Feature Graphic Store Assets

We have prepared two beautiful, professional **1024x500 Feature Graphic** options for your store listing. You can find them inside your `release_assets/` folder:

1.  **Option A: Zen Garden Theme** (`release_assets/feature_graphic.png`)
    *   *Aesthetic*: Soft, natural lighting showing a meditating silhouette in a peaceful bamboo/stone zen garden context.
2.  **Option B: Cosmic Stardust Theme** (`release_assets/feature_graphic_cosmic.jpg`)
    *   *Aesthetic*: A gold line-art Buddha seated in deep meditation set against a starlit violet/indigo space nebula gradient.

