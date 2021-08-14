const criptomonedasSelect = document.querySelector("#criptomonedas");
const monedasSelect = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");
const objBusqueda = {
  moneda: "",
  criptomoneda: "", //estos dos se van a llenar conforme el usuario vaya llenando algo
};

//crear un promise
const obtenerCriptomonedas = (criptomonedas) =>
  new Promise((resolve) => {
    resolve(criptomonedas); //y va a resolver las criptomonedas
  }); //este promise resulve el problema y se va ejecutar en caso de que resulva y pueda descargar todas las criptomonedas

document.addEventListener("DOMContentLoaded", () => {
  consultarCriptomonedas(); //una vez que el documento esta listo mandamos a llamar la funcion de consultar criptomonedas

  formulario.addEventListener("submit", submitFormulario);

  criptomonedasSelect.addEventListener("change", leerValor); //cuando el usuario elija otra opcion ese es el change
  monedasSelect.addEventListener("change", leerValor);
});

async function consultarCriptomonedas() {
  //♥♥ migrando a async await ponemos el async al comenzar la fucion y antes de cerrarla un try catch
  const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`; //esto nos trae las 10 criptomonedas mas importantes. le decmos una vez que el docuento este listo consulta y obten las criptomonedas

  /*fetch(url)
    .then((respuesta) => respuesta.json()) //esta es la consulta a la api y que vengan en json
    .then((resultado) => obtenerCriptomonedas(resultado.Data)) //promise
    .then((criptomonedas) => selectCriptomonedas(criptomonedas)); //lo que hacemos es crear un nuevo promise, llamamos la funcion selecto criptomonedas*/
  try {
    const respuesta = await fetch(url); //tenemos tres await porque el de abajo requiere que este sea completado y el de mas abajo requiere que ambos de arriba sean compleatados
    const resultado = await respuesta.json();
    const criptomonedas = await obtenerCriptomonedas(resultado.Data);
    selectCriptomonedas(criptomonedas);
  } catch (error) {
    console.log(error);
  }
}

function selectCriptomonedas(criptomonedas) {
  //una vez que obtenemos las criptomonedas mandamos a llamar esta funcion. criptomonedas es un arreglo por lo tanto vamos a iterar en cada una de ellas
  criptomonedas.forEach((cripto) => {
    const { FullName, Name } = cripto.CoinInfo; //cripto seria un objeto de cada criptomoneda
    const option = document.createElement("option"); //y armamos el select de criptomonedas en el html
    option.value = Name;
    option.textContent = FullName;
    criptomonedasSelect.appendChild(option);
  });
}

function leerValor(e) {
  objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e) {
  //luego creamos un objeto de busqueda arriba
  e.preventDefault();

  //validar
  const { moneda, criptomoneda } = objBusqueda;

  if (moneda === "" || criptomonedas === "") {
    mostrarAlerta("Ambos campos son obligatorios");
    return; //cortamos la ejecucion de la funcion
  }
  //consultar la api si esta validado todo y funciona
  consultarAPI();
}

function mostrarAlerta(msg) {
  const existeError = document.querySelector(".error");
  if (!existeError) {
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("error");

    divMensaje.textContent = msg;

    formulario.appendChild(divMensaje);

    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }
}

async function consultarAPI() {
  const { moneda, criptomoneda } = objBusqueda; //leemos los datos del objeto los extraemos
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`; //asi colocamos las varialbels que se van a agregar dinamicamente segun elija el usuario
  //mostrar el spinner

  mostrarSpinner();
  /*fetch(url)
    .then((respuesta) => respuesta.json())
    .then((cotizacion) => {
      mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
    });*/ //♥♥ esto es lo mismo de abajo primero como siempre ponemos el async en la funcion y luego los await y el try catch

  try {
    const respuesta = await fetch(url);
    const cotizacion = await respuesta.json();
    mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
  } catch (error) {
    console.log(error);
  }
}

function mostrarCotizacionHTML(cotizacion) {
  limpiarHtml();
  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

  const precio = document.createElement("p");
  precio.classList.add("precio");
  precio.innerHTML = `El Precio es: <span>${PRICE}</span> `;

  const precioAlto = document.createElement("p");
  precioAlto.innerHTML = `<p>Precio más alto del día <span>${HIGHDAY}</span> `;

  const precioBajo = document.createElement("p");
  precioBajo.innerHTML = `<p>Precio más bajo del día <span>${LOWDAY}</span> `;

  const ultimasHoras = document.createElement("p");
  ultimasHoras.innerHTML = `<p>Variación últimas 24 horas <span>${CHANGEPCT24HOUR}%</span> `;

  const ultimaActualizacion = document.createElement("p");
  ultimaActualizacion.innerHTML = `<p>Última actualización <span>${LASTUPDATE}</span> `;

  resultado.appendChild(precio);
  resultado.appendChild(precioAlto);
  resultado.appendChild(precioBajo);
  resultado.appendChild(ultimasHoras);
  resultado.appendChild(ultimaActualizacion);
}

function limpiarHtml() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function mostrarSpinner() {
  limpiarHtml();
  const spinner = document.createElement("div");
  spinner.classList.add("sk-cube-grid");

  spinner.innerHTML = ` 
  <div class="sk-cube sk-cube1"></div>
  <div class="sk-cube sk-cube2"></div>
  <div class="sk-cube sk-cube3"></div>
  <div class="sk-cube sk-cube4"></div>
  <div class="sk-cube sk-cube5"></div>
  <div class="sk-cube sk-cube6"></div>
  <div class="sk-cube sk-cube7"></div>
  <div class="sk-cube sk-cube8"></div>
  <div class="sk-cube sk-cube9"></div> `;

  resultado.appendChild(spinner);
}
