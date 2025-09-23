const express = require("express");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// GET handler for K2 Describe Service
app.get("/verify-captcha", (req, res) => {
  res.json({
    info: {
      title: "Captcha Verify",
      version: "1.0",
    },
    paths: {
      "/verify-captcha": {
        post: {
          parameters: [
            { name: "token", in: "body", type: "string", required: true },
            { name: "secret", in: "body", type: "string", required: true },
          ],
          responses: {
            200: { description: "Returns success true/false" },
          },
        },
      },
    },
  });
});

// POST handler for actual verification
app.post("/verify-captcha", async (req, res) => {
  const { token, secret } = req.body;

  if (!token || !secret) {
    return res.status(400).json({ success: false });
  }

  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${secret}&response=${token}`,
      }
    );
    const data = await response.json();
    res.json({ success: data.success });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.listen(port, () => console.log(`Captcha proxy running on port ${port}`));
