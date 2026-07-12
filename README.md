# Siddha Meditation App

Siddha is a free, privacy-first, open-source mobile companion designed to help you build and maintain a consistent meditation practice. 

---

## 🧘 The Philosophy: A Bridge, Not a Cage
Maintaining a consistent meditation habit is notoriously difficult in a dopamine-saturated world. While language apps use game mechanics (like streaks and achievements) to hook our attention, silent practice offers no immediate sensory rewards. 

Siddha acts as **training wheels for your mind**:
*   **Meet Your Brain Where It Is**: It uses gentle gamification (progressive paths, XP rewards, and random daily quests) to lower the starting friction of building a habit.
*   **Designed to be Outgrown**: As you progress to advanced paths, the gamified scaffolding naturally dissolves. The missions get longer, the UI gets quieter, and the notifications fade. 
*   **Free & Open**: Siddha is built entirely from the heart, has no ads, no paywalls, and gathers zero user data. Once you have built a self-sustaining practice, you are encouraged to uninstall the app and rest in the silence.

---

## 🛠️ Technology Stack
Siddha is built with a lightweight, modern web stack wrapped for mobile deployment:
*   **Frontend**: Vanilla HTML5, CSS3, and ES6 Javascript Modules (No complex frameworks or build compile overhead needed for development).
*   **Database**: Offline-first lightweight local storage abstraction layer (`src/services/db.js`).
*   **Sound Synthesis**: Web Audio API synth layer (`src/services/synth.js`) for procedural bell chimes.
*   **Mobile Wrapper**: [Capacitor](https://capacitorjs.com/) for native packaging on iOS and Android.
*   **Background Resiliency**: Custom timestamp-delta timer and Capacitor Local Notifications integration to ensure audio chimes alert you reliably, even when the OS suspends the background app or locks the screen.

---

## 🗺️ Progression Pathways
Practice levels are structured progressively:
$$\text{Anapana (Low Difficulty)} \rightarrow \text{Metta (Low)} \rightarrow \text{Vipassana (High)} \rightarrow \text{TMI (Medium)} \rightarrow \text{Zen (High)}$$

---

## 🚀 Getting Started (Run Locally)

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### 1. Install Dependencies
Clone the repository and install npm packages:
```bash
npm install
```

### 2. Run the Web App Development Server
Siddha runs entirely on standard ES modules. Start a local server:
```bash
# Serves the app locally
python3 -m http.server 8088
# Or open index.html directly using a browser extension/local server
```

### 3. Build & Package for Mobile
To compile and package the web assets into the native mobile platforms:
```bash
# 1. Compile web assets
npm run build

# 2. Sync files into iOS and Android packages
npx cap sync
```

#### Launching the Native Emulator
*   **Android**: Run `npx cap open android` to open the project in Android Studio.
*   **iOS**: Run `npx cap open ios` to open the Xcode project.

---

## 📜 License & Intellectual Property
*   **Source Code**: The codebase of Siddha is licensed under the **GNU General Public License v3 (GPL-3.0)**. See the [LICENSE](LICENSE) file for details. This copyleft license ensures that the application remains free and open-source forever.
*   **Art & Media Assets**: All branding, logos, graphic design, companion illustrations, custom UI themes, and custom audio chime files are proprietary and copyrighted. You are free to run the code, but you may not repackage or redistribute the proprietary visual and audio assets for commercial use or on public app stores without express permission.
