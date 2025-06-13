import requests
from bs4 import BeautifulSoup
import json
import time


def scrape_aeped():
    url = 'https://www.aeped.es/protocolos'
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    titulos = soup.select('div.titulo a')

    protocolos = []
    for a in titulos:
        href = a.get('href')
        titulo = a.text.strip()
        if href:
            if not href.startswith('http'):
                href = 'https://www.aeped.es' + href
            protocolos.append({
                'titulo': titulo,
                'url': href
            })
    return protocolos


def scrape_sispro():
    url = 'https://www.sispro.gov.co/observatorios/oncalidadsalud/Paginas/Linea-Tematicas.aspx'
    base_url = 'https://www.sispro.gov.co'
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    enlaces = []

    for a in soup.find_all('a', href=True):
        href = a['href']
        titulo = a.get_text(strip=True)

        if href.lower().endswith('.pdf') and 'GPC' in titulo.upper():
            primera_palabra = titulo.strip().split()[0] if titulo else ""
            if primera_palabra.upper() == "(GPC)":
                continue

            if not href.startswith('http'):
                href = base_url + href

            enlaces.append({'titulo': titulo or href.split('/')[-1], 'url': href})

    return enlaces


def scrape_scardio(base_url, start_param='start', step=10, max_start=100, delay=2):
    resultados = []

    for start in range(0, max_start + 1, step):
        url = f"{base_url}?{start_param}={start}"
        print(f"Scraping: {url}")
        response = requests.get(url)
        if response.status_code != 200:
            print(f"Error al acceder a la página {url}")
            break

        soup = BeautifulSoup(response.text, 'html.parser')
        encontrados = 0

        for h2 in soup.find_all('h2'):
            a = h2.find('a', href=True)
            if a:
                titulo = a.get_text(strip=True)
                enlace = a['href'].strip()
                if not enlace.startswith('http'):
                    enlace = requests.compat.urljoin(base_url, enlace)
                resultados.append({'titulo': titulo, 'url': enlace})
                encontrados += 1

        if encontrados == 0:
            print("No se encontraron más elementos, fin del scraping.")
            break

        time.sleep(delay)

    return resultados



def guardar_datos():
    datos_combinados = {
        "aeped": scrape_aeped(),
        "sispro": scrape_sispro(),
    }

    urls_secardio = [
        "https://secardiologia.es/cientifico/guias-clinicas/arritmias",
        "https://secardiologia.es/cientifico/guias-clinicas/cardiopatia-congenita",
        "https://secardiologia.es/cientifico/guias-clinicas/cardiopatia-isquemica",
        "https://secardiologia.es/cientifico/guias-clinicas/cardio-oncologia",
        "https://secardiologia.es/cientifico/guias-clinicas/cuidados-criticos-cardiologicos",
        "https://secardiologia.es/cientifico/guias-clinicas/enfermedades-del-pericardio-grandes-vasos",
        "https://secardiologia.es/cientifico/guias-clinicas/farmacologia",
        "https://secardiologia.es/cientifico/guias-clinicas/hemodinamica-cardiologia-intervencionista",
        "https://secardiologia.es/cientifico/guias-clinicas/insuficiencia-cardiaca-y-miocardiopatia",
        "https://secardiologia.es/cientifico/guias-clinicas/prevencion-riesgo-cardiovascular",
        "https://secardiologia.es/cientifico/guias-clinicas/valvulopatias",
    ]

    for url in urls_secardio:
        slug = url.rstrip('/').split('/')[-1]
        datos_combinados[slug] = scrape_scardio(
            base_url=url,
            step=10,
            max_start=100,
            delay=1
        )

    with open('webs.json', 'w', encoding='utf-8') as f:
        json.dump(datos_combinados, f, ensure_ascii=False, indent=4)
    print("Todos los datos guardados en 'webs.json'")


if __name__ == '__main__':
    guardar_datos()
