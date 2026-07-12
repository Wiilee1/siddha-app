# Siddha Meditation App — Release Notes (v1.1.0)

## Overview
This update focuses on polishing the onboarding experience, streamlining the initial meditation pathway, improving layout visibility during the tutorial tour, and making daily quests dynamic and rewarding.

---

## What's New

### 1. Reordered & Condensed Journey Map
- **Anapana First**: Configured **Anapana** (Low difficulty) as the starting, beginner-friendly pathway.
- **Concise Nodes**: Condensed Anapana to exactly 5 nodes with 3 short missions each (instead of 10+ missions) to make early progress concise and motivating.
- **Pathway Sequencing**: The progression sequence is reordered to follow:
  $$\text{Anapana (Low)} \rightarrow \text{Metta (Low)} \rightarrow \text{Vipassana (High)} \rightarrow \text{TMI (Medium)} \rightarrow \text{Zen (High)}$$
- **Locked Pathways**: TMI is locked initially and requires reaching Level 4.

### 2. Streamlined Onboarding & Interactive Tour
- **Onboarding Form Fix**: The first two onboarding questions now highlight the chosen option and wait for the "Next" button click instead of auto-advancing, ensuring users review their selections.
- **Suppressed Popups**: Celebrations and popups (Level Up and Achievement modals) are suppressed during the onboarding tour to keep the user focused.
- **Non-Obstructive Spotlight**: Reworked the onboarding tour spotlight. The ring overlay matches the shape and size of the `.node-circle` button exactly, and is fully click-through accessible.
- **Calibrated XP Progress**: Adjusted the tutorial completion rewards so that the user is awarded **90 XP** after finishing the onboarding tour (75 XP from meditation + 15 XP from wisdom reading), leaving them exactly 10 XP short of Level 2 (100 XP).

### 3. Dynamic Daily Quests
- **1 Random Quest Daily**: Automatically rotates a single random daily quest every day from a pool of meditation sits, grateful reflections, and wisdom reading.
- **Explicit Reward Info**: The daily quest card now clearly displays the reward in the header: **Daily Quest (+25 XP)**.

### 4. Profile & Timer Enhancements
- **Clean Profile Screen**: Removed the user's email address from the profile header.
- **Collapsed Milestones**: The "Milestones & Badges" section is collapsed by default on screen load to reduce clutter.
- **Custom Timer Validation**: Ensured that when choosing custom durations for a mission, the user cannot set a timer shorter than the mission's minimum duration.

---

## Verification Summary
All features have been successfully built and verified on the served production build (`http://localhost:8088/`):
- Clean tutorial spotlight ring shapes.
- Correct progression, pathway order, and locking rules.
- Fully operational single random daily quest with reward visibility.
- Collapsed milestones grid on the profile tab with email address removed.
- **0 JavaScript console errors**.
