"""Genera web/js/datos.js a partir de los archivos exportados por el cuaderno.

Uso (desde la carpeta raíz del proyecto):
    python web/scripts/generar_datos.py

Fuentes:
- modelo/modelo_web.json   -> coeficientes del modelo web (sección 14.1 del cuaderno)
- modelo/resultados.json   -> cifras clave (sección 14.3 del cuaderno)
- EXTRA (abajo)            -> cifras verificadas del cuaderno que no están en resultados.json
                              (tasas del EDA, odds ratios, matrices de confusión).
Volver a ejecutar este script si el cuaderno se vuelve a ejecutar.
"""
import json
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
modelo = json.loads((RAIZ / "modelo" / "modelo_web.json").read_text(encoding="utf-8"))
resultados = json.loads((RAIZ / "modelo" / "resultados.json").read_text(encoding="utf-8"))

# Cifras verificadas contra las salidas del cuaderno ejecutado (scikit-learn 1.7.2).
EXTRA = {
    # Sección 7: % de malos pagadores (n) por categoría
    "eda": {
        "duracion": [["≤ 12 meses", 21.2, 359], ["13–24 meses", 29.7, 411], ["25–36 meses", 39.9, 143], ["> 36 meses", 51.7, 87]],
        "cuenta": [["Saldo negativo", 49.3, 274], ["0 a 200 DM", 39.0, 269], ["200 DM o más", 22.2, 63], ["Sin cuenta", 11.7, 394]],
        "edad": [["19–25", 42.1, 190], ["26–35", 29.6, 398], ["36–50", 23.7, 299], ["51+", 27.4, 113]],
        "ahorros": [["Menos de 100 DM", 36.0, 603], ["100 a 500 DM", 33.0, 103], ["500 a 1000 DM", 17.5, 63], ["1000 DM o más", 12.5, 48]],
    },
    # Sección 12.2: odds ratios de la regresión logística completa
    "odds": [
        ["Cuenta: saldo negativo", 1.48], ["Ahorros < 100 DM", 1.40], ["Duración (+1 desv.)", 1.30],
        ["Empleo < 1 año", 1.25], ["Otros créditos en bancos", 1.23], ["Propósito: educación", 1.23],
        ["Cuota (+1 desv.)", 1.22], ["Propiedad: inmueble", 0.85], ["Empleo 4–7 años", 0.78],
        ["Propósito: auto usado", 0.78], ["Historial: cuenta crítica", 0.70], ["Sin cuenta corriente", 0.56],
    ],
    # Matrices de confusión en prueba [VN, FP, FN, VP]
    "confusion": {
        "Random Forest (umbral 0,28)": [83, 92, 10, 65],
        "Modelo web (umbral 0,34)": [61, 114, 6, 69],
    },
}

datos = {"modelo": modelo, "resultados": resultados, "extra": EXTRA}
salida = RAIZ / "web" / "js" / "datos.js"
salida.write_text(
    "// Archivo generado por web/scripts/generar_datos.py — no editar a mano.\n"
    "window.DATOS = " + json.dumps(datos, ensure_ascii=False, indent=1) + ";\n",
    encoding="utf-8",
)
print("✔", salida.relative_to(RAIZ))
