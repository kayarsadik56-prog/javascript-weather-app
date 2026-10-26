const sehirInput = document.getElementById("sehirInput");
const araBtn = document.getElementById("araBtn");
const sonucAlani = document.getElementById("sonucAlani");
const hataMesaji = document.getElementById("hataMesaji");

const sehirAdi = document.getElementById("sehirAdi");
const sicaklik = document.getElementById("sicaklik");
const ruzgar = document.getElementById("ruzgar");

// Butona tıklandığında çalışır
araBtn.addEventListener("click", havaDurumuGetir);

// Enter tuşuna basıldığında da çalışır
sehirInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    havaDurumuGetir();
  }
});

async function havaDurumuGetir() {
  const sehir = sehirInput.value.trim();

  if (!sehir) {
    alert("Lütfen bir şehir adı yazın!");
    return;
  }

  // Önce eski sonuçları gizle
  sonucAlani.style.display = "none";
  hataMesaji.style.display = "none";

  try {
    // 1. Adım: Şehrin koordinatlarını (enlem / boylam) bul
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${sehir}&count=1&language=tr&format=json`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      hataMesaji.style.display = "block";
      return;
    }

    const enlem = geoData.results[0].latitude;
    const boylam = geoData.results[0].longitude;
    const resmiSehirAdi = geoData.results[0].name;

    // 2. Adım: Koordinatlara göre hava durumunu çek
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${enlem}&longitude=${boylam}&current_weather=true`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    const temp = Math.round(weatherData.current_weather.temperature);
    const wind = weatherData.current_weather.windspeed;

    // 3. Adım: Bilgileri ekrana yaz ve kutuyu göster
    sehirAdi.innerText = resmiSehirAdi;
    sicaklik.innerText = `${temp}°C`;
    ruzgar.innerText = `${wind} km/s`;

    sonucAlani.style.display = "block";
  } catch (error) {
    hataMesaji.innerText = "Bağlantı hatası oluştu!";
    hataMesaji.style.display = "block";
  }
}