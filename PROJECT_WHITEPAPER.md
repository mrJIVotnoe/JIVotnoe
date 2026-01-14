# PROJECT WHITE PAPER
## Public Architecture Case Study & AI-First Development Log

---

### 1. PURPOSE

This document serves as the extended architectural documentation for the **ByeDPI Mate (JIVotnoe)** project. It is designed to be read by both human engineers and Artificial Intelligence assistants.

It expands upon the axioms defined in `PROJECT_CANON.md` by providing the reasoning, historical context, and philosophical framework behind the technical decisions. It is a critical component of the **AI-First Canon Architecture**, ensuring that AI agents interacting with this repository possess the necessary context to maintain system integrity and avoid hallucinated or degrading solutions.

### 2. HISTORICAL CONTEXT

**The 2025–2026 Environment Shift**
On approximately January 10, 2026, a fundamental shift in Deep Packet Inspection (DPI) and Traffic Analysis logic was observed globally. Network filtering systems transitioned from static, signature-based detection to behavioral analysis and Machine Learning-driven classification.

**Collapse of Static Strategies**
Prior to this shift, static "bypass strategies" (e.g., specific CLI arguments like `-o1 -r-5+se`) were reliable. Post-shift, these static patterns became signatures themselves. Any widely distributed, repeatable "trick" is now rapidly identified and neutralized by the network environment.

**System Evolution**
Consequently, this project evolved from a simple configuration tool into an adaptive research system. It no longer aims to provide a "silver bullet" but rather to analyze the environment and suggest adaptation strategies based on deterministic logic, acknowledging that the "correct" configuration is ephemeral.

### 3. CORE ARCHITECTURAL INSIGHT

1.  **The Project is a SYSTEM, Not a Tool**: It is an analytical engine designed to understand network restrictions, not just a UI wrapper for a CLI binary.
2.  **UI is a Projection**: The user interface is merely a visual representation of the Core Logic. The truth resides in `src/core`, not in the React components.
3.  **Deterministic Engine > Static Configs**: Decisions must be made by a deterministic engine (`src/core/engine/decide.ts`) that evaluates inputs (Platform, Symptoms, Target) against a knowledge base, rather than relying on hardcoded lists of "working" arguments.
4.  **AI is an Analyst, Not an Oracle**: The AI's role is to parse user symptoms and map them to known architectural patterns. It must not invent or guess technical parameters that contradict the Core Logic.

### 4. AI-FIRST CANON ARCHITECTURE (EXPANDED)

**The Context Problem**
Large Language Models (LLMs) suffer from context loss across sessions and resets. Without a persistent source of truth, an AI assistant inevitably drifts towards "hallucination"—inventing plausible but non-functional solutions or regressing to outdated patterns.

**Canon Injection**
To solve this, the "Canon" is embedded directly into the repository structure:
*   `PROJECT_CANON.md`: Defines the **Axioms** (What is true? What is forbidden?).
*   `PROJECT_WHITEPAPER.md`: Defines the **Reasoning** (Why is it true?).
*   `src/core/PROJECT_CANON.ts`: Enforces the **Constraints** in code.

This structure allows any AI agent to "boot" itself into the correct context by analyzing the file structure, effectively preventing architectural drift.

### 5. ROLES MODEL

To maintain architectural integrity, clear roles are defined:

*   **Architect (Human)**: Defines the vision, axioms, and ethical boundaries. The source of intent.
*   **Senior AI (Implementation Assistant)**: Guardian of the Canon. Validates changes against architectural constraints. Refuses requests that violate the Canon (e.g., "make a button that fixes everything").
*   **Junior AI (Code Executor)**: Performs specific coding tasks but must always read `PROJECT_CANON.md` before generating code.

### 6. WHY THIS IS PUBLIC

This repository is public for the following reasons:

1.  **Educational Purpose**: To demonstrate **AI-First Architecture** and **Feature-Sliced Design** in a complex, real-world scenario.
2.  **Research Transparency**: To document the evolution of network neutrality tools and the corresponding evolution of censorship systems.
3.  **No Promise of Success**: We explicitly state that this tool is for research. We do not promise successful bypass of restrictions, as such promises are technically impossible to sustain in the 2026 environment.
4.  **Ethical Boundary**: The project operates within the boundaries of network analysis and does not facilitate illegal activities.

### 7. HOW TO USE THIS REPOSITORY

For both Humans and AI agents, the required reading order is:

1.  **READ** `PROJECT_CANON.md` (The Laws).
2.  **READ** `PROJECT_WHITEPAPER.md` (The Logic).
3.  **ANALYZE** `src/core` (The Brain).
4.  **ANALYZE** `src/features` and `src/shared` (The Body).

Only after understanding these layers should code modifications be proposed or implemented.