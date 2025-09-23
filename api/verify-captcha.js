import fetch from "node-fetch";

export default async function handler(req, res) {
  // Allow requests from your domain
  res.setHeader("Access-Control-Allow-Origin", "https://dev.solutions.vision"); // or "*" for testing
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const { token, secret } = req.body;
  if (!token || !secret) {
    return res
      .status(400)
      .json({ success: false, message: "Missing token or secret" });
  }

  try {
    const params = new URLSearchParams();
    params.append("secret", secret);
    params.append("response", token);

    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        body: params,
      }
    );

    const data = await response.json();

    // Return full Google response for debugging
    return res.status(200).json({
      success: data.success,
      challenge_ts: data.challenge_ts,
      hostname: data.hostname,
      "error-codes": data["error-codes"],
      raw: data
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
