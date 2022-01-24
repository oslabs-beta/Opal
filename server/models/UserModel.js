const { Pool } = require('pg');

const URI =
  'postgres://setcemrb:1g50hezSaFJUI3viqizyjpOlvrIcLJyC@castor.db.elephantsql.com/setcemrb';

const pool = new Pool({ connectionString: URI });

module.exports = pool;
