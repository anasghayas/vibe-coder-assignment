# Wobb Frontend Assignment

[![Netlify Status](https://api.netlify.com/api/v1/badges/influencersearch.netlify.app/deploy-status)](https://influencersearch.netlify.app/)
**Live Demo:** [https://influencersearch.netlify.app/](https://influencersearch.netlify.app/)

An influencer search and discovery application built with React, TypeScript, Vite, and Tailwind CSS v4. This project started as a rough starter template with intentional bugs and quality issues — the submission below documents every fix, design decision, and improvement made.

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Production build         |
| `npm run lint`  | Run ESLint               |

---

## Submission Notes

### Tech Stack

| Tool              | Version | Purpose                                        |
| ----------------- | ------- | ---------------------------------------------- |
| React             | 19      | UI framework                                   |
| TypeScript        | 6       | Type safety                                    |
| Vite              | 8       | Dev server and bundler                         |
| Tailwind CSS      | 4       | Utility-first styling                          |
| shadcn/ui         | 4       | Accessible, composable UI components           |
| Zustand           | 5       | Lightweight state management (replaces Context)|
| Sonner            | 2       | Toast notifications                            |
| Lucide React      | 1       | Icon library                                   |
| React Router DOM  | 7       | Client-side routing                            |

### Project Structure

```
src/
├── assets/data/         # JSON data files (search results + profile details)
├── components/
│   ├── ui/              # shadcn/ui primitives (button, card, tabs, avatar, etc.)
│   ├── Layout.tsx        # App shell with header, aurora background
│   ├── PlatformFilter.tsx# Tab-based platform switcher + search input
│   ├── ProfileCard.tsx   # Individual influencer card (memoized)
│   ├── ProfileList.tsx   # Grid of ProfileCards
│   ├── SelectedListPanel.tsx # Dialog to view/manage saved profiles
│   └── VerifiedBadge.tsx # Verified checkmark indicator
├── hooks/
│   └── useToggleList.ts  # Reusable add/remove list hook
├── pages/
│   ├── SearchPage.tsx    # Main dashboard with search and filters
│   └── ProfileDetailPage.tsx # Detailed influencer profile view
├── store/
│   └── useListStore.ts   # Zustand store with localStorage persistence
├── types/
│   └── index.ts          # Shared TypeScript interfaces
├── utils/
│   ├── dataHelpers.ts    # Data extraction, normalization, filtering
│   ├── formatters.ts     # Number/rate formatting utilities
│   └── profileLoader.ts  # Dynamic profile JSON loader
├── App.tsx               # Route definitions
├── main.tsx              # Entry point
└── index.css             # Global styles, CSS variables, aurora animation
```

---

## Bugs Found and Fixed

The starter code contained 12 intentional bugs and quality issues. Each one is documented below with the problem, how it was fixed, why that approach was chosen, and what alternative could have been used instead.

### Bug 1 — Case-Sensitive Search

- **File**: `src/utils/dataHelpers.ts`
- **Problem**: The search filter used `.includes(query)` directly, so searching "CRISTIANO" would not match "cristiano". Users expect search to be case-insensitive.
- **Fix**: Applied `.toLowerCase()` to both the query and the profile fields (`username`, `fullname`) before comparison.
- **Why this approach**: It is the simplest and most readable way to do case-insensitive matching. No external dependency needed.
- **Alternative**: Use a regular expression with the `i` flag (`new RegExp(query, 'i').test(username)`). This would also work but adds regex overhead for a simple substring check.

### Bug 2 — Engagement Rate Math Error

- **File**: `src/pages/ProfileDetailPage.tsx`
- **Problem**: The engagement rate was multiplied by `10000` instead of `100`, so a rate of `0.0247` displayed as `247.00%` instead of `2.47%`.
- **Fix**: Changed the multiplier to `100` and moved the formatting logic into a shared `formatEngagementRate` utility in `src/utils/formatters.ts`.
- **Why this approach**: Centralizing the formatter prevents the same mistake from happening in multiple places. A single function handles the conversion and formatting consistently.
- **Alternative**: Use a library like `numeral.js` or `Intl.NumberFormat` for locale-aware percentage formatting. Overkill for this use case, but would scale better for internationalization.

### Bug 3 — Engagements Display Showing Wrong Data

- **File**: `src/pages/ProfileDetailPage.tsx`
- **Problem**: The "Engagements" section was calling `formatEngagementRate(engagement_rate)` instead of displaying the actual `engagements` count. Users saw a percentage where they expected a number.
- **Fix**: Replaced the call with the correct `engagements` field and used `formatFollowers` to display it in a human-readable format (e.g., `5.9M`).
- **Why this approach**: The data was already available; it was just the wrong field being rendered. Straightforward data binding fix.
- **Alternative**: Remove the engagements row entirely and only show engagement rate, but that loses useful information.

### Bug 4 — Disabled "Add to List" Button Still Triggering Navigation

- **File**: `src/components/ProfileCard.tsx`
- **Problem**: The "Add to List" button was marked `disabled` and had `onClick={e => e.stopPropagation()}`. But since `disabled` buttons do not fire click events in HTML, the `stopPropagation()` never ran. Clicking anywhere on the button area bubbled up to the card's click handler and navigated to the profile page.
- **Fix**: Removed the `disabled` attribute entirely. Implemented proper add/remove functionality using the Zustand store, so the button actually works now.
- **Why this approach**: The button was a stub that was meant to be implemented. Making it functional solves the UX issue and fulfills the assignment requirement.
- **Alternative**: Keep the button disabled but wrap it in a `<span>` with its own `onClick={e => e.stopPropagation()}` to prevent the event from reaching the card. This is a hack and does not solve the real problem.

### Bug 5 — Unnecessary Re-renders from `clickCount` State

- **File**: `src/pages/SearchPage.tsx`
- **Problem**: A `clickCount` state variable was incremented on every profile click. This served no purpose but caused the entire `SearchPage` component (including all profile cards) to re-render on every click.
- **Fix**: Removed `clickCount` and all references to it.
- **Why this approach**: Dead state that triggers re-renders is a performance bug. Removing it is the correct fix.
- **Alternative**: If click tracking was actually needed (e.g., analytics), it should be handled outside of React state — for example, using `useRef` or an analytics library that does not trigger re-renders.

### Bug 6 — Duplicate `formatFollowers` Implementation

- **File**: `src/components/ProfileCard.tsx`
- **Problem**: `ProfileCard` defined its own `formatFollowersLocal` function that did the exact same thing as `formatFollowers` in `src/utils/formatters.ts`. Code duplication like this leads to inconsistencies when one copy is updated but the other is not.
- **Fix**: Removed `formatFollowersLocal` and imported `formatFollowers` from `src/utils/formatters.ts`.
- **Why this approach**: DRY (Don't Repeat Yourself). One source of truth for formatting logic.
- **Alternative**: Keep both but extract into a shared module. This is essentially what we did — the shared module already existed, the local copy was redundant.

### Bug 7 — Fixed Width Layout Breaking on Mobile

- **File**: `src/components/ProfileCard.tsx`
- **Problem**: The profile card had a hardcoded `w-[700px]` width. On any screen narrower than 700px, content overflowed or got cut off.
- **Fix**: Replaced the fixed width with a responsive layout. Cards now use a CSS grid (`grid-cols-1 md:grid-cols-2`) that stacks on mobile and shows two columns on larger screens.
- **Why this approach**: CSS grid is the modern standard for responsive card layouts. It handles the breakpoints cleanly without JavaScript.
- **Alternative**: Use `max-w-full` with a percentage-based width. Works, but grid gives better control over spacing and alignment.

### Bug 8 — Dead Code: Unused `SearchBar` Component

- **File**: `src/components/SearchBar.tsx`
- **Problem**: The `SearchBar` component existed in the codebase but was never imported or rendered anywhere. The actual search input lived inside `PlatformFilter.tsx`.
- **Fix**: Deleted `SearchBar.tsx`.
- **Why this approach**: Dead code adds confusion for anyone reading the codebase. If it is not used, it should not exist.
- **Alternative**: Refactor to actually use `SearchBar` as a standalone component. But since `PlatformFilter` already handles search well as a combined component, this would be unnecessary abstraction.

### Bug 9 — Missing `rel="noopener noreferrer"` on External Links

- **File**: `src/pages/ProfileDetailPage.tsx`
- **Problem**: The external profile link used `target="_blank"` without `rel="noopener noreferrer"`. This is a well-known security issue — the opened page can access `window.opener` and potentially redirect the original tab (tab-nabbing attack).
- **Fix**: Added `rel="noopener noreferrer"` to all external links.
- **Why this approach**: It is the standard security practice recommended by OWASP and MDN. No downside to adding it.
- **Alternative**: Avoid `target="_blank"` entirely and open links in the same tab. This is safer but worse UX since users lose their place in the app.

### Bug 10 — Fixed `#root` Width Breaking Responsiveness

- **File**: `src/index.css`
- **Problem**: The `#root` element had `width: 1126px` hardcoded in CSS. This made the entire app a fixed width, breaking the layout on any screen that was not exactly that size.
- **Fix**: The full UI redesign replaced this with a responsive container system using Tailwind's `container`, `max-w-screen-xl`, and responsive padding.
- **Why this approach**: Tailwind's container utilities handle responsive widths automatically with proper breakpoints.
- **Alternative**: Change to `max-width: 1126px; width: 100%;`. Quick fix, but the redesign made this moot since the entire layout system was replaced.

### Bug 11 — Missing `alt` Attribute on Profile Image (Card)

- **File**: `src/components/ProfileCard.tsx`
- **Problem**: The `<img>` tag for the profile picture had no `alt` attribute. Screen readers cannot describe the image to visually impaired users, and the HTML fails accessibility audits.
- **Fix**: Added a descriptive `alt` attribute using the user's full name. The redesign also replaced `<img>` with shadcn's `Avatar` component, which includes `AvatarFallback` for broken images.
- **Why this approach**: `alt` text is a basic accessibility requirement (WCAG 2.1 Level A). Using the person's name as alt text is semantically correct for a profile photo.
- **Alternative**: Use `alt=""` to mark it as decorative. Not appropriate here since the image carries meaning (it identifies the influencer).

### Bug 12 — Missing `alt` Attribute on Profile Image (Detail Page)

- **File**: `src/pages/ProfileDetailPage.tsx`
- **Problem**: Same as Bug 11 but on the detail page. The larger profile image also lacked an `alt` attribute.
- **Fix**: Added descriptive `alt` text and replaced with the `Avatar` component with a fallback showing the user's initials.
- **Why this approach**: Consistent with the fix in Bug 11. Both pages now follow the same accessible pattern.
- **Alternative**: Same as Bug 11.

---

## Features Implemented

### State Management with Zustand

The assignment required replacing React Context with Zustand. The store lives in `src/store/useListStore.ts` and handles:

- **Adding profiles** to a saved list (with duplicate prevention using `user_id` comparison)
- **Removing profiles** from the list
- **Checking** if a profile is already saved
- **Clearing** the entire list
- **Persistence** via Zustand's `persist` middleware, which syncs the list to `localStorage` automatically

Why Zustand over Context: Context re-renders every consumer when any value changes. Zustand uses selectors, so components only re-render when the specific slice of state they subscribe to changes. It also requires zero provider wrappers in the component tree.

### "Add to List" Feature

The stub button from the starter code is now fully functional:

- Clicking "Add to List" on a profile card or the detail page saves the profile to the Zustand store
- The button toggles between "Add to List" and "Added" with a visual state change
- Duplicate adds are prevented at the store level and show a warning toast
- A `useToggleList` custom hook (`src/hooks/useToggleList.ts`) encapsulates the toggle logic and toast feedback, so both `ProfileCard` and `ProfileDetailPage` share the same behavior without duplicating code
- The header shows a "Selected List" button that opens a dialog with all saved profiles, where users can view or remove them

### UI/UX Redesign

The original UI was a plain, unstyled layout. The redesign includes:

- **Dark theme** enabled globally via the `dark` class on `<html>`, using shadcn/ui's built-in dark mode CSS variables
- **Animated Aurora Background** adapted from Aceternity UI, using CSS gradients and keyframe animations (ported to work with Tailwind v4's `@theme` directive since the original used Tailwind v3 variables)
- **Glassmorphism header** with `backdrop-blur` and semi-transparent background
- **shadcn/ui components** throughout: Card, Avatar (with fallback initials), Badge, Button, Tabs, Dialog, Separator, ScrollArea, Input
- **Responsive grid layout** for profile cards (single column on mobile, two columns on desktop)
- **Tab-based platform switching** replacing the old button group
- **Profile detail page** with large avatar, stats grid (followers, likes, comments, engagement rate with icons), and a clean bio section
- **Toast notifications** via Sonner for user feedback on list actions

### Data Normalization

An additional runtime bug was discovered during testing: the YouTube JSON data has profiles where `username` is missing entirely (only `handle` or `custom_name` exists). This caused `filterProfiles` to crash with `TypeError: Cannot read properties of undefined`.

Fixed in `extractProfiles` in `src/utils/dataHelpers.ts` by normalizing every profile at extraction time:

```typescript
username: p.username || p.handle || p.custom_name || p.user_id || "unknown"
```

The `UserProfileSummary` type was also updated to include the optional `custom_name` and `handle` fields that the YouTube data uses.

### Performance Optimizations

- `ProfileCard` is wrapped in `React.memo` to skip re-renders when props have not changed
- `extractProfiles` and `filterProfiles` in `SearchPage` are wrapped in `useMemo` so they only recompute when `platform` or `searchQuery` actually changes
- The platform change handler is wrapped in `useCallback` to maintain a stable function reference
- Removed the `clickCount` state that was causing unnecessary full-page re-renders
- Profile detail JSON files are loaded via `import.meta.glob` (Vite's lazy imports) so they are code-split and loaded on demand

### URL Parameter Validation

The starter code cast `searchParams.get("platform")` directly as `Platform`, which is unsafe. If someone navigated to `?platform=myspace`, the app would break at runtime.

Fixed with explicit validation:

```typescript
const platform: Platform =
  platformParam === "youtube" || platformParam === "tiktok"
    ? platformParam
    : "instagram";
```

This defaults gracefully to Instagram for any invalid or missing value.

---

## Trade-offs and Assumptions

- **No unit tests**: The focus was on bug fixes, feature implementation, and UI quality within the time constraint. Given more time, I would add tests using Vitest and React Testing Library for the store, hooks, and components.
- **Static JSON data**: The app loads from local JSON files. I kept this as-is since it matches the starter code's approach. In production, this would be replaced with API calls.
- **No dark mode toggle**: Dark mode is always on. A toggle could be added using `next-themes` (already installed as a dependency) but the assignment did not require it.
- **shadcn/ui components are copied into the project**: This is by design — shadcn is not a traditional npm dependency. The components in `src/components/ui/` are owned by the project and can be customized freely.

---

## Future Scope

If this project were to continue, here is what I would prioritize:

1. **Search debouncing** — Add a small delay (200-300ms) before filtering so the app does not re-filter on every single keystroke. Use `useDeferredValue` or a debounce utility.
2. **Pagination or infinite scroll** — The current list renders all 10 profiles at once. With real data (thousands of results), this would need pagination or virtualized scrolling (e.g., `@tanstack/virtual`).
3. **API integration** — Replace static JSON with real API calls, add loading states, error boundaries, and retry logic.
4. **Testing** — Unit tests for the Zustand store and formatting utilities with Vitest. Component tests with React Testing Library. End-to-end tests with Playwright.
5. **Export saved list** — Allow users to export their saved influencer list as CSV or JSON.
6. **Advanced filtering** — Filter by follower count range, engagement rate threshold, verified status, or content category.
7. **Sort options** — Sort profiles by followers, engagement rate, or name.
8. **Dark/light mode toggle** — Let users pick their preferred theme using `next-themes`.
9. **Accessibility audit** — Run a full Lighthouse and axe-core audit and fix any remaining issues.

---

## What's Included

- **Search / Dashboard** — filter influencers by platform (Instagram, YouTube, TikTok) and search by username or full name
- **Profile Details** — click a profile to view extended data loaded from individual JSON files
- **Routing** — React Router with `/` (search) and `/profile/:username` (details)
- **Selected List** — save influencers to a persistent list, view and manage them from the header

Sample data lives in:

- `src/assets/data/search/` — platform search results (10 profiles each)
- `src/assets/data/profiles/` — detailed profile JSON per username
