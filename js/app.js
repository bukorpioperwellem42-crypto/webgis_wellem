// app.js - update bagian ini saja

// Inisialisasi peta dengan view awal
const map = L.map('map', {
  // Opsi tetap, tapi turunkan minZoom sedikit agar bisa zoom out lebih fleksibel tanpa bug
  minZoom: 12,              // <--- ubah ke 12 (masih batasi, tapi tidak terlalu ketat agar zoom in/out lancar)
  maxZoom: 18,
  zoomControl: true,
  attributionControl: true
}).setView([-7.769, 110.408], 14);  // view awal tetap

// Tile layer tetap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Batasi wilayah (bounds tetap rapat, tapi tambah padding agar popup & zoom in tidak terpotong)
const southWest = L.latLng(-7.82, 110.36);
const northEast = L.latLng(-7.71, 110.44);
const bounds = L.latLngBounds(southWest, northEast);

map.setMaxBounds(bounds.pad(1.5));  // <--- tambah .pad(0.5) untuk padding 50% lebih lebar, agar zoom in & popup punya ruang
map.options.maxBoundsViscosity = 1.0;  // tetap lengket

// Load data dari JSON
let kostData = [];
let allMarkers = L.layerGroup().addTo(map);  // grup marker supaya mudah difilter nanti

fetch('data/kost.json')
  .then(response => {
    if (!response.ok) throw new Error('Gagal load kost.json');
    return response.json();
  })
  .then(data => {
    kostData = data;
    renderMarkers(kostData);  // render pertama kali semua marker
  })
  .catch(error => {
    console.error('Error loading kost data:', error);
    // Optional: tampilkan pesan di map kalau mau
    map.attributionControl.addAttribution('Error: Data kost gagal dimuat');
  });

// Fungsi render marker (dipisah supaya bisa dipanggil ulang saat filter)
function renderMarkers(filteredData) {
  allMarkers.clearLayers();  // hapus marker lama

  filteredData.forEach(kost => {
    const marker = L.marker([kost.lat, kost.lng]);

    // Tooltip sama persis seperti sebelumnya
    marker.bindTooltip(`
      <b>${kost.nama}</b><br>
      <img src="${kost.foto}" alt="${kost.nama}" 
           style="width: 200px; height: 150px; object-fit: cover; border-radius: 4px; margin-top: 5px; border: 1px solid #ddd;"
           onerror="this.src='https://via.placeholder.com/200x150?text=Foto+Tidak+Tersedia';">
      <br><small> • Klik untuk detail lengkap</small>
    `, {
      direction: 'top',
      permanent: false,
      opacity: 0.95,
      className: 'custom-tooltip',
      offset: [0, -10]
    });

    // Popup sama persis seperti sebelumnya
    marker.bindPopup(`
      <div style="width: 300px; font-family: Arial, sans-serif; line-height: 1.5;">
        <h3 style="margin: 0 0 10px; text-align: center; color: #333;">${kost.nama}</h3>
        <img src="${kost.foto}" alt="${kost.nama}" 
             style="width: 300px; height: 200px; object-fit: cover; display: block; margin: 0 auto 15px; border-radius: 6px; border: 1px solid #ddd;"
             onerror="this.src='https://via.placeholder.com/300x200?text=Foto+Tidak+Tersedia';">
        <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px 10px; align-items: start;">
          <strong>Nama Pemilik:</strong> <span>${kost.pemilik}</span>
          <strong>No.Telp:</strong> <span>${kost.Notelp}</span>
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

    marker.addTo(allMarkers);
  });
}


// Attribution custom (tetap)
map.attributionControl.addAttribution('WebGIS Pemetaan Kost Inklusif Mahasiswa Papua | Skripsi 2025');