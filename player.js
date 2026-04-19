export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { id, type } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing id' });

  // Use NHL Stats REST API — same source as nhl.com/stats page
  // gameTypeId=3 = playoffs, seasonId=20252026
  const isGoalie = type === 'goalie';
  const base = 'https://api.nhle.com/stats/rest/en';
  const report = isGoalie ? 'goalie/summary' : 'skater/summary';
  const url = `${base}/${report}?cayenneExp=playerId=${id} and gameTypeId=3 and seasonId=20252026`;

  try {
    const upstream = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NHL-pool-tracker/1.0)',
        'Accept': 'application/json',
      },
    });

    if (!upstream.ok) {
      console.error(`NHL Stats API ${upstream.status} for player ${id}`);
      return res.status(upstream.status).json({ data: [] });
    }

    const json = await upstream.json();
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    res.status(200).json(json);
  } catch (err) {
    console.error(`Fetch error for player ${id}:`, err.message);
    res.status(500).json({ data: [] });
  }
}
