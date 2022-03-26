const { runQuery } = require("../index");

module.exports = {
  Create: async (user_id, code) =>
    await runQuery(
      "INSERT INTO otps (user_id, code) VALUES ($1, $2)",
      user_id,
      code
    ),
  Delete: {
    ByUserId: async (user_id) =>
      await runQuery("DELETE FROM otps WHERE user_id = $1", user_id),
  },
  Get: {
    ByUserId: async (user_id) =>
      await runQuery(
        "SELECT code, created_at FROM otps WHERE user_id = $1",
        user_id
      ),
  },
};
