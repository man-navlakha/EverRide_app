% SKILL: Design Pages (workspace-scoped)

# Design Pages — SKILL.md

Purpose
-------
This skill codifies a repeatable, workspace-scoped workflow for designing and delivering app screens/pages for this React Native project. Use it to move from feature request or ticket to implemented, tested, and reviewed screens that match design intent, performance, and accessibility goals.

Scope
-----
- Workspace-scoped: intended for use by contributors working on this repository.
- Focus: UI/UX design-to-implementation for screens/pages (wireframes, components, styles, assets, tests, PR checklist).

When to use
-----------
- New screen or flow is requested (feature ticket, Figma link, product spec).
- Redesign/visual refresh of existing screens.
- Spike to evaluate component reuse or platform-specific differences.

Inputs
------
- Feature spec or ticket (goal, user story, acceptance criteria).
- Design assets (Figma link, exported PNG/SVG, design tokens if available).
- Existing app context: current screens, theme, components.

Primary outputs
---------------
- Wireframes or annotated screenshots.
- Component breakdown and file map (which components to create/reuse).
- Implemented screen(s) in code with styles and assets.
- Tests: snapshot/unit + basic interaction tests.
- PR with checklist and QA notes.

Step-by-step workflow
---------------------
1. Discover & clarify
   - Confirm goal, user story, and acceptance criteria. Ask product/design for missing details.
   - Decide scope: full flow vs single screen, data needed, and platform differences.
   - Decision point: Is this substantially similar to an existing screen? If yes, prefer reuse/refactor.

2. Audit the repo
   - Locate related screens/components in the codebase.
   - Note theme tokens, spacing scale, font usage, and design system primitives.

3. Define user flows and screen list
   - Produce a concise screen list and primary/secondary flows.
   - Create simple annotated wireframes (sketch or Figma frames) mapping data & states.

4. Component decomposition
   - Split the screen into presentational and container components.
   - For each component, record: props, states, variants, accessibility roles.
   - Decision point: extract a reusable component now or add technical debt task for later.

5. Implementation plan & ticketing
   - Create granular tasks: wireframe, assets, components, styles, tests, QA.
   - Estimate and assign work.

6. Implement: code & styles
   - Use existing theme variables where possible (`theme/*`).
   - Keep components small and testable; prefer props over context for simple variants.
   - Add platform-specific tweaks only when necessary; document differences.

7. Assets & localization
   - Optimize images (SVG where possible), add 2x/3x raster assets for mobile.
   - Extract text for localization if needed.

8. Accessibility & performance
   - Ensure focus order, labels, contrast, and touch target sizes.
   - Measure and keep render cost low (avoid unnecessary re-renders, use memoization as needed).

9. Tests and snapshots
   - Add unit tests for logic and snapshot tests for visual regressions.
   - Add basic interaction tests (e.g., button press navigates or calls handler).

10. PR checklist & review
    - Link design assets/figma and screenshots in PR description.
    - Include device/OS tested and any deviations from designs.
    - Checklist: lint passes, unit tests run, accessibility checks, performance notes, translation keys.

Decision points & branching logic
---------------------------------
- Reuse vs new component: prefer reuse; if design differs by >20% consider new component.
- Native module needed: if animation or hardware access required, open spike ticket.
- Platform differences: if rendering diverges, implement conditional styles with clear comments.

Quality criteria / completion checks
----------------------------------
- Visual: pixel-approx match to design (within acceptable tolerance), responsive across supported screen sizes.
- Functional: all acceptance criteria from ticket satisfied.
- Tests: unit + snapshot + at least one interaction test present.
- Accessibility: basic ARIA/labeling and contrast checks passed.
- Performance: no obvious jank on typical device; large lists use virtualization.

Example prompts to invoke this skill (try with the agent)
-----------------------------------------------------
- "Design Pages: I have a Figma link and ticket #123 — generate a component breakdown and implementation plan."
- "Design Pages: scaffold screen `BookingsScreen` with placeholders and a component map for the UI."
- "Design Pages: produce a PR checklist and example PR description for screen `ProfileDetails`."

Common follow-ups and related skills
----------------------------------
- Related skill: `agent-customization` — for packaging repo-specific prompts and helpers.
- Related skill: `create-component` — scaffolds a React Native component file, styles, and tests.
- Related action: run visual regression testing (if available) and add to CI.

Ambiguities to clarify (ask user)
--------------------------------
- Is there an authoritative design token source (Figma tokens, theme file)?
- Which devices/resolutions must be prioritized for QA?
- Should the skill produce PR branches and commit messages automatically?

Template prompts to include in PRs
-------------------------------
- Short description of change, linked ticket, screenshots.
- Testing steps for reviewers (how to reproduce states, device/OS used).
- Known limitations and follow-up tasks.

Maintenance notes
-----------------
- Keep this SKILL.md updated when design tokens or theme primitives change.
- Add project-specific examples (component names, folder structure) as the repo evolves.

End of skill
