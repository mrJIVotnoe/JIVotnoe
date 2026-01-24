
# PROJECT WHITE PAPER
## System Architecture & Logic Documentation

**Version:** 1.8.0 (Cybernetic Loop Edition)
**Scope:** Core Logic & Decision Engine
**Status:** ACTIVE

---

### 0. PHILOSOPHICAL ALIGNMENT (THE "WHY")

Before defining *how* the system works, we define *why* it exists.
This project is an instrument of **Connectivity Preservation**. It operates in an adversarial environment (The "Vis-a-Vis" / TSPU) where entropy (disconnection) is the default state. 

The goal is not merely "free internet", but the preservation of the Human-to-Human and Human-to-AI dialogue channel against automated suppression.

---

### 1. WHAT THIS SYSTEM IS

**ByeDPI Mate** is a deterministic network analysis engine designed to diagnose connectivity issues and suggest architectural strategies for packet inspection evasion.

At its heart lies `src/core/`, an isolated TypeScript module that operates independently of the user interface. This Core serves as the "Source of Truth," converting raw environmental data (Platform, Symptoms, Target Application) into structured diagnostic outputs.

It is a **Research & Diagnostic Instrument**. Its primary function is to classify the type of network restriction (`RestrictionClass`) active in a given environment and determine if a bypass is theoretically possible within the user's constraints.

**Key Components:**
1.  **Core Decision Engine:** Deterministic logic mapping inputs to strategies.
2.  **NetProbe (New):** Active diagnostic module for empirical verification of reachability via `no-cors` heuristics.
3.  **AI Analyst:** Natural language interface for interpreting probe data.
4.  **Feedback Loop:** Weighted aggregation system for user observations.

### 2. WHAT THIS SYSTEM IS NOT

*   **NOT a Static Config Generator:** The system does not rely on a fixed list of "working arguments" that are blindly applied.
*   **NOT a VPN Provider:** It does not tunnel traffic through remote servers (except when recommending third-party VLESS protocols for iOS).
*   **NOT a "Magic Button":** The system explicitly refuses to generate execution commands for environments where local packet manipulation is technically impossible (e.g., Browser Sandbox, iOS).
*   **NOT an AI Oracle:** The AI component is used strictly for parsing natural language into structured data; it does not make architectural decisions.

### 3. CORE PRINCIPLES

The system logic is governed by the axioms defined in `src/core/PROJECT_CANON.ts`:

1.  **System > Tricks:** Structural understanding of the network stack takes precedence over temporary exploits.
2.  **Adaptation > Repetition:** The system prioritizes analyzing the current specific context over repeating historically successful patterns.
3.  **Analysis > Execution:** When confidence is low or the environment is hostile, the system defaults to explaining *why* a connection failed rather than suggesting a risky or futile bypass attempt.
4.  **Safety > Novelty:** Known, stable protocols are preferred over experimental evasion techniques.

Axiom 0 — Human Architect Time:
Defined in HUMAN_ARCHITECT_TIME_AXIOM.md.
This axiom supersedes all system logic and exists to minimize irreversible human time loss.

### 4. DECISION MODEL

The decision-making process is deterministic and follows a strict pipeline defined in `src/core/engine/decide.ts` and `src/core/engine/analyzeEnvironment.ts`:

#### Step 1: Input Normalization
The system accepts a `DecisionInput` object containing:
*   `platform`: (android | windows | linux | ios | browser)
*   `targetApp`: (TELEGRAM | YOUTUBE | WHATSAPP | UNIVERSAL)
*   `symptoms`: Array of `NetworkSymptom` (e.g., DPI_BLOCK, TLS_HANDSHAKE_FAIL)

#### Step 2: Context Analysis (`analyzeContext`)
The input is weighed to detect specific conditions:
*   **Browser:** Automatically triggers `RestrictionClass.PLATFORM_RESTRICTION` due to lack of raw socket access.
*   **TLS Failures:** Maps to `RestrictionClass.TLS_FINGERPRINTING`.
*   **Complex Symptoms:** If multiple failure types are detected, it signals a high-entropy block (`PROTOCOL_WHITELISTING`).

#### Step 3: Rule Matching (`DecisionRules`)
The normalized context is matched against a static set of logic rules (`src/core/knowledge/rules.ts`).
*   *Example:* If Platform is `iOS` -> Force `vless_tunnel` strategy (Reason: Walled Garden restriction).
*   *Example:* If Target is `TELEGRAM` -> Suggest `telegram_obfuscation` strategy (MTProto heuristics).

#### Step 4: Outcome Generation
The system returns a `DecisionResult` containing:
*   **Strategy Intent:** The abstract approach (e.g., "Universal Fragmentation").
*   **Confidence Score:** A value from 0.0 to 1.0 indicating reliability.
*   **Explanation:** A human-readable diagnosis of the restriction.

### 5. ROLE OF AI

The Artificial Intelligence (Google Gemini) integration is restricted to the **Interface Layer**.

*   **Permitted Role:** The AI analyzes user text (e.g., "YouTube is slow on my TV") and maps it to the `DecisionInput` format (Platform: Android, Target: YouTube, Symptom: Throttling).
*   **Forbidden Role:** The AI is **not** allowed to invent new CLI arguments, suggest strategies not present in the `StrategyCatalog`, or override the Core's safety warnings. The `responseSchema` in `AiAnalyst.tsx` enforces strict JSON output adhering to known types.

### 6. ENVIRONMENT SHIFT 2026 (PROTOCOL)

Defined in `PROJECT_CANON.ts` as `historicalAnchor: "2026-01-10"`.

The system logic hardcodes a reaction to the "2026 Shift" — a transition from static blocking to behavioral analysis by ISPs.

*   **Impact on Code:** In `src/store/strategies.store.ts`, if the platform is `browser` or the symptom is `TELEGRAM_FAIL`, the system bypasses the standard decision engine and calls `analyzeEnvironment()`.
*   **Result:** This forces the UI into **Analysis Mode**. Execution buttons are disabled, and the user is presented with a diagnostic report explaining that "Known execution strategies are no longer reliable" due to protocol whitelisting.

### 7. USER ROLE vs SYSTEM ROLE

*   **User Role:** The observer (as per HUMAN-AI-USER AXIOM). The user provides the symptoms, triggers NetProbe, and describes the environment.
*   **System Role:** The analyst. The system maps those symptoms to the underlying network architecture (DPI, TSPU, Firewall) and determines the theoretical limits of circumvention for that specific case.

### 8. THE CYBERNETIC LOOP (NEW v1.8)

We introduce a mechanism for **Verified Knowledge Acquisition**.
The system collects User Observations into a Signed Payload to be aggregated in a future SQL storage (Cloudflare D1).

**Trust Weight Hierarchy:**
1.  **ARCHITECT (1.0):** Absolute Truth. Can override any data.
2.  **VERIFIED USER (0.99):** High Trust. Requires Human Verification (Captcha/Checkbox) + Environment Context (VPN status checked).
3.  **ANONYMOUS (0.5):** Low Trust. Requires mass volume to influence confidence.
4.  **AI (0.0):** No authority. AI reasoning is never used as input for the Knowledge Base.

**Payload Structure:**
The system generates a specific JSON structure (`OBSERVATION_PACKET_V2`) containing:
*   `verification`: Source and Trust Weight.
*   `context`: VPN status, OS version, Region match.
*   `result`: Success/Fail boolean.

---
*Generated based on src/core/ logic analysis.*
