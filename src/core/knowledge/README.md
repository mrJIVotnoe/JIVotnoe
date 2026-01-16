# Core Knowledge Base 📚

This directory contains **Static Knowledge** about the network environment.

## ⚠️ Architectural Constraints

1.  **Informational Only:** The data here describes "What exists", not "What to do".
2.  **No Execution Logic:** Files in this directory must **NOT** contain functions that execute commands or change application state.
3.  **Advisory Role:** This data is used by the `Consultant` engine and `AiAnalyst` to provide context, warnings, and explanations to the user.

## Structure

*   `whitelist.ru.ts`: Observations about specific domains (Ozon, Gov services) and their trust levels.
*   `scenarios.ru.ts`: Explanations of *why* certain strategies exist, written for educational purposes.
*   `rules.ts` & `strategies.ts`: (Legacy) Mapping logic for the decision engine.
*   `scenario.db.ts`: Abstract definitions of evasion techniques (Fragmentation, disorder).

## Usage Rule

❌ **Forbidden:**
Importing `RU_WHITELIST_OBSERVATIONS` into `decide.ts` to automatically select a domain.

✅ **Allowed:**
Importing `RU_WHITELIST_OBSERVATIONS` into `analyzeEnvironment.ts` to explain why a user's connection to `gosuslugi.ru` might be failing (e.g., "Observation: Requires Direct Connection").

---
*Part of ByeDPI Mate Core Architecture*