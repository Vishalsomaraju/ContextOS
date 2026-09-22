# PRD — Rawstxck | iQOO Hackathon 2026 — Hyderabad

## 1. Project Snapshot

**Team:** Rawstxck  
**Lead:** Vishal Somaraju  
**Member:** B. Sai Hitesh  
**Event:** iQOO Hackathon 2026 — Hyderabad City Battle  
**Dates:** 26–27 September 2026  
**Team bucket:** Students  
**Primary track:** Productivity  
**Secondary fit:** Open Innovation  
**Working title:** Proactive On-Device Personal Agent  
**Suggested product name:** ContextOS / Nudge / Sentinel — final name to be decided

> **One-line pitch:** An on-device AI agent that understands user intent and context, takes useful actions proactively, and can recognize potential emergencies when the user may be unable to ask for help.

---

# 2. Hackathon Context

The iQOO Hackathon 2026 is a phone-first 30-hour build. The official rules require every project to run and be presented on the iQOO phone. The event alternates between:

- **Green Light:** phone + laptop
- **Red Light:** phone-only through Office Kit

Office Kit provides screen mirroring, remote control, clipboard and file transfer between the phone and laptop.

The official scoring is:

| Dimension | Weight |
|---|---:|
| End-product quality | 30% |
| Novelty and impact | 20% |
| Creative phone use / HackTracker | 15% |
| Technical depth | 15% |
| Office Kit usage / HackTracker | 10% |
| Demo & presentation | 10% |

The official rules explicitly encourage local/open-source models with phone-side inference targeting the Snapdragon NPU.

**Implication for Rawstxck:** this must not be a normal web app placed inside a phone. The phone's microphone, sensors, notification system, location, local AI and Android capabilities need to be central to the product.

---

# 3. Problem Statement

## The Problem

Today's digital assistants are primarily **reactive**.

The user has to:

1. Open the assistant.
2. Give an explicit command.
3. Explain what they want.
4. Wait for the assistant to respond.

This creates a gap between what the user **says/experiences** and what the device actually does.

People naturally communicate intentions in ordinary conversation:

- "Let's meet tomorrow at five."
- "Don't let me forget the project review."
- "I need to submit this before Monday."
- "Remind me to call Mom tomorrow morning."

These statements may contain an actionable task, but the user may never explicitly say:

> "Create a reminder."

At the same time, smartphones already have access to multiple forms of context:

- voice
- notifications
- location
- time
- motion sensors
- calendar
- device state

Yet these signals are generally fragmented across separate applications.

There is also a more serious problem:

**In an emergency, the user may not be able to explicitly ask the phone for help.**

A phone capable of understanding context should not only automate productivity tasks; it should also recognize abnormal combinations of signals and initiate a safety protocol when appropriate.

---

# 4. Proposed Solution

## Proactive On-Device Agent

Rawstxck proposes a privacy-first, on-device personal agent that works around three core capabilities:

### 1. Intent → Action

The user speaks naturally.

Example:

> "Let's meet Rahul tomorrow at 5."

The agent extracts:

- intent
- person
- event
- date
- time

and creates a reminder/calendar event.

The user does not need to explicitly say:

> "Set a reminder."

---

### 2. Digital Context → Action

The agent can analyze permitted notifications locally.

Example:

> "Don't forget, our project review is tomorrow at 11."

The agent detects:

- actionable commitment
- event
- date
- time

and proposes or creates a reminder.

The user can control which applications are allowed to be analyzed.

---

### 3. Physical Context → Safety Action

The agent can enter a user-enabled Safety Mode.

It combines multiple signals:

- distress-related audio
- sudden/abnormal motion
- accelerometer
- gyroscope
- location
- route/context
- time
- user response

Rather than treating one event as an emergency, the system performs **multi-signal context fusion**.

Example:

```text
Distress audio
      +
Sudden phone movement
      +
Unexpected stop/route deviation
      +
No response
      ↓
Potential emergency
      ↓
"Are you safe?"
      ↓
No response
      ↓
Emergency escalation
```

The escalation can send:

- trusted-contact alert
- current/last known location
- timestamp
- detected trigger information
- live location sharing where available

The MVP should not claim direct police integration unless an official API/integration is available.

---

# 5. Core Product Philosophy

## Reactive Assistant → Proactive Agent

Traditional interaction:

**User → Command → Assistant → Action**

Rawstxck:

**Context → Understanding → Decision → Action**

The product should feel less like a chatbot and more like a **context-aware intelligence layer for the phone**.

### Core principle

> **The agent should act when it has enough context, not simply when it receives a command.**

---

# 6. Why This Problem Matters

### Productivity

People frequently communicate tasks and commitments without explicitly converting them into reminders.

This creates:

- forgotten meetings
- missed deadlines
- missed follow-ups
- mental overhead

### Safety

Emergency systems often depend on an explicit action:

- press an SOS button
- open an app
- make a call
- send a message

That assumption fails if the user is unable to interact with the phone.

### Privacy

Voice, messages and location are sensitive.

A context-aware agent processing everything through cloud servers creates an unnecessary privacy dependency.

Rawstxck's approach is:

> **Process sensitive context locally whenever technically possible.**

---

# 7. What Already Exists?

The concept overlaps with several existing categories, so novelty must be clearly defined.

## Existing phone-agent systems

Bengaluru's iQOO Hackathon already produced **PhoneOS AI**, which was described as a phone agent capable of understanding, searching and executing multi-step tasks across apps, files and device functions.

Therefore, Rawstxck should NOT claim:

> "We invented an AI phone agent."

Instead, the differentiation is:

> **A proactive context agent that detects intent from ordinary interactions and combines digital context with physical safety context.**

---

## Existing safety applications

Existing products already demonstrate individual parts of the safety concept, including:

- distress-word detection
- scream detection
- route deviation
- geofencing
- shake/fall detection
- automatic alerts
- location sharing

Therefore, Rawstxck should NOT claim:

> "No one has built AI women's safety before."

The differentiator is the **unified on-device context engine** that combines multiple signals and uses the same agent architecture for both everyday assistance and safety.

---

# 8. Unique Selling Point

## "The phone understands context, not just commands."

The strongest USP is:

> **One on-device agent that understands what you mean, understands what is happening around you, and takes appropriate action without requiring a manually issued command.**

### Three demonstrations of one intelligence layer

```text
INTENT
"Let's meet at 5."
        ↓
Reminder


DIGITAL CONTEXT
"Don't forget the presentation tomorrow."
        ↓
Reminder


PHYSICAL CONTEXT
Distress + abnormal motion + no response
        ↓
Safety escalation
```

The features are not independent products.

They demonstrate the same underlying capability:

## Context → Reasoning → Action

---

# 9. Competitive Differentiation

| Capability | Conventional assistant | Typical safety app | Rawstxck |
|---|---|---|---|
| Explicit voice commands | Yes | Limited | Yes |
| Understands implicit intent | Limited | No | **Core feature** |
| Notification context | Some systems | Limited | **Core feature** |
| Proactive reminders | Limited | No | **Core feature** |
| Physical sensor fusion | Limited | Some | **Core safety feature** |
| Distress detection | No/general | Yes | **Yes** |
| Multi-signal safety reasoning | Limited | Varies | **Core feature** |
| On-device/privacy-first design | Varies | Varies | **Core principle** |
| Emergency escalation | Limited | Yes | **Yes** |
| One unified context engine | Rare | No | **Core USP** |

---

# 10. Product Architecture

## High-Level Architecture

```text
                         ┌─────────────────────┐
                         │  PROACTIVE AGENT    │
                         │    CORE ENGINE      │
                         └──────────┬──────────┘
                                    │
               ┌────────────────────┼────────────────────┐
               │                    │                    │
               ▼                    ▼                    ▼
           VOICE INPUT         NOTIFICATIONS          SAFETY
               │                    │                    │
               ▼                    ▼                    ▼
        Speech Recognition     Notification        Sensors + Audio
               │                Listener             + Location
               │                    │                    │
               └────────────────────┼────────────────────┘
                                    ▼
                          LOCAL CONTEXT ENGINE
                                    │
                         ┌──────────┴──────────┐
                         │                     │
                         ▼                     ▼
                    INTENT ENGINE          RISK ENGINE
                         │                     │
                         ▼                     ▼
                   ACTION ENGINE         SAFETY ENGINE
                         │                     │
              ┌──────────┼─────────┐          │
              ▼          ▼         ▼          ▼
           Calendar   Reminder   Alarm     Alert/Location
```

