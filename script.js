let datosCargados = {};
let datosFiltrados = {};
let paginaActual = 1;
const resultadosPorPagina = 10;

fetch('webs.json')
  .then(response => response.json())
  .then(data => {
    datosCargados = data;
    cargarOpcionesFiltro(data);
    filtrarResultados();
  })
  .catch(err => {
    document.getElementById('contenido').innerText = 'Error al cargar los datos.';
    console.error(err);
  });

function crearTarjeta(titulo, url) {
  const tarjeta = document.createElement('div');
  tarjeta.className = 'tarjeta-enlace';
  tarjeta.innerHTML = `
    <div class="tarjeta-icono">
      <img src="https://www.google.com/s2/favicons?sz=32&domain_url=${url}" alt="Icono">
    </div>
    <div class="tarjeta-contenido">
      <a href="${url}" target="_blank">${titulo}</a>
    </div>
  `;
  return tarjeta;
}

function cargarOpcionesFiltro(data) {
  const select = document.getElementById('fuenteFiltro');
  for (const fuente in data) {
    const option = document.createElement('option');
    option.value = fuente;
    option.textContent = fuente;
    select.appendChild(option);
  }
}

function filtrarResultados() {
  const filtroTexto = document.getElementById('searchInput').value.toLowerCase();
  const filtroFuente = document.getElementById('fuenteFiltro').value;
  datosFiltrados = {};

  for (const fuente in datosCargados) {
    if (filtroFuente && fuente !== filtroFuente) continue;

    const itemsFiltrados = datosCargados[fuente].filter(item =>
      item.titulo.toLowerCase().includes(filtroTexto)
    );

    if (itemsFiltrados.length > 0) {
      datosFiltrados[fuente] = itemsFiltrados;
    }
  }

  paginaActual = 1;
  mostrarDatosPaginados();
}

function mostrarDatosPaginados() {
  const contenedor = document.getElementById('contenido');
  contenedor.innerHTML = '';

  let totalItems = 0;
  for (const fuente in datosFiltrados) {
    totalItems += datosFiltrados[fuente].length;
  }

  const inicio = (paginaActual - 1) * resultadosPorPagina;
  const fin = inicio + resultadosPorPagina;
  let contador = 0;
  let impresos = 0;

  for (const fuente in datosFiltrados) {
    const seccion = document.createElement('div');
    seccion.classList.add('fuente-seccion');

    const h2 = document.createElement('h2');
    h2.textContent = fuente.toUpperCase();
    seccion.appendChild(h2);

    for (const item of datosFiltrados[fuente]) {
      if (contador >= inicio && contador < fin) {
        const tarjeta = crearTarjeta(item.titulo, item.url);
        seccion.appendChild(tarjeta);
        impresos++;
      }
      contador++;
    }

    if (seccion.children.length > 1) {
      contenedor.appendChild(seccion);
    }

    if (impresos >= resultadosPorPagina) break;
  }

  mostrarPaginacion(totalItems);
}

function mostrarPaginacion(totalItems) {
  const paginacionDiv = document.getElementById('paginacion');
  paginacionDiv.innerHTML = '';

  const totalPaginas = Math.ceil(totalItems / resultadosPorPagina);
  if (totalPaginas <= 1) return;

  const maxBotones = 5;
  let inicioBloque = Math.floor((paginaActual - 1) / maxBotones) * maxBotones + 1;
  let finBloque = Math.min(inicioBloque + maxBotones - 1, totalPaginas);


  if (inicioBloque > 1) {
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '«';
    prevBtn.onclick = () => {
      paginaActual = inicioBloque - 1;
      mostrarDatosPaginados();
    };
    paginacionDiv.appendChild(prevBtn);
  }

  for (let i = inicioBloque; i <= finBloque; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = i === paginaActual ? 'activo' : '';
    btn.onclick = () => {
      paginaActual = i;
      mostrarDatosPaginados();
    };
    paginacionDiv.appendChild(btn);
  }

  if (finBloque < totalPaginas) {
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '»';
    nextBtn.onclick = () => {
      paginaActual = finBloque + 1;
      mostrarDatosPaginados();
    };
    paginacionDiv.appendChild(nextBtn);
  }
}

