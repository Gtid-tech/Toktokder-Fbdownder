export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { url } = req.body || {};

  if (!url || typeof url !== "string") {
    return res.status(400).json({
      success: false,
      message: "URL Facebook tidak valid.",
    });
  }

  try {
    // ==========================================
    //  TEMP: BACKEND FACEBOOK MASIH STUB
    //  Di sini nanti lu sambungkan ke provider Facebook pilihan lu
    //
    //  Contoh pola umum kalau pakai provider:
    //
    //  const apiUrl = "https://provider-facebook.com/api?url=" + encodeURIComponent(url);
    //  const response = await fetch(apiUrl, { headers: { ... } });
    //  const json = await response.json();
    //  const downloadUrl = json.data.hd || json.data.sd;
    //
    //  return res.status(200).json({ success: true, downloadUrl });
    //
    // ==========================================

    return res.status(500).json({
      success: false,
      message:
        "FBdownder masih beta. Backend Facebook belum dihubungkan ke provider mana pun.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error FBdownder, coba lagi nanti.",
    });
  }
}
