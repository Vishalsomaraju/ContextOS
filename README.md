# ContextOS 🧠📱

> **A Privacy-First, Proactive On-Device Context Agent**  
> *Transforming smartphones from reactive command receivers into proactive context-aware companions.*

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Gemini_1.5_Flash-Powered-orange?logo=google)](https://ai.google.dev/)
[![Snapdragon NPU Ready](https://img.shields.io/badge/Hardware-Snapdragon_NPU_Ready-red)](https://www.qualcomm.com/)
[![Privacy-First](https://img.shields.io/badge/Security-Local_On--Device-success)](#privacy--on-device-architecture)

---

## 🌟 Vision & Overview

Today's virtual assistants are fundamentally **reactive**: they sit idle waiting for explicit commands (*"Hey Assistant, set a reminder for 5 PM tomorrow"*). If you don't issue the exact command, nothing happens.

**ContextOS** changes the paradigm:
```
Traditional:  User  ──[ Explicit Command ]──►  Assistant  ──►  Action
ContextOS:    Context & Intent  ──[ On-Device AI ]──►  Confidence Engine  ──►  Proactive Action
```

Smartphones already possess rich ambient and digital context—speech, notifications, calendar, motion, time, and location—but this data remains siloed. ContextOS fuses this context locally using on-device AI and the **Snapdragon NPU**, understanding what you mean and what is happening around you to take action **when it actually matters**.

> **Note on Current Repository State:**  
> This repository contains an **interactive web demonstration & prototype** of ContextOS's core *Intent → Action* pipeline. It models on-device speech transcription, confidence-tiered proactive execution, and multimodal intent parsing. The complete on-device system architecture and mobile roadmap are detailed in the [Product Requirements Document (PRD)](./Rawstxck_iQOO_Hackathon_PRD.md).

---

## 🚀 Core Pillars

### 1. 🎙️ Natural Intent → Proactive Action
Users communicate intentions naturally in casual conversation without saying "create a reminder":
- *"Let's meet tomorrow at 5."* ➔ Detects meeting intent with Rahul, date: tomorrow, time: 17:00.
- *"Kal 5 baje Rahul se milna hai"* ➔ Seamless multilingual / Hinglish comprehension.
- **Confidence-Gated Execution**:
  - **High Confidence (≥ 85%)**: Action executed automatically with an immediate undo window.
  - **Medium Confidence (50% – 84%)**: Proactive inline confirmation card (*"Would you like to schedule this?"*).
  - **Low Confidence (< 50%)**: Silently filtered or requests minimal clarification to avoid notification fatigue.

### 2. 📲 Digital Context Fusion
- Analyzes incoming messages and notifications locally (from user-permitted apps like Slack, WhatsApp, or Email).
- Detects actionable commitments, upcoming deadlines, and reviews (*"Review slides before Monday 10 AM"*).
- Synthesizes commitments without data ever leaving the device.

### 3. 🛡️ Physical Context & Safety Mode
- Combines physical hardware signals: **distress-related acoustic cues + abrupt motion / accelerometer spike + GPS route anomalies**.
- Employs **multi-signal context fusion** to prevent false alarms:
  ```
  Distress Audio + Sudden Movement + Unexpected Stop/Deviation
                         ↓
               Potential Emergency
                         ↓
             "Are you safe?" Prompt
                         ↓
               (No Response within 30s)
                         ↓
      Escalate: Alert Trusted Contacts + Live Location + Trigger Context
  ```
- Protects users in situations where they are physically unable to reach for their phone or press an SOS button.

### 4. 🔒 Privacy-First & Snapdragon NPU Acceleration
- Sensitive data (voice recordings, personal messages, GPS coordinates) remains strictly inside the device's local perimeter.
- Designed to leverage Qualcomm Snapdragon NPU hardware acceleration for near-instant inference with minimal battery footprint.

---

## 💻 Interactive Web Demo

The included web demo simulates the on-device user interface and speech-to-intent engine:

- **Web Speech API & Audio Visualizer**: Live microphone capture with automatic silence detection (6-second auto-stop).
- **Gemini 1.5 Flash Server Engine**: Extracts structured JSON intents, resolves temporal references (today, tomorrow, relative dates), and outputs confidence scores.
- **Built-in Offline Mode**: Works out of the box even without an API key, providing simulated offline on-device responses.
- **Interactive Presentation Controls**:
  - Press `1`: Run High Confidence Demo (*"Let's meet Rahul tomorrow at 5."*)
  - Press `2`: Run Hinglish / Multilingual Demo (*"Kal 5 baje Rahul se milna hai"*)
  - Microphone toggle & typed keyboard input fallback.

---

## 📁 Repository Structure

```text
ContextOS/
├── src/
│   └── app/
│       ├── actions.ts          # Server Action: Gemini 1.5 Flash intent extractor & offline fallbacks
│       ├── globals.css         # Tailwind styles & theme variables
│       ├── layout.tsx          # Root Next.js layout & typography
│       └── page.tsx            # Main ContextOS interactive demo UI & audio pipeline
├── .env.example                # Example environment file template
├── .gitignore                  # Production Git ignore rules (secrets, builds, office binaries)
├── Rawstxck_iQOO_Hackathon_PRD.md # Comprehensive 1200+ line Product Requirements Document
├── package.json                # Project dependencies and run scripts
├── tailwind.config.ts          # Tailwind CSS theme configuration
└── tsconfig.json               # TypeScript configuration
```

---

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.17.0 or higher recommended)
- `npm` or `pnpm` or `yarn`

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/Vishalsomaraju/ContextOS.git
cd ContextOS
npm install
```

### 2. Configure Environment Variables (Optional)

ContextOS includes a built-in offline simulation mode. To enable real-time Gemini AI intent parsing:

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Open `.env.local` and add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(You can obtain a free Gemini API key from [Google AI Studio](https://aistudio.google.com/)).*

> If `GEMINI_API_KEY` is not provided, the demo automatically runs in offline mock mode using preconfigured intents.

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser (Google Chrome or Chromium-based browsers recommended for Web Speech API microphone support).

---

## 🎮 How to Test the Demo

1. **Microphone Input**: Click the central microphone button and speak a natural sentence (e.g., *"Let's meet tomorrow at five"* or *"Doctor appointment on Friday"*).
2. **Preset Shortcuts**: Use the on-screen preset badges or press `1` or `2` on your keyboard to instantly trigger demo phrases.
3. **Typed Input**: Click the keyboard icon at the bottom of the interface to manually test text intent extraction.
4. **Observe Context Engine**: Watch the NPU status badge, confidence score, and schedule card dynamically update based on intent confidence.

---

## 👥 Hackathon & Team Credits

- **Event**: [iQOO Hackathon 2026 — Hyderabad City Battle](https://www.iqoo.com/)
- **Team**: **Rawstxck**
  - **Lead**: Vishal Somaraju ([@Vishalsomaraju](https://github.com/Vishalsomaraju))
  - **Member**: B. Sai Hitesh ([@saihitesh007](https://github.com/saihitesh007))
- **Track**: Productivity / Open Innovation

For detailed architecture diagrams, sensor fusion matrix, and mobile system design, refer to [Rawstxck_iQOO_Hackathon_PRD.md](./Rawstxck_iQOO_Hackathon_PRD.md).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — feel free to explore, innovate, and build proactive AI experiences.
