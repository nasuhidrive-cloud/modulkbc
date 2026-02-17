# modulkbc
KBC KEMENAG 2026

## Aplikasi Pembuatan Modul Ajar (KMA 1503 - KBC)

Aplikasi web sederhana untuk menyusun **Modul Ajar Madrasah** sesuai prinsip **KMA 1503** dan pendekatan **Kurikulum Berbasis Cinta (KBC)**.

### Fitur
- Form input data modul ajar (jenjang, fase, mapel, topik, tujuan, asesmen, dll).
- Generate via **OpenAI API (ChatGPT)** menggunakan endpoint `responses`.
- **Fallback otomatis ke puter.js** jika OpenAI gagal (misal limit/kuota habis atau error lain).
- Hasil ditampilkan dalam format markdown dan bisa disalin via tombol.

### Cara Menjalankan
Karena ini static web app, cukup jalankan server lokal:

```bash
python3 -m http.server 8080
```

Lalu buka:

```text
http://localhost:8080
```

### Cara Pakai
1. Isi API Key OpenAI dan model (default `gpt-4.1-mini`).
2. Isi form data modul ajar.
3. Klik **Generate Modul Ajar**.
4. Jika OpenAI gagal/limit, aplikasi otomatis mencoba `puter.js`.

> Catatan: API key hanya dipakai dari browser saat request dan tidak disimpan oleh aplikasi ini.
