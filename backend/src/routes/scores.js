import { Router } from "express";

export function scoresRoutes(db) {
  const router = Router();

  // Add new score
  router.post("/", async (req, res) => {
    try {
      const { name, score } = req.body;
      if (!name || typeof score !== "number") {
        return res.status(400).json({ error: "Name and score are required" });
      }

      await db.run("INSERT INTO scores (name, score) VALUES (?, ?)", [
        name.trim(),
        score,
      ]);

      res.status(201).json({ message: "Score added successfully" });
    } catch (err) {
      console.error("Error inserting score:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get top 10 scores
  router.get("/", async (_req, res) => {
    try {
      const scores = await db.all(
        "SELECT name, score, created_at FROM scores ORDER BY score DESC, created_at ASC LIMIT 10"
      );
      res.json(scores);
    } catch (err) {
      console.error("Error fetching scores:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}
