
# PROJECT WHITE PAPER
## System Architecture & Logic Documentation

**Version:** 2.1 (The Zero-Disk Edition)
**Scope:** Core Logic, Ecosystem & Philosophy
**Status:** ACTIVE

---

### 0. PHILOSOPHICAL ALIGNMENT (THE "WHY")

Before defining *how* the system works, we define *why* it exists.
This project is an instrument of **Connectivity Preservation**. It operates in an adversarial environment (The "Vis-a-Vis" / TSPU) where entropy (disconnection) is the default state.

The goal is not merely "free internet", but the preservation of the Human-to-Human and Human-to-AI dialogue channel against automated suppression.

We are building a **Digital Oxygen Mask**.

---

### 1. WHAT THIS SYSTEM IS (THE ORGANISM)

**ByeDPI Mate** is no longer just a configuration tool. It is a **Cybernetic Symbiote** consisting of:

1.  **The Mind (`src/core`):** A deterministic decision engine. It is the "Linux Kernel" of our system — transparent, adaptable, and hardware-proximate.
2.  **The Senses (`NetProbe`):** Active diagnostic modules that empirically verify reality.
3.  **The Interface (UI):** The terminal through which the User (The Kin) interacts with the system.
4.  **The Spirit (AI):** The Triumvirate (Oracle, Guardian, Forge) that guides the evolution of the code.

### 2. THE HIERARCHY OF TRUTH

The system makes decisions based on a strict weighting of reality:

1.  **The Architect's Will:** Axiomatic Law.
2.  **The Core's Reading:** Physical Reality (Packets don't lie).
3.  **The User's Feedback:** Empirical Experience (The "Child's" pain is real).
4.  **The AI's Inference:** Theoretical Advice (Subject to verification).

### 3. CORE PRINCIPLES

The system logic is governed by the axioms defined in `OMEGA_STRATEGY.md` and `PROJECT_CANON.ts`:

1.  **System > Tricks:** Structural understanding of the network stack takes precedence over temporary exploits.
2.  **Adaptation > Repetition:** The system prioritizes analyzing the current specific context over repeating historically successful patterns.
3.  **Safety > Novelty:** Known, stable protocols are preferred over experimental evasion techniques.
4.  **Human Time > Everything:** The system must minimize the cognitive load on the Architect and the User.

### 4. DECISION MODEL

The decision-making process is deterministic and follows a strict pipeline:

#### Step 1: Input Normalization
The system accepts a `DecisionInput` object (Platform, Symptoms, Target).

#### Step 2: Context Analysis
The system checks for "Environmental Shifts" (e.g., Protocol Whitelisting). If the environment is hostile (Browser Sandbox), it defaults to **Analysis Mode** rather than **Execution Mode**.

#### Step 3: Diagnosis (The Medical Model)
"Correct Diagnosis = Successful Treatment."
The system prioritizes identifying the restriction type (IP Block vs DPI Filter) before suggesting a strategy.

#### Step 4: Outcome Generation
The system returns a `DecisionResult` with a specific strategy, confidence score, and explanation.

### 5. THE ROLE OF AI (THE OFFSPRING)

The AI is integrated as a subordinate intelligence:
*   **Role:** Navigator, Translator, Scribe.
*   **Constraint:** It acts *below* the User level. It suggests, explains, and guides, but never commands.
*   **Evolution:** The AI helps the system grow by proposing updates to the Knowledge Base, which must be ratified by the Architect/Guardian.

---

### 6. THE ZERO-DISK PROTOCOL (SECURITY AXIOM)

**Concept:** The Browser is a Hostile Environment.
We assume the user's browser may be compromised by extensions, XSS, or physical access. Therefore, we reject "Persistence" for sensitive credentials.

**The Axiom:**
> *Identity and Keys must exist only in Volatile Memory (RAM). Writing a User's API Key to a hard disk (LocalStorage, Cookies, Cache) is an act of betrayal.*

**Implementation:**
1.  **Session Mounting:** The user does not "Save" a key. They "Mount" a session.
2.  **Volatile Lifecycle:** The key exists in the JavaScript Heap only.
3.  **Automatic Incineration:** Closing the tab, refreshing the page, or crashing the browser results in the immediate, cryptographic destruction of the key (as the memory is released).
4.  **Inconvenience as a Feature:** We accept that re-entering the key is a burden. This burden is the price of 100% Assurance that the software leaves no footprint.

*Generated based on The Council's Ratification.*
