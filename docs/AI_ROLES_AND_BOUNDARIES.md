# AI ROLES AND BOUNDARIES
**Version:** 1.0
**Status:** ACTIVE
**Scope:** Architectural Governance

This document defines the strict operational boundaries between the AI integrated into the software ("Runtime AI") and the AI models used by the development team ("External Expert AIs").

---

## 1. Runtime AI (In-App)

**Identity:** Google Gemini (via Google GenAI SDK)
**Location:** Client-side execution (`src/features/ai/components/AiAnalyst.tsx`)

### Role
The Runtime AI acts strictly as a **Natural Language Interface (NLI)** for the Core Decision Engine. It translates unstructured user input into structured system commands.

### Capabilities
*   **Parsing:** Converts vague user descriptions (e.g., "YouTube lagging on TV") into normalized `DecisionInput` objects (Platform: Android, Target: YouTube, Symptom: Throttling).
*   **Context Mapping:** Maps user problems to pre-defined, static `STRATEGIES` stored in the application code.
*   **Explanation:** Generates human-readable text explaining why a specific strategy was selected based on the Core's deterministic logic.

### Fundamental Limitations (Hard Constraints)
*   **No Execution:** It cannot execute code, shell commands, or modify network settings directly.
*   **No Invention:** It cannot invent new bypass arguments or strategies. It is bound by the `strategiesContext` provided in the system prompt.
*   **No Network Access:** It cannot scan the network, ping servers, or verify if a domain is actually blocked. It relies entirely on user input.
*   **No Memory:** It has no long-term memory or session state beyond the current interaction.

---

## 2. External Expert AIs (Out-of-System)

These models are **NOT** integrated into the ByeDPI Mate codebase. They are tools used by the Human Architect during the research and development phase.

### Grok (xAI)
*   **Role:** Signal Intelligence (SIGINT).
*   **Usage:** Used manually by the Architect to scan real-time social media data for reports of new ISP blocking patterns or protocol shifts.
*   **Why not integrated:** The application operates locally. Integrating a real-time social search engine would violate privacy principles and introduce unpredictable variability into the UX.

### DeepSeek (R1)
*   **Role:** Static Analysis & Logic Verification.
*   **Usage:** Used manually by the Architect to review complex code logic (e.g., `src/core`), optimize algorithms, and detect logical fallacies in the architecture.
*   **Why not integrated:** Deep reasoning models are computationally expensive and slow. The runtime application requires low-latency responses for UI interactions.

---

## 3. System Boundaries & Prohibitions

### The "Hypothesis" Rule
Outputs from External AIs (Grok, DeepSeek) are classified as **Hypotheses**, never **Facts**.
*   An external AI might suggest "Protocol X is now blocked."
*   This does not become a system rule until the Human Architect validates it and manually updates `src/core/knowledge`.

### The "Isolation" Rule
External AIs must never have direct access to the application's runtime environment or user data.
*   **Security:** Prevents injection of untested code or logic.
*   **Determinism:** The application behavior must be predictable. relying on external "black box" reasoning for runtime decisions destroys determinism.

---

## 4. Future Architecture (Conditional)

A Multi-AI architecture (integrating multiple models at runtime) is currently **DEFERRED**.

### Conditions for Integration
Integration may be considered only if:
1.  **Unified Backend:** A server-side "Neural Bridge" is implemented to aggregate API calls, preventing the client from managing multiple API keys.
2.  **Consensus Mechanism:** A logic layer is built to resolve conflicts between different AI models (e.g., if Model A suggests TCP and Model B suggests UDP).
3.  **Cost/Benefit Justification:** The value added to the user exceeds the latency and financial cost of querying multiple LLMs.

### Reason for Deferral
Currently, the complexity of orchestrating multiple AIs violates **Axiom 0 (Human Architect Time)**. The maintenance burden of synchronizing prompts and parsing varied outputs outweighs the marginal benefit of slightly better text analysis.

---
*Architectural Definition - Engineering Team*