# DESIGN SYSTEM

# Professional ERP & Business Management Platform

## 1. PURPOSE

This document defines the visual language of the ERP platform.

The interface must feel:

* premium
* professional
* modern
* coherent
* distinctive
* efficient
* trustworthy
* enterprise-grade

It must not resemble a generic AI-generated dashboard.

---

# 2. DESIGN PHILOSOPHY

The design system should balance:

```text
Enterprise Density
        +
Visual Quality
        +
Clarity
        +
Speed
        +
Accessibility
        +
Customization
```

The interface must prioritize business productivity.

Decorative elements must never interfere with important business operations.

---

# 3. VISUAL CHARACTER

The product should have:

* sophisticated blue gradients
* clean surfaces
* subtle depth
* strong typography hierarchy
* precise spacing
* refined borders
* meaningful shadows
* controlled color accents
* polished micro-interactions

Avoid excessive glassmorphism.

Avoid excessive gradients.

Avoid random colorful cards.

Avoid excessive rounded corners.

Avoid visual noise.

---

# 4. COLOR SYSTEM

The design system should use semantic tokens rather than direct color values.

Primary color family:

* Blue
* Navy
* Cyan
* Indigo

Supporting colors:

* Slate
* Gray
* White
* Black

Semantic colors:

* Green = success
* Red = error/danger
* Yellow = warning
* Blue = information
* Purple = special/advanced

---

# 5. PRIMARY BLUE SCALE

The system should provide approximately 10 primary blue shades.

Conceptual scale:

```text
Blue 50
Blue 100
Blue 200
Blue 300
Blue 400
Blue 500
Blue 600
Blue 700
Blue 800
Blue 900
Blue 950
```

Exact values should be defined in the token implementation.

---

# 6. SEMANTIC COLOR SYSTEM

## Success

Use for:

* completed
* approved
* paid
* available
* healthy
* active

---

## Warning

Use for:

* pending
* approaching deadline
* low stock
* attention required

---

## Danger

Use for:

* errors
* failed
* rejected
* overdue
* destructive operations

---

## Information

Use for:

* informational messages
* system information
* neutral guidance

---

# 7. COLOR USAGE RULE

Do not use semantic colors merely for decoration.

For example:

A green card should not exist simply because it looks attractive.

Green should communicate a meaningful positive state.

---

# 8. SURFACE SYSTEM

The platform should use layered surfaces.

Example:

```text
Application Background
    ↓
Page Surface
    ↓
Section Surface
    ↓
Card Surface
    ↓
Elevated Surface
    ↓
Modal / Popover Surface
```

Surfaces should create hierarchy without excessive shadows.

---

# 9. LIGHT THEME

The light theme should use:

* grayish-white backgrounds
* white surfaces
* dark readable text
* subtle borders
* blue primary accents

Avoid pure white everywhere.

---

# 10. DARK THEME

The dark theme should use:

* deep navy/charcoal backgrounds
* elevated dark surfaces
* light text
* controlled blue accents

Avoid pure black as the default background.

---

# 11. THEME ARCHITECTURE

Themes must be implemented through tokens.

Conceptual:

```text
Theme
 ├── Colors
 ├── Typography
 ├── Surfaces
 ├── Borders
 ├── Shadows
 ├── Motion
 └── Components
```

Components should consume semantic tokens.

---

# 12. REQUIRED THEMES

Initial themes:

1. Ocean Blue
2. Corporate Blue
3. Royal Indigo
4. Emerald
5. Forest
6. Purple
7. Crimson
8. Amber
9. Light Neutral
10. Dark Professional

More themes may be added.

---

# 13. ORGANIZATION BRANDING

Organizations should eventually be able to configure:

* logo
* favicon
* primary color
* secondary color
* theme
* business name
* email branding
* document branding

Branding must remain compatible with accessibility.

---

# 14. TYPOGRAPHY

Typography must prioritize:

* readability
* hierarchy
* dense information presentation
* accessibility

Recommended font categories:

* modern sans-serif
* highly readable system fonts
* optional organization fonts where safe

Potential default:

* Inter
* system sans-serif fallback

Do not use decorative fonts for the ERP workspace.

---

# 15. TYPOGRAPHIC SCALE

Provide tokens for:

