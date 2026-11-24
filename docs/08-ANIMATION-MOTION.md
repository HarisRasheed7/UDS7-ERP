# ANIMATION & MOTION

## Professional ERP & Business Management Platform

**Document:** `08-ANIMATION-MOTION.md`
**Status:** Specification
**Depends On:**

* `00-MASTER-INSTRUCTIONS.md`
* `01-PROJECT-VISION.md`
* `02-PRODUCT-REQUIREMENTS.md`
* `03-ARCHITECTURE.md`
* `04-TECH-STACK.md`
* `05-DESIGN-SYSTEM.md`
* `06-UI-UX-SPECIFICATION.md`
* `07-THEME-SYSTEM.md`

---

# 1. PURPOSE

This document defines the motion and animation architecture for the platform.

Motion must improve:

* clarity
* orientation
* feedback
* continuity
* hierarchy
* perceived responsiveness
* interaction quality

Motion must never exist merely for decoration.

The platform is a professional business system. Animation must therefore be:

* intentional
* restrained
* fast
* predictable
* consistent
* accessible
* performant

---

# 2. SCOPE

This document defines:

* motion principles
* animation hierarchy
* timing
* easing
* transitions
* micro-interactions
* page transitions
* navigation motion
* modal/drawer motion
* dropdown motion
* table interaction motion
* loading motion
* notification motion
* dashboard motion
* chart motion
* command interface motion
* reduced-motion behavior
* performance requirements
* motion implementation rules
* testing and acceptance criteria

This document does not redefine:

* colors
* typography
* spacing
* component visual design
* page information architecture
* business workflows

Those responsibilities belong to the relevant specifications.

---

# 3. MOTION OBJECTIVE

Motion should answer one or more of these questions:

* What changed?
* Where did something come from?
* Where did something go?
* What action occurred?
* What is currently active?
* Is the system processing something?
* Can the user safely continue?
* How are two states related?

If animation does not communicate useful information, it should generally not be added.

---

# 4. CORE MOTION PRINCIPLES

## 4.1 Purpose Before Decoration

Every meaningful animation must have a functional or experiential purpose.

---

## 4.2 Fast but Perceivable

Animations should be short enough to keep the interface feeling responsive while remaining long enough to communicate state changes.

---

## 4.3 Consistency

Similar interactions should use similar motion behavior.

For example:

* all standard drawers should open using the same motion family
* similar dialogs should behave consistently
* dropdowns should not each have unrelated animation styles

---

## 4.4 Hierarchy

Motion should reinforce interface hierarchy.

Primary transitions may receive slightly stronger movement.

Secondary changes should be more subtle.

---

## 4.5 Spatial Continuity

When possible, motion should communicate where an interface element came from and where it is going.

---

## 4.6 No Motion Overload

ERP users may spend hours inside the application.

Continuous animation can cause:

* distraction
* fatigue
* reduced productivity
* accessibility problems

Motion must therefore remain restrained.

---

# 5. MOTION CATEGORIES

The platform should classify motion into:

```text
Micro
Component
Contextual
Navigation
Feedback
Loading
Data Visualization
System
```

Each category has a different purpose and intensity.

---

# 6. MICRO MOTION

Micro motion includes:

* button state changes
* hover transitions
* focus changes
* toggles
* checkbox changes
* icon state changes
* small status changes

Micro motion should be subtle and generally shorter than larger transitions.

---

# 7. COMPONENT MOTION

Component motion includes:

* dropdowns
* popovers
* tooltips
* menus
* drawers
* dialogs
* expandable sections
* accordions
* tabs

Motion should communicate the component's spatial relationship to its trigger.

---

# 8. CONTEXTUAL MOTION

Contextual motion communicates changes within the current page.

Examples:

* filters appearing
* form sections expanding
* table rows updating
* inline validation
* status changes
* contextual panels opening

---

# 9. NAVIGATION MOTION

Navigation motion communicates movement between larger interface contexts.

Examples:

* page transitions
* module transitions
* navigation expansion
* sidebar collapse
* workspace changes

Navigation motion must remain subtle because users perform navigation frequently.

---

# 10. FEEDBACK MOTION

Feedback motion confirms system actions.

Examples:

* save completed
* item added
* approval completed
* synchronization finished
* notification received
* validation state changed

Feedback should never depend only on animation.

A textual, visual, or semantic indicator must also exist where required.

---

# 11. LOADING MOTION

Loading motion communicates processing.

Examples:

* skeletons
* progress indicators
* spinners
* progress bars
* processing states

The appropriate loading mechanism depends on the expected duration and context.

