import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// 1) configura o CORS para **qualquer** origem (pode restringir apenas à sua LP se quiser)
app.use(cors({ origin: "*" }));
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
    // 2) devolve o token com CORS liberado
    res.json({ access_token: data.access_token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Token server rodando na porta ${PORT}`));
