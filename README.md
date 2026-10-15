# Web — simulador de riesgo crediticio

Sitio estático (HTML + CSS + JavaScript, **sin frameworks ni servidor**). El modelo es una regresión logística: la predicción se calcula en el navegador con los coeficientes de `../modelo/modelo_web.json`.

## Estructura
```
web/
├── index.html               # página única
├── css/estilos.css          # diseño (tema claro/oscuro, animaciones, responsive)
├── js/app.js                # simulador, gráficos SVG animados, galería
├── js/datos.js              # GENERADO: modelo + resultados del cuaderno
├── img/                     # escudo UNAP y los 24 gráficos del cuaderno
└── scripts/generar_datos.py # regenera js/datos.js
```

## Actualizar los datos
Si el cuaderno se vuelve a ejecutar y cambian `modelo/modelo_web.json` o `modelo/resultados.json`:
```bash
python web/scripts/generar_datos.py
```

## Ver la página en tu computadora
Abre `web/index.html` con doble clic, o levanta un servidor local:
```bash
python -m http.server 8000 -d web     # luego abre http://localhost:8000
```

## Publicar en Render
Ver los pasos en `../decisiones/06_pagina_web.md` (sección «Despliegue en Render»).