---

# 12. DATA VISUALIZATION MOTION

Charts may use restrained animation to communicate:

* initial rendering
* changes
* filtering
* drill-down
* comparison

Charts should never use excessive animation merely to appear dynamic.

---

# 13. SYSTEM MOTION

System-level motion may communicate:

* synchronization
* offline state
* background processing
* connectivity changes
* system alerts

System motion must not obstruct normal business workflows.

---

# 14. MOTION TOKENS

Motion should use centralized tokens.

Conceptually:

```text id="g2p2fj"
Duration
├── instant
├── micro
├── fast
├── normal
├── moderate
└── slow

Easing
├── standard
├── entrance
├── exit
├── emphasized
└── linear
```

Exact values should be maintained centrally rather than duplicated across components.

---

# 15. DURATION GUIDELINES

Recommended conceptual ranges:

| Motion              | Approximate Duration |
| ------------------- | -------------------: |
| Instant state       |               0–80ms |
| Micro interaction   |             80–150ms |
| Fast transition     |            120–200ms |
| Standard transition |            180–280ms |
| Complex transition  |            250–400ms |
| Long transition     |               400ms+ |

Long animations should be uncommon in normal business workflows.

These are guidelines rather than requirements for every interaction.

---

# 16. EASING

Motion should use appropriate easing.

### Standard

Used for common UI transitions.

### Entrance

Used when an element appears.

### Exit

Used when an element disappears.

### Emphasized

Used for important contextual movement.

### Linear

Primarily used for continuous processes such as:

* progress
* loading
* data streams

Easing functions should be centralized.

---

# 17. ENTER MOTION

When an element appears, motion should communicate:

* origin
* hierarchy
* relationship to its trigger

Examples:

* dropdown → small vertical/scale entrance
* drawer → directional slide
* dialog → subtle scale/opacity
* tooltip → short fade/translate

---

# 18. EXIT MOTION

Exit motion should generally be slightly faster than entrance motion.

Users should not have to wait for elements to disappear.

---

# 19. OPACITY

Opacity transitions may be used to communicate appearance/disappearance.

Opacity should not be the only mechanism when spatial context is important.

---

# 20. TRANSFORM

Preferred animation properties should generally include:

* transform
* opacity

Avoid unnecessary animation of expensive layout properties.

---

# 21. LAYOUT ANIMATION

Animating layout dimensions can be useful for:

* accordions
* expanding sections
* navigation collapse
* contextual panels

However, layout animation should be used carefully because it can cause expensive rendering.

---

# 22. PERFORMANCE-FIRST MOTION

Animation should prefer properties that can be efficiently rendered.

Avoid unnecessary continuous animation of:

* large layout trees
* expensive shadows
* complex filters
* huge surfaces
* large tables

Motion must not cause visible application lag.

---

# 23. PAGE TRANSITIONS

Page transitions should be subtle.

Recommended behavior:

```text id="zj5ux7"
Current Page
     ↓
short transition
     ↓
New Page
```

Avoid dramatic:

* zooms
* spins
* large slides
* theatrical effects

ERP navigation should feel professional and immediate.

---

# 24. ROUTE TRANSITIONS

Route transitions may use:

* opacity
* subtle translation
* shared-container transitions where justified

They must not delay the user's ability to interact with the destination page.

---

# 25. SIDEBAR MOTION

When collapsing or expanding primary navigation:

* movement should be smooth
* content should adapt predictably
* labels should not flicker
* icons should remain stable
* layout should not jump excessively

The state should persist where appropriate.

---

# 26. DRAWER MOTION

Drawers should generally move from the edge they are associated with.

Examples:

```text id="6z5ccw"
Right Drawer
→ enters from right

Left Drawer
→ enters from left
```

The transition should make the relationship to the trigger understandable.

---

# 27. MODAL MOTION

Dialogs should appear with restrained motion.

Potential pattern:

```text id="kw5kwp"
opacity
+
subtle scale/translate
```

The background overlay may transition separately.

Dialogs should remain easy to perceive and should not use exaggerated movement.

---

# 28. DROPDOWN MOTION

Dropdowns and menus should:

* appear quickly
* remain anchored to their trigger
* close quickly
* avoid large travel distances

They should not animate in a way that makes selection feel slow.

---

# 29. TOOLTIP MOTION

Tooltips should use short, subtle transitions.

They should not appear so slowly that they interfere with rapid navigation.

Tooltips must remain accessible to keyboard users where appropriate.

---

# 30. ACCORDION MOTION

Expandable sections may animate between collapsed and expanded states.

