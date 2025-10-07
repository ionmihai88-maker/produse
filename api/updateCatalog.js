export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { categorii, subcategorii, produse } = req.body;

  if (!categorii || !subcategorii || !produse) {
    return res.status(400).json({ message: "Date lipsă în corpul cererii." });
  }

  const username = "ionmihai88-maker";
  const repo = "produse";
  const path = "catalog.json";
  const token = process.env.GITHUB_TOKEN; // 🔒 ascuns în Vercel

  try {
    // 1️⃣ Obține SHA-ul fișierului existent
    const fileRes = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${path}`, {
      headers: { Authorization: `token ${token}` },
    });

    if (!fileRes.ok) {
      const text = await fileRes.text();
      console.error("Eroare la obținerea SHA:", text);
      return res.status(500).json({ message: "Eroare la obținerea SHA." });
    }

    const fileData = await fileRes.json();
    const sha = fileData.sha;

    // 2️⃣ Actualizează fișierul
    const updateRes = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${path}`, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Actualizare automată catalog.json din API Vercel",
        content: Buffer.from(JSON.stringify({ categorii, subcategorii, produse }, null, 2)).toString("base64"),
        sha,
      }),
    });

    if (!updateRes.ok) {
      const text = await updateRes.text();
      console.error("Eroare la actualizare:", text);
      return res.status(500).json({ message: "Eroare la actualizarea fișierului." });
    }

    return res.status(200).json({ message: "✅ Fișier actualizat cu succes pe GitHub!" });
  } catch (err) {
    console.error("Eroare generală:", err);
    return res.status(500).json({ message: "Eroare server." });
  }
}
