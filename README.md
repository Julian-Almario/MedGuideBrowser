# MedGuideBrowser

**MedGuideBrowser** es una herramienta en Python diseñada para **extraer y organizar enlaces públicos** a guías clínicas y protocolos médicos desde diversas fuentes confiables en la web.  nacida por la nacesidad de tener todo en un solo lugar y de facil acceso.


## Webs de extraccion de datos

  - [AEPED - Asociación Española de Pediatría](https://www.aeped.es/protocolos)
  - [SISPRO - Observatorio de Calidad en Salud (Colombia)](https://www.sispro.gov.co/observatorios/oncalidadsalud/Paginas/Linea-Tematicas.aspx)
  - [Sociedad Española de Cardiología](https://secardiologia.es/cientifico/guias-clinicas)



## Objetivo
Con esta web busco simplemente tener las guias mass actualizada de acceso publico de forma mas ordenada y lista para la cconsulta en cualquier momento.

> **Importante**: Esta herramienta **solo recopila enlaces** disponibles públicamente. **No descarga, almacena ni reutiliza el contenido** enlazado, ni se usa para minería de datos, entrenamientos de inteligencia artificial ni ningún centro de datos. Su propósito es exclusivamente educativo y organizativo.


## Uso del scraper

- Python 3.7+
- `requests`
- `beautifulsoup4`

Instalación de dependencias:

```bash
pip install requests beautifulsoup4

```
```bash
python scraper.py
```

El archivo generado será:
```bash
webs.json
```

El archivo se generara con la siguiente estructura
```bash
{
  "aeped": [
    { "titulo": "Protocolo X", "url": "https://..." }
  ],
  "sispro": [
    { "titulo": "Guía GPC", "url": "https://..." }
  ],
  "arritmias": [
    { "titulo": "Guía de manejo", "url": "https://..." }
  ]
}
```

## 📄 Licencia

Este proyecto se distribuye bajo la licencia **GNU GPL v3**.  
Consulta el archivo [`LICENSE`](LICENSE) para más detalles.