The animation must:

* preserve content readability
* avoid excessive duration
* avoid causing major page jumps
* work without motion when reduced motion is enabled

---

# 31. TAB MOTION

Tab changes may use subtle indicators such as:

* active underline movement
* content transition
* indicator sliding

Tab motion should not obscure content or delay interaction.

---

# 32. BUTTON MOTION

Buttons may respond to:

* hover
* focus
* active/pressed
* loading
* success
* disabled

Motion should remain subtle.

Avoid:

* bouncing buttons
* exaggerated scaling
* continuous pulsing

---

# 33. FORM MOTION

Forms may use motion for:

* validation feedback
* conditional fields
* section expansion
* autosave indication
* submission feedback

Validation animation must not replace clear text or semantic error information.

---

# 34. VALIDATION MOTION

For invalid input:

* highlight the affected field
* display an understandable message
* optionally use a subtle transition

Avoid excessive shaking.

If a shake is used, it must be brief and disabled under reduced-motion preferences.

---

# 35. SUCCESS MOTION

Successful actions may use:

* checkmark transitions
* status changes
* subtle confirmation indicators

Example:

```text id="2d6h5y"
Saving...
   ↓
Saved ✓
```

The success state must remain understandable without animation.

---

# 36. ERROR MOTION

Errors may use:

* status transition
* subtle appearance
* focus movement to the relevant field where appropriate

Errors should not use alarming or distracting animation.

---

# 37. TABLE MOTION

Tables may animate:

* row insertion
* row removal
* sorting indicators
* selection
* status changes

Large datasets should not animate every row unnecessarily.

For bulk updates, a concise state transition is preferred.

---

# 38. TABLE SELECTION

Row selection may use subtle:

* background transition
* checkbox transition
* toolbar appearance

The selection toolbar should appear without causing excessive layout movement.

---

# 39. BULK ACTION MOTION

When records are selected:

```text id="y6smw2"
No Selection
      ↓
Records Selected
      ↓
Bulk Toolbar Appears
```

The transition should be short and predictable.

---

# 40. FILTER MOTION

When filters are opened:

* filter panels may slide/fade
* active filter chips may appear
* result updates may show subtle feedback

Filtering must never feel slower because of animation.

---

# 41. SEARCH MOTION

Search interactions may use:

* search panel expansion
* result appearance
* keyboard focus
* category changes

Global search should feel immediate.

---

# 42. COMMAND PALETTE MOTION

The command palette should appear quickly.

Recommended conceptual behavior:

```text id="9s2r2o"
Shortcut
   ↓
Command Palette
   ↓
Focus Search
   ↓
Results
```

Keyboard focus should be available immediately.

---

# 43. NOTIFICATION MOTION

Notifications may:

* enter the notification center
* appear as transient messages
* update unread counts

Avoid aggressive:

* bouncing
* shaking
* flashing

Critical alerts should use appropriate persistent UI rather than relying on motion.

---

# 44. TOAST MOTION

Toast notifications may use:

* subtle entrance
* short exit
* stacking behavior

The toast should not block important controls.

---

# 45. BADGE MOTION

Unread or changed badges may use a brief state transition.

Continuous pulsing should generally be avoided.

---

# 46. DASHBOARD MOTION

Dashboard widgets may animate during:

* initial loading
* filter changes
* date-range changes
* drill-down

Do not animate every KPI continuously.

Business dashboards should prioritize information clarity over visual spectacle.

---

# 47. KPI MOTION

Numeric values may transition when changing datasets.

For example:

```text id="8a4y3p"
Rs. 1,250,000
      ↓
Rs. 1,310,000
```

Number transitions should be brief and must not make precise values difficult to read.

---

# 48. CHART MOTION

Charts may animate their initial render.

Animation should be disabled or reduced when:

* datasets are extremely large
* repeated updates occur rapidly
* performance is affected
* reduced-motion is enabled

---

# 49. DRILL-DOWN MOTION

When moving from:

```text id="z7i6e3"
Summary
↓
Detailed Report
```

motion may provide spatial continuity.

However, users must retain immediate access to the destination.

---

# 50. LOADING SKELETONS

Skeleton loading should communicate the structure of expected content.

Skeletons should not become overly animated.

A restrained shimmer or opacity movement may be used.

---

# 51. SKELETON PERFORMANCE

Skeleton animations must not consume significant resources.

Large pages should not contain hundreds of independently animated skeleton elements.

---

# 52. PROGRESS INDICATORS

Long-running operations should use appropriate progress indicators.

Examples:

