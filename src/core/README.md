
# Core Layer 🧠

This directory contains the deterministic decision-making engine of ByeDPI Mate.

## Philosophy
- **Zero UI Dependency**: This code runs in CLI, Web, or Test environments.
- **Deterministic**: Same input = Same output. No AI hallucinations.
- **Abstract**: It returns *intent* (e.g., "Use Fragmentation"), not *implementation* (e.g., CLI flags).

## Architecture

### 1. Domain (`domain/`)
Pure TypeScript types and enums defining the problem space (Platform, Symptoms, Apps).

### 2. Knowledge (`knowledge/`)
Static data:
- `strategies.ts`: The catalog of available maneuvers.
- `rules.ts`: Logic tables mapping conditions to strategies.

### 3. Engine (`engine/`)
- `analyze.ts`: Converts raw input into normalized conditions.
- `decide.ts`: Matches conditions against rules.
- `explain.ts`: Formats the decision for humans.

## Usage

```typescript
import { Core, AppTarget, NetworkSymptom } from './core';

const decision = Core.decide({
  platform: 'android',
  targetApp: AppTarget.TELEGRAM,
  symptoms: [NetworkSymptom.CONNECTIVITY_LOSS]
});

console.log(decision.strategyId); // 'telegram_obfuscation'
console.log(Core.explain(decision, 'en')); 
```

## Extension
To add a new strategy:
1. Add descriptor to `knowledge/strategies.ts`
2. Add matching rule to `knowledge/rules.ts`
