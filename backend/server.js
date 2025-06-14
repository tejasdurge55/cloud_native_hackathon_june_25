const express = require("express");
const cors = require("cors");
const { Client } = require("pg");

const app = express();
app.use(cors());
app.use(express.json()); // This line is important to read POST body

// Connect to PostgreSQL
const conn = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432, // port should be a number, not string
  password: "root",
  database: "chatbotDb",
});

conn
  .connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ Connection error:", err));

// GET: fetch messages
app.get("/api/messages", async (req, res) => {
  try {
    const result = await conn.query("select * from messages");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error in GET /api/messages:", err);
    res.status(500).send("Server error");
  }
});

// POST: add new message
app.post("/api/messages", async (req, res) => {
  const { role, content } = req.body;

  if (!role || !content) {
    return res.status(400).json({ error: "role and content are required" });
  }

  try {
    const result = await conn.query(
      "INSERT INTO messages (role, content) VALUES ($1, $2) RETURNING *;",
      [role, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error in POST /api/messages:", err);
    res.status(500).send("Server error");
  }

  //   await conn.query(
  //     "INSERT INTO messages (role, content) VALUES ($1, $2) RETURNING *;",
  //     [role, content]
  //   );
});
app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
