// app.js - WebGIS Kost Inklusif Mahasiswa Papua di Depok Sleman

// Inisialisasi peta, fokus ke area Depok Sleman (pusat sekitar UGM/UNY)
const map = L.map('map').setView([-7.769, 110.408], 14);  // Zoom level 14 cukup detail

// Tambahkan tile layer dari OpenStreetMap (gratis, no API key)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Data kost - gunakan array ini dulu (hardcoded, mudah diedit)
const kostData = [
  {
    id: 1,
    nama: "Kost Buk Nur ITNY",
    alamat: "Jl. Kaliurang Km 5, Karangwuni, Caturtunggal, Depok, Sleman, Yogyakarta",
    lat: -7.771882023742445, 
    lng: 110.41676663637934,
    harga: "Rp 600.000 / bulan",
    fasilitas: ["WiFi", "AC", "Kamar Mandi Dalam", "Dapur Bersama", "Parkir"],
    status_penerimaan: "Menerima Mahasiswa (verif manual untuk Papua)",
    jarak_kampus: "Dekat UGM (~2 km)",
    foto: "assets/kos1.jpg"  
  },

  {
    id: 2,
    nama: "Kost Mahasiswa Depok",
    alamat: "Gg. Pogung, Caturtunggal, Depok, Sleman",
    lat: -7.7705,
    lng: 110.4150,
    harga: "Rp 750.000 / bulan",
    fasilitas: ["WiFi", "Kamar Mandi Dalam", "Parkir Motor"],
    status_penerimaan: "Menerima semua mahasiswa termasuk dari Papua",
    jarak_kampus: "Dekat UNY (~1.5 km)",
    foto: "https://cdn.home-designing.com/wp-content/uploads/2015/11/glass-house-with-pool.jpg"
  },

  {
    id: 3,
    nama: "Kost Mahasiswa Depok",
    alamat: "Gg. Pogung, Caturtunggal, Depok, Sleman",
    lat: -7.7705,
    lng: 110.4150,
    harga: "Rp 750.000 / bulan",
    fasilitas: ["WiFi", "Kamar Mandi Dalam", "Parkir Motor"],
    status_penerimaan: "Menerima semua mahasiswa termasuk dari Papua",
    jarak_kampus: "Dekat UNY (~1.5 km)",
    foto: "https://cdn.home-designing.com/wp-content/uploads/2015/11/glass-house-with-pool.jpg"
  },

  {
    id: 4,
    nama: "Kost Mahasiswa Depok",
    alamat: "Gg. Pogung, Caturtunggal, Depok, Sleman",
    lat: -7.77011,
    lng: 110.4160,
    harga: "Rp 750.000 / bulan",
    fasilitas: ["WiFi", "Kamar Mandi Dalam", "Parkir Motor"],
    status_penerimaan: "Menerima semua mahasiswa termasuk dari Papua",
    jarak_kampus: "Dekat UNY (~1.5 km)",
    foto: "https://cdn.home-designing.com/wp-content/uploads/2015/11/glass-house-with-pool.jpg"
  },
  {
    id: 5,
    nama: "Kost Mahasiswa Depok",
    alamat: "Gg. Pogung, Caturtunggal, Depok, Sleman",
    lat: -7.7720,
    lng: 110.4170,
    harga: "Rp 750.000 / bulan",
    fasilitas: ["WiFi", "Kamar Mandi Dalam", "Parkir Motor"],
    status_penerimaan: "Menerima semua mahasiswa termasuk dari Papua",
    jarak_kampus: "Dekat UNY (~1.5 km)",
    foto: "https://cdn.home-designing.com/wp-content/uploads/2015/11/glass-house-with-pool.jpg"
  },
  {
    id: 6,
    nama: "Kost Mahasiswa Depok",
    alamat: "Gg. Pogung, Caturtunggal, Depok, Sleman",
    lat: -7.7730,
    lng: 110.4175,
    harga: "Rp 750.000 / bulan",
    fasilitas: ["WiFi", "Kamar Mandi Dalam", "Parkir Motor"],
    status_penerimaan: "Menerima semua mahasiswa termasuk dari Papua",
    jarak_kampus: "Dekat UNY (~1.5 km)",
    foto: "https://cdn.home-designing.com/wp-content/uploads/2015/11/glass-house-with-pool.jpg"
  },
  {
    id: 7,
    nama: "Kost Mahasiswa Depok",
    alamat: "Gg. Pogung, Caturtunggal, Depok, Sleman",
    lat: -7.7740,
    lng: 110.4180,
    harga: "Rp 750.000 / bulan",
    fasilitas: ["WiFi", "Kamar Mandi Dalam", "Parkir Motor"],
    status_penerimaan: "Menerima semua mahasiswa termasuk dari Papua",
    jarak_kampus: "Dekat UNY (~1.5 km)",
    foto: "https://cdn.home-designing.com/wp-content/uploads/2015/11/glass-house-with-pool.jpg"
  },
  {
    id: 8,
    nama: "Kost Mahasiswa Depok",
    alamat: "Gg. Pogung, Caturtunggal, Depok, Sleman",
    lat: -7.7750,
    lng: 110.4185,
    harga: "Rp 750.000 / bulan",
    fasilitas: ["WiFi", "Kamar Mandi Dalam", "Parkir Motor"],
    status_penerimaan: "Menerima semua mahasiswa termasuk dari Papua",
    jarak_kampus: "Dekat UNY (~1.5 km)",
    foto: "https://cdn.home-designing.com/wp-content/uploads/2015/11/glass-house-with-pool.jpg"
  },
 
];

