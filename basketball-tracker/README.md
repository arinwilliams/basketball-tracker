# 🏀 Basketball Tracker

A full-stack basketball stats tracking app built with React and Airtable. Coaches and team managers can manage their roster, log games, enter player stats, and view box scores. This is all synced to a live Airtable database.

---

## Features

- **Roster** — Add and remove players with jersey number and position
- **Games** — Log games with opponent, date, location, and result
- **Stats Entry** — Enter per-player stats for any game; updates existing records automatically
- **Box Scores** — View a full box score for any game with calculated points and team totals
- **Live Game** — Coming soon

---

## Dependencies

### Core
| Package | Purpose |
|---|---|
| `react` / `react-dom` | UI framework |
| `react-router` | Client-side routing |
| `vite` | Build tool and dev server |

### No direct DOM manipulation libraries are used.
All DOM updates are handled through React's virtual DOM via `useState`, `useReducer`, and `useEffect` hooks.

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/arinwilliams/basketball-tracker.git
cd basketball-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```bash
touch .env.local
```

Add the following:

```
VITE_AIRTABLE_API_TOKEN=your_airtable_api_token
VITE_AIRTABLE_BASE_ID=your_airtable_base_id
```

### 4. Run the development server

```bash
npm run dev
```

The app will be available at LOCALHOST

---

## API Connection

This app uses the **Airtable REST API** to store and retrieve all data.

### Service
- **Airtable** — [airtable.com](https://airtable.com)

### Credentials Required
| Variable | Where to Find |
|---|---|
| `VITE_AIRTABLE_API_TOKEN` | [airtable.com/create/tokens](https://airtable.com/create/tokens) — create a personal access token with `data.records:read` and `data.records:write` scopes |
| `VITE_AIRTABLE_BASE_ID` | Found in the URL when your base is open — starts with `app` |

### Required Airtable Tables

Your Airtable base must have the following tables with these exact field names:

#### Players
| Field | Type |
|---|---|
| `name` | Single line text |
| `number` | Number |
| `position` | Single line text |

#### Games
| Field | Type |
|---|---|
| `opponent` | Single line text |
| `date` | Date |
| `location` | Single line text |
| `result` | Single line text (`W` or `L`) |

#### Stats
| Field | Type |
|---|---|
| `name` | Single line text |
| `gameId` | Single line text |
| `playerId` | Single line text |
| `fgm2` | Number |
| `fga2` | Number |
| `fgm3` | Number |
| `fga3` | Number |
| `ftm` | Number |
| `fta` | Number |
| `rebounds` | Number |
| `assists` | Number |
| `steals` | Number |
| `blocks` | Number |
| `turnovers` | Number |
| `fouls` | Number |

---

## Notes

- `.env.local` is excluded from version control via `.gitignore`.
- Airtable field names are case-sensitive.