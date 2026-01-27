
# THE LINUX CORE PARADIGM
## Architectural Roadmap for Ubiquity

**Status:** DOCTRINE
**Inspiration:** The Linux Kernel
**Goal:** To achieve community trust through absolute transparency, modularity, and stability.

---

### 1. THE GOLDEN RULE ("Don't Break Userspace")
**Linux Principle:** Even if the internal code changes completely, the interface for the user (syscalls) must remain constant. Stability is King.
**Project Application:**
*   **Backward Compatibility:** If a User saves a config, it MUST work in version 2.0, 3.0, and 10.0.
*   **Non-Volatile Decisions:** The AI/Core must never automatically change a working strategy unless explicitly authorized or if the strategy is proven dead (0% packets).
*   **The "Safe Mode":** Just as Linux boots into Safe Mode/Recovery, our Core must always have a fallback "Direct Connection" mode that works without magic.

### 2. HARDWARE ABSTRACTION LAYER (HAL)
**Linux Principle:** The Kernel does not know it is running on an Intel CPU. It speaks to the HAL.
**Project Application:**
The Core (`src/core`) must be decoupled from the Execution Environment.

*   **Current State:** Tightly coupled to Browser/Electron APIs.
*   **Target State:** The Core issues abstract intents: `SplitPacket(offset=3)`.
    *   *Adapter A (Browser):* Ignores (Sandbox limitation).
    *   *Adapter B (Electron):* Executes `ciadpi.exe`.
    *   *Adapter C (Android):* Calls VpnService.
    *   *Adapter D (Router):* Writes `iptables` rules.

**Result:** One Core code base runs on Routers, Phones, and PCs. This creates Ubiquity.

### 3. THE "DRIVER" MODEL (Community Contribution)
**Linux Principle:** Linus doesn't write drivers for every webcam. The Community does.
**Project Application:**
The Core must support **Dynamic Knowledge Injection**.
*   **Kernel Space (The Architect):** The logic engines (`decide.ts`, `probe.ts`). Immutable by users.
*   **User Space (The Community):** The data files (`strategies.json`, `whitelist.json`).
*   **Mechanism:** Users can load external "Strategy Packs" (Drivers) via the UI.
    *   *Example:* A user creates a "Beeline-Fix-2025.json" driver.
    *   *Action:* Other users import this JSON. The Core validates it and uses it.
    *   *Result:* The app evolves faster than the Architect can write code.

### 4. TRANSPARENCY & DEBUGGING (dmesg)
**Linux Principle:** "Given enough eyeballs, all bugs are shallow." Linux logs everything.
**Project Application:**
*   **Verbose Decision Log:** The Core must output a structured log of its thinking process.
    *   *Input:* "Packet blocked."
    *   *Reasoning:* "Detected RST flag. Assuming DPI."
    *   *Action:* "Loading Fragmentation Module."
*   **Visualizer:** The UI must visualize this log (like `htop` for network packets). This turns every user into a debugger/contributor.

---

### EXECUTION PLAN (To become "The Linux of DPI")

1.  **Decouple:** Move `src/core` into a standalone package/repo without React dependencies.
2.  **Interface:** Define the `NetworkDriver` interface.
3.  **Logs:** Implement `CoreLogger` (dmesg-style).
4.  **Distribution:** Allow users to import external "Strategy Packs" (Distros).

*Approved by The Forge.*
