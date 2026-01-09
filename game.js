// Estado del juego
let turno = 1;
let relacion = "guerra"; // guerra | paz | alianza;
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

function iniciarJuego(faccionElegida) {
  document.getElementById("seleccion").style.display = "none";
  document.getElementById("juego").style.display = "block";

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

  jugador = JSON.parse(JSON.stringify(facciones[faccionElegida]));

  const iaFaccion = Object.keys(facciones).find(f => f !== faccionElegida);
  ia = JSON.parse(JSON.stringify(facciones[iaFaccion]));

  actualizarUI();
}

{let jugador = null;
let ia = null;
}
function turnoIA() {
  ia.oro += 100;

  if (ia.ejercito > 60) {
    const posibles = Object.keys(territorios).filter(
      t => territorios[t].dueño !== ia.faccion
    );

    if (posibles.length > 0) {
      const objetivo = posibles[Math.floor(Math.random() * posibles.length)];
      territorios[objetivo].dueño = ia.faccion;
      ia.territorios.push(objetivo);
      ia.ejercito -= 40;
      alert("La IA ha conquistado " + objetivo);
    }
  }
}

const territorios = {
  "La Española": { dueño: "España", riqueza: 100, moral: 100
 },
  "Tenochtitlan": { dueño: "Aztecas", riqueza: 200, moral: 100
},
  "Cuzco": { dueño: "Incas", riqueza: 180,  moral: 100
}
  "Tikal": { dueño: "Mayas", riqueza: 180, moral: 100}
};

function siguienteTurno() {
  turno++;
  jugador.oro += calcularIngresos();
  turnoIA();
  actualizarUI();
}
function resolverBatalla(objetivo) {
  if (relacion === "alianza") {
    alert("No podés atacar a un aliado");
    return false;
  }

  const poderJugador = jugador.ejercito + jugador.moral + ventajaMilitar(jugador.faccion);
  const poderIA = ia.ejercito + ia.moral;

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

function calcularIngresos() {
  let ingreso = 0;
  jugador.territorios.forEach(t => {
    ingreso += territorios[t].riqueza;
  });
  return ingreso;
}
function ventajaMilitar(faccion) {
  switch (faccion) {
    case "Corona Española":
      return 40; // armas de fuego
    case "Imperio Azteca":
      return 30; // guerra ritual
    case "Imperio Inca":
      return 25; // logística
    case "Civilización Maya":
      return 20; // estrategia y terreno
    default:
      return 0;
  }
}
function verificarVictoria() {
  if (jugador.faccion === "Corona Española" && jugador.territorios.length >= 4) {
    alert("Victoria histórica: Conquista del Nuevo Mundo");
  }

  if (jugador.faccion !== "Corona Española" && ia.ejercito <= 0) {
    alert("Victoria histórica: Resistencia indígena exitosa");
  }
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
