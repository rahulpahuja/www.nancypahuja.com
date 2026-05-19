# Nancy Pahuja Hub - Project Instructions

## Overview
The **Nancy Pahuja Hub** is a React-based application designed to showcase various screens and components of the Nancy Pahuja brand. It acts as a central dashboard that renders static HTML exports (from design tools or other sources) within a controlled environment.

## Technology Stack
- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Routing:** React Router DOM v6
- **Icons:** Lucide React
- **Styling:** Vanilla CSS with a defined design system in `index.css`.

## Project Structure
- `app/`: Root directory for the web application.
  - `src/`: Contains the React source code for the Hub.
    - `components/`: Core UI components (`Sidebar`, `Dashboard`, `ScreenShell`, `CustomerHeader`).
    - `App.tsx`: Main application entry point and layout definition.
    - `modules.ts`: **Central Configuration**. Defines the list of modules/screens displayed in the hub.
    - `index.css`: Global styles and design system variables.
  - `[module_name]/`: Individual directories for each screen (e.g., `homepage`, `product_listing_page`).
    - `code.html`: The static HTML content rendered in the `ScreenShell` iframe.
    - `screen.png`: (Optional) Preview image of the screen.

## Core Architecture
- **Hub & Spoke:** The `App` component provides the layout (Sidebar + Header). The `ScreenShell` component is the primary "spoke" that loads a module's `code.html` via an `iframe`.
- **Dynamic Loading:** Modules are discovered via the `modules` array in `src/modules.ts`.
- **Iframe Integration:** `ScreenShell.tsx` includes logic to inject styles into the iframe to hide redundant headers or adjust padding for a seamless hub experience.

## Conventions
- **Adding a New Screen:**
  1. Create a directory in `app/` (e.g., `app/new_feature/`).
  2. Add `code.html` (and optionally `screen.png`) to that directory.
  3. Add a new entry to the `modules` array in `app/src/modules.ts`.
- **Styling:** Use CSS variables defined in `:root` in `index.css` for consistent branding (e.g., `--color-deep-berry`, `--font-serif`).
- **Icons:** Use icons from `lucide-react` and register them in `modules.ts`.

## Development Workflows
- **Running Dev Server:** `cd app && npm run dev`
- **Building for Production:** `cd app && npm run build`
- **Linting:** `cd app && npm run lint`
