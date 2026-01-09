// Estado del juego
let turno = 1;

let jugador = {
const facciones = {
  España: {
    faccion: "Corona Española",
    oro: 500,
    ejercito: 120,
    territorios: ["La Española"]
  },
  Aztecas: {
    faccion: "Imperio Azteca",
    oro: 400,
    ejercito: 140,
    territorios: ["Tenochtitlan"]
  },
  Incas: {
    faccion: "Imperio Inca",
    oro: 450,
    ejercito: 130,
    territorios: ["Cuzco"]
  },
  Mayas: {
    faccion: "Civilización Maya",
    oro: 420,
    ejercito: 125,
    territorios: ["Tikal"]
  }
};

const territorios = {
  "La Española": { dueño: "España", riqueza: 100 },
  "Tenochtitlan": { dueño: "Aztecas", riqueza: 200 },
  "Cuzco": { dueño: "Incas", riqueza: 180 }
  "Tikal": { dueño: "Mayas", riqueza: 180 }
};

function siguienteTurno() {
  turno++;
  jugador.oro += calcularIngresos();
  actualizarUI();
}

function calcularIngresos() {
  let ingreso = 0;
  jugador.territorios.forEach(t => {
    ingreso += territorios[t].riqueza;
  });
  return ingreso;
}

function atacar(territorio) {
  if (territorios[territorio].dueño === "España") {
    alert("Ese territorio ya es tuyo.");
    return;
  }

  if (jugador.ejercito < 50) {
    alert("Ejército insuficiente.");
    return;
  }

  jugador.ejercito -= 30;
  jugador.territorios.push(territorio);
  territorios[territorio].dueño = "España";

  alert("Has conquistado " + territorio);
  actualizarUI();
}

function actualizarUI() {
  document.getElementById("turno").innerText = turno;
  document.getElementById("oro").innerText = jugador.oro;
  document.getElementById("ejercito").innerText = jugador.ejercito;
  document.getElementById("territorios").innerText =
    jugador.territorios.join(", ");
}
function guardarPartida() {
  const estado = {
    turno,
    jugador,
    territorios
  };

  localStorage.setItem("conquista_guardado", JSON.stringify(estado));
  alert("Partida guardada correctamente");
}

function cargarPartida() {
  const data = localStorage.getItem("conquista_guardado");

  if (!data) {
    alert("No hay partida guardada");
    return;
  }

  const estado = JSON.parse(data);

  turno = estado.turno;
  jugador = estado.jugador;
  Object.assign(territorios, estado.territorios);

  actualizarUI();
  alert("Partida cargada");
}
