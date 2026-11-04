// Da credenciales temporales del servidor intermedio de Cloudflare.
// La clave vive en las variables de entorno de Vercel, nunca en este archivo.
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const id = process.env.TURN_KEY_ID, token = process.env.TURN_KEY_TOKEN;
  if (!id || !token) return res.status(503).json({ error: 'sin configurar' });
  const call = path => fetch(`https://rtc.live.cloudflare.com/v1/turn/keys/${id}/credentials/${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ttl: 14400 })
  });
  try {
    let r = await call('generate-ice-servers');
    if (!r.ok) r = await call('generate');
    if (!r.ok) return res.status(502).json({ error: 'cloudflare ' + r.status });
    const j = await r.json(), s = j.iceServers;
    return res.status(200).json({ iceServers: Array.isArray(s) ? s : [s] });
  } catch (e) { return res.status(502).json({ error: 'sin respuesta' }); }
};