* imports
* exports
* document generation
* synchronization
* background processing

Where actual progress is unknown, use indeterminate progress.

Never fabricate precise progress values.

---

# 53. PROCESSING STATES

Buttons and actions that initiate processing should communicate state.

Example:

```text id="b0i9hj"
[Submit]
   ↓
[Submitting...]
   ↓
[Submitted ✓]
```

The user should not accidentally trigger duplicate operations when the action is already processing.

---

# 54. OFFLINE MOTION

Offline state transitions may use subtle indicators.

Example:

```text id="g3h1ki"
Online
  ↓
Offline
  ↓
Queued
  ↓
Syncing
  ↓
Synced
```

Motion should not be the only indication of state.

---

# 55. SYNC MOTION

Synchronization may use:

* progress indicators
* subtle status transitions
* sync icons
* completion indicators

Continuous spinning icons should only appear while actual synchronization is active.

---

# 56. CONFLICT MOTION

Synchronization conflicts should not use aggressive animation.

Instead, use clear visual state changes and direct user actions.

---

# 57. POS MOTION

POS motion must be especially restrained.

Cashiers need speed.

Useful motion may include:

* product added to cart
* payment state
* sale completion
* receipt generation

Avoid:

* long transitions
* decorative effects
* unnecessary page changes

---

# 58. WAREHOUSE MOTION

Warehouse and scanning workflows should prioritize speed.

Motion may confirm:

* scan accepted
* quantity updated
* item located
* transfer completed

Feedback must remain fast enough for repetitive scanning.

---

# 59. MANUFACTURING MOTION

Manufacturing interfaces may use subtle motion to communicate:

* production state
* machine status
* workflow progress
* quality state

Real-time operational interfaces must not depend on decorative animations.

---

# 60. MOBILE MOTION

Mobile motion should support:

* navigation
* drawers
* sheets
* dialogs
* gesture relationships
* state changes

Motion must remain efficient on lower-powered devices.

---

# 61. GESTURE MOTION

Where supported, gestures may include:

* swipe
* drag
* pull
* slide

Gesture-driven motion must have non-gesture alternatives.

---

# 62. DRAG-AND-DROP MOTION

Drag-and-drop interfaces may provide:

* pickup feedback
* movement feedback
* valid target indication
* invalid target indication
* drop confirmation

Do not rely exclusively on color or animation to indicate valid targets.

---

# 63. REDUCED MOTION

The platform must respect:

```text
prefers-reduced-motion
```

When reduced motion is enabled:

* non-essential animation should be removed
* transitions should be shortened
* large movement should be avoided
* decorative animation should be disabled
* essential state changes must remain visible

---

# 64. REDUCED MOTION IS NOT NO FEEDBACK

Disabling animation must not remove:

* success indication
* error indication
* loading indication
* focus
* state changes
* workflow feedback

Only motion should be reduced, not information.

---

# 65. USER MOTION PREFERENCE

Where appropriate, application-level preferences may supplement operating system settings.

Potential options:

```text id="kq2l2n"
Motion
├── Full
├── Reduced
└── Follow System
```

The system preference must be respected.

---

# 66. MOTION ACCESSIBILITY

Motion must not:

* create usability barriers
* cause disorientation
* flash rapidly
* create unnecessary visual stress
* obscure content
* prevent keyboard interaction

Special care must be taken with repeated movement.

---

# 67. FLASHING CONTENT

The application must avoid rapid flashing or strobing animations.

Critical alerts should use:

* text
* iconography
* semantic color
* persistent state

rather than flashing.

---

# 68. MOTION AND FOCUS

When a component opens:

* focus must move appropriately
* animation must not delay keyboard access unnecessarily

When a component closes:

* focus should return to the logical trigger where appropriate

---

# 69. MOTION AND SCREEN READERS

Animation must never be required for screen-reader users to understand application state.

State changes must be communicated through appropriate semantic mechanisms.

---

# 70. MOTION AND ROUTING

Route changes must preserve accessibility.

Focus should move to the new page's logical heading or main content area where appropriate.

Animation must not prevent this.

---

# 71. MOTION AND DATA CORRECTNESS

Motion must never imply a business state before the underlying operation has actually succeeded.

For example:

A transaction should not visually appear `Posted` merely because the user clicked `Post`.

The interface should reflect the authoritative operation result.

---

# 72. FINANCIAL MOTION RULES

Financial operations require conservative motion.

Avoid animation that could:

* imply incorrect balances
* obscure amounts
* delay confirmation
* hide errors
* create ambiguity around posting

Financial state changes must be explicit.

---

# 73. INVENTORY MOTION RULES

Inventory motion must not obscure:

* quantity
* warehouse
* location
* batch
* serial
* reservation state

Correctness takes priority over visual effects.

---

# 74. MOTION AND CONFIRMATION

Important actions may use motion to transition between states, but confirmation must remain explicit.

Example:

```text id="z3n43s"
Draft
  ↓
Submitting
  ↓
Approved
```

The intermediate processing state should prevent accidental repeated actions.

---

# 75. MOTION AND ERRORS

If an operation fails:

```text id="r2xw5s"
Processing
    ↓
Failed
    ↓
Actionable Error
```

The failure state must remain visible until appropriately dismissed or resolved.

---

# 76. MOTION AND BACKGROUND JOBS

Background operations should use subtle indicators.

Users should be able to continue working while:

* exports run
* reports generate
* files process
* synchronization occurs
* imports run

The application should not lock the interface unnecessarily.

---

# 77. MOTION AND RESPONSIVENESS

Motion must never compensate for slow application behavior.

For example:

Do not use a long animation to hide a slow API request.

Instead:

* improve performance
* show accurate loading
* provide appropriate progress
* allow background processing

---

# 78. MOTION COMPONENT CONTRACT

Reusable components should define their supported motion states centrally.

For example:

```text id="4u2yca"
Dialog
├── Enter
├── Active
├── Exit
└── Reduced Motion

Drawer
├── Enter
├── Active
├── Exit
└── Reduced Motion
```

Modules should consume these behaviors rather than inventing their own.

---

# 79. MOTION CUSTOMIZATION

Organization-level customization should not normally allow arbitrary animation configuration.

Motion is more tightly controlled than colors because inconsistent motion can significantly harm usability.

Future advanced configuration may allow limited motion preferences.

---

# 80. MOTION THEME RELATIONSHIP

Themes may provide limited motion-related configuration where necessary, but the core motion system remains centralized.

For example:

```text id="x3j8j6"
Theme
  ↓
Motion Tokens
  ↓
Components
```

Themes must not redefine business workflow behavior.

---

# 81. MOTION TESTING

Motion testing should verify:

* correct timing
* correct direction
* correct state
* no layout breakage
* no content obstruction
* keyboard compatibility
* reduced-motion behavior
* performance
* mobile behavior

---

# 82. MOTION PERFORMANCE TESTING

Test on:

* modern desktop
* lower-end desktop
* tablet
* mobile
* large datasets
* dense dashboards
* complex forms

The platform should remain responsive while animations are active.

---

# 83. MOTION REGRESSION TESTING

Changes to shared motion components must be tested across affected modules.

Examples:

Changing dialog motion should not unexpectedly alter:

* financial dialogs
* POS dialogs
* approval dialogs
* settings dialogs

---

# 84. MOTION CONSISTENCY REVIEW

Before introducing a new animation, determine:

1. Does an existing motion pattern already solve this?
2. Is motion necessary?
3. Does it communicate state?
4. Is it accessible?
5. Does it affect performance?
6. Does it remain consistent with similar interactions?

If an existing pattern is appropriate, reuse it.

---

# 85. ANTI-PATTERNS

The platform must avoid:

* excessive bounce effects
* decorative particle systems
* constant background animation
* unnecessary parallax
* long page transitions
* spinning elements without active processing
* repeated pulsing
* excessive scaling
* animation on every hover
* animation used to hide performance problems
* large layout shifts
* motion that blocks interaction

---

# 86. PROFESSIONAL MOTION STANDARD

The overall motion character should be:

**subtle + precise + responsive + intentional**

The platform should feel alive without feeling animated for its own sake.

---

# 87. ACCEPTANCE CRITERIA

The motion system is considered complete when:

* motion tokens are centralized
* common component motion is standardized
* page transitions are defined
* dialogs/drawers/dropdowns have consistent behavior
* loading states are defined
* feedback motion is defined
* dashboard/chart motion is restrained
* POS and operational workflows remain fast
* reduced-motion support works
* keyboard/focus behavior remains correct
* animations do not compromise business correctness
* performance is tested
* mobile behavior is tested
* motion regression testing exists
* modules reuse shared motion patterns
* decorative animation is controlled

---

# 88. FINAL PRINCIPLE

Motion is a communication layer.

It should help users understand:

**where they are → what changed → what is happening → what happened next**

The final experience should feel:

* responsive
* controlled
* modern
* professional
* calm
* predictable
* accessible

The objective is not to make the ERP look animated.

The objective is to make complex interactions feel **clear, connected, and understandable**.
