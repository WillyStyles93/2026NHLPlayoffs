// api/today.js
// Returns today's NHL playoff games as a list of matchups.
// Called by the frontend on load and auto-refreshed at 5 AM EST.
//
// NHL API endpoint:
//   https://api-web.nhle.com/v1/schedule/now
//   Returns the current day's schedule with team abbreviations.

export default async function handler(req, res) {
  // Allow GET only
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://api-web.nhle.com/v1/schedule/now', {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      return res.status(502).json({ error: `NHL API responded with ${response.status}` });
    }

    const data = await response.json();

    // The schedule API returns gameWeek[]. The first entry whose date matches
    // today (in ET) is the one we want.
    const todayET = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' }); // 'YYYY-MM-DD'

    // Find today's game day block
    const dayBlock = (data.gameWeek || []).find(d => d.date === todayET);
    const games = dayBlock ? dayBlock.games : [];

    // Extract matchups — only playoff games (gameType 3)
    const matchups = games
      .filter(g => g.gameType === 3)
      .map(g => ({
        home: g.homeTeam?.abbrev || '',
        away: g.awayTeam?.abbrev || '',
        startTime: g.startTimeUTC || '',
      }))
      .filter(g => g.home && g.away);

    // Cache for 1 hour — stale-while-revalidate for 4 h
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=14400');
    return res.status(200).json({ date: todayET, matchups });

  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch schedule', detail: err.message });
  }
}
