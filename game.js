// ================== ESTADO GLOBAL ==================
let turno = 1;
let relacion = "paz"; // estado inicial neutral
let jugador = null;
let ia = null;
const coloresFaccion = {
  "Corona Española": "#8b0000",
  "Imperio Azteca": "#006400",
  "Imperio Inca": "#b8860b",
  "Civilización Maya": "#1e90ff",
  "Neutral": "#555"
};
// ================== TERRITORIOS ==================
const territorios = {
  "La Española": { dueño: "Neutral", riqueza: 100 },
  "Tenochtitlan": { dueño: "Neutral", riqueza: 200 },
  "Cuzco": { dueño: "Neutral", riqueza: 180 },
  "Tikal": { dueño: "Neutral", riqueza: 160 },
  "Yucatán": { dueño: "Neutral", riqueza: 140 },
  "Andes del Norte": { dueño: "Neutral", riqueza: 150 }
};
const fronteras = {
  "La Española": ["Tenochtitlan"],
  "Tenochtitlan": ["La Española", "Tikal", "Cuzco"],
  "Tikal": ["Tenochtitlan"],
  "Cuzco": ["Tenochtitlan"]
};


// ================== INICIO ==================
function iniciarJuego(faccionElegida) {
  document.getElementById("seleccion").style.display = "none";
  document.getElementById("juego").style.display = "block";

  const facciones = {
    España: {
      faccion: "Corona Española",
      oro: 500,
      ejercito: 120,
      moral: 100,
      territorios: []
    },
    Aztecas: {
      faccion: "Imperio Azteca",
      oro: 400,
      ejercito: 140,
      moral: 100,
      territorios: []
    },
    Incas: {
      faccion: "Imperio Inca",
      oro: 450,
      ejercito: 130,
      moral: 100,
      territorios: []
    },
    Mayas: {
      faccion: "Civilización Maya",
      oro: 420,
      ejercito: 125,
      moral: 100,
      territorios: []
    }
  };

  jugador = structuredClone(facciones[faccionElegida]);

  const iaKey = Object.keys(facciones).find(f => f !== faccionElegida);
  ia = structuredClone(facciones[iaKey]);

  actualizarUI();
}

// ================== DIPLOMACIA ==================
function pedirPaz() {
  relacion = "paz";
  alert("Se establece la paz");
  actualizarUI();
}

function formarAlianza() {
  if (Math.random() > 0.5) {
    relacion = "alianza";
    alert("Alianza aceptada");
  } else {
    alert("La otra facción desconfía");
  }
  actualizarUI();
}

// ================== ATAQUE ==================
function atacar(nombre) {
if (territorios[territorio].dueño === jugador.faccion) {
  alert("Ese territorio ya es tuyo.");
  return;
}

if (!esTerritorioFrontera(territorio)) {
  alert("No es un territorio fronterizo.");
  return;
}

if (relacion === "paz") {
  relacion = "guerra";
}
  }

  if (relacion !== "guerra") {
    relacion = "guerra";
  }

  if (jugador.ejercito < 40) {
    alert("Ejército insuficiente");
    return;
  }

  const poderJugador = jugador.ejercito + jugador.moral + ventajaMilitar(jugador.faccion);
  const poderDefensa = Math.random() * 200;

  if (poderJugador > poderDefensa) {
    territorios[nombre].dueño = jugador.faccion;
    jugador.territorios.push(nombre);
    jugador.ejercito -= 30;
    jugador.moral += 5;
    alert("Conquista exitosa: " + nombre);
  } else {
    jugador.ejercito -= 20;
    jugador.moral -= 10;
    alert("Derrota en la batalla");
  }

  verificarVictoria();
  actualizarUI(const div = document.createElement("div");
div.className = "territorio";
div.style.background =
  coloresFaccion[data.dueño] || "#333";
);
}

// ================== IA ==================
function turnoIA() {
  if (ia.ejercito < 50) return;

  const objetivos = Object.entries(territorios)
    .filter(([_, t]) => t.dueño !== ia.faccion)
    .sort((a, b) => b[1].riqueza - a[1].riqueza);

  if (objetivos.length === 0) return;

  const [nombre] = objetivos[0];

  territorios[nombre].dueño = ia.faccion;
  ia.territorios.push(nombre);
  ia.ejercito -= 30;

  alert(ia.faccion + " conquista estratégicamente " + nombre);
  const objetivos = Object.entries(territorios)
  .filter(([nombre, t]) =>
    t.dueño !== ia.faccion &&
    ia.territorios.some(own =>
      fronteras[own]?.includes(nombre)
    )
  )
  .sort((a, b) => b[1].riqueza - a[1].riqueza);

}

// ================== TURNO ==================
function siguienteTurno() {
  turno++;
  jugador.oro += calcularIngresos();
  turnoIA();
  verificarVictoria();
  actualizarUI();
}

function calcularIngresos() {
  return jugador.territorios.reduce(
    (acc, t) => acc + territorios[t].riqueza,
    0
  );
}

// ================== VENTAJAS ==================
function ventajaMilitar(faccion) {
  switch (faccion) {
    case "Corona Española": return 40;
    case "Imperio Azteca": return 30;
    case "Imperio Inca": return 25;
    case "Civilización Maya": return 20;
    default: return 0;
  }
}
function esTerritorioFrontera(nombreTerritorio) {
  return jugador.territorios.some(t =>
    fronteras[t]?.includes(nombreTerritorio)
  );
}


// ================== VICTORIA ==================
function verificarVictoria() {
  if (jugador.territorios.length >= 4) {
    alert("Victoria histórica alcanzada");
  }
}

// ================== UI ==================
function actualizarUI() {
  document.getElementById("turno").innerText = turno;
  document.getElementById("faccion").innerText = jugador.faccion;
  document.getElementById("oro").innerText = jugador.oro;
  document.getElementById("ejercito").innerText = jugador.ejercito;
  document.getElementById("moral").innerText = jugador.moral;
  document.getElementById("relacion").innerText = relacion;
  document.getElementById("territorios").innerText =
    jugador.territorios.join(", ") || "Ninguno";

  const mapa = document.getElementById("mapa");
  mapa.innerHTML = "";

  Object.entries(territorios).forEach(([nombre, data]) => {
    const div = document.createElement("div");
    div.className = "territorio";

    div.innerHTML = `
      <strong>${nombre}</strong><br>
      Dueño: ${data.dueño}<br>
      Riqueza: ${data.riqueza}<br>
      ${data.dueño !== jugador.faccion
        ? `<button onclick="atacar('${nombre}')">Atacar</button>`
        : "<em>Territorio propio</em>"
      }
    `;

    mapa.appendChild(div);
    if (data.dueño !== jugador.faccion && esTerritorioFrontera(nombre)) {
  contenido += `<button onclick="atacar('${nombre}')">Atacar</button>`;
} else if (data.dueño !== jugador.faccion) {
  contenido += `<em>No fronterizo</em>`;
} else {
  contenido += `<em>Territorio propio</em>`;
}

  });
}

// ================== GUARDADO ==================
function guardarPartida() {
  localStorage.setItem(
    "conquista_guardado",
    JSON.stringify({ turno, jugador, ia, territorios, relacion })
  );
  alert("Partida guardada");
}

function cargarPartida() {
  const data = localStorage.getItem("conquista_guardado");
  if (!data) return alert("No hay partida guardada");

  const estado = JSON.parse(data);
  turno = estado.turno;
  jugador = estado.jugador;
  ia = estado.ia;
  relacion = estado.relacion;
  Object.assign(territorios, estado.territorios);

  actualizarUI();
  alert("Partida cargada");
}
