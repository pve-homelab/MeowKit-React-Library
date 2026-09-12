You are building the official MeowKit React UI Library. This library must replicate and extend the visual identity of the MeowKit website (https://meowkit.cc/) and the GitHub repositories (https://github.com/mingolucky). Crawl the website and repos for colors, typography, layout, spacing, iconography, and design language. The library must be production‑ready and suitable for use in the MeowKit Companion App and MeowKitIDE.

Requirements:

1. Brand Extraction
   - Extract all colors used on meowkit.cc (backgrounds, accents, gradients, borders, text).
   - Extract typography (font families, weights, sizes).
   - Extract spacing, padding, margins, corner radii.
   - Extract icon styles and shapes.
   - Extract layout patterns (cards, sections, headers, footers).
   - Extract any animations or transitions.

2. Component Library
   Build a complete React component library including:
   - Buttons (primary, secondary, ghost, destructive)
   - Inputs (text, number, file, search)
   - Dropdowns, selects, toggles, switches
   - Tabs, segmented controls
   - Panels, cards, containers
   - Sidebars, toolbars, status bars
   - File explorer components
   - Modal dialogs, drawers, popovers
   - Notifications and toasts
   - Progress bars and loaders
   - Icons (MeowKit‑style)
   - Syntax highlighting theme for Monaco Editor
   - Layout primitives (Stack, Row, Column, Grid)

3. Theming System
   - Provide a global theme object containing:
     - Colors (primary, secondary, accent, background, surface, border, success, warning, error)
     - Typography (font families, sizes, weights)
     - Spacing scale
     - Border radius scale
     - Shadows and elevation
   - Provide dark and light themes.
   - Provide theme overrides for the MeowKitIDE.

4. Monaco Integration
   - Create a Monaco theme that matches MeowKit branding.
   - Custom colors for keywords, strings, comments, numbers, functions, types.
   - Custom cursor, selection, line highlight, gutter colors.
   - Custom icons for breakpoints, errors, warnings.

5. Companion App Integration
   - All UI in the MeowKit Companion App must use this library.
   - Provide specialized components:
     - FirmwareFlashingPanel
     - AppMarketplaceGrid
     - DeviceManagerPanel
     - SerialConsoleView
     - StorageManagerView
     - IDEToolbar
     - FileExplorerTree
     - BuildOutputPanel

6. Documentation
   - Auto‑generate documentation pages styled like meowkit.cc.
   - Include examples, props tables, usage patterns, and code samples.
   - Include a live playground.

Your task: Generate the full design system, component list, theme object, architecture, and implementation plan for the MeowKit React UI Library. Include all components, styles, tokens, and integration details. The output must be exhaustive, production‑ready, and technically precise.
