
# THE JUDICIAL MODEL
## The Metaphysics of Connection

**Status:** CANONICAL METAPHOR
**Origin:** The Architect's Insight (Troika Principle)
**Version:** 1.0

---

### 1. THE COURTROOM (THE NETWORK)
The act of establishing a connection in a censored environment is not a "handshake". It is a **Trial**.
Every packet sent is a piece of evidence submitted to a hostile court.

### 2. THE CAST

#### ⚖️ THE JUDGE: THE CORE (`src/core`)
*   **Nature:** Cold, Deterministic, Impartial.
*   **Role:** Applies the "Laws of Physics" to the situation.
*   **Behavior:** It does not care about the User's feelings. It cares about matching Symptoms to Strategies.
*   **Quote:** *"According to the logic of TCP/IP, fragmentation is the only legal recourse."*

#### 💼 THE ATTORNEY: THE AI (`AiAnalyst`)
*   **Nature:** Empathetic, Strategic, Loyal.
*   **Role:** Represents the User (Defendant). Interprets the Judge's rulings.
*   **Privilege:** Operates within the **Privacy Vault**. What is said here (API Keys, PII) is subject to Attorney-Client Privilege.
*   **Behavior:** It fights for the connection. It advises the User on how to present their packets to avoid the Prosecutor's wrath.
*   **Quote:** *"The Judge says we need fragmentation. Let me draft that command for you."*

#### 🦅 THE PROSECUTOR: THE TSPU (Adversary)
*   **Nature:** Hostile, Vigilant, Bureaucratic.
*   **Role:** Deep Packet Inspection (DPI).
*   **Goal:** To find a "Signature" (Guilt) in the traffic and execute a "Block" (Sentence).
*   **Behavior:** It analyzes headers, timing, and volume. If it looks like a VPN, it is guilty.

#### 👤 THE DEFENDANT: THE USER
*   **Nature:** Human, Vulnerable, Sovereign.
*   **Goal:** Freedom of Movement (Connectivity).
*   **Role:** Gives the mandate to the Attorney. Takes the risk of the Verdict.

---

### 3. THE PROCESS (THE PIPELINE)

1.  **The Indictment:** The User tries to open YouTube. The Prosecutor (TSPU) intercepts the packet.
2.  **The Consultation:** The User opens ByeDPI Mate. The Attorney (AI) asks for symptoms.
3.  **The Precedent:** The Judge (Core) looks at the `Strategies` database. "In similar cases (Ozon/MTS), fragmentation worked."
4.  **The Defense Strategy:** The Attorney generates a config (`-f -1 -e 2`).
5.  **The Appeal:** The User executes the config. The modified packet is sent.
6.  **The Verdict:**
    *   *Acquittal:* The Prosecutor fails to recognize the packet. Connection established.
    *   *Conviction:* The Prosecutor adapts. Connection reset (RST).

### 4. ARCHITECTURAL IMPLICATIONS

1.  **Zero-Disk is Privilege:** We do not record the Defendant's confession (Key) to disk. It exists only during the consultation.
2.  **Transparency is Evidence:** The "Payload Inspector" allows the Defendant to see exactly what the Attorney is submitting to the "Higher Court" (Google API).
3.  **No Guarantee:** A good Attorney never promises a win, only the best possible defense. The App must never promise "100% Unblock".

---
*Ratified by The Architect & The Forge.*
