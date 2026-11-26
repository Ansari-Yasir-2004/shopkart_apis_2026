const mysql = require("mysql2/promise");
const config = require("./db.conf");
const logger = require("./logger.config");

const pool = mysql.createPool(config.mysql);

pool
  .getConnection()
  .then((conn) => {
    console.log("DB CONNECTED");
    conn.release();
  })
  .catch((err) => {
    console.error("DB CONNECTION FAILED", err);
  });

let activeConnections = 0;

pool.on("acquire", function (connection) {
  activeConnections++;
  logger.info(
    `Connection ${connection.threadId} acquired. Active connection: ${activeConnections}`,
  );
});

pool.on("release", function (connection) {
  activeConnections--;
  logger.info(
    `Connection ${connection.threadId} released. Active connection: ${activeConnections}`,
  );
});

module.exports = pool;
