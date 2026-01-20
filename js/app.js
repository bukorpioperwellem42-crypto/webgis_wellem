
// Inisialisasi peta dengan view awal
const map = L.map('map', {
  //zoom control
  zoomAnimation: true,                // Aktifkan animasi zoom (default true, tapi pastikan)
  zoomAnimationThreshold: 4,          // Animasi aktif sampai zoom level berubah >4 (default 4)
  fadeAnimation: true,                // Fade layer saat zoom (membuat transisi lebih mulus)
  markerZoomAnimation: true,          // Marker ikut beranimasi saat zoom
  zoomSnap: 0.25,                     // Zoom snap ke kelipatan 0.25 → transisi lebih halus
  zoomDelta: 0.5,                     // Setiap scroll wheel zoom lebih kecil → terasa lebih smooth
  wheelPxPerZoomLevel: 120,

  // max/min zoom in & out
  minZoom: 12,              
  maxZoom: 18,
  zoomControl: true,
  attributionControl: true
}).setView([-7.769, 110.408], 14);  // view awal peta

// Tile layer tetap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Batas wilayah peta ke area Yogyakarta)
const southWest = L.latLng(-7.82, 110.36);
const northEast = L.latLng(-7.71, 110.44);
const bounds = L.latLngBounds(southWest, northEast);

map.setMaxBounds(bounds.pad(1.5));  //  agar zoom in & popup punya ruang
map.options.maxBoundsViscosity = 1.0;  


// Fungsi untuk sembunyikan zoom control saat popup dibuka di mobile
if (L.Browser.mobile) {
  // Event saat popup dibuka (detail kost diklik)
  map.on('popupopen', function() {
    if (map.zoomControl) {
      map.zoomControl.getContainer().style.display = 'none';  // Sembunyikan zoom +/-
    }
  });

  // Event saat popup ditutup (klik close button atau klik luar)
  map.on('popupclose', function() {
    if (map.zoomControl) {
      map.zoomControl.getContainer().style.display = '';  // Kembalikan tampilan default
    }
  });
}


// Load data dari JSON
let kostData = [];
let allMarkers = L.layerGroup().addTo(map); 

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
    // Optional: tampilkan pesan di map jika gagal load data
    map.attributionControl.addAttribution('Error: Data kost gagal dimuat');
  });


// Fungsi render marker
function renderMarkers(filteredData) {
  allMarkers.clearLayers();  

  filteredData.forEach(kost => {
    const marker = L.marker([kost.lat, kost.lng]);

    // Tooltip dengan gambar miniatur
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

    // Popup dengan info lengkap
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

// Tambahan: buat zoom lebih smooth dengan easing custom 
map.on('zoomstart', function(e) {
  // Bisa tambah efek loading ringan jika mau
});

map.on('zoomend', function(e) {
  
  if (!bounds.contains(map.getCenter())) {
    map.panTo(bounds.getCenter(), { animate: true, duration: 0.8 });
  }
});


// Attribution 
map.attributionControl.addAttribution('WebGIS Pemetaan Kost Inklusif Mahasiswa Papua | Skripsi 2025');