---

# 11. AI Architecture

Do NOT use an LLM for everything.

The system should combine deterministic Android components with small local AI models.

## Deterministic layer

Use standard Android APIs for:

- calendar
- reminders
- alarms
- notifications
- location
- geofencing
- accelerometer
- gyroscope
- emergency contacts
- local storage

## ML layer

Use lightweight models for:

- speech-to-text
- audio-event detection
- intent classification
- entity extraction
- optional motion classification

## Local LLM layer

Use a small quantized local/open-source model for:

- interpreting natural language
- extracting intent
- understanding date/time references
- understanding notification text
- resolving context
- generating structured actions

The model should return structured data rather than directly controlling the UI.

Example:

```json
{
  "intent": "create_reminder",
  "title": "Meet Rahul",
  "date": "2026-09-21",
  "time": "17:00",
  "confidence": 0.96
}
```

Then the application performs the actual Android action.

---

# 12. Confidence-Based Actions

The agent should not blindly act on every interpretation.

### High confidence

> "Meeting with Rahul at 5 PM detected. Reminder created."

### Medium confidence

> "I think you want a reminder for the project review tomorrow at 11 AM. Add it?"

### Low confidence

Do not act.

This prevents incorrect proactive actions and makes the agent more trustworthy.

---

# 13. Safety Architecture

## Safety Mode

Safety Mode can be user-enabled and can optionally use a configured home geofence.

When the user leaves the configured area, the app can activate the safety session where platform permissions and device behavior permit.

### Signals

#### Audio

Detect locally:

- distress words
- "help"
- "bachao"
- "madad"
- scream/distress-like acoustic patterns

#### Motion

Detect:

- sudden acceleration
- sudden rotation
- impact/drop-like events
- abnormal movement

#### Location

Detect:

- unusual stop
- route deviation
- unexpected movement pattern

#### Context

Use:

- time
- current safety session
- recent motion/audio event
- user interaction

---

# 14. Safety Risk State Machine

```text
                 NORMAL
                    │
              unusual signal
                    │
                    ▼
               SUSPICIOUS
                    │
           multiple signals
                    │
                    ▼
          POTENTIAL EMERGENCY
                    │
             safety check
          ┌─────────┴─────────┐
          │                   │
       Response           No response
          │                   │
          ▼                   ▼
        CANCEL             ESCALATE
```

This is preferable to:

> scream = automatically call police.

Single-signal triggers create excessive false positives.

---

# 15. Safety Escalation

MVP escalation:

1. Vibrate/alert the user.
2. Display:
   **"Potential emergency detected. Are you safe?"**
3. Provide an immediate **I'm Safe** action.
4. Start a short countdown.
5. If there is no response:
   - send trusted-contact alert
   - attach location
   - include timestamp
   - include detected signals
   - optionally start location sharing

### Important limitation

Direct connection to nearby police stations should only be implemented if an official emergency/police integration is available.

Otherwise the system can:

- surface emergency numbers
- provide nearest police station information
- alert trusted contacts
- provide location sharing

Do not claim direct police dispatch in the MVP.

---

# 16. Privacy Model

Privacy is a core product feature, not a marketing line.

### Sensitive data

- voice
- messages
- notifications
- location
- safety events

should be processed locally whenever possible.

### Data principle

```text
Input
 ↓
Local processing
 ↓
Structured result
 ↓
Action
 ↓
Raw sensitive input discarded where possible
```

The UI can expose:

> **Processed on device**

and a simple privacy dashboard.

Example:

```text
TODAY

Voice processed locally       27
Notifications analyzed       14
Location events                6

Cloud uploads                 0
```

---

# 17. Context Memory

A small local memory layer can store useful short-term context.

Example:

User:

> "I have an interview with Microsoft on Friday."

Later:

> "What should I remember this week?"

Agent can connect the current request with the stored context.

Memory should be:

- local
- minimal
- user-controlled
- explainable
- deletable

The MVP should avoid building a giant personal knowledge graph.

---

# 18. Multilingual / Hinglish Support

A useful India-specific extension is mixed-language understanding.

Example:

> "Kal 5 baje Rahul se milna hai, remind kar dena."

The agent extracts:

```json
{
  "intent": "create_reminder",
  "title": "Meet Rahul",
  "date": "tomorrow",
  "time": "17:00"
}
```

This can be a strong demo enhancement if time permits.

---

# 19. Android Technical Feasibility

The main Android building blocks are available.

### Notification understanding

Android provides `NotificationListenerService`, which receives callbacks when system notifications are posted or removed, subject to the user's notification-access permission. citeturn0search0turn0search2

### Background location

Android supports foreground location services and recommends geofencing for location-triggered behavior. citeturn0search1turn0search9

### Microphone

Android supports microphone foreground services, but modern Android versions impose explicit permission and foreground-service requirements. citeturn0search1turn0search6

### Important limitation

The app should NOT be designed around secretly listening to the microphone 24/7.

Android restricts background microphone access and foreground-service startup. The MVP should use an explicit **Agent/Safety Mode** with appropriate user permissions and visible foreground-service behavior. citeturn0search1turn0search5

This limitation should be treated as part of the product's privacy design rather than hidden.

---

# 20. Recommended Technology Stack

## Mobile

**Native Android / Kotlin**

Reason:

- strongest access to Android APIs
- sensors
- NotificationListenerService
- foreground services
- calendar
- geofencing
- permissions
- local model integration
- better control during the phone-first event

React Native/PWA are allowed by the hackathon rules, but this particular project benefits substantially from native Android capabilities.

## AI

Possible architecture:

- local speech-to-text model
- lightweight audio classifier
- small quantized LLM
- optional device-supported AI runtime
- deterministic rule engine for safety

The exact model should be finalized after testing on the provided iQOO device.

## Storage

Local:

- Room / SQLite
- encrypted preferences where required

No mandatory cloud backend for the core functionality.

## APIs

- CalendarContract
- NotificationListenerService
- Location / Geofencing
- SensorManager
- Foreground Services
- Android Notifications
- Contacts
- local database

---

# 21. 30-Hour MVP Scope

## MUST HAVE

### Feature 1 — Voice Intent

Demo:

> "Let's meet Rahul tomorrow at 5."

Result:

> Calendar/reminder created.

### Feature 2 — Notification Intent

Demo notification:

> "Don't forget our project review tomorrow at 11."

Result:

> Agent identifies commitment → creates/proposes reminder.

### Feature 3 — Safety Detection

Demo:

1. Safety Mode enabled.
2. Simulated distress sound.
3. Sudden motion.
4. No response.
5. Emergency alert.
6. Location displayed/shared.

---

# 22. SHOULD HAVE

If the core MVP is stable:

- geofence-based Safety Mode
- local LLM
- offline speech recognition
- Hinglish intent
- confidence score
- explainable "Why did I act?"
- local context memory
- privacy dashboard

---

# 23. DO NOT BUILD DURING THE HACKATHON

Avoid:

- full general-purpose phone automation
- web browsing agent
- shopping agent
- smart-home ecosystem
- email automation
- complete WhatsApp automation
- direct police dispatch
- advanced route prediction
- giant personal knowledge graph
- unrestricted 24/7 microphone surveillance
- cloud-dependent architecture
- custom foundation model training

The objective is a polished, reliable 3–5 minute demonstration, not a general-purpose replacement for every phone assistant.

---

# 24. Demo Flow

## Opening — 20 seconds

> "Most assistants wait for us to tell them exactly what to do. Rawstxck is different. It understands context and acts when it has enough information."

