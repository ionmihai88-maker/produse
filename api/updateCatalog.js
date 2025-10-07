// api/updateCatalog.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { categorii, subcategorii, produse } = req.body;
  const token = process.env.GITHUB_TOKEN;
  const username = "ionmihai88-maker";
  const repo = "produse";
  const path = "catalog.json";

  const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${path}`;

  try {
    // 1️⃣ Obține SHA-ul fișierului actual
    const getFile = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const fileData = await getFile.json();
    const sha = fileData.sha;

    // 2️⃣ Actualizează fișierul cu conținut nou
    const newContent = {
      message: "Actualizare catalog.json din aplicația Vercel",
      content: Buffer.from(
        JSON.stringify({ categorii, subcategorii, produse }, null, 2)
      ).toString("base64"),
      sha
    };

    const updateFile = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newContent)
    });

    if (updateFile.ok) {
      return res.status(200).json({ success: true });
    } else {
      const error = await updateFile.text();
      return res.status(500).json({ success: false, error });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
