export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing id' });

  try {
    const upstream = await fetch(
      `https://api-web.nhle.com/v1/player/${id}/game-log/now`,
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );
    if (!upstream.ok) return res.status(upstream.status).json({ error: 'NHL API error' });
    const data = await upstream.json();
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
