# Design

## Source of truth
- Status: Draft
- Last refreshed: 2026-06-12
- Primary product surfaces: ERPNext login, website/portal theme, Desk foundation, List View, Form View, Report View.
- Evidence reviewed: `erpnext/hooks.py`, `erpnext/startup/boot.py`, `erpnext/public/css/sgat_login.css`, `erpnext/public/css/themes/*`, `erpnext/public/js/sgat_theme_manager.js`, `erpnext/public/images/sgat_logo_20y/*`, `erpnext/public/images/sgat_logo_NEO/*`, Frappe `Website Theme` DocType, Frappe Desk theme switcher.

## Brand
- Personality: official coffee-house authority with bold neo-brutalist confidence.
- Trust signals: strong contrast, clear hierarchy, predictable controls, espresso/crema palette.
- Avoid: decorative-only complexity, low contrast, cafe-cute styling, broad gradients as the only identity cue.

## Product goals
- Goals: provide switchable SGAT-branded light and dark themes without editing Frappe core.
- Non-goals: custom report logic, custom datatable behavior, or changing report data semantics.
- Success signals: admin can switch between `SGAT Neo Light` and `SGAT Neo Dark` from Website Settings; login and Desk foundation follow the selected Neo theme, while `Standard` returns to the default interface.

## Personas and jobs
- Primary personas: SGAT ERP administrators and internal ERP users.
- User jobs: log in confidently, recognize SGAT branding, use consistent light/dark visual language.
- Key contexts of use: desktop-first ERP use, occasional mobile login.

## Information architecture
- Primary navigation: unchanged ERPNext/Frappe navigation.
- Core routes/screens: `/login`, `/app`, workspaces, Desk shell.
- Content hierarchy: logo, login heading, credential form, secondary auth actions.

## Design principles
- Principle 1: switchability before breadth; each theme must be reversible by admin setting.
- Principle 2: neo-brutalism with operational restraint; bold borders/shadows without hurting readability.
- Tradeoffs: dense report/data-table views get stronger framing and readable states, without changing column behavior or report interactions.

## Visual language
- Color: Coffee Official palette; light theme uses crema/paper coffee tones with primary `#FDFD96`; dark theme uses espresso tones with primary `#C4A1FF`; red and blue are supporting accent colors for UI contrast, status emphasis, and Neo-brutalist edge details.
- Typography: use existing Frappe typography, reinforced by heavier weights on headings/buttons.
- Spacing/layout rhythm: preserve Frappe layout dimensions; add stronger edges and shadow rhythm.
- Shape/radius/elevation: 2-3px coffee-black borders, low radius, hard offset shadows.
- Motion: no new motion in first pass.
- Imagery/iconography: Standard keeps the SGAT 20Y logo/favicon from global hooks; Neo themes use `sgat_logo_NEO` assets plus a simplified CSS-generated coffee background: restrained grid, SGAT Coffee ERP label, small bean/cup references, and red/blue/yellow brutalist blocks; no image background in Neo themes.

## Components
- Existing components to reuse: Frappe login template, Website Theme, Website Settings.
- New/changed components: SGAT Neo website theme CSS files, Website Theme fixtures, Desk theme activator JS, Desk foundation CSS, common Desk control styling, workspace/dashboard widget polish, List View polish, Form View polish, Report View and Query Report table polish.
- Variants and states: Light and Dark theme variants.
- Token/component ownership: SGAT CSS variables under `--sgat-*`.

## Accessibility
- Target standard: WCAG-aware contrast for login text and controls.
- Keyboard/focus behavior: preserve Frappe defaults; add visible brutalist focus ring for Neo controls.
- Contrast/readability: maintain opaque form panel over image background.
- Screen-reader semantics: no template structure changes in first pass.
- Reduced motion and sensory considerations: no animation added.

## Responsive behavior
- Supported breakpoints/devices: preserve Frappe responsive login layout.
- Layout adaptations: background image covers viewport; form remains centered.
- Touch/hover differences: hover enhancements must not be required for use.

## Interaction states
- Loading: unchanged.
- Empty: unchanged.
- Error: preserve Frappe messages; theme only styles surrounding panel.
- Success: unchanged.
- Disabled: preserve Frappe button disabled behavior.
- Offline/slow network, if applicable: unchanged.

## Content voice
- Tone: concise, businesslike.
- Terminology: keep ERPNext/Frappe auth terms unless separately localized.
- Microcopy rules: no new instructional copy inside login surface.

## Implementation constraints
- Framework/styling system: Frappe Website Theme fixture plus static CSS assets.
- Design-token constraints: custom CSS variables scoped to login page and selected theme.
- Performance constraints: CSS-generated login background; Neo website theme JS is limited to favicon link swapping; Desk JS reads `frappe.boot.sgat_website_theme` and toggles a root data attribute.
- Compatibility constraints: do not edit `apps/frappe`; changes live in ERPNext app.
- Test/screenshot expectations: verify selected Website Theme changes login page, Desk foundation, common controls, workspace/dashboard widgets, List View, Form View, and Report View after cache/build.

## Open questions
- [ ] Confirm whether print formats and portal/customer-facing pages should receive the Neo treatment after Desk approval.
