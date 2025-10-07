export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { categorii, subcategorii, produse } = req.body;

  const token = process.env.GITHUB_TOKEN; // 🔒 se ia din Environment Variables din Vercel
  const username = "ionmihai88-maker";
  const repo = "produse";
  const path = "catalog.json";

  const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${path}`;

  try {
    // 1️⃣ Obține SHA-ul fișierului existent
    const currentFile = await fetch(apiUrl, {
      headers: { Authorization: `token ${token}` }
    });
    const currentData = await currentFile.json();
    const sha = currentData.sha;

    // 2️⃣ Creează conținut nou codificat în base64
    const newContent = btoa(unescape(encodeURIComponent(JSON.stringify({ categorii, subcategorii, produse }, null, 2))));

    // 3️⃣ Trimite commit-ul nou
    const updateRes = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "Actualizare automată catalog.json (Vercel API)",
        content: newContent,
        sha
      })
    });

    if (updateRes.ok) {
      res.status(200).json({ message: "✅ Fișierul a fost actualizat cu succes pe GitHub!" });
    } else {
      const errText = await updateRes.text();
      res.status(400).json({ message: "❌ Eroare la update", errText });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Eroare internă", err: err.message });
  }
}
