// Funciones de fecha. Más adelante salen a un paquete npm propio.

function getTimeStamp() {
  return Date.now();
}

function getLongTime(locale = 'es-ES', timestamp = Date.now()) {
  return new Date(timestamp).toLocaleString(locale, {
    dateStyle: 'full',
    timeStyle: 'long',
  });
}

function getShortDate(locale = 'es-ES', timestamp = Date.now()) {
  return new Date(timestamp).toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

module.exports = { getTimeStamp, getLongTime, getShortDate };
