// Estado del juego
let turno = 1;

let jugador = {
  faccion: "Corona Española",
  oro: 500,
  ejercito: 100,
  territorios: ["La Española"],
  relaciones: {
    aztecas: "neutral",
    incas: "neutral"
  }
};

const territorios = {
  "La Española": { dueño: "España", riqueza: 100 },
  "Tenochtitlan": { dueño: "Aztecas", riqueza: 200 },
  "Cuzco": { dueño: "Incas", riqueza: 180 }
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
