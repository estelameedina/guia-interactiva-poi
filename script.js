const lista = document.getElementById("lista-poi");
const reproductor = document.getElementById("reproductor");
const mensaje = document.getElementById("mensaje");

// ======================
// RENDER POI
// ======================

function renderPOI() {
  pois.forEach(poi => {
    const card = document.createElement("div");
    card.classList.add("poi-card");

    card.innerHTML = `
      <h3>${poi.nombre}</h3>
      <p>${poi.descripcion}</p>
      <button>Reproducir guía</button>
    `;

    const boton = card.querySelector("button");

    boton.addEventListener("click", () => {
      reproductor.src = poi.audio;
      reproductor.play();
    });

    lista.appendChild(card);
  });
}

// ======================
// DISTANCIA (Haversine)
// ======================

function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// ======================
// GEOLOCALIZACIÓN
// ======================

function iniciarGeolocalizacion() {
  if (!navigator.geolocation) {
    mensaje.textContent = "Tu navegador no soporta geolocalización.";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const userLat = pos.coords.latitude;
      const userLon = pos.coords.longitude;

      detectarProximidad(userLat, userLon);
    },
    () => {
      mensaje.textContent = "Debes permitir la geolocalización.";
    }
  );
}

function detectarProximidad(lat, lon) {
  pois.forEach(poi => {
    const distancia = calcularDistancia(lat, lon, poi.lat, poi.lon);

    if (distancia < 200) {
      mensaje.textContent = `Estás cerca de ${poi.nombre}`;
    }
  });
}

// ======================
// INIT
// ======================

renderPOI();
iniciarGeolocalizacion();