* display
* heading 1
* heading 2
* heading 3
* heading 4
* body large
* body
* body small
* caption
* label
* overline

Enterprise screens should use compact but readable typography.

---

# 16. SPACING SYSTEM

Use a consistent spacing scale.

Conceptual:

```text
4
8
12
16
20
24
32
40
48
64
80
96
```

Components must avoid arbitrary spacing values wherever practical.

---

# 17. BORDER SYSTEM

Borders should be subtle.

Use borders to communicate:

* separation
* grouping
* focus
* hierarchy

Do not put heavy borders around every element.

---

# 18. BORDER RADIUS

Use a restrained radius system.

Example:

```text
xs
sm
md
lg
xl
2xl
pill
```

Enterprise data tables should generally use smaller radii than marketing cards.

---

# 19. SHADOW SYSTEM

Shadows should communicate elevation.

Use:

* subtle
* medium
* elevated
* overlay

Avoid extremely large shadows.

---

# 20. ICONOGRAPHY

Icons must be:

* consistent
* simple
* recognizable
* accessible

Primary icon system should preferably use one family.

---

# 21. BUTTONS

Button hierarchy:

### Primary

Main action.

### Secondary

Alternative action.

### Tertiary/Ghost

Low-emphasis action.

### Danger

Destructive action.

### Icon Button

Compact contextual action.

Buttons must have:

* hover
* active
* focus
* disabled
* loading

states.

---

# 22. INPUTS

Inputs should support:

* default
* focus
* filled
* error
* warning
* disabled
* read-only
* loading

Input labels should remain clear.

Do not rely solely on placeholders to identify fields.

---

# 23. FORMS

Complex ERP forms should be organized using:

* sections
* tabs
* accordions
* steps
* progressive disclosure

Do not place dozens of unrelated fields into one giant form without grouping.

---

# 24. CARDS

Cards should be used to group related information.

Do not use cards for every piece of information.

Examples:

Good:

* KPI card
* customer summary
* order summary
* workflow panel

Avoid:

Every table row being a card on desktop.

---

# 25. TABLES

Tables are one of the most important components.

They must support where appropriate:

* sorting
* filtering
* pagination
* search
* column visibility
* column resizing
* bulk actions
* selection
* export
* saved views
* grouping
* totals

Tables should remain visually clean even with many columns.

---

# 26. DASHBOARDS

Dashboards should provide:

* hierarchy
* context
* filters
* KPIs
* charts
* tables
* alerts
* recent activity

Avoid dashboards made entirely from equal-sized cards.

Use visual hierarchy.

---

# 27. SIDEBAR

The sidebar should support:

* expandable sections
* active state
* badges
* nested navigation
* collapsed mode
* favorites
* module grouping

The sidebar must remain usable with large module counts.

---

# 28. HEADER

The global header may contain:

* organization switcher
* branch/location context
* global search
* command palette
* notifications
* help
* profile
* theme switcher

Do not overload the header.

---

# 29. BREADCRUMBS

Breadcrumbs should communicate location in complex workflows.

Example:

```text
Sales
→ Orders
→ SO-000123
```

---

# 30. MODALS

Use modals for:

* confirmations
* focused actions
* short forms
* quick views

Do not put extremely complex workflows inside small modal windows.

Use drawers or full pages where appropriate.

---

# 31. DRAWERS

Drawers are useful for:

* record details
* quick edit
* activity history
* filters
* contextual information

---

# 32. COMMAND PALETTE

The application should eventually provide a command interface.

Potential shortcuts:

```text
Search customers
Create invoice
Create quotation
Open inventory
Open settings
Search products
Switch branch
```

---

# 33. NOTIFICATION CENTER

Notifications should be categorized.

Examples:

* approvals
* tasks
* warnings
* system
* workflow
* security

Users should be able to mark notifications:

* read
* unread

---

# 34. EMPTY STATES

Empty states should explain:

* what is missing
* why it matters
* what the user can do

Whenever appropriate include a primary action.

---

# 35. LOADING STATES

Use:

* skeletons
* spinners
* progress indicators

Prefer skeletons for content-heavy screens.

Avoid flashing empty layouts.

---

# 36. ERROR STATES

Error screens should explain:

* what happened
* whether the action succeeded
* what can be done next

