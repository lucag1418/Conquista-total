/* ================== ESTADO ================== */
let turno = 1;
let territorioSeleccionado = null;

/* ================== FACCIONES ================== */
const facciones = {
  España: { nombre:"España", capital:"Madrid", territorios:["Madrid"], generales:[{nombre:"Hernán Cortés", territorio:"Madrid", tropas:120}] },
  Inglaterra: { nombre:"Inglaterra", capital:"Londres", territorios:["Londres"], generales:[{nombre:"Francis Drake", territorio:"Londres", tropas:110}] },
  Imperio_Azteca: { nombre:"Imperio_Azteca", capital:"Tenochtitlan", territorios:["Tenochtitlan"], generales:[{nombre:"Moctezuma", territorio:"Tenochtitlan", tropas:130}] },
  Imperio_Inca: { nombre:"Imperio_Inca", capital:"Cuzco", territorios:["Cuzco"], generales:[{nombre:"Atahualpa", territorio:"Cuzco", tropas:125}] },
  Civilización_Maya: { nombre:"Civilización_Maya", capital:"Tikal", territorios:["Tikal"], generales:[{nombre:"Kʼinich Janaabʼ", territorio:"Tikal", tropas:120}] }
};

const faccionesIA = [facciones.Inglaterra,facciones.Imperio_Azteca,facciones.Imperio_Inca,facciones.Civilización_Maya];
const jugador = facciones.España;

/* ================== TERRITORIOS ================== */
const territorios = {
  Madrid:{nombre:"Madrid", dueño:"España", tropas:80}, Londres:{nombre:"Londres", dueño:"Inglaterra", tropas:80},
  Tenochtitlan:{nombre:"Tenochtitlan", dueño:"Imperio_Azteca", tropas:100}, Cuzco:{nombre:"Cuzco", dueño:"Imperio_Inca", tropas:100},
  Tikal:{nombre:"Tikal", dueño:"Civilización_Maya", tropas:90}, La_Hispaniola:{nombre:"La Hispaniola", dueño:"Neutral", tropas:40},
  Panama:{nombre:"Panamá", dueño:"Neutral", tropas:40}, Mexico:{nombre:"México", dueño:"Neutral", tropas:50},
  Peru:{nombre:"Perú", dueño:"Neutral", tropas:50}, Argentina:{nombre:"Argentina", dueño:"Neutral", tropas:45},
  Norteamerica:{nombre:"Norteamérica", dueño:"Neutral", tropas:60}
};

/* ================== POSICIONES MAPA ================== */
const posicionesTerritorios = {
  Madrid:{x:100,y:50}, Londres:{x:200,y:30}, Tenochtitlan:{x:400,y:300}, Cuzco:{x:450,y:450},
  Tikal:{x:350,y:250}, La_Hispaniola:{x:300,y:200}, Panama:{x:350,y:300}, Mexico:{x:400,y:280},
  Peru:{x:460,y:420}, Argentina:{x:500,y:500}, Norteamerica:{x:300,y:100}
};

/* ================== CONEXIONES ================== */
const conexiones = {
  Madrid:["La_Hispaniola"], Londres:["Norteamerica"], La_Hispaniola:["Panama","Mexico"], Panama:["Mexico","Peru"],
  Mexico:["Tenochtitlan"], Peru:["Cuzco","Argentina"], Tenochtitlan:["Mexico"], Cuzco:["Peru"], Tikal:["Mexico"], Norteamerica:["Mexico"], Argentina:["Peru"]
};

/* ================== ASEDIOS ================== */
let asedios = [];

function iniciarAsedio(general, territorio, faccion){
  asedios.push({atacante:faccion.nombre,general,generalNombre:general.nombre,territorio,turnos:0});
  log(`🏰 ${faccion.nombre} inicia asedio en ${territorio}`);
}

function procesarAsedios(){
  for(let i=asedios.length-1;i>=0;i--){
    const a = asedios[i]; const t=territorios[a.territorio];
    a.turnos++; t.tropas-=10;
    if(t.tropas<=0){ t.dueño=a.atacante; t.tropas=40; a.general.territorio=a.territorio; facciones[a.atacante]?.territorios.push(a.territorio);
      log(`🏳️ ${a.territorio} cae tras asedio`); asedios.splice(i,1);}
  }
}

/* ================== IA ================== */
function turnoIA(){
  faccionesIA.forEach(f=>f.generales.forEach(g=>decidirMovimientoIA(g,f)));
}

function decidirMovimientoIA(general,faccion){
  const opciones=conexiones[general.territorio]; if(!opciones) return;
  const destino=opciones[Math.floor(Math.random()*opciones.length)];
  const t=territorios[destino];
  if(t.dueño!==faccion.nombre){ t.tropas>general.tropas ? iniciarAsedio(general,destino,faccion) : atacarIA(general,destino,faccion);}
  else general.territorio=destino;
}

function atacarIA(general,destino,faccion){
  const t=territorios[destino]; const ataque=general.tropas+Math.random()*40; const defensa=t.tropas+Math.random()*30;
  if(ataque>defensa){t.dueño=faccion.nombre; general.territorio=destino; general.tropas-=20; t.tropas=40; faccion.territorios.push(destino); log(`⚔️ ${faccion.nombre} conquista ${destino}`);}
  else {general.tropas-=30; log(`❌ ${faccion.nombre} falla el ataque en ${destino}`);}
}

/* ================== INTERFAZ ================== */
const canvas=document.getElementById("mapCanvas"); const ctx=canvas.getContext("2d");
const mini=document.getElementById("miniMapa"); const miniCtx=mini.getContext("2d");

canvas.addEventListener("click",(e)=>{
  const rect=canvas.getBoundingClientRect(); const x=e.clientX-rect.left; const y=e.clientY-rect.top;
  Object.keys(posicionesTerritorios).forEach(t=>{
    const p=posicionesTerritorios[t]; if(Math.hypot(p.x-x,p.y-y)<20){seleccionarTerritorio(t);}
  });
});

function seleccionarTerritorio(nombre){
  territorioSeleccionado=nombre; const t=territorios[nombre]; document.getElementById("nombreTerritorio").innerText=nombre;
  let html=""; if(t.dueño!==jugador.nombre){ html+=`<button onclick="atacarJugador()">Atacar</button>`; html+=`<button onclick="pedirAlianza()">Diplomacia</button>`;} else{html="Territorio propio";}
  document.getElementById("acciones").innerHTML=html;
}

function atacarJugador(){
  const t=territorios[territorioSeleccionado]; const general=jugador.generales[0];
  if(general.tropas<40){alert("Tropas insuficientes"); return;}
  t.tropas>general.tropas ? iniciarAsedio(general,territorioSeleccionado,jugador) : atacarIA(general,territorioSeleccionado,jugador);
  render();
}

function pedirAlianza(){alert("Diplomacia en desarrollo");}

/* ================== MAPA ================== */
function dibujarMapa(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  Object.values(territorios).forEach(t=>{
    const pos=posicionesTerritorios[t.nombre];
    ctx.fillStyle=t.dueño===jugador.nombre?"gold":t.dueño==="Neutral"?"gray":"red";
    ctx.beginPath(); ctx.arc(pos.x,pos.y,20,0,2*Math.PI); ctx.fill();
    ctx.fillStyle="#fff"; ctx.font="12px Arial"; ctx.fillText(t.nombre,pos.x-20,pos.y-25); ctx.fillText(`T:${t.tropas}`,pos.x-15,pos.y+35);
  });
  jugador.generales.forEach(g=>{const pos=posicionesTerritorios[g.territorio]; ctx.fillStyle="blue"; ctx.fillRect(pos.x-5,pos.y-5,10,10);});
  faccionesIA.forEach(f=>f.generales.forEach(g=>{const pos=posicionesTerritorios[g.territorio]; ctx.fillStyle="green"; ctx.fillRect(pos.x-5,pos.y-5,10,10);}));
}

function dibujarMiniMapa(){
  miniCtx.clearRect(0,0,mini.width,mini.height);
  Object.values(territorios).forEach(t=>{
    const pos=posicionesTerritorios[t.nombre]; const miniX=pos.x/4; const miniY=pos.y/4;
    miniCtx.fillStyle=t.dueño===jugador.nombre?"gold":t.dueño==="Neutral"?"gray":"red";
    miniCtx.fillRect(miniX,miniY,5,5);
  });
  jugador.generales.forEach(g=>{const pos=posicionesTerritorios[g.territorio]; miniCtx.fillStyle="blue"; miniCtx.fillRect(pos.x/4-2,pos.y/4-2,4,4);});
  faccionesIA.forEach(f=>f.generales.forEach(g=>{const pos=posicionesTerritorios[g.territorio]; miniCtx.fillStyle="green"; miniCtx.fillRect(pos.x/4-2,pos.y/4-2,4,4);}));
}

function render(){dibujarMapa(); dibujarMiniMapa();}

/* ================== TURNO ================== */
function siguienteTurno(){turno++; procesarAsedios(); turnoIA(); render(); document.getElementById("turno").innerText=turno; document.getElementById("faccionJugador").innerText=jugador.nombre;}

/* ================== LOG ================== */
function log(mensaje){document.getElementById("log").innerHTML += mensaje+"<br>";}

/* ================== INICIO ================== */
render();
document.getElementById("faccionJugador").innerText=jugador.nombre;
