export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Doar metoda POST este permisă' });
  }

  const token = process.env.GITHUB_TOKEN; // tokenul GitHub
  const repo = 'USER/REPO'; // înlocuiește cu ex: userul tău și numele repo-ului
  const filePath = 'catalog.json'; // fișierul JSON din repo

  try {
    const { content } = req.body;
    const encoded = Buffer.from(content).toString('base64');

    const response = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Actualizare catalog automat din aplicație',
        content: encoded
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Eroare la actualizare');
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
