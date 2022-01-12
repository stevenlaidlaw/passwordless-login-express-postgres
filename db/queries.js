const db = require("./index");

const runQuery = async (query, ...args) => {
  console.log(`DB Request:::[${query}]::ARGS::[${args.join(",")}]`);
  const result = await db.query(query, args);
  console.log(
    `DB Result:::${result.rowLength} results::[${JSON.stringify(result.rows)}]`
  );
  return result.rows;
};

module.exports = {
  Users: {
    Create: async (name, email) =>
      await runQuery(
        "INSERT INTO users (name, email) VALUES ($1, $2)",
        name,
        email
      ),
    Get: {
      ByEmail: async (email) =>
        await runQuery(
          "SELECT id, name, email, active FROM users WHERE email = $1",
          email
        ),
      ByName: async (name) =>
        await runQuery(
          "SELECT id, name, email, active FROM users WHERE name = $1",
          name
        ),
      ByNameOrEmail: async (name, email) =>
        await runQuery(
          "SELECT id, name, email, active FROM users WHERE name = $1 OR email = $2",
          name,
          email
        ),
    },
  },
  Otp: {
    Create: async (user_id, code) =>
      await runQuery(
        "INSERT INTO otp (user_id, code) VALUES ($1, $2)",
        user_id,
        code
      ),
    Delete: {
      ByUserId: async (user_id) =>
        await runQuery("DELETE FROM otp WHERE user_id = $1", user_id),
    },
    Get: {
      ByUserId: async (user_id) =>
        await runQuery(
          "SELECT code, created_at FROM otp WHERE user_id = $1",
          user_id
        ),
    },
  },
};
