/* ================= ESTADO GENERAL ================= */

let turno = 1;
let relacion = "neutral";
let jugador = null;
let ia = null;

/* ================= TERRITORIOS ================= */

const territorios = {
  "Madrid": crearTerritorio("Madrid"),
  "Londres": crearTerritorio("Londres"),
  "Tenochtitlan": crearTerritorio("Tenochtitlan"),
  "Cuzco": crearTerritorio("Cuzco"),
  "Tikal": crearTerritorio("Tikal"),
  "México": crearTerritorio("México"),
  "Centroamérica": crearTerritorio("Centroamérica"),
  "Andes": crearTerritorio("Andes"),
  "Argentina": crearTerritorio("Argentina"),
  "Brasil": crearTerritorio("Brasil"),
  "Norteamérica": crearTerritorio("Norteamérica")
};

function crearTerritorio(nombre) {
  return {
    nombre,
    dueño: "Neutral",
    moral: 100,
    edificios: {
      mercado:0, mina:0, cultivos:0, templo:0, cuartel:0, puerto:0
    }
  };
}

/* ================= LÍDERES ================= */

const lideres = {
  "Corona Española":"Carlos I",
  "Inglaterra":"Enrique VIII",
  "Imperio Azteca":"Moctezuma II",
  "Imperio Inca":"Huayna Cápac",
  "Civilización Maya":"Ah Cacao"
};

/* ================= DINASTÍAS ================= */

const princesas = {
  "Corona Española":["Juana","Isabel"],
  "Inglaterra":["María","Ana"],
  "Imperio Azteca":["Xochitl","Chimalma"],
  "Imperio Inca":["Mama Ocllo","Coya Rimay"],
  "Civilización Maya":["Ix Chel","Yax Kuk"]
};

/* ================= INICIO ================= */

function iniciarJuego(faccion) {
  document.getElementById("seleccion").style.display="none";
  document.getElementById("juego").style.display="block";

  jugador = crearFaccion(faccion);
  ia = crearFaccion(faccion === "Corona Española" ? "Imperio Azteca" : "Corona Española");

  territorios[jugador.capital].dueño = jugador.faccion;
  territorios[ia.capital].dueño = ia.faccion;

  log("Comienza la campaña");
  actualizarUI();
  renderMapa();
}

function crearFaccion(faccion) {
  const capitales = {
    "Corona Española":"Madrid",
    "Inglaterra":"Londres",
    "Imperio Azteca":"Tenochtitlan",
    "Imperio Inca":"Cuzco",
    "Civilización Maya":"Tikal"
  };

  return {
    faccion,
    capital: capitales[faccion],
    oro:500,
    ejercito:120,
    territorios:[capitales[faccion]],
    general:{ nombre: lideres[faccion], territorio: capitales[faccion], tropas:80 },
    princesas: [...princesas[faccion]]
  };
}

/* ================= MAPA ================= */

function renderMapa() {
  const mapa = document.getElementById("mapa");
  mapa.innerHTML="";

  Object.values(territorios).forEach(t=>{
    const div = document.createElement("div");
    div.className = "territorio " + claseFaccion(t.dueño);
    div.innerHTML = `<b>${t.nombre}</b><br>Dueño: ${t.dueño}`;
    div.onclick = ()=>atacarTerritorio(t.nombre);
    mapa.appendChild(div);
  });
}

function claseFaccion(f) {
  return f==="Neutral"?"neutral":f.split(" ")[1]?.toLowerCase()||"neutral";
}

/* ================= ACCIONES ================= */

function atacarTerritorio(nombre) {
  const t = territorios[nombre];
  if (t.dueño === jugador.faccion) return;

  if (jugador.ejercito < 40) {
    alert("Ejército insuficiente");
    return;
  }

  const poderJugador = jugador.ejercito + Math.random()*50;
  const poderDefensa = 80 + Math.random()*50;

  if (poderJugador > poderDefensa) {
    t.dueño = jugador.faccion;
    jugador.territorios.push(nombre);
    jugador.ejercito -= 30;
    log("Conquista de "+nombre);
  } else {
    jugador.ejercito -= 20;
    log("Derrota en "+nombre);
  }

  verificarDerrota();
  renderMapa();
  actualizarUI();
}

/* ================= DIPLOMACIA ================= */

function pedirPaz() {
  if (Math.random()>0.5) {
    relacion="paz";
    log("Paz aceptada");
  } else log("Paz rechazada");
  actualizarUI();
}

function formarAlianza() {
  if (Math.random()>0.6) {
    relacion="alianza";
    log("Alianza formada");
  } else log("Fracaso diplomático");
  actualizarUI();
}

function proponerMatrimonio() {
  if (jugador.princesas.length===0) {
    alert("No hay princesas disponibles");
    return;
  }

  const p = jugador.princesas.shift();
  relacion="alianza";
  jugador.oro+=200;
  log("Matrimonio diplomático: "+p);
  actualizarUI();
}

/* ================= TURNOS ================= */

function siguienteTurno() {
  turno++;
  jugador.oro += 200;
  verificarDerrota();
  actualizarUI();
}

function verificarDerrota() {
  if (jugador.territorios.length===0) {
    alert("Derrota: tu facción ha sido eliminada");
    location.reload();
  }
}

/* ================= UI ================= */

function actualizarUI() {
  document.getElementById("turno").innerText=turno;
  document.getElementById("oro").innerText=jugador.oro;
  document.getElementById("ejercito").innerText=jugador.ejercito;
  document.getElementById("relacion").innerText=relacion;
}

function log(txt) {
  const l=document.getElementById("log");
  l.innerHTML+=txt+"<br>";
  l.scrollTop=l.scrollHeight;
}

/* ================= GUARDADO ================= */

function guardarPartida() {
  localStorage.setItem("conquista",JSON.stringify({turno,jugador,ia,territorios,relacion}));
  alert("Partida guardada");
}

function cargarPartida() {
  const d=JSON.parse(localStorage.getItem("conquista"));
  if(!d)return;
  ({turno,jugador,ia,relacion}=d);
  Object.assign(territorios,d.territorios);
  renderMapa();
  actualizarUI();
}