Provide retry where meaningful.

---

# 37. SUCCESS FEEDBACK

Success feedback may use:

* toast
* inline status
* animation
* updated state

Do not rely exclusively on disappearing toast messages for important operations.

---

# 38. DANGER ACTIONS

Destructive actions should:

* be visually distinct
* require appropriate permission
* request confirmation where appropriate
* clearly explain consequences

---

# 39. STATUS SYSTEM

Use consistent status styles.

Examples:

```text
Draft
Pending
Approved
Rejected
Confirmed
Processing
Completed
Cancelled
Failed
Archived
```

Status appearance must be consistent across modules.

---

# 40. MICRO-INTERACTIONS

Use subtle interactions for:

* hover
* focus
* selection
* expansion
* saving
* completion
* navigation

Micro-interactions should provide feedback.

---

# 41. MOTION PRINCIPLES

Motion should communicate:

* where something came from
* where something went
* what changed
* what completed
* what requires attention

Avoid motion that delays interaction.

---

# 42. PAGE TRANSITIONS

Page transitions should be:

* subtle
* fast
* optional
* accessible

Do not use large cinematic transitions in normal ERP workflows.

---

# 43. HOVER EFFECTS

Hover effects should communicate interactivity.

Examples:

* subtle elevation
* border change
* background shift
* icon movement
* tooltip

Avoid excessive scaling.

---

# 44. RESPONSIVE DESIGN

Desktop:

* dense tables
* multi-column forms
* side navigation
* dashboards

Tablet:

* reduced columns
* adaptive navigation
* stacked sections

Mobile:

* simplified navigation
* cards where appropriate
* horizontal table scrolling or transformed layouts
* larger touch targets
* simplified workflows

---

# 45. ACCESSIBILITY

The design system must support:

* keyboard focus
* screen readers
* accessible labels
* contrast
* reduced motion
* touch accessibility
* semantic HTML

---

# 46. DATA DENSITY

ERP users often need high information density.

Provide density modes:

* comfortable
* compact
* dense

Users should eventually be able to choose their preferred density.

---

# 47. PERSONALIZATION

User preferences may include:

* theme
* density
* sidebar state
* dashboard layout
* table columns
* language
* timezone
* date format
* notification preferences

---

# 48. DESIGN CONSISTENCY

The same concept must look the same throughout the application.

For example:

A "Pending" status should not look blue in one module and orange in another without a semantic reason.

---

# 49. DESIGN SYSTEM COMPONENT GROUPS

The component library should eventually contain:

## Foundations

* colors
* typography
* spacing
* radius
* shadows
* motion

## Navigation

* sidebar
* header
* breadcrumbs
* tabs
* menus

## Inputs

* input
* select
* combobox
* date picker
* checkbox
* radio
* switch
* upload

## Feedback

* toast
* alert
* banner
* progress
* tooltip

## Data

* table
* list
* timeline
* tree
* chart

## Layout

* container
* grid
* stack
* split panel
* drawer
* modal

## Business Components

* KPI card
* status badge
* activity feed
* approval panel
* document panel
* customer summary
* product summary
* inventory summary
* payment summary

---

# 50. DESIGN QUALITY CHECKLIST

Before a screen is considered complete, verify:

* Is the hierarchy clear?
* Is the primary action obvious?
* Are related actions grouped?
* Is the information density appropriate?
* Does it work on smaller screens?
* Does it support keyboard interaction?
* Are errors understandable?
* Are loading states implemented?
* Are empty states implemented?
* Are permissions respected?
* Are hover/focus states present?
* Does it follow the theme system?
* Does it use design tokens?
* Does it visually belong to the same product?

---

# 51. ANTI-PATTERNS

Do not create:

* random gradients
* excessive glassmorphism
* oversized cards
* excessive rounded corners
* unnecessary animations
* inconsistent icon sets
* giant typography in ERP screens
* low-contrast text
* rainbow dashboards
* generic template layouts
* decorative elements that reduce productivity

---

# 52. DESIGN GOAL

The final UI should feel like:

> A premium modern enterprise operating system designed specifically for real business work.

It should combine the professionalism of established ERP products with the usability and visual quality expected from modern web applications.

END OF DESIGN SYSTEM
