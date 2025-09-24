import fetch from "node-fetch";

// Remove dotenv import as it's not needed in Vercel
const SECRET = process.env.RECAPTCHA_SECRET_KEY; // Changed variable name to match Vercel config

if (!SECRET) {
  throw new Error(
    "RECAPTCHA_SECRET_KEY environment variable is not configured"
  );
}

export default async function handler(req, res) {
  // Allow requests from your domain
  res.setHeader("Access-Control-Allow-Origin", "https://dev.solutions.vision"); // or "*" for testing
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const { token } = req.body; // Only need the token from client
  if (!token) {
    return res.status(400).json({ success: false, message: "Missing token" });
  }

  try {
    const params = new URLSearchParams();
    params.append("secret", SECRET); // secret is only on server
    params.append("response", token);

    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      { method: "POST", body: params }
    );

    const data = await response.json();

    return res.status(200).json({
      success: data.success,
      challenge_ts: data.challenge_ts,
      hostname: data.hostname,
      "error-codes": data["error-codes"],
      raw: data,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
