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
    const message = {
      notification: { title, body },
      token,
    };
    await admin.messaging().send(message);
    res.status(200).send("Bildirim gönderildi!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Bildirim gönderilemedi.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server çalışıyor: ${PORT}`));
