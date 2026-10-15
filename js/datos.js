// Archivo generado por web/scripts/generar_datos.py — no editar a mano.
window.DATOS = {
 "modelo": {
  "descripcion": "Regresión logística de riesgo crediticio (German Credit Data, UCI). P(malo) = 1/(1+exp(-z)).",
  "intercepto": -0.004068384716720361,
  "umbral": 0.34,
  "numericas": {
   "duracion_meses": {
    "media": 20.804,
    "desviacion": 11.858284755112491,
    "coef": 0.2343195783971545,
    "min": 4,
    "max": 72
   },
   "monto_credito": {
    "media": 3213.154666666667,
    "desviacion": 2699.0979303114505,
    "coef": 0.12099079842909001,
    "min": 250,
    "max": 18424
   },
   "cuota_pct_ingreso": {
    "media": 2.949333333333333,
    "desviacion": 1.1231352941159354,
    "coef": 0.17760421862830836,
    "min": 1,
    "max": 4
   }
  },
  "categoricas": {
   "cuenta_corriente": {
    "0 a 200 DM": 0.2111492817719871,
    "200 DM o más": -0.01514427136148951,
    "Saldo negativo": 0.411217982499427,
    "Sin cuenta": -0.6057006525849796
   },
   "ahorros": {
    "100 a 500 DM": 0.09139621161693746,
    "1000 DM o más": -0.11242475370887903,
    "500 a 1000 DM": -0.05688284376322431,
    "Menos de 100 DM": 0.34161417118062126,
    "Sin ahorros / desconocido": -0.26218044500050985
   },
   "historial_credito": {
    "Atrasos en el pasado": 0.014329077815129012,
    "Cuenta crítica / créditos en otros bancos": -0.3775766646133038,
    "Pagando al día": 0.049991001888241224,
    "Sin créditos / todo pagado": 0.17982651045371428,
    "Todo pagado en este banco": 0.13495241478116438
   },
   "otros_planes_pago": {
    "Banco": 0.21498099229095124,
    "Ninguno": -0.21866834680150368,
    "Tiendas": 0.005209694835497699
   },
   "propiedad": {
    "Auto u otro bien": -0.028391276836723142,
    "Inmueble": -0.17777821609599517,
    "Seguro de vida / ahorro vivienda": 0.010757865488093623,
    "Sin propiedad / desconocido": 0.1969339677695701
   }
  },
  "metricas_prueba": {
   "Accuracy": 0.52,
   "Recall": 0.92,
   "Precisión": 0.3770491803278688,
   "F1": 0.5348837209302325,
   "ROC-AUC": 0.7772952380952382,
   "Costo": 144.0
  }
 },
 "resultados": {
  "versiones": {
   "scikit-learn": "1.7.2",
   "pandas": "3.0.6",
   "numpy": "2.5.4"
  },
  "datos": {
   "filas": 1000,
   "malos": 300,
   "buenos": 700,
   "entrenamiento": 750,
   "prueba": 250,
   "malos_prueba": 75,
   "buenos_prueba": 175
  },
  "eda": {
   "medianas": {
    "duracion_meses": {
     "mediana_buenos": 18.0,
     "mediana_malos": 24.0,
     "p_valor": 7.981665531518925e-11
    },
    "monto_credito": {
     "mediana_buenos": 2244.0,
     "mediana_malos": 2574.5,
     "p_valor": 0.005917609166184079
    },
    "cuota_pct_ingreso": {
     "mediana_buenos": 3.0,
     "mediana_malos": 4.0,
     "p_valor": 0.019860046970362137
    },
    "anios_residencia": {
     "mediana_buenos": 3.0,
     "mediana_malos": 3.0,
     "p_valor": 0.9357824054306769
    },
    "edad": {
     "mediana_buenos": 34.0,
     "mediana_malos": 31.0,
     "p_valor": 0.00039127735615298106
    },
    "num_creditos": {
     "mediana_buenos": 1.0,
     "mediana_malos": 1.0,
     "p_valor": 0.1348189095343981
    },
    "num_dependientes": {
     "mediana_buenos": 1.0,
     "mediana_malos": 1.0,
     "p_valor": 0.9242355855949411
    }
   },
   "v_cramer": {
    "cuenta_corriente": {
     "V_Cramer": 0.35173988047457116,
     "p_valor": 1.2189020722893755e-26
    },
    "historial_credito": {
     "V_Cramer": 0.24837752910558458,
     "p_valor": 1.2791872956750918e-12
    },
    "ahorros": {
     "V_Cramer": 0.18999717943279762,
     "p_valor": 2.7612142385682596e-07
    },
    "proposito": {
     "V_Cramer": 0.18263747386946125,
     "p_valor": 0.00011574910079691635
    },
    "propiedad": {
     "V_Cramer": 0.15401152971081322,
     "p_valor": 2.8584415733250017e-05
    },
    "antiguedad_empleo": {
     "V_Cramer": 0.13552960505622672,
     "p_valor": 0.0010454523491402541
    },
    "vivienda": {
     "V_Cramer": 0.13490678849696047,
     "p_valor": 0.00011167465374597664
    },
    "otros_planes_pago": {
     "V_Cramer": 0.11331013959865258,
     "p_valor": 0.0016293178186473534
    },
    "estado_civil_sexo": {
     "V_Cramer": 0.09800619347437206,
     "p_valor": 0.02223800546926877
    },
    "otros_deudores": {
     "V_Cramer": 0.08151911761828783,
     "p_valor": 0.036055954027247206
    },
    "trabajador_extranjero": {
     "V_Cramer": 0.07629925238843341,
     "p_valor": 0.015830754902852885
    },
    "empleo": {
     "V_Cramer": 0.04341838352602698,
     "p_valor": 0.5965815918843431
    },
    "telefono": {
     "V_Cramer": 0.034242641998258334,
     "p_valor": 0.27887615430357426
    }
   }
  },
  "cv_roc_auc": {
   "Regresión logística": 0.771089947089947,
   "Árbol de decisión": 0.7622010582010581,
   "Random Forest": 0.7870899470899471,
   "Gradient Boosting": 0.7856296296296297
  },
  "hiperparametros": {
   "Regresión logística": {
    "C": 0.03
   },
   "Árbol de decisión": {
    "max_depth": 6.0,
    "min_samples_leaf": 20.0
   },
   "Random Forest": {
    "max_depth": null,
    "max_features": 0.3,
    "min_samples_leaf": 5.0
   },
   "Gradient Boosting": {
    "learning_rate": 0.1,
    "max_depth": 2.0,
    "n_estimators": 100.0,
    "subsample": 0.8
   }
  },
  "prueba_umbral_05": {
   "Regresión logística": {
    "Accuracy": 0.752,
    "Recall": 0.7733333333333333,
    "Precisión": 0.5631067961165048,
    "F1": 0.651685393258427,
    "ROC-AUC": 0.8105142857142857,
    "Costo": 130.0
   },
   "Árbol de decisión": {
    "Accuracy": 0.62,
    "Recall": 0.6,
    "Precisión": 0.4090909090909091,
    "F1": 0.4864864864864865,
    "ROC-AUC": 0.6982857142857143,
    "Costo": 215.0
   },
   "Random Forest": {
    "Accuracy": 0.756,
    "Recall": 0.68,
    "Precisión": 0.5795454545454546,
    "F1": 0.6257668711656442,
    "ROC-AUC": 0.7947428571428572,
    "Costo": 157.0
   },
   "Gradient Boosting": {
    "Accuracy": 0.764,
    "Recall": 0.4666666666666667,
    "Precisión": 0.6481481481481481,
    "F1": 0.5426356589147286,
    "ROC-AUC": 0.8086857142857143,
    "Costo": 219.0
   }
  },
  "referencias_costo": {
   "aprobar_a_todos": 375,
   "rechazar_a_todos": 175
  },
  "umbral_optimo": {
   "Regresión logística": 0.36,
   "Árbol de decisión": 0.31,
   "Random Forest": 0.28,
   "Gradient Boosting": 0.11
  },
  "costo_cv_por_solicitante": {
   "Regresión logística": 0.52,
   "Árbol de decisión": 0.528,
   "Random Forest": 0.512,
   "Gradient Boosting": 0.5253333333333333
  },
  "prueba_umbral_optimo": {
   "Regresión logística": {
    "Umbral": 0.36,
    "Accuracy": 0.564,
    "Recall": 0.8933333333333333,
    "Precisión": 0.39880952380952384,
    "F1": 0.551440329218107,
    "ROC-AUC": 0.8105142857142857,
    "Costo": 141.0
   },
   "Árbol de decisión": {
    "Umbral": 0.31,
    "Accuracy": 0.568,
    "Recall": 0.7466666666666667,
    "Precisión": 0.38620689655172413,
    "F1": 0.509090909090909,
    "ROC-AUC": 0.6982857142857143,
    "Costo": 184.0
   },
   "Random Forest": {
    "Umbral": 0.28,
    "Accuracy": 0.592,
    "Recall": 0.8666666666666667,
    "Precisión": 0.4140127388535032,
    "F1": 0.5603448275862069,
    "ROC-AUC": 0.7947428571428572,
    "Costo": 142.0
   },
   "Gradient Boosting": {
    "Umbral": 0.11,
    "Accuracy": 0.532,
    "Recall": 0.9466666666666667,
    "Precisión": 0.3858695652173913,
    "F1": 0.5482625482625483,
    "ROC-AUC": 0.8086857142857143,
    "Costo": 133.0
   }
  },
  "modelo_final": {
   "nombre": "Random Forest",
   "umbral": 0.28
  },
  "importancia_permutacion_prueba": {
   "Regresión logística": {
    "duracion_meses": 0.028642539682539703,
    "monto_credito": 0.014250158730158757,
    "cuota_pct_ingreso": 0.012322539682539713,
    "anios_residencia": 0.0003961904761904907,
    "edad": 0.011052698412698451,
    "num_creditos": 0.001056507936507963,
    "num_dependientes": 0.0003809523809523855,
    "cuenta_corriente": 0.09334603174603175,
    "historial_credito": 0.011172063492063507,
    "proposito": 0.020746666666666715,
    "ahorros": 0.009117460317460347,
    "antiguedad_empleo": 0.005780317460317478,
    "otros_deudores": 0.0036114285714285875,
    "propiedad": -0.0018336507936507688,
    "otros_planes_pago": 0.0007060317460317582,
    "vivienda": 0.003966984126984144,
    "empleo": -0.0004038095238094767,
    "telefono": 0.004792380952380978
   },
   "Árbol de decisión": {
    "duracion_meses": 0.02305269841269839,
    "monto_credito": 0.015966984126984128,
    "cuota_pct_ingreso": -0.006613333333333363,
    "anios_residencia": 0.0025295238095237814,
    "edad": 0.022166349206349193,
    "num_creditos": 0.0,
    "num_dependientes": 0.0,
    "cuenta_corriente": 0.10498031746031748,
    "historial_credito": 0.0014742857142857205,
    "proposito": 0.0,
    "ahorros": -0.001481904761904788,
    "antiguedad_empleo": -0.018947301587301606,
    "otros_deudores": 0.0,
    "propiedad": 0.0040977777777777375,
    "otros_planes_pago": 0.0031568253968253914,
    "vivienda": 0.0,
    "empleo": 0.0,
    "telefono": 0.0
   },
   "Random Forest": {
    "duracion_meses": 0.024464761904761934,
    "monto_credito": 0.015514920634920682,
    "cuota_pct_ingreso": 0.003608888888888928,
    "anios_residencia": 0.0012317460317460653,
    "edad": 0.00967111111111116,
    "num_creditos": 0.0007263492063492786,
    "num_dependientes": -0.0007669841269840456,
    "cuenta_corriente": 0.14624000000000004,
    "historial_credito": 0.009526349206349238,
    "proposito": 0.007966984126984182,
    "ahorros": 0.01636825396825402,
    "antiguedad_empleo": -0.00018793650793647403,
    "otros_deudores": 0.007613968253968306,
    "propiedad": 0.005803174603174643,
    "otros_planes_pago": 0.006996825396825457,
    "vivienda": 0.0024152380952381183,
    "empleo": 0.005630476190476264,
    "telefono": 0.0036393650793651385
   },
   "Gradient Boosting": {
    "duracion_meses": 0.03581968253968258,
    "monto_credito": 0.03484698412698419,
    "cuota_pct_ingreso": 0.0005409523809524308,
    "anios_residencia": 0.0028673015873016293,
    "edad": 0.007583492063492129,
    "num_creditos": 0.0009193650793651235,
    "num_dependientes": 0.0,
    "cuenta_corriente": 0.09796317460317464,
    "historial_credito": 0.015428571428571465,
    "proposito": 0.01691428571428576,
    "ahorros": 0.005046349206349232,
    "antiguedad_empleo": 0.00967111111111116,
    "otros_deudores": 0.0027301587301587827,
    "propiedad": -0.0007263492063491565,
    "otros_planes_pago": 0.003789206349206405,
    "vivienda": 0.0038679365079365537,
    "empleo": 0.00022349206349210707,
    "telefono": 0.0
   }
  },
  "equidad_sexo": {
   "Hombre": {
    "n": 690,
    "Tasa real de malos": 0.2768115942028985,
    "Tasa de rechazo del modelo": 0.6246376811594203,
    "Buenos rechazados injustamente": 0.5190380761523046,
    "Malos detectados (recall)": 0.900523560209424
   },
   "Mujer": {
    "n": 310,
    "Tasa real de malos": 0.35161290322580646,
    "Tasa de rechazo del modelo": 0.6870967741935484,
    "Buenos rechazados injustamente": 0.5870646766169154,
    "Malos detectados (recall)": 0.8715596330275229
   }
  },
  "equidad_edad": {
   "19-25": {
    "n": 190,
    "Tasa real de malos": 0.42105263157894735,
    "Tasa de rechazo del modelo": 0.8421052631578947,
    "Buenos rechazados injustamente": 0.7818181818181819,
    "Malos detectados (recall)": 0.925
   },
   "26-35": {
    "n": 398,
    "Tasa real de malos": 0.2964824120603015,
    "Tasa de rechazo del modelo": 0.6407035175879398,
    "Buenos rechazados injustamente": 0.5392857142857143,
    "Malos detectados (recall)": 0.8813559322033898
   },
   "36-50": {
    "n": 299,
    "Tasa real de malos": 0.23745819397993312,
    "Tasa de rechazo del modelo": 0.5451505016722408,
    "Buenos rechazados injustamente": 0.44298245614035087,
    "Malos detectados (recall)": 0.8732394366197183
   },
   "51+": {
    "n": 113,
    "Tasa real de malos": 0.2743362831858407,
    "Tasa de rechazo del modelo": 0.584070796460177,
    "Buenos rechazados injustamente": 0.47560975609756095,
    "Malos detectados (recall)": 0.8709677419354839
   }
  },
  "modelo_web": {
   "variables": [
    "cuenta_corriente",
    "duracion_meses",
    "ahorros",
    "monto_credito",
    "historial_credito",
    "otros_planes_pago",
    "propiedad",
    "cuota_pct_ingreso"
   ],
   "umbral": 0.34,
   "C": 0.03,
   "comparacion_prueba": {
    "Modelo completo (Random Forest, 18 variables)": {
     "Accuracy": 0.592,
     "Recall": 0.8666666666666667,
     "Precisión": 0.4140127388535032,
     "F1": 0.5603448275862069,
     "ROC-AUC": 0.7947428571428572,
     "Costo": 142.0
    },
    "Regresión logística completa (18 variables)": {
     "Accuracy": 0.564,
     "Recall": 0.8933333333333333,
     "Precisión": 0.39880952380952384,
     "F1": 0.551440329218107,
     "ROC-AUC": 0.8105142857142857,
     "Costo": 141.0
    },
    "Modelo web (8 variables)": {
     "Accuracy": 0.52,
     "Recall": 0.92,
     "Precisión": 0.3770491803278688,
     "F1": 0.5348837209302325,
     "ROC-AUC": 0.7772952380952382,
     "Costo": 144.0
    }
   },
   "equidad_edad": {
    "19-25": {
     "Buenos rechazados — Random Forest": 0.7818181818181819,
     "Buenos rechazados — modelo web": 0.6909090909090909,
     "Recall — Random Forest": 0.925,
     "Recall — modelo web": 0.9125
    },
    "26-35": {
     "Buenos rechazados — Random Forest": 0.5392857142857143,
     "Buenos rechazados — modelo web": 0.6464285714285715,
     "Recall — Random Forest": 0.8813559322033898,
     "Recall — modelo web": 0.8983050847457628
    },
    "36-50": {
     "Buenos rechazados — Random Forest": 0.44298245614035087,
     "Buenos rechazados — modelo web": 0.5964912280701754,
     "Recall — Random Forest": 0.8732394366197183,
     "Recall — modelo web": 0.9295774647887324
    },
    "51+": {
     "Buenos rechazados — Random Forest": 0.47560975609756095,
     "Buenos rechazados — modelo web": 0.524390243902439,
     "Recall — Random Forest": 0.8709677419354839,
     "Recall — modelo web": 0.9032258064516129
    }
   }
  }
 },
 "extra": {
  "eda": {
   "duracion": [
    [
     "≤ 12 meses",
     21.2,
     359
    ],
    [
     "13–24 meses",
     29.7,
     411
    ],
    [
     "25–36 meses",
     39.9,
     143
    ],
    [
     "> 36 meses",
     51.7,
     87
    ]
   ],
   "cuenta": [
    [
     "Saldo negativo",
     49.3,
     274
    ],
    [
     "0 a 200 DM",
     39.0,
     269
    ],
    [
     "200 DM o más",
     22.2,
     63
    ],
    [
     "Sin cuenta",
     11.7,
     394
    ]
   ],
   "edad": [
    [
     "19–25",
     42.1,
     190
    ],
    [
     "26–35",
     29.6,
     398
    ],
    [
     "36–50",
     23.7,
     299
    ],
    [
     "51+",
     27.4,
     113
    ]
   ],
   "ahorros": [
    [
     "Menos de 100 DM",
     36.0,
     603
    ],
    [
     "100 a 500 DM",
     33.0,
     103
    ],
    [
     "500 a 1000 DM",
     17.5,
     63
    ],
    [
     "1000 DM o más",
     12.5,
     48
    ]
   ]
  },
  "odds": [
   [
    "Cuenta: saldo negativo",
    1.48
   ],
   [
    "Ahorros < 100 DM",
    1.4
   ],
   [
    "Duración (+1 desv.)",
    1.3
   ],
   [
    "Empleo < 1 año",
    1.25
   ],
   [
    "Otros créditos en bancos",
    1.23
   ],
   [
    "Propósito: educación",
    1.23
   ],
   [
    "Cuota (+1 desv.)",
    1.22
   ],
   [
    "Propiedad: inmueble",
    0.85
   ],
   [
    "Empleo 4–7 años",
    0.78
   ],
   [
    "Propósito: auto usado",
    0.78
   ],
   [
    "Historial: cuenta crítica",
    0.7
   ],
   [
    "Sin cuenta corriente",
    0.56
   ]
  ],
  "confusion": {
   "Random Forest (umbral 0,28)": [
    83,
    92,
    10,
    65
   ],
   "Modelo web (umbral 0,34)": [
    61,
    114,
    6,
    69
   ]
  }
 }
};
