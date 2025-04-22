import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/rd-token", async (req, res) => {
  try {
    const response = await fetch("https://api.rd.services/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type:   "refresh_token",
        client_id:     process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        refresh_token: process.env.REFRESH_TOKEN
      })
    });
    const data = await response.json();
    if (!data.access_token) {
      return res.status(500).json({ error: "Falha ao gerar token", details: data });
    }
    res.json({ access_token: data.access_token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`RD‑Token server rodando na porta ${PORT}`));
