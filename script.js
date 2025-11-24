// Deteksi sederhana: ini device mobile atau bukan
function isMobile() {
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(
    navigator.userAgent
  );
}

// Helper umum untuk TikTok & Facebook
function setupDownloader(options) {
  const {
    type,
    formId,
    inputId,
    statusId,
    resultId,
    videoId,
    linkId,
    buttonId,
    endpoint,
  } = options;

  const form = document.getElementById(formId);
  const input = document.getElementById(inputId);
  const statusEl = document.getElementById(statusId);
  const resultEl = document.getElementById(resultId);
  const videoEl = document.getElementById(videoId);
  const downloadLink = document.getElementById(linkId);
  const button = document.getElementById(buttonId);

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const url = input.value.trim();
    if (!url) return;

    // Reset tampilan
    resultEl.classList.add("hidden");
    statusEl.textContent = `Lagi ngambil video ${type}...`;
    button.disabled = true;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        throw new Error("Gagal menghubungi server.");
      }

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || `Gagal memproses link ${type}.`);
      }

      const videoUrl = data.downloadUrl;

      if (!videoUrl || typeof videoUrl !== "string") {
        throw new Error("Server tidak mengembalikan link video yang valid.");
      }

      // ==== BEHAVIOR DOWNLOAD ====
      // Desktop → auto-download
      // Mobile → user tap tombol "Download Video"
      if (!isMobile()) {
        try {
          const a = document.createElement("a");
          a.href = videoUrl;
          a.download =
            type.toLowerCase() === "tiktok"
              ? "tiktok-video.mp4"
              : "facebook-video.mp4";
          document.body.appendChild(a);
          a.click();
          a.remove();
        } catch (e) {
          console.warn("Auto-download gagal, fallback ke tombol saja:", e);
        }
      }

      // Tampilkan preview & tombol download (desktop & mobile)
      videoEl.src = videoUrl;
      downloadLink.href = videoUrl;

      resultEl.classList.remove("hidden");
      statusEl.textContent = isMobile()
        ? "Kalau belum ke-save, tap tombol Download Video di bawah. Kalau kebuka di tab baru, pakai menu Save/Download di browser."
        : "";
    } catch (err) {
      console.error(err);
      statusEl.textContent = err.message || "Terjadi error.";
    } finally {
      button.disabled = false;
    }
  });
}

// TikTok (endpoint lama /api/download)
setupDownloader({
  type: "TikTok",
  formId: "tiktok-form",
  inputId: "tiktok-url",
  statusId: "tiktok-status",
  resultId: "tiktok-result",
  videoId: "tiktok-preview",
  linkId: "tiktok-download",
  buttonId: "tiktok-btn",
  endpoint: "/api/download",
});

// Facebook (endpoint baru /api/facebook)
setupDownloader({
  type: "Facebook",
  formId: "facebook-form",
  inputId: "facebook-url",
  statusId: "facebook-status",
  resultId: "facebook-result",
  videoId: "facebook-preview",
  linkId: "facebook-download",
  buttonId: "facebook-btn",
  endpoint: "/api/facebook",
});
