let turno = 1;
let jugador = null;
let ia = null;
let ejercitos = [];
let transportes = 0;
let eventosActivados = [];

/* CAPITALS */
const capitales = {
  España: "Madrid",
  Inglaterra: "Londres",
  Aztecas: "Tenochtitlan",
  Incas: "Cuzco",
  Mayas: "Tikal"
};

/* TERRITORIES */
const territorios = {
  Madrid:{dueño:"España"}, Londres:{dueño:"Inglaterra"},
  Caribe:{dueño:"Neutral"}, Centroamérica:{dueño:"Neutral"},
  México:{dueño:"Neutral"}, Yucatán:{dueño:"Neutral"},
  Andes:{dueño:"Neutral"}, Amazonia:{dueño:"Neutral"},
  Brasil:{dueño:"Neutral"}, Argentina:{dueño:"Neutral"},
  Chile:{dueño:"Neutral"}, "Río de la Plata":{dueño:"Neutral"},
  Tenochtitlan:{dueño:"Tikall"}, Cuzco:{dueño:"Incas"}, Tikal:{dueño:"Mayas"}
};

/* CONNECTIONS */
const conexiones = {
  Madrid:["Atlántico"], Londres:["Atlántico"],
  Atlántico:["Madrid","Londres","Caribe"],
  Caribe:["Atlántico","Centroamérica"],
  Centroamérica:["Caribe","México","Yucatán"],
  México:["Centroamérica","Yucatán"],
  Yucatán:["México"],
  Andes:["Amazonia","Chile","Argentina"],
  Amazonia:["Andes","Brasil"],
  Brasil:["Amazonia","Río de la Plata"],
  Argentina:["Chile","Río de la Plata","Andes"],
  Chile:["Argentina","Andes"],
  "Río de la Plata":["Argentina","Brasil"]
};

/* TRANSPORT */
const transportePorFaccion = {
  España:{tipo:"Galeón",costo:250},
  Inglaterra:{tipo:"Fragata",costo:300},
  Aztecas:{tipo:"Balsa",costo:100},
  Incas:{tipo:"Balsa",costo:100},
  Mayas:{tipo:"Balsa",costo:100}
};

/* FACTIONS */
const facciones = {
  España:{oro:500,territorios:[],victoriaCorta:["Centroamérica","Caribe","México","Andes","Argentina","Brasil"]},
  Inglaterra:{oro:500,territorios:[],victoriaCorta:["Caribe","Centroamérica"]},
  Aztecas:{oro:400,territorios:[]},
  Incas:{oro:400,territorios:[]},
  Mayas:{oro:400,territorios:[]}
};

/* EVENTS */
const eventos = [
  {nombre:"Virreinatos",turno:5,faccion:"España",efecto:()=>jugador.oro+=300},
  {nombre:"Compañías",turno:4,faccion:"Inglaterra",efecto:()=>jugador.oro+=250},
  {nombre:"Alianzas Tribales",turno:3,faccion:"Aztecas",efecto:()=>{}},
  {nombre:"Red de Caminos",turno:4,faccion:"Incas",efecto:()=>{}},
  {nombre:"Ciudades Estado",turno:3,faccion:"Mayas",efecto:()=>jugador.oro+=150}
];

/* INIT */
function iniciarJuego(f) {
  jugador = JSON.parse(JSON.stringify(facciones[f]));
  jugador.faccion = f;
  jugador.territorios.push(capitales[f]);
  territorios[capitales[f]].dueño = f;

  const otras = Object.keys(facciones).filter(x=>x!==f);
  ia = JSON.parse(JSON.stringify(facciones[otras[0]]));
  ia.faccion = otras[0];

  document.getElementById("seleccion").style.display="none";
  document.getElementById("juego").style.display="block";
  actualizarUI();
}

/* ACTIONS */
function reclutarEjercito() {
  if(jugador.oro<150)return;
  ejercitos.push({faccion:jugador.faccion,tropas:100,ubicacion:capitales[jugador.faccion]});
  jugador.oro-=150;
  actualizarUI();
}

function construirTransporte(){
  const t=transportePorFaccion[jugador.faccion];
  if(jugador.oro<t.costo)return;
  jugador.oro-=t.costo;
  transportes++;
  actualizarUI();
}

function moverEjercito(){
  const e=ejercitos.find(x=>x.faccion===jugador.faccion);
  if(!e)return;
  const v=conexiones[e.ubicacion];
  const d=prompt("Mover a: "+v.join(", "));
  if(!v.includes(d))return;
  e.ubicacion=d;
  actualizarUI();
}

function atacarTerritorio(){
  const e=ejercitos.find(x=>x.faccion===jugador.faccion);
  if(!e)return;
  const t=e.ubicacion;
  if(territorios[t].dueño===jugador.faccion)return;

  if(Math.random()*150 < e.tropas){
    territorios[t].dueño=jugador.faccion;
    jugador.territorios.push(t);
    alert("Victoria en "+t);
  } else {
    e.tropas-=40;
    alert("Derrota");
  }
  actualizarUI();
}

/* IA */
function turnoIA(){
  if(Math.random()>0.5){
    ejercitos.push({faccion:ia.faccion,tropas:90,ubicacion:capitales[ia.faccion]});
  }
}

/* EVENTS */
function verificarEventos(){
  eventos.forEach(e=>{
    if(!eventosActivados.includes(e.nombre) && turno===e.turno && jugador.faccion===e.faccion){
      alert("Evento histórico: "+e.nombre);
      e.efecto();
      eventosActivados.push(e.nombre);
    }
  });
}

/* TURN */
function siguienteTurno(){
  turno++;
  turnoIA();
  verificarEventos();
  verificarDerrota();
  verificarVictoria();
  actualizarUI();
}

/* CONDITIONS */
function verificarDerrota(){
  if(jugador.territorios.length===0 && !ejercitos.some(e=>e.faccion===jugador.faccion)){
    alert("Tu facción ha sido eliminada");
    location.reload();
  }
}

function verificarVictoria(){
  if(jugador.victoriaCorta && jugador.victoriaCorta.every(t=>jugador.territorios.includes(t))){
    alert("Victoria corta lograda");
  }
  if(jugador.territorios.length===Object.keys(territorios).length){
    alert("Victoria total");
  }
}

/* UI */
function actualizarUI(){
  document.getElementById("turno").innerText=turno;
  document.getElementById("oro").innerText=jugador.oro;
  document.getElementById("territorios").innerText=jugador.territorios.join(", ");
  document.getElementById("ejercitos").innerText=ejercitos.filter(e=>e.faccion===jugador.faccion).length;
  document.getElementById("transportes").innerText=transportes;

  const m=document.getElementById("mapa");
  m.innerHTML="";
  for(let t in territorios){
    const d=document.createElement("div");
    d.className="region "+territorios[t].dueño;
    d.innerText=t+" ("+territorios[t].dueño+")";
    m.appendChild(d);
  }
}
