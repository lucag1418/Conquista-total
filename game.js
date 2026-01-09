// ================== ESTADO GLOBAL ==================
let turno = 1;
let relacion = "guerra"; // guerra | paz | alianza
let jugador = null;
let ia = null;

// ================== TERRITORIOS ==================
const territorios = {
  "La Española": { dueño: "Corona Española", riqueza: 100 },
  "Tenochtitlan": { dueño: "Imperio Azteca", riqueza: 200 },
  "Cuzco": { dueño: "Imperio Inca", riqueza: 180 },
  "Tikal": { dueño: "Civilización Maya", riqueza: 160 }
};

// ================== INICIO DEL JUEGO ==================
function iniciarJuego(faccionElegida) {
  document.getElementById("seleccion").style.display = "none";
  document.getElementById("juego").style.display = "block";

  const facciones = {
    España: {
      faccion: "Corona Española",
      oro: 500,
      ejercito: 120,
      moral: 100,
      territorios: ["La Española"]
    },
    Aztecas: {
      faccion: "Imperio Azteca",
      oro: 400,
      ejercito: 140,
      moral: 100,
      territorios: ["Tenochtitlan"]
    },
    Incas: {
      faccion: "Imperio Inca",
      oro: 450,
      ejercito: 130,
      moral: 100,
      territorios: ["Cuzco"]
    },
    Mayas: {
      faccion: "Civilización Maya",
      oro: 420,
      ejercito: 125,
      moral: 100,
      territorios: ["Tikal"]
    }
  };

  jugador = structuredClone(facciones[faccionElegida]);

  const iaKey = Object.keys(facciones).find(f => f !== faccionElegida);
  ia = structuredClone(facciones[iaKey]);

  actualizarUI();
}

// ================== DIPLOMACIA ==================
function pedirPaz() {
  if (Math.random() > 0.4) {
    relacion = "paz";
    alert("La IA acepta la paz");
  } else {
    alert("La IA rechaza la paz");
  }
  actualizarUI();
}

function formarAlianza() {
  if (Math.random() > 0.6) {
    relacion = "alianza";
    alert("Se ha formado una alianza");
  } else {
    alert("La IA desconfía");
  }
  actualizarUI();
}

// ================== BATALLA ==================
function atacar(territorio) {
  if (territorios[territorio].dueño === jugador.faccion) {
    alert("Ese territorio ya es tuyo");
    return;
  }

  if (relacion === "alianza") {
    alert("No podés atacar a un aliado");
    return;
  }

  if (!resolverBatalla()) return;

  territorios[territorio].dueño = jugador.faccion;
  jugador.territorios.push(territorio);
  jugador.ejercito -= 20;

  alert("Territorio conquistado: " + territorio);
  verificarVictoria();
  actualizarUI();
}

function resolverBatalla() {
  const poderJugador =
    jugador.ejercito + jugador.moral + ventajaMilitar(jugador.faccion);
  const poderIA =
    ia.ejercito + ia.moral;

  if (Math.random() * poderJugador > Math.random() * poderIA) {
    jugador.moral += 5;
    ia.moral -= 10;
    return true;
  } else {
    jugador.ejercito -= 30;
    jugador.moral -= 15;
    alert("Derrota en la batalla");
    return false;
  }
}

// ================== IA ==================
function turnoIA() {
  ia.oro += 100;
  if (ia.ejercito < 60) return;

  const posibles = Object.keys(territorios).filter(
    t => territorios[t].dueño !== ia.faccion
  );

  if (posibles.length === 0) return;

  const objetivo = posibles[Math.floor(Math.random() * posibles.length)];
  territorios[objetivo].dueño = ia.faccion;
  ia.territorios.push(objetivo);
  ia.ejercito -= 40;

  alert("La IA conquista " + objetivo);
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

// ================== VICTORIA ==================
function verificarVictoria() {
  if (jugador.faccion === "Corona Española" && jugador.territorios.length >= 4) {
    alert("Victoria histórica: Conquista del Nuevo Mundo");
  }

  if (jugador.faccion !== "Corona Española" && ia.ejercito <= 0) {
    alert("Victoria histórica: Resistencia indígena exitosa");
  }
}

// ================== UI ==================
function actualizarUI() {
  document.getElementById("turno").innerText = turno;
  document.getElementById("faccion").innerText = jugador.faccion;
  document.getElementById("oro").innerText = jugador.oro;
  document.getElementById("ejercito").innerText = jugador.ejercito;
  document.getElementById("moral").innerText = jugador.moral;
  document.getElementById("territorios").innerText =
    jugador.territorios.join(", ");
  document.getElementById("relacion").innerText = relacion;
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
