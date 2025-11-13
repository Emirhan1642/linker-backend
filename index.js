import express from "express";
import admin from "firebase-admin";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
app.use(bodyParser.json());

// 🔑 Firebase Admin’i başlat
const serviceAccount = JSON.parse(fs.readFileSync("./serviceAccountKey.json", "utf8"));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 🔔 Bildirim gönderen endpoint
app.post("/send-notification", async (req, res) => {
  try {
    const { token, title, body } = req.body;

    if (!token || !title || !body) {
      return res.status(400).json({ success: false, message: "Eksik parametre!" });
    }

    const message = {
      notification: { title, body },
      token,
    };

    const response = await admin.messaging().send(message);
    console.log("✅ Bildirim gönderildi:", response);

    res.status(200).json({ success: true, message: "Bildirim gönderildi!", response });
  } catch (error) {
    console.error("❌ Bildirim gönderme hatası:", error);
    res.status(500).json({ success: false, message: "Bildirim gönderilemedi.", error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server çalışıyor: ${PORT}`));