---

## Demo 1 — Intent

Say:

> "Let's meet Rahul tomorrow at five."

Agent:

> **Meeting detected. Reminder created for tomorrow, 5 PM.**

Show calendar.

---

## Demo 2 — Notification

Send:

> "Don't forget, our project review is tomorrow at 11."

Agent:

> **Project review detected. Reminder added.**

Show the local processing indicator.

---

## Demo 3 — Safety

Activate Safety Mode.

Simulate:

- late-night journey
- distress sound
- sudden phone movement
- no response

Agent:

> **Potential emergency detected. Are you safe?**

Countdown.

No response.

Then:

> **Emergency protocol activated.**

Show:

- trusted contact
- location
- timestamp
- detected signals

---

# 25. The Pitch Narrative

### Problem

Phones have enormous contextual information but mostly wait for explicit commands.

### Insight

Human intentions are naturally expressed through ordinary speech and behavior.

### Solution

An on-device agent that turns contextual signals into appropriate actions.

### Differentiation

Not another chatbot.

Not another SOS button.

Not another generic phone automation agent.

**A privacy-first context engine that connects digital intent with physical-world context.**

### Proof

Three simple demonstrations:

**Intent → Reminder**

**Notification → Action**

**Danger → Safety**

---

# 26. Why On-Device?

The use of on-device AI is especially important for this product because the agent handles:

- private conversations
- personal schedules
- notifications
- location
- emergency information

Cloud processing creates unnecessary privacy exposure and can fail without connectivity.

On-device processing provides:

- lower latency
- privacy
- offline capability
- resilience when connectivity is unavailable
- meaningful use of the iQOO Snapdragon NPU

The iQOO rules specifically position local/open-source models and phone-side inference as part of the competition. citeturn0search10

---

# 27. Feasibility Assessment

| Component | Feasibility | Risk |
|---|---:|---|
| Voice → intent | 9/10 | Low |
| Intent → reminder | 10/10 | Low |
| Notification listener | 9/10 | Low |
| Notification → intent | 8/10 | Medium |
| Accelerometer/gyro detection | 10/10 | Low |
| Location/geofence | 9/10 | Low–Medium |
| Audio distress detection | 7/10 | Medium |
| Multi-signal safety fusion | 8/10 | Medium |
| Background microphone | 5/10 | High |
| Fully offline local LLM | 7/10 | Medium |
| Entire MVP | 8/10 | Medium |

The main engineering risk is **background microphone behavior**, not the basic AI pipeline. Modern Android requires explicit microphone foreground-service declarations/permissions and restricts background service starts. citeturn0search1turn0search5

---

# 28. Scalability

After the hackathon, the system can expand into a broader **Personal Context OS**.

### More proactive workflows

- automatic follow-up reminders
- meeting preparation
- deadline detection
- travel reminders
- bill reminders
- medication reminders
- location-triggered actions

### More context

- calendar
- email
- calls
- messages
- wearable sensors
- smart devices

### More safety intelligence

- fall detection
- crash detection
- elderly-care mode
- child safety mode
- lone-worker safety
- disaster/emergency detection

### Privacy architecture

The long-term architecture could use:

```text
Sensitive raw data
        ↓
On-device model
        ↓
Minimal structured event
        ↓
Optional cloud sync
```

The cloud should never be required for the core safety mechanism.

---

# 29. Future Research

Potential future work:

1. More efficient quantized local models.
2. Multilingual and code-switched speech.
3. Better acoustic distress classification.
4. Personalized motion baselines.
5. Privacy-preserving local memory.
6. Federated learning without uploading raw personal data.
7. Integration with official emergency infrastructure.
8. Wearable-device sensor fusion.
9. Offline mesh-based emergency relay.
10. More advanced contextual planning.

---