// Render marker untuk setiap kost
kostData.forEach(kost => {
  const marker = L.marker([kost.lat, kost.lng]).addTo(map);

  // Tooltip (hover preview) - muncul saat mouse over
  marker.bindTooltip(`
    <b>${kost.nama}</b><br>
    <img src="${kost.foto}" alt="${kost.nama}" 
         style="width: 200px; height: 150px; object-fit: cover; border-radius: 4px; margin-top: 5px; border: 1px solid #ddd;"
         onerror="this.src='https://via.placeholder.com/200x150?text=Foto+Tidak+Tersedia';">
    <br><small> • Klik untuk detail lengkap</small>
  `, {
    direction: 'top',
    permanent: false,         // Hanya saat hover
    opacity: 0.95,
    className: 'custom-tooltip',
    offset: [0, -10]          // Sedikit naik agar tidak nutup marker
  });

  // Popup (klik) - detail lengkap dengan alignment rapi (rata kiri, label bold)
  marker.bindPopup(`
    <div style="width: 300px; font-family: Arial, sans-serif; line-height: 1.5;">
      <h3 style="margin: 0 0 10px; text-align: center; color: #333;">${kost.nama}</h3>
      <img src="${kost.foto}" alt="${kost.nama}" 
           style="width: 300px; height: 200px; object-fit: cover; display: block; margin: 0 auto 15px; border-radius: 6px; border: 1px solid #ddd;"
           onerror="this.src='https://via.placeholder.com/300x200?text=Foto+Tidak+Tersedia';">
      <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px 10px; align-items: start;">
        <strong>Alamat:</strong> <span>${kost.alamat}</span>
        <strong>Harga:</strong> <span>${kost.harga}</span>
        <strong>Fasilitas:</strong> <span>${kost.fasilitas.join(', ')}</span>
        <strong>Status Penerimaan:</strong> <span>${kost.status_penerimaan}</span>
        <strong>Jarak ke Kampus:</strong> <span>${kost.jarak_kampus}</span>
      </div>
    </div>
  `, {
    maxWidth: 320,
    closeButton: true
  });
});

// Tambah attribution custom
map.attributionControl.addAttribution('WebGIS Pemetaan Kost Inklusif Mahasiswa Papua | Skripsi 2025');