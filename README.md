# App Performance Analytics

Dashboard for visualizing downloads, revenue, and RPD (Revenue per Download) for apps over time. Users filter by date range, switch the metric shown in the chart, and view aggregated totals in the table.

**Live demo:** [https://fe-assignment-react-snowy.vercel.app/](https://fe-assignment-react-snowy.vercel.app/)

## Quick Start

1. `npm install`
2. `npm start`
3. Open `http://localhost:3000` in your browser

## What the project does

The page is composed, top to bottom, of:

- **Dashboard controls** (`Controls`) — start and end date filters that affect both the chart and the table
- **Chart** — time series of downloads or revenue per app; the Downloads/Revenue toggle lives here, not in the dashboard controls
- **Table** — aggregated totals for downloads, revenue, and RPD in the selected period

Data comes from a single static endpoint (`public/data.json`). Each app has an array of tuples in the format `[date, downloads, revenueInCents]`:

```json
[
  {
    "id": 1,
    "name": "Clash of Clans",
    "icon": "image_url",
    "data": [
      ["2020-01-01", 80000, 9808000],
      ["2020-01-02", 70000, 9790000]
    ]
  }
]
```

## Stack

React 18 · TypeScript · Create React App · Highcharts · MUI Data Grid · Day.js

## Decisions and improvements

This section covers **technical decisions** and **improvements beyond the assignment brief**. Functional requirements (controls, chart, table) and bonus items (loading, icons, inefficiencies) are implemented in the code but are not detailed here.

### Code structure

The original `App` concentrated fetch, dates, chart, and table in a single file, with loose components in `src/components/`.

**Folder organization:** feature-based structure with a clear separation between **global** code and **dashboard** code.

```
src/
├── app/                    # Application shell and global styles
├── features/dashboard/     # Main feature (colocation)
│   ├── components/         # chart, table, controls, errorState...
│   ├── hooks/              # useData, useDateRangeFromUrl
│   ├── utils/              # filterData, aggregateData
│   └── types.ts
├── components/             # Reusable UI (Card, DateField)
├── hooks/                  # Generic hooks (useDebouncedValue)
├── utils/                  # Pure formatting (date, currency, number)
└── config/                 # Library setup (dayjs, highcharts)
```

**Why:**

- **Colocation** — dashboard components, hooks, business utils, and types live together, making navigation, testing, and feature evolution easier.
- `**components/` at the root** — generic, domain-agnostic UI (`Card`, `DateField`), reusable by any feature without importing dashboard code.
- `**utils/` at the root vs `features/.../utils/`** — pure formatting at the root; date-range filtering and metric aggregation in the feature.
- **Global vs. feature boundary** — the organization makes explicit what is shareable (`components/`, formatting `utils/`, `config/`) and what belongs to the dashboard domain. This brought clarity during implementation and makes it easier to evolve the project without mixing responsibilities.

**What else changed:**

- Monolithic `App` split into `Dashboard`, `Controls`, `Chart`, `Table`, and dedicated hooks.
- Filter logic (`filterByDateRange`) and aggregation (`aggregateAppMetrics`) extracted as testable pure functions.
- Formatting utilities extracted to `src/utils/` with unit tests.
- Generic `Response` type replaced by `AppData` and `AppDataTuple` with named elements.

### Data loading (`useData`)

The original hook called `fetchData()` in the component body, **outside of a `useEffect`** — triggering a request on every re-render. It used a hardcoded URL (`localhost:3000`), did not check `response.ok`, and handled errors only with `console.error`.

**Improvements beyond the brief:**

- Fetch inside `useEffect` with `setTimeout` cleanup.
- Relative path `/data.json`.
- `response.ok` check, `error` and `refetch` states with `ErrorState` for UI retry.

**Why:** fix the re-fetch bug and expose network failures to the user — behavior the initial code did not provide.

### Date filters

**Improvements beyond the brief:**

- Range synced with `?start=...&end=...` in the URL via `history.replaceState`, with `popstate` support.
- Validation when the end date is before the start date, with field feedback.
- `DateField` with MUI `TextField` and error messages, instead of native `<input>`.
- Day.js with UTC plugin centralized in `config/dayjs.ts`.
- 300ms debounce on chart and table filtering via `useDebouncedValue` — inputs and the URL respond immediately; heavy recalculation (Highcharts + DataGrid) only runs after the user stops adjusting dates.

**Why:** URL persistence allows reload and link sharing; UTC ensures consistent comparisons regardless of browser timezone; debounce avoids re-rendering heavy libraries on every intermediate range change.

### Chart

**Decision — measure inside Chart:** the Downloads/Revenue toggle lives in the chart header; the `measure` state is local to `Chart`, not in `Controls`.

**Technical reason:** the metric only affects the chart. The table always shows downloads, revenue, and RPD. Local state avoids unnecessary prop drilling.

**UX reason:** global controls suggest the entire dashboard changes with the selection. Visual proximity = functional proximity.

> If the table starts reacting to the metric, the toggle can move up to `Controls` or a shared context.

**Improvements beyond the brief:**

- Empty state via the `no-data-to-display` module, instead of returning `null`.
- Config centralized in `config/highcharts.ts`, with accessibility and empty-state plugins.
- Hover interaction hint to isolate apps.

### Table

**Decision — revenue in cents:** sum and RPD in integers; conversion to dollars only at presentation (`formatCurrencyFromCents`), avoiding floating-point imprecision.

**Improvements beyond the brief:**

- DataGrid native empty state (`noRowsLabel`), instead of returning `null`.

### Performance

Meets the inefficiencies bonus and includes additional optimizations:

- `**useMemo` in chart and table** — replaces the initial code's `useEffect` + `useState`; avoids recalculating series, rows, and Highcharts options on every re-render.
- `**useCallback`** in data and date hooks.
- **Extracted logic** — filter and aggregation as pure functions outside components.
- **Debounce on date filter** — `useDebouncedValue` delays filtering by 300ms, reducing chart and table recalculations while the user adjusts the range.
- **Chart** — markers disabled; memoized series derivation.
- **Images** — `loading="lazy"` on app icons.

### Accessibility

Quality layer not required by the brief:

- **Landmark and structure** — `<main>`; heading hierarchy (`h1`, `h2`).
- **Forms** — labels associated via MUI `TextField`; errors linked to input (`helperText`).
- **Dynamic states** — chart loading with `role="status"`; error with `role="alert"`; semantic empty states.
- **Interactive controls** — toggle with `aria-label` and `aria-pressed`.
- **Decorative content** — icons with `aria-hidden` and `alt=""`.
- **Chart** — Highcharts accessibility plugin.
- **Table** — DataGrid native semantics and keyboard support.

### Tests

Not required by the brief. ~17 files covering utils, hooks, components, and dashboard integration.

## UI adjustments

The brief did not ask for visual refinement — the priority was functionality. Even so, targeted adjustments were made to make the dashboard more readable and guide the user, without building a full design system.

**Hierarchy and context**

- Page title and subtitle (`App Performance Analytics`) communicate the dashboard purpose on entry.
- Titles and subtitles on the chart and table indicate what each block shows and for which period — the user does not need to infer this from the data alone.

**Visual separation**

- White-surface cards wrap the chart and table; date filters sit directly on the dashboard (no card), since they apply globally to both sections.
- The Downloads/Revenue toggle is scoped to the chart card — it is not part of the dashboard-level filters.
- More consistent spacing and typography between blocks, reducing the feel of a "flat" page with loose components.

**Interface guidance**

- Hint below the chart explains how to isolate apps on hover — a Highcharts interaction that is not obvious without guidance.
- Invalid date feedback on filters.
- Metric toggle positioned in the chart header (not at the global top of the page), reinforcing that the selection only affects the chart — avoids the expectation that the table will also change.

**Data and error feedback**

The dashboard explicitly communicates what is happening with the data at each stage — the user is not left facing a blank or ambiguous screen.

- **Load error** — if fetch fails (network, non-ok HTTP), chart and table are replaced by an `ErrorState` with a clear message and "Try again" button for refetch, instead of only logging to the console.
- **Loading** — the chart shows a centered spinner (`role="status"`) while data loads; the table uses DataGrid native loading (progress bar over the grid).
- **No data in range** — the chart distinguishes two scenarios via Highcharts' `no-data-to-display` module:
  - *"No data available"* — no apps returned by the API;
  - *"No data for the selected date range"* — apps exist, but no points fall within the filtered range.
- **Empty table** — when there are no apps (`data` empty), the DataGrid shows *"No data available"* via `noRowsLabel`, keeping headers visible. With apps in the dataset but no points in the range, the table still lists apps with zero totals and RPD as `"-"`.
- **Date validation** — invalid range (start after end) shows *"End date must be after start date"* on both fields via MUI `helperText`, without blocking typing.

**Why:** each state (error, loading, empty, range with no points, invalid filter) has its own message — the user understands whether to retry, wait, adjust dates, or simply that there are no metrics for that period.

**Styling**

- CSS tokens in `:root` (colors, background, surface) and light BEM convention per component (`dashboard__title`, `chart__header`).
- Few colors, straightforward layout, no animations or decorative components — sufficient for the scope, without the overhead of Tailwind, extensive CSS Modules, or a custom component library.

The intent was to improve presentation and information clarity while keeping the visual simple and functional, without adding disproportionate complexity to the project.

## Opportunities for improvement

### Date selection input

`DateField` usability can still improve: it is not clear which part of the control opens the calendar (text field, icon, or clickable area). Worth revisiting the component — for example, with an explicit calendar button, larger click area, or a more guided date picker — to make the interaction obvious without trial and error.

### Code splitting

Highcharts and MUI Data Grid are heavy libraries; `React.lazy` + `Suspense` for chart/table would reduce initial JS (useful if this becomes a multi-page app).

### React Query (TanStack Query)

Useful with multiple endpoints or dynamic data: cache, deduplication, standardized states, and retry. For a single static JSON, the current hook is sufficient.

### Tailwind CSS

At larger scale, utilities or centralized tokens would reduce fragmentation — with the cost of migration and coexistence with MUI and Highcharts.

### Other

- Announce table loading for screen readers; review keyboard on toggle
- Fetch URL via `REACT_APP_API_URL`
- Sync `measure` in the URL if it one day affects other charts on the screen
- React Router;
- i18n;
- table pagination

---

## Deploy (Vercel)

A aplicação está publicada na [Vercel](https://vercel.com/) — plataforma de hospedagem pensada para front-end e apps estáticos/SSR. Ela conecta ao repositório Git, roda o build (`npm run build`) e serve os arquivos gerados em uma URL pública, com HTTPS e CDN incluídos.

O projeto está ligado a este repo: **cada push na branch `main` dispara um deploy automático** para [https://fe-assignment-react-snowy.vercel.app/](https://fe-assignment-react-snowy.vercel.app/). Não é preciso publicar manualmente — merge na `main` e a versão mais recente fica disponível em alguns minutos.

Para rodar localmente, use o [Quick Start](#quick-start) acima.

---

## Original assignment brief (Sensor Tower)

Texto original recebido com o projeto. Descreve o escopo pedido, os requisitos por seção e os itens de bônus.

Thank you for your interest in Sensor Tower! We appreciate your time and effort in completing this take-home assignment. We understand that your time is valuable, and we estimate that this assignment should not take more than 3-4 hours to complete. We look forward to reviewing your work and getting to know you better. If you have any questions or need further clarification, please don't hesitate to reach out. Good luck!

### Quick Overview

The page, from top to bottom, consists of:

- Controls to filter the data
- A chart with downloads or revenue data
- A table of the app and sales data

There is a single endpoint, "data.json" that returns sales data. The data looks like so:

```json
[
  {
    "id": 1,
    "name": "Clash of Clans",
    "icon": "image_url",
    "data": [
      ["2020-01-01", 80000, 9808000],
      ["2020-01-02", 70000, 9790000],
      ["2020-01-03", 70000, 9000000],
      ["2020-01-04", 95000, 3500000],
      ["2020-01-05", 90000, 2000000],
      ["2020-01-06", 65000, 1241201],
      ["2020-01-07", 42000, 2424241]
    ],
  }, ...
]
```

Each element in the "data" array is a tuple of the date, downloads, and revenue in cents.

### Tasks

Here are the tasks you should complete:

#### Controls

- [x] Add Downloads and Revenue buttons (aka "measures")
  - [x] They should be roughly formatted according to the screenshots
  - [x] The selected button should have a light blue background

#### Chart

- [x] The title should say...
  - [x] "Downloads by App" when the downloads button is selected
  - [x] "Revenue by App" when the revenue button is selected
- [x] The chart should show revenue data when the Revenue button is selected
- [x] The chart should only plot points within (and including) the start and end date inputs
  - [x] It should automatically update when the start or end date inputs change
- [x] The chart subtitle should have the date range:
  - e.g. "Jan 01, 2020 - Jan 07, 2020"
  - [x] It should automatically update when the start or end date inputs change
- [x] The chart's Y Axis should say "Downloads" or "Revenue ($)" depending on the selected measures
- [x] The chart's X Axis should have formatted dates:
  - e.g. "Jan 01, 20'", "Jan 07, 20'", etc

#### Table

- [x] Make the header row text bold
- [x] Fix the calculation for the total downloads cells
- [x] The download cells should be formatted with thousands commas
  - E.G. 80000 downloads should be "80,000"
- [x] Add a column for Revenue
  - [x] The table header should say "Revenue"
  - [x] The revenue cells should have the revenue, formatted with a dollar sign and commas. EG: "$140,043.51"
- [x] Add a column for "Revenue per Download"
  - [x] The table header should say "RPD"
  - [x] The RPD cells should have the revenue divided by downloads. If the value is invalid, the cell should say "-".
  - [x] The RPD cells should be formatted like the Revenue column
- [x] The table should only use data within (and including) the start and end date inputs to calculate the total downloads/revenue/RPD.

#### Bonus

- [x] Add a loading state for the chart and table
- [x] In the table, add each app's icon next to app name in the `App Name` column
- [x] Address any inefficiencies in the code

### Tips

- We use multiple libraries: Highcharts, MUI's Data Grid, and Dayjs. You can read their documentation/API here:
  - Highcharts - [https://api.highcharts.com/highcharts/](https://api.highcharts.com/highcharts/)
  - Data Grid - [https://mui.com/x/react-data-grid/](https://mui.com/x/react-data-grid/)
  - Dayjs - [https://day.js.org/en/](https://day.js.org/en/)

