const { EventEmitter } = require("events");
const logger = require("./logger.cjs");

const filmEvents = new EventEmitter();

filmEvents.on("filmDetailViewed", (filmId, filmTitle) => {
  logger(`Film detayı görüntülendi: ${filmTitle} (ID: ${filmId})`, "info", new Date(), `/films/${filmId}`);
  console.log(`📽️ Film detayı görüntülendi: ${filmTitle}`);
});

filmEvents.on("filmNotFound", (filmId) => {
  logger(`Film bulunamadı: ID ${filmId}`, "error", new Date(), `/films/${filmId}`);
  console.log(`❌ Film bulunamadı: ID ${filmId}`);
});

module.exports = filmEvents;