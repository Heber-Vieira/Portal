# Implementation Plan - Refined Help System (N.I.C.)

## Goal
Replace `SupportModal`, `DocsModal`, and `SLAModal` with a single, high-performance, and visually stunning "Help Center" component named `HelpCenter`.

## 1. Architecture & Components
- **`HelpCenter.tsx`**: The main orchestrator.
- **`SearchModule`**: Spotlight-style input with instant results.
- **`KnowledgeBase`**: Interactive list of guides with drill-down views.
- **`ServiceStatus`**: Live-updated system health metrics.
- **`SupportFlow`**: Animated ticket submission system.

## 2. Visual System (Liquid Industrial)
- **Geometry**: Sharp 2px borders, 12px-24px corner radius for a "Technical but Modern" feel.
- **Palette**: 
  - Deep Navy (#0f172a) for depth.
  - Electric Blue (#2563eb) for actions.
  - Emerald (#10b981) for success/uptime.
  - Neutral Slate for text.
- **Motion**:
  - Modal: "Snap-spring" entry (scale + fade).
  - Content: Staggered "Slide-up" for list items.
  - Tabs: Fluid width transitions.

## 3. Tech Stack
- **React** (Hooks: `useState`, `useMemo`, `useEffect`).
- **Vanilla CSS** with GPU-accelerated transforms.
- **Lucide Icons** (via `IconRenderer`).

## 4. Phases
1. **Foundation**: Create `HelpCenter` base structure and replace triggers in `App.tsx`.
2. **Search Logic**: Implement the filtering system for docs and actions.
3. **Module Implementation**: Port existing logic from `DocsModal` and `SupportModal` into the new unified layout.
4. **Polish**: Add Framer-like CSS animations and micro-interactions.
