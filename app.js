const form = document.getElementById("moduleForm");
const output = document.getElementById("output");
const statusEl = document.getElementById("status");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");

function setStatus(message, type = "idle") {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
}

function buildPrompt(data) {
  return `Anda adalah penyusun Modul Ajar Madrasah ahli KMA 1503 berbasis Kurikulum Berbasis Cinta (KBC) Kementerian Agama.

Buatkan MODUL AJAR lengkap, terstruktur, praktis diterapkan guru, dan bernuansa rahmatan lil alamin.

Data input:
- Jenjang: ${data.jenjang}
- Kelas/Fase: ${data.kelasFase}
- Mata Pelajaran: ${data.mapel}
- Semester: ${data.semester}
- Topik: ${data.topik}
- Alokasi Waktu: ${data.alokasiWaktu}
- Tujuan Pembelajaran: ${data.tujuan}
- Profil Pelajar Rahmatan lil 'Alamin: ${data.profil || "(belum diisi)"}
- Nilai KBC utama: ${data.nilaiKBC || "(belum diisi)"}
- Asesmen diinginkan: ${data.asesmen || "(belum diisi)"}
- Catatan tambahan: ${data.catatan || "(belum diisi)"}

Wajib memuat bagian-bagian berikut:
1) Identitas modul
2) Kompetensi awal
3) Sarana/prasarana/media
4) Target peserta didik dan diferensiasi
5) Capaian pembelajaran & tujuan pembelajaran
6) Pemahaman bermakna & pertanyaan pemantik
7) Integrasi nilai KBC secara eksplisit
8) Langkah pembelajaran (pendahuluan, inti, penutup) rinci per aktivitas
9) Asesmen diagnostik, formatif, dan sumatif + rubrik singkat
10) Remedial dan pengayaan
11) Refleksi guru dan peserta didik
12) Lampiran LKPD singkat/contoh tugas

Gunakan format Markdown dengan heading jelas, tabel jika membantu, dan bahasa Indonesia formal yang mudah dipahami guru madrasah.`;
}

async function generateWithOpenAI(prompt, apiKey, model) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: prompt,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    const error = new Error(`OpenAI error ${response.status}: ${errText}`);
    error.status = response.status;
    throw error;
  }

  const json = await response.json();
  return json.output_text || "Tidak ada output_text dari OpenAI.";
}

async function generateWithPuter(prompt) {
  if (!window.puter?.ai?.chat) {
    throw new Error("puter.js tidak terdeteksi. Pastikan skrip puter.js berhasil dimuat.");
  }

  const result = await window.puter.ai.chat(prompt, {
    model: "gpt-4.1-mini",
  });

  if (typeof result === "string") return result;
  if (result?.message?.content) return result.message.content;
  if (result?.text) return result.text;
  return JSON.stringify(result, null, 2);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = Object.fromEntries(new FormData(form).entries());
  const apiKey = document.getElementById("openaiKey").value.trim();
  const model = document.getElementById("openaiModel").value.trim() || "gpt-4.1-mini";
  const prompt = buildPrompt(formData);

  generateBtn.disabled = true;
  setStatus("Menyusun modul dengan OpenAI...", "warn");
  output.textContent = "Sedang memproses...";

  try {
    if (!apiKey) {
      throw new Error("API key OpenAI belum diisi.");
    }

    const openAIResult = await generateWithOpenAI(prompt, apiKey, model);
    output.textContent = openAIResult;
    setStatus("Berhasil generate dengan OpenAI.", "ok");
    return;
  } catch (openAIError) {
    console.warn("OpenAI gagal, mencoba fallback puter.js", openAIError);
    setStatus("OpenAI gagal/limit tercapai. Mencoba fallback puter.js...", "warn");
  }

  try {
    const puterResult = await generateWithPuter(prompt);
    output.textContent = puterResult;
    setStatus("Berhasil generate dengan puter.js (fallback).", "ok");
  } catch (puterError) {
    output.textContent = `Gagal generate modul.\n\nDetail error:\n${puterError.message}`;
    setStatus("Gagal pada OpenAI dan fallback puter.js.", "error");
  } finally {
    generateBtn.disabled = false;
  }
});

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(output.textContent);
    setStatus("Hasil berhasil disalin ke clipboard.", "ok");
  } catch {
    setStatus("Gagal menyalin. Browser menolak akses clipboard.", "warn");
  }
});