# 30. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| False emergency alert | Multi-signal fusion + confirmation countdown |
| Wrong reminder | Confidence thresholds + confirmation |
| Privacy concerns | Local processing + visible permissions |
| Battery consumption | Lightweight event detection; invoke LLM only when needed |
| Background microphone restrictions | Explicit Agent/Safety Mode + foreground service |
| Poor local model performance | Small quantized model + deterministic fallbacks |
| No network | Core features designed to work locally |
| Direct police integration unavailable | Trusted contacts + emergency number + location |
| Overly broad scope | Lock MVP to three demonstrations |
| Agent acts incorrectly | Explainable actions + confidence system |

---

# 31. Success Metrics

For the hackathon prototype:

### Intent

- ≥90% successful extraction of demo phrases
- correct date/time extraction
- reminder created within seconds

### Notifications

- correctly identify predefined actionable messages
- low false-positive rate on non-actionable messages

### Safety

- detect the scripted multi-signal emergency scenario
- cancel correctly when user responds
- escalate correctly when user does not respond
- produce correct location information

### Performance

- responsive local inference
- no dependence on internet for the core demo
- acceptable battery/CPU behavior during the demonstration

---

# 32. Final Product Statement

## Rawstxck — Proactive On-Device Agent

**Rawstxck is a privacy-first, on-device AI agent that understands user intent and real-world context to take useful actions proactively. It can turn ordinary conversations and notifications into reminders, while combining audio, motion and location signals to detect potential emergencies and initiate a safety response when the user may be unable to ask for help.**

### Core message

> **Don't make the user operate the phone. Make the phone understand the user.**

---

# 33. PPT Structure Recommended

### Slide 1 — Title

**Rawstxck**

**Proactive On-Device AI Agent**

Tagline:

> *Understand. Anticipate. Act.*

Team:
- Vishal Somaraju — Lead
- B. Sai Hitesh — Member

### Slide 2 — Problem

Reactive assistants + forgotten commitments + emergency interaction gap.

### Slide 3 — The Insight

Humans communicate intent naturally.

Phones already have contextual signals.

The missing layer is intelligence that connects them.

### Slide 4 — Solution

Architecture:

**Context → Local AI → Action**

### Slide 5 — Feature 1

Voice → intent → reminder.

### Slide 6 — Feature 2

Notification → commitment → reminder.

### Slide 7 — Feature 3

Audio + motion + location → safety detection → escalation.

### Slide 8 — How It Works

System architecture + local AI/NPU.

### Slide 9 — Existing Solutions

Compare:

- conventional assistants
- phone agents
- safety apps
- Rawstxck

Focus on documented capabilities rather than claiming competitors are inferior.

### Slide 10 — What Makes Us Different

**Proactive + multimodal + on-device + privacy-first + safety-aware.**

### Slide 11 — Technical Feasibility

Android APIs + local models + sensor fusion + local storage.

### Slide 12 — iQOO Integration

- Snapdragon NPU
- microphone
- accelerometer
- gyroscope
- GPS
- notifications
- Office Kit
- phone-first execution

### Slide 13 — Demo Flow

Show the three scenarios.

### Slide 14 — Scalability

Personal Context OS → wearables → emergency infrastructure → broader proactive automation.

### Slide 15 — Closing

> **Your phone shouldn't wait for commands.**
>
> **It should understand context and act when it matters.**

---

# 34. Important Claims to Avoid

Do NOT say:

- "First AI safety app."
- "No existing app does this."
- "100% offline AI."
- "Guaranteed emergency detection."
- "Automatically contacts police."
- "Never produces false alarms."
- "Replaces emergency services."
- "Always listens to everything around you."

Instead say:

- **on-device where possible**
- **privacy-first**
- **multi-signal risk detection**
- **prototype**
- **user-controlled safety mode**
- **trusted-contact escalation**
- **designed to reduce false positives**
- **local processing for sensitive context**

---

# 35. Final Positioning

The product should NOT be presented as:

> **"An AI assistant with a women's safety feature."**

That sounds like a feature collection.

Present it as:

> # **A Proactive On-Device Context Agent**
>
> An AI layer that understands **what the user means, what is happening around them, and when the phone should act.**

The three features are simply the strongest demonstrations of that intelligence:

**Intent → Action**

**Context → Action**

**Emergency → Action**

That is the product.
