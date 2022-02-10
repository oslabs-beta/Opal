import pkg from 'pg';
const { Pool } = pkg;

// Consider adding alt option for database.

const URI = 'postgres://setcemrb:1g50hezSaFJUI3viqizyjpOlvrIcLJyC@castor.db.elephantsql.com/setcemrb';

const pool = new Pool({ connectionString: URI });

export default pool;
