// Runs on Vercel at /api/recipe. Keeps the Sarvam key on the server.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  const food = (req.body?.food || "").trim();
  if (!food) {
    return res.status(400).json({ error: "Type the name of a food first." });
  }

  const response = await fetch("https://api.sarvam.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-subscription-key": process.env.SARVAM_API_KEY
    },
    body: JSON.stringify({
      model: "sarvam-105b-conversations",
      messages: [
        {
          role: "system",
          content: "You are a helpful cook. Given a dish, reply with a short recipe in plain text: a one-line intro, then 'Ingredients:' as a list with '- ' bullets, then 'Steps:' as a numbered list. No markdown headings or bold."
        },
        { role: "user", content: `Recipe for: ${food}` }
      ]
    })
  });

  const data = await response.json();
  const recipe = data.choices?.[0]?.message?.content;

  if (!response.ok || !recipe) {
    return res.status(502).json({ error: "Sarvam didn't send a recipe back. Try again." });
  }

  res.status(200).json({ recipe });
}
