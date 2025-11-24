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

      videoEl.src = videoUrl;
      downloadLink.href = videoUrl;

      resultEl.classList.remove("hidden");
      statusEl.textContent = "";
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
