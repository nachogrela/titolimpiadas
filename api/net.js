// Registra datos anónimos de conexión de una partida (demora, pérdida, cuadros) para poder diagnosticar el lag.
module.exports = (req, res) => {
  if (req.method === 'POST') { try { console.log('NET ' + JSON.stringify(req.body).slice(0, 800)); } catch (e) {} }
  res.status(204).end();
};
