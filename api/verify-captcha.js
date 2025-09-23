const express = require("express");
const fetch = require("node-fetch"); // or global fetch in Node 18+
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// POST /verify-captcha
app.post("/verify-captcha", async (req, res) => {
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
    // Return only success
    res.json({ success: data.success });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Captcha API running on http://localhost:${port}`);
});
