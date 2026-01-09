let turno = 1;
let territorioSeleccionado = null;

function log(texto) {
  const div = document.getElementById("log");
  div.innerHTML += texto + "<br>";
  div.scrollTop = div.scrollHeight;
}

/* ================= FACCIONES ================= */

const facciones = {
  España: {
    nombre: "España",
    capital: "Madrid",
    territorios: ["Madrid"],
    generales: [{ nombre: "Hernán Cortés", territorio: "Madrid", tropas: 120 }],
  },
  Inglaterra: {
    nombre: "Inglaterra",
    capital: "Londres",
    territorios: ["Londres"],
    generales: [{ nombre: "Francis Drake", territorio: "Londres", tropas: 110 }],
  },
  Imperio_Azteca: {
    nombre: "Imperio_Azteca",
    capital: "Tenochtitlan",
    territorios: ["Tenochtitlan"],
    generales: [{ nombre: "Moctezuma", territorio: "Tenochtitlan", tropas: 130 }],
  },
  Imperio_Inca: {
    nombre: "Imperio_Inca",
    capital: "Cuzco",
    territorios: ["Cuzco"],
    generales: [{ nombre: "Atahualpa", territorio: "Cuzco", tropas: 125 }],
  },
  Civilización_Maya: {
    nombre: "Civilización_Maya",
    capital: "Tikal",
    territorios: ["Tikal"],
    generales: [{ nombre: "Kʼinich Janaabʼ", territorio: "Tikal", tropas: 120 }],
  }
};

const faccionesIA = [
  facciones.Inglaterra,
  facciones.Imperio_Azteca,
  facciones.Imperio_Inca,
  facciones.Civilización_Maya
];

const jugador = facciones.España;

/* ================= TERRITORIOS ================= */

const territorios = {
  Madrid: { nombre: "Madrid", dueño: "España", tropas: 80 },
  Londres: { nombre: "Londres", dueño: "Inglaterra", tropas: 80 },
  Tenochtitlan: { nombre: "Tenochtitlan", dueño: "Imperio_Azteca", tropas: 100 },
  Cuzco: { nombre: "Cuzco", dueño: "Imperio_Inca", tropas: 100 },
  Tikal: { nombre: "Tikal", dueño: "Civilización_Maya", tropas: 90 },

  La_Hispaniola: { nombre: "La Hispaniola", dueño: "Neutral", tropas: 40 },
  Panama: { nombre: "Panamá", dueño: "Neutral", tropas: 40 },
  Mexico: { nombre: "México", dueño: "Neutral", tropas: 50 },
  Peru: { nombre: "Perú", dueño: "Neutral", tropas: 50 },
  Argentina: { nombre: "Argentina", dueño: "Neutral", tropas: 45 },
  Norteamerica: { nombre: "Norteamérica", dueño: "Neutral", tropas: 60 }
};

/* ================= MAPA ================= */

const conexiones = {
  Madrid: ["La_Hispaniola"],
  Londres: ["Norteamerica"],
  La_Hispaniola: ["Panama", "Mexico"],
  Panama: ["Mexico", "Peru"],
  Mexico: ["Tenochtitlan"],
  Peru: ["Cuzco", "Argentina"],
  Tenochtitlan: ["Mexico"],
  Cuzco: ["Peru"],
  Tikal: ["Mexico"],
  Norteamerica: ["Mexico"],
  Argentina: ["Peru"]
};

/* ================= ASEDIOS ================= */

let asedios = [];

function iniciarAsedio(general, territorio, faccion) {
  asedios.push({
    atacante: faccion.nombre,
    general: general,
    territorio: territorio,
    turnos: 0
  });
  log(`🏰 ${faccion.nombre} inicia asedio en ${territorio}`);
}

function procesarAsedios() {
  asedios.forEach((a, i) => {
    const t = territorios[a.territorio];
    a.turnos++;
    t.tropas -= 10;

    if (t.tropas <= 0) {
      t.dueño = a.atacante;
      t.tropas = 40;
      a.general.territorio = a.territorio;
      facciones[a.atacante]?.territorios.push(a.territorio);
      log(`🏳️ ${a.territorio} cae tras asedio`);
      asedios.splice(i, 1);
    }
  });
}

/* ================= IA ================= */

function turnoIA() {
  faccionesIA.forEach(f => {
    f.generales.forEach(g => decidirMovimientoIA(g, f));
  });
}

function decidirMovimientoIA(general, faccion) {
  const opciones = conexiones[general.territorio];
  if (!opciones) return;

  const destino = opciones[Math.floor(Math.random() * opciones.length)];
  const t = territorios[destino];

  if (t.dueño !== faccion.nombre) {
    if (t.tropas > general.tropas) {
      iniciarAsedio(general, destino, faccion);
    } else {
      atacarIA(general, destino, faccion);
    }
  } else {
    general.territorio = destino;
  }
}

function atacarIA(general, destino, faccion) {
  const t = territorios[destino];
  const ataque = general.tropas + Math.random() * 40;
  const defensa = t.tropas + Math.random() * 30;

  if (ataque > defensa) {
    t.dueño = faccion.nombre;
    general.territorio = destino;
    general.tropas -= 20;
    t.tropas = 40;
    faccion.territorios.push(destino);
    log(`⚔️ ${faccion.nombre} conquista ${destino}`);
  } else {
    general.tropas -= 30;
    log(`❌ ${faccion.nombre} falla el ataque en ${destino}`);
  }
}

/* ================= INTERFAZ ================= */

function renderMapa() {
  const mapa = document.getElementById("mapa");
  mapa.innerHTML = "";

  Object.values(territorios).forEach(t => {
    const div = document.createElement("div");
    div.className = `territorio ${t.dueño}`;
    div.innerHTML = `<strong>${t.nombre}</strong><br>Dueño: ${t.dueño}<br>Tropas: ${t.tropas}`;
    div.onclick = () => seleccionarTerritorio(t.nombre);
    mapa.appendChild(div);
  });

  document.getElementById("turno").innerText = turno;
  document.getElementById("faccionJugador").innerText = jugador.nombre;
}

function seleccionarTerritorio(nombre) {
  territorioSeleccionado = nombre;
  const t = territorios[nombre];
  document.getElementById("nombreTerritorio").innerText = nombre;

  let html = "";
  if (t.dueño !== jugador.nombre) {
    html += `<button onclick="atacarJugador()">Atacar</button>`;
    html += `<button onclick="pedirAlianza()">Diplomacia</button>`;
  } else {
    html += "Territorio propio";
  }

  document.getElementById("acciones").innerHTML = html;
}

function atacarJugador() {
  const t = territorios[territorioSeleccionado];
  const general = jugador.generales[0];

  if (general.tropas < 40) {
    alert("Tropas insuficientes");
    return;
  }

  if (t.tropas > general.tropas) {
    iniciarAsedio(general, territorioSeleccionado, jugador);
  } else {
    atacarIA(general, territorioSeleccionado, jugador);
  }

  renderMapa();
}

function pedirAlianza() {
  alert("Diplomacia en desarrollo");
}

/* ================= TURNO ================= */

function siguienteTurno() {
  turno++;
  procesarAsedios();
  turnoIA();
  renderMapa();
}

/* ================= INICIO ================= */

renderMapa();
