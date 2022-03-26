const { runQuery } = require("../index");

module.exports = {
  Create: async (name, email) =>
    await runQuery(
      "INSERT INTO users (name, email) VALUES ($1, $2)",
      name,
      email
    ),
  Delete: {
    ById: async (id) => await runQuery("DELETE FROM users WHERE id = $1", id),
  },
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
};
