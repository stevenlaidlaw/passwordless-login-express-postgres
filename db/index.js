const { Pool } = require("pg");

const { DATABASE_URL } = process.env;

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const runQuery = async (query, ...args) => {
  console.log(`DB Request:::QUERY::[${query}]::ARGS::[${args.join(",")}]`);
  const result = await pool.query(query, args);
  console.log(
    `DB Result:::COUNT::${result.rowCount}::DATA::[${JSON.stringify(
      result.rows
    )}]`
  );
  return result.rows;
};

module.exports = {
  runQuery,
};
