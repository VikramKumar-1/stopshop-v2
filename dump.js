const mysqldump = require('mysqldump');
const path = require('path');

const dbUrl = "mysql://2gpX4YD1zsCMQw1.root:fFU2kWPKhtCnSF3L@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict";

// Parse URL manually since it's a bit complex
const urlObj = new URL(dbUrl);
const username = decodeURIComponent(urlObj.username);
const password = decodeURIComponent(urlObj.password);
const host = urlObj.hostname;
const port = parseInt(urlObj.port) || 3306;
const database = urlObj.pathname.replace('/', '');

async function exportDump() {
  console.log("Starting SQL dump... this may take a minute.");
  try {
    await mysqldump({
      connection: {
        host: host,
        user: username,
        password: password,
        database: database,
        port: port,
        ssl: {
          rejectUnauthorized: false
        }
      },
      dumpToFile: path.join(__dirname, 'database_dump.sql'),
    });
    console.log("Dump successful! Saved as database_dump.sql");
  } catch (err) {
    console.error("Error creating dump:", err);
  }
}

exportDump();
