import express from "express";
import admin from "firebase-admin";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

// 🔑 Firebase Admin’i başlat
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 🔔 Bildirim gönderen endpoint (sadece data mesajı)
app.post("/send-notification", async (req, res) => {
  const { token, title, body, senderUid, receiverUid } = req.body;

  const message = {
    data: { title, body, senderUid, receiverUid },
    token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Mesaj başarıyla gönderildi:', response);
    res.status(200).send({ success: true, message: "Bildirim gönderildi." });
  } catch (error) {
    console.error('Mesaj gönderme hatası:', error);
    res.status(500).send({ success: false, message: "Bildirim gönderilemedi." });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server çalışıyor: ${PORT}`));
