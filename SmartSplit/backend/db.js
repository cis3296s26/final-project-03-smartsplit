const oracledb = require('oracledb');

const dbConfig = {
  user: 'tur02823@cis-linux2.temple.edu',
  password: 'Tia9boifeeno',
  connectString: 'localhost/XEPDB1'  // or 'localhost/orcl' depending on your Oracle install
};

async function getConnection() {
  return await oracledb.getConnection(dbConfig);
}

module.exports = { getConnection };
