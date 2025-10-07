// api/updateCatalog.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Doar metoda POST este permisă." });
  }

  const { categorii, subcategorii, produse } = req.body;

  const username = "ionmihai88-maker";
  const repo = "produse";
  const token = process.env.GITHUB_TOKEN; // 🔒 citit automat din Vercel

  const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/catalog.json`;

  try {
    // 1️⃣ Obține SHA-ul curent al fișierului
    const resSha = await fetch(apiUrl, {
      headers: { Authorization: `token ${token}` },
    });
    const fileData = await resSha.json();

    // 2️⃣ Trimite commit nou către GitHub
    const updateRes = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Actualizare automată catalog.json din Vercel",
        content: Buffer.from(JSON.stringify({ categorii, subcategorii, produse }, null, 2)).toString("base64"),
        sha: fileData.sha,
      }),
    });

    if (updateRes.ok) {
      return res.status(200).json({ success: true });
    } else {
      const err = await updateRes.text();
      return res.status(500).json({ error: err });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Eroare la actualizarea catalog.json" });
  }
}
