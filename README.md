# 2026 NHL Playoff Pool Tracker

Live scoring dashboard for a 5-manager NHL playoff pool.

## Scoring System

| Event | Points |
|-------|--------|
| Goal (skater) | +1 |
| Assist (skater) | +1 |
| Goalie Win | +1 |
| Goalie Shutout | +4 |

## Managers

| Manager | Draft Column |
|---------|-------------|
| Mike P  | Porf        |
| Mike I  | Mike I      |
| Matt    | Matt        |
| Kyle    | Kyle        |
| Chad    | Chad        |

## Stats Source

Stats are pulled from the **official NHL API** (`api-web.nhle.com`) — the same backend that powers NHL.com. The site filters for **playoff games only** (game type 3) and refreshes automatically every 5 minutes. A manual Refresh button is also available.

## Setup (GitHub + Vercel)

### 1. Create a GitHub repo

```bash
git init nhl-pool
cd nhl-pool
cp /path/to/index.html .
cp /path/to/README.md .
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/nhl-pool.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New → Project**
3. Import your `nhl-pool` repo
4. Leave all defaults (it's a static site — no build step needed)
5. Click **Deploy**

Your site will be live at `https://nhl-pool.vercel.app` (or a custom domain).

### 3. Share with friends

Send them the Vercel URL. Stats are fetched client-side from the NHL API, so everyone sees the same data in real time without any backend.

## Updating Draft Picks

Draft picks are stored in `index.html` in the `DRAFT` object near the top of the `<script>` block. Each player entry looks like:

```js
{ nhlId: 8478402, name: 'Connor McDavid', team: 'EDM', type: 'skater' }
```

To find an NHL player's ID: go to `https://www.nhl.com/player/PLAYER-NAME` and check the URL — the number at the end is the NHL ID.

To update picks:
1. Edit `index.html` locally
2. `git commit -am "Update picks"` + `git push`
3. Vercel auto-deploys in ~30 seconds

## Notes

- The NHL API is public and free — no API key required
- Stats load on page open and refresh every 5 minutes
- Click a manager's score card to filter views to their team only
- Toggle between **Teams** and **Leaderboard** views using the buttons
- The NHL API only returns playoff stats once the playoffs begin; scores will show 0 until then
