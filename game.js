let turno=1, jugador, ia, relacion="neutral", ciudadSeleccionada=null;

/* ===== MAPA ===== */

const territorios={
  Madrid:crear("Madrid"), Londres:crear("Londres"),
  Tenochtitlan:crear("Tenochtitlan"), Cuzco:crear("Cuzco"),
  Tikal:crear("Tikal"), Mexico:crear("Mexico"),
  Centroamerica:crear("Centroamerica"), Andes:crear("Andes"),
  Argentina:crear("Argentina"), Brasil:crear("Brasil"),
  Norteamerica:crear("Norteamerica")
};

function crear(nombre){
  return{nombre,dueño:"Neutral",ed:{mercado:0,mina:0,cuartel:0},tropas:40};
}

/* ===== INICIO ===== */

function iniciarJuego(f){
  document.getElementById("seleccion").style.display="none";
  document.getElementById("juego").style.display="block";

  jugador={faccion:f,oro:500,ejercito:120,capital:capital(f),territorios:[]};
  ia={faccion:"IA",oro:500,ejercito:120,territorios:[]};

  territorios[jugador.capital].dueño=f;
  jugador.territorios.push(jugador.capital);

  actualizar(); render();
}

function capital(f){
  return {España:"Madrid",Inglaterra:"Londres",Aztecas:"Tenochtitlan",Incas:"Cuzco",Mayas:"Tikal"}[f];
}

/* ===== MAPA ===== */

function render(){
  const m=document.getElementById("mapa");
  m.innerHTML="";
  Object.values(territorios).forEach(t=>{
    const d=document.createElement("div");
    d.className="territorio "+(t.dueño==="Neutral"?"neutral":t.dueño.toLowerCase());
    d.innerHTML=`<b>${t.nombre}</b><br>Dueño: ${t.dueño}`;
    d.onclick=()=>seleccionar(t.nombre);
    m.appendChild(d);
  });
}

function seleccionar(nombre){
  ciudadSeleccionada=territorios[nombre];
  document.getElementById("acciones").style.display="block";
  document.getElementById("ciudadNombre").innerText=nombre;
}

/* ===== ACCIONES ===== */

function conquistar(){
  const t=ciudadSeleccionada;
  if(t.dueño===jugador.faccion)return;

  if(jugador.ejercito<30){log("Ejército insuficiente");return;}

  if(Math.random()>0.4){
    t.dueño=jugador.faccion;
    jugador.territorios.push(t.nombre);
    jugador.ejercito-=30;
    log("Conquista exitosa de "+t.nombre);
  } else {
    jugador.ejercito-=20;
    log("Fracaso en la conquista");
  }
  render(); actualizar();
}

function construir(tipo){
  const t=ciudadSeleccionada;
  if(t.dueño!==jugador.faccion)return;
  if(jugador.oro<100)return;
  jugador.oro-=100;
  t.ed[tipo]++;
  log("Construido "+tipo+" en "+t.nombre);
  actualizar();
}

function reclutar(){
  const t=ciudadSeleccionada;
  if(t.dueño!==jugador.faccion)return;
  if(t.ed.cuartel===0)return;
  jugador.ejercito+=30;
  jugador.oro-=50;
  log("Tropas reclutadas en "+t.nombre);
  actualizar();
}

/* ===== DIPLOMACIA ===== */

function pedirComercio(){
  relacion="comercio";
  jugador.oro+=100;
  log("Tratado comercial firmado");
  actualizar();
}

function pedirAlianza(){
  if(Math.random()>0.5){
    relacion="alianza";
    log("Alianza formada");
  } else log("Alianza rechazada");
  actualizar();
}

function pedirMatrimonio(){
  relacion="alianza";
  jugador.oro+=200;
  log("Matrimonio dinástico sellado");
  actualizar();
}

/* ===== IA ===== */

function turnoIA(){
  ia.oro+=150;
  const neutrales=Object.values(territorios).filter(t=>t.dueño==="Neutral");
  if(neutrales.length>0 && Math.random()>0.5){
    const t=neutrales[Math.floor(Math.random()*neutrales.length)];
    t.dueño="IA";
    ia.territorios.push(t.nombre);
    log("La IA conquista "+t.nombre);
  }
}

/* ===== TURNOS ===== */

function finTurno(){
  turno++;
  turnoIA();
  actualizar(); render();
}

/* ===== UI ===== */

function actualizar(){
  document.getElementById("turno").innerText=turno;
  document.getElementById("oro").innerText=jugador.oro;
  document.getElementById("ejercito").innerText=jugador.ejercito;
  document.getElementById("relacion").innerText=relacion;
}

function log(t){
  const l=document.getElementById("log");
  l.innerHTML+=t+"<br>";
  l.scrollTop=l.scrollHeight;
}

/* ===== GUARDADO ===== */

function guardar(){
  localStorage.setItem("conquista",JSON.stringify({turno,jugador,ia,territorios,relacion}));
  alert("Guardado");
}
function cargar(){
  const d=JSON.parse(localStorage.getItem("conquista"));
  if(!d)return;
  ({turno,jugador,ia,relacion}=d);
  Object.assign(territorios,d.territorios);
  actualizar(); render();
}
