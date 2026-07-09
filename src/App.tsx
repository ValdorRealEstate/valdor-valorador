import React, { useState, useEffect } from "react";


const tiposInmueble = ["Piso", "Casa / Chalet", "Ático", "Dúplex", "Estudio", "Local comercial", "Solar / Terreno"];
// Dirección via Google Places Autocomplete
const estadosInmueble = ["A reformar", "Buen estado", "Reformado", "Obra nueva · Seminuevo"];

// --- Precio base por m² por zona (€/m², estimación 2025) ---
// Base de datos de precios €/m² por municipio (Ministerio Transportes Q3 2024 + Idealista)
const PRECIOS_MUNICIPIOS: { [key: string]: number } = {
  "A Coruña": 1900, "Abrera": 1650, "Adeje": 3500,
  "Alacant": 2000, "Albacete": 1300, "Alcalá de Guadaíra": 1600,
  "Alcalá de Henares": 2100, "Alcobendas": 3500, "Alcorcón": 2400,
  "Alella": 3524, "Algeciras": 1400, "Alicante": 2000,
  "Almería": 1500, "Arganda del Rey": 1900, "Argentona": 1986,
  "Arona": 2800, "Badajoz": 1200, "Badalona": 2481,
  "Badia del Vallès": 1963, "Barakaldo": 2400, "Barberà del Vallès": 2355,
  "Barcelona": 5243, "Barcelona ciudad": 5243, "Begues": 2630,
  "Benalmádena": 3000, "Benidorm": 2800, "Berga": 1027,
  "Bigues i Riells": 1648, "Bilbao": 3200, "Blanes": 2000,
  "Boadilla del Monte": 3600, "Burgos": 1700, "Cabrera d'Anoia": 1234,
  "Cabrils": 2610, "Caldes de Montbui": 2185, "Calella": 2529,
  "Calvià": 4500, "Cambrils": 2200, "Canet de Mar": 2480,
  "Canovelles": 1444, "Canyelles": 1723, "Capellades": 1276,
  "Cardedeu": 2458, "Cartagena": 1600, "Castellar del Vallès": 2071,
  "Castellbell i el Vilar": 1253, "Castellbisbal": 2080, "Castelldefels": 4405,
  "Castelló de la Plana": 1400, "Castellón de la Plana": 1400, "Cerdanyola del Vallès": 3095,
  "Cervelló": 1943, "Ciudad Real": 1200, "Collado Villalba": 2000,
  "Corbera de Llobregat": 1799, "Cornellà de Llobregat": 3026, "Cubelles": 2536,
  "Cuenca": 1100, "Cáceres": 1300, "Cádiz": 2000,
  "Córdoba": 1600, "Donostia": 4500, "Dos Hermanas": 1700,
  "Dosrius": 1772, "Eivissa": 7200, "El Masnou": 3333,
  "El Prat de Llobregat": 3127, "Elche": 1500, "Elx": 1500,
  "Esparreguera": 1940, "Esplugues de Llobregat": 4177, "Estepona": 3000,
  "Ferrol": 1100, "Figueres": 1600, "Fuengirola": 3000,
  "Fuenlabrada": 2000, "Gandía": 1900, "Gavà": 3517,
  "Gelida": 1527, "Getafe": 2300, "Getxo": 3600,
  "Gijón": 1700, "Girona": 2400, "Granada": 1900,
  "Granollers": 2280, "Guadalajara": 1800, "Hospitalet de Llobregat": 2951,
  "Huelva": 1300, "Huesca": 1400, "Ibiza": 7200,
  "Inca": 2400, "Iruña": 2600, "Irún": 2800,
  "Jaén": 1100, "Jerez de la Frontera": 1400, "L'Ametlla del Vallès": 2067,
  "La Garriga": 2533, "La Laguna": 1900, "La Llagosta": 1961,
  "La Roca del Vallès": 2476, "La Torre de Claramunt": 1152, "Las Palmas de Gran Canaria": 2200,
  "Las Rozas de Madrid": 3500, "Leganés": 2200, "Les Botigues de Sitges": 4333,
  "Les Franqueses del Vallès": 2213, "León": 1400, "Lleida": 1400,
  "Llinars del Vallès": 1930, "Lliçà d'Amunt": 1897, "Lliçà de Vall": 1828,
  "Lloret de Mar": 2200, "Llucmajor": 2600, "Logroño": 1700,
  "Lorca": 1100, "Lugo": 1200, "Madrid": 4500,
  "Majadahonda": 3800, "Malgrat de Mar": 2086, "Manlleu": 1025,
  "Manresa": 1460, "Marbella": 4500, "Marratxí": 3200,
  "Martorell": 1988, "Martorelles": 2727, "Masquefa": 1751,
  "Matadepera": 2527, "Mataró": 2286, "Maó": 3800,
  "Mediona": 1103, "Menorca": 3800, "Mijas": 3200,
  "Mislata": 1800, "Moià": 1598, "Molins de Rei": 3328,
  "Mollerussa": 1200, "Mollet del Vallès": 2119, "Montcada i Reixac": 2035,
  "Montornès del Vallès": 2155, "Murcia": 1500, "Mérida": 1100,
  "Móstoles": 2200, "Nerja": 3500, "Olesa de Montserrat": 2039,
  "Olot": 1500, "Orihuela": 1400, "Otra": 1800,
  "Ourense": 1300, "Oviedo": 1800, "Palau-Solità i Plegamans": 2225,
  "Palencia": 1300, "Pallejà": 2490, "Palma": 3600,
  "Palma de Mallorca": 3600, "Pamplona": 2600, "Parets del Vallès": 2512,
  "Parla": 1700, "Paterna": 1900, "Piera": 1514,
  "Pineda de Mar": 2325, "Platja d'Aro": 3500, "Polinyà": 2589,
  "Pontevedra": 1700, "Pozuelo de Alarcón": 4800, "Premià de Dalt": 2845,
  "Premià de Mar": 2627, "Reus": 1600, "Ripollet": 2222,
  "Rivas-Vaciamadrid": 2400, "Roda de Ter": 1345, "Roses": 2500,
  "Rubí": 2332, "Sabadell": 2272, "Sagunto": 1500,
  "Salamanca": 1800, "Sallent": 906, "Salt": 1400,
  "San Sebastián": 4500, "San Sebastián de los Reyes": 2800, "Sant Andreu de la Barca": 2702,
  "Sant Andreu de Llavaneres": 3120, "Sant Boi de Llobregat": 2588, "Sant Cebrià de Vallalta": 2134,
  "Sant Celoni": 2001, "Sant Cugat del Vallès": 4962, "Sant Esteve Sesrovires": 2122,
  "Sant Feliu de Llobregat": 3398, "Sant Fost de Campsentelles": 1758, "Sant Joan Despí": 3753,
  "Sant Just Desvern": 4460, "Sant Pere de Ribes": 2586, "Sant Pere de Vilamajor": 1522,
  "Sant Pol de Mar": 2723, "Sant Quirze del Vallès": 2700, "Sant Vicenç de Montalt": 3240,
  "Sant Vicenç dels Horts": 2379, "Santa Coloma de Cervelló": 2461, "Santa Coloma de Gramenet": 2428,
  "Santa Cruz de Tenerife": 2000, "Santa Eulàlia de Ronçana": 1853, "Santa Margarida de Montbui": 1125,
  "Santa Margarida i els Monjos": 1538, "Santa Perpètua de Mogoda": 2098, "Santa Susanna": 2011,
  "Santander": 2000, "Santiago de Compostela": 2000, "Segovia": 1700,
  "Sentmenat": 1949, "Seva": 1959, "Sevilla": 2100,
  "Sitges": 5257, "Soria": 1000, "Tarragona": 1800,
  "Teià": 3091, "Terrassa": 2138, "Teruel": 1000,
  "Tiana": 3301, "Toledo": 1600, "Tona": 2078,
  "Tordera": 1650, "Torrejón de Ardoz": 2000, "Torrelles de Foix": 1114,
  "Torrelles de Llobregat": 2288, "Torremolinos": 2800, "Torrent": 1800,
  "Torrevieja": 1800, "Tortosa": 1100, "Tres Cantos": 3200,
  "Vacarisses": 1791, "Valdemoro": 1800, "Valencia": 2300,
  "Valladolid": 1700, "Vallirana": 1893, "Valls": 1300,
  "Vic": 2314, "Vigo": 1900, "Vila-seca": 1900,
  "Viladecans": 2960, "Vilafranca del Penedès": 2146, "Vilanova del Camí": 1659,
  "Vilanova del Vallès": 1810, "Vilanova i la Geltrú": 2777, "Vilassar de Dalt": 2571,
  "Vilassar de Mar": 3754, "Vitoria-Gasteiz": 2600, "Vélez-Málaga": 1600,
  "Zamora": 1100, "Zaragoza": 1800, "Ávila": 1200,
};

const PRECIOS_PROVINCIA: { [key: string]: number } = {
  "barcelona": 2300, "girona": 2200, "tarragona": 1900, "lleida": 1400,
  "baleares": 3800, "madrid": 3200, "valencia": 1900, "alicante": 2200,
  "castellón": 1400, "sevilla": 1900, "málaga": 2800, "granada": 1700,
  "córdoba": 1500, "almería": 1600, "cádiz": 1800, "huelva": 1300,
  "jaén": 1100, "vizcaya": 3000, "guipúzcoa": 3800, "álava": 2500,
  "navarra": 2400, "zaragoza": 1700, "valladolid": 1600, "murcia": 1500,
  "canarias": 2200, "asturias": 1700, "cantabria": 1900, "la rioja": 1600,
};


// ── Zonas de precio por coordenadas ──────────────────────────────────────────
// Polígonos aproximados para Barcelona y Madrid
// Cada zona: [nombre, precio_m2, [[lat,lng]...]]
const ZONAS_PRECIO_COORDS: [string, number, number[][]][] = [
  // Barcelona
  ["Pedralbes / Zona Alta", 7000, [[41.388,2.105],[41.405,2.105],[41.410,2.125],[41.395,2.130],[41.385,2.120]]],
  ["Sarrià - Sant Gervasi", 7051, [[41.390,2.125],[41.410,2.125],[41.415,2.145],[41.400,2.155],[41.388,2.140]]],
  ["Diagonal Premium", 6400, [[41.378,2.128],[41.415,2.128],[41.418,2.200],[41.382,2.204]]],
  ["Eixample", 6496, [[41.370,2.146],[41.378,2.146],[41.380,2.180],[41.372,2.182]]],
  ["Gràcia", 5643, [[41.398,2.146],[41.418,2.146],[41.420,2.170],[41.400,2.172]]],
  ["Ciutat Vella", 4805, [[41.373,2.168],[41.386,2.168],[41.388,2.186],[41.375,2.186]]],
  ["Poblenou / 22@", 4800, [[41.388,2.184],[41.406,2.184],[41.408,2.218],[41.390,2.218]]],
  ["Sants - Montjuïc", 4574, [[41.358,2.128],[41.378,2.128],[41.380,2.164],[41.360,2.167]]],
  ["Sant Martí", 5097, [[41.388,2.172],[41.412,2.172],[41.414,2.222],[41.390,2.222]]],
  ["Horta - Guinardó", 4076, [[41.406,2.146],[41.436,2.146],[41.438,2.178],[41.408,2.180]]],
  ["Sant Andreu", 3940, [[41.418,2.172],[41.440,2.172],[41.442,2.202],[41.420,2.207]]],
  ["Nou Barris", 3193, [[41.426,2.146],[41.458,2.146],[41.460,2.188],[41.428,2.190]]],
  ["Besòs / La Mina", 2500, [[41.403,2.208],[41.426,2.208],[41.428,2.234],[41.405,2.234]]],
  // Madrid
  ["Salamanca (Madrid)", 6200, [[40.422,-3.680],[40.438,-3.680],[40.440,-3.658],[40.424,-3.656]]],
  ["Chamberí (Madrid)", 5500, [[40.430,-3.706],[40.446,-3.706],[40.448,-3.683],[40.432,-3.681]]],
  ["Retiro (Madrid)", 5800, [[40.406,-3.682],[40.424,-3.682],[40.426,-3.657],[40.408,-3.654]]],
  ["Centro (Madrid)", 5200, [[40.408,-3.714],[40.426,-3.714],[40.428,-3.693],[40.410,-3.690]]],
  ["Chamartín (Madrid)", 5800, [[40.444,-3.686],[40.466,-3.686],[40.468,-3.656],[40.446,-3.653]]],
  ["Moncloa (Madrid)", 5000, [[40.426,-3.732],[40.448,-3.732],[40.450,-3.706],[40.428,-3.703]]],
  ["Arganzuela (Madrid)", 4200, [[40.393,-3.706],[40.412,-3.706],[40.414,-3.691],[40.395,-3.688]]],
  ["Carabanchel (Madrid)", 2800, [[40.368,-3.742],[40.396,-3.742],[40.398,-3.706],[40.370,-3.703]]],
  ["Vallecas (Madrid)", 2400, [[40.376,-3.662],[40.400,-3.662],[40.402,-3.633],[40.378,-3.630]]],
  ["Latina (Madrid)", 3000, [[40.396,-3.742],[40.416,-3.742],[40.418,-3.719],[40.398,-3.716]]],
  ["Villaverde (Madrid)", 2200, [[40.343,-3.720],[40.370,-3.720],[40.372,-3.697],[40.345,-3.694]]],
];

// Ray casting algorithm — point in polygon
function pointInPolygon(lat: number, lng: number, polygon: number[][]) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const intersect = ((yi > lng) !== (yj > lng)) && (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function getPrecioByCoords(lat: number, lng: number) {
  for (const [name, price, polygon] of ZONAS_PRECIO_COORDS) {
    if (pointInPolygon(lat, lng, polygon)) return { zona: name, precio: price };
  }
  return null;
}

function getPrecioZona(zona: string) {
  if (!zona) return 1800;
  if (PRECIOS_MUNICIPIOS[zona]) return PRECIOS_MUNICIPIOS[zona];
  const zonaLower = zona.toLowerCase().trim();
  const key = Object.keys(PRECIOS_MUNICIPIOS).find(k => k.toLowerCase() === zonaLower);
  if (key) return PRECIOS_MUNICIPIOS[key];
  const partial = Object.keys(PRECIOS_MUNICIPIOS).find(k =>
    k.toLowerCase().includes(zonaLower) || zonaLower.includes(k.toLowerCase())
  );
  if (partial) return PRECIOS_MUNICIPIOS[partial];
  const prov = Object.keys(PRECIOS_PROVINCIA).find(k => zonaLower.includes(k));
  if (prov) return PRECIOS_PROVINCIA[prov];
  return 1800;
}

// Multiplicadores por tipo
const MULT_TIPO = {
  "Piso":               1.00,
  "Casa / Chalet":      1.25,
  "Ático":              1.20,
  "Dúplex":             1.10,
  "Estudio":            0.95,
  "Local comercial":    0.80,
  "Solar / Terreno":    0.40,
};

// Multiplicadores por estado
const MULT_ESTADO = {
  "A reformar":              0.85,
  "Buen estado":             0.98,
  "Reformado":               1.07,
  "Obra nueva · Seminuevo":  1.16,
};

// Multiplicadores por planta
const MULT_PLANTA = {
  "Bajo":          0.92,
  "Entreplanta":   0.94,
  "1ª–3ª":         1.00,
  "4ª–6ª":         1.04,
  "7ª o superior": 1.07,
  "Última planta": 1.12,
  "":              1.00,
};

// Valor extras (€ adicionales por extra)
const VALOR_EXTRAS = {
  "Parking":              0, // calculated dynamically below
  "Trastero":             3000,
  "Terraza":              6000,
  "Jardín":               10000,
  "Piscina comunitaria":  4000,
  "Ascensor":             3500,
  "Vistas":               5000,
  "Aire acondicionado":   2000,
};

// Factores explicativos por zona/tipo/estado
const FACTORES_DB = {
  estado: {
    "A reformar":             "El estado a reformar reduce el valor hasta un 18% respecto al precio de mercado medio.",
    "Buen estado":            "El buen estado del inmueble garantiza una venta ágil sin objeciones de precio en visita.",
    "Reformado":              "La reforma reciente añade valor y acelera la venta, con prima de hasta un 5%.",
    "Obra nueva · Seminuevo": "La obra nueva o seminuevo obtiene la prima máxima por eficiencia energética y garantías.",
  },
  tipo: {
    "Piso":             "El piso es el producto con mayor liquidez y demanda en el mercado catalán.",
    "Casa / Chalet":    "La casa unifamiliar obtiene una prima de superficie y privacidad respecto al piso.",
    "Ático":            "El ático suma un 20% de media por terraza, vistas y exclusividad.",
    "Dúplex":           "El dúplex tiene mayor absorción entre familias, con prima del 10% sobre piso equivalente.",
    "Estudio":          "El estudio tiene alta demanda inversora para alquiler pero menor precio absoluto por m².",
    "Local comercial":  "El local comercial se valora por rendimiento de alquiler, no por comparables residenciales.",
    "Solar / Terreno":  "El solar se valora por edificabilidad y gestión urbanística, con alta variabilidad.",
  },
  zona: {
    "Barcelona ciudad":       "Barcelona ciudad mantiene tensión de precios alta con oferta limitada en todos los distritos.",
    "Terrassa":               "Terrassa ofrece buen equilibrio precio-calidad con demanda sostenida de primera residencia.",
    "Sabadell":               "Sabadell sigue una tendencia alcista impulsada por la mejora de conectividad con Barcelona.",
    "Sant Quirze del Vallès": "Sant Quirze del Vallès es uno de los municipios más demandados del Vallès Occidental.",
    "Castellar del Vallès":   "Castellar del Vallès combina tranquilidad residencial con precios competitivos del Vallès.",
    "Vacarisses":             "Vacarisses atrae a compradores que buscan casa con parcela a precio accesible.",
    "Ibiza":                  "Ibiza mantiene precios de los más elevados de España con demanda internacional constante.",
    "Palma de Mallorca":      "Palma de Mallorca sostiene precios altos impulsada por inversión extranjera y turística.",
    "Menorca":                "Menorca combina exclusividad insular con precios más moderados que Ibiza.",
    "Otra":                   "Zona con datos estimados; te recomendamos contactar con un agente Valdor para una valoración más precisa.",
  }
};

function calcularValoracion(form: any) {
  const precioBase = form.precioOverride || getPrecioZona(form.zona);
  const multTipo   = MULT_TIPO[form.tipo]    || 1.00;
  const multEstado = MULT_ESTADO[form.estado]|| 1.00;
  const multPlanta = MULT_PLANTA[form.planta || ""] || 1.00;

  // Ajuste por baños extra (>1)
  const banoBonus  = Math.max(0, (form.banos - 1)) * 0.03;

  const precioM2   = Math.round(precioBase * multTipo * multEstado * multPlanta * (1 + banoBonus));
  let valorBase    = precioM2 * form.metros;

  // Extras
  // Parking value scales with zone price (approx 4-6m² equivalent, capped)
  const parkingVal = Math.min(Math.max(Math.round(precioM2 * 5 / 1000) * 1000, 5000), 25000);
  const extrasValor = (form.extras || []).reduce((acc, e) => {
    if (e === "Parking") return acc + parkingVal;
    return acc + (VALOR_EXTRAS[e] || 0);
  }, 0);
  const total       = valorBase + extrasValor;

  // Rango ±10%
  const min         = Math.round((total * 0.90) / 1000) * 1000;
  const estimado    = Math.round(total / 1000) * 1000;
  const max         = Math.round((total * 1.12) / 1000) * 1000;

  const fmt = (n) => "€" + n.toLocaleString("es-ES");

  // Factores
  const factores = [
    FACTORES_DB.zona[form.zona]   || FACTORES_DB.zona["Otra"],
    FACTORES_DB.tipo[form.tipo]   || "",
    FACTORES_DB.estado[form.estado] || "",
  ].filter(Boolean);

  if ((form.extras || []).includes("Parking"))
    factores.push(`El parking suma aprox. ${Math.min(Math.max(Math.round(precioM2 * 5 / 1000) * 1000, 5000), 25000).toLocaleString("es-ES")}€ al valor total en esta zona.`);
  if ((form.extras || []).includes("Terraza") || (form.extras || []).includes("Jardín"))
    factores.push("Los espacios exteriores (terraza/jardín) son uno de los factores más valorados post-pandemia.");

  // Recomendación
  let recomendacion = "";
  if (form.estado === "A reformar") {
    recomendacion = `Con una inversión de reforma estimada entre €${Math.round(form.metros * 400).toLocaleString("es-ES")} y €${Math.round(form.metros * 600).toLocaleString("es-ES")}, podrías aumentar el valor en un 15–20%. Valorar si la operación compensa según tu objetivo de venta.`;
  } else if (form.estado === "Obra nueva · Seminuevo") {
    recomendacion = "El inmueble está en las mejores condiciones para la venta. Apuesta por precio firme los primeros 30 días; el mercado de obra nueva tiene margen de negociación reducido.";
  } else {
    recomendacion = `En ${form.zona}, el tiempo medio de venta a precio de mercado es de 45–90 días. Posicionar en el rango estimado desde el inicio evita quemas de precio por exceso de tiempo en el portal.`;
  }

  return {
    rango: { min: fmt(min), estimado: fmt(estimado), max: fmt(max) },
    precioM2: `€${precioM2.toLocaleString("es-ES")}/m²`,
    factores: factores.slice(0, 4),
    recomendacion,
    esMediaMunicipal: !form.precioOverride,
    municipio: (form.zona && form.zona !== "Otra") ? form.zona : "",
  };
}

// --- UI Components ---

function ProgressBar({ step, total }: { step: number, total: number }) {
  return (
    <div style={{ width: "100%", height: 3, background: "#E8E0D6", borderRadius: 2, overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${(step / total) * 100}%`,
        background: "linear-gradient(90deg, #B8956A, #D4AA80)",
        borderRadius: 2, transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)"
      }} />
    </div>
  );
}

function ChipSelect({ options, value, onChange, multi = false }: { options: any[], value: any, onChange: any, multi?: boolean }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 8 }}>
      {options.map(opt => {
        const selected = multi ? (value || []).includes(opt) : value === opt;
        return (
          <button key={opt} onClick={() => {
            if (multi) {
              const cur = value || [];
              onChange(selected ? cur.filter(x => x !== opt) : [...cur, opt]);
            } else { onChange(opt); }
          }} style={{
            padding: "10px 18px", borderRadius: 50,
            border: selected ? "1.5px solid #B8956A" : "1.5px solid #DDD5C8",
            background: selected ? "#FAF4EE" : "#FFFFFF",
            color: selected ? "#8A6840" : "#4A4035",
            fontFamily: "'DM Sans', sans-serif", fontSize: 14,
            fontWeight: selected ? 600 : 400, cursor: "pointer", transition: "all 0.18s",
          }}>{opt}</button>
        );
      })}
    </div>
  );
}

function NumberInput({ value, onChange, min, max, step = 1, unit, label }: { value: any, onChange: any, min: number, max: number, step?: number, unit: string, label?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {label && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#9B8C7D", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={() => onChange(Math.max(min, (value || min) - step))} style={{
          width: 40, height: 40, borderRadius: "50%", border: "1.5px solid #DDD5C8",
          background: "#FFF", fontSize: 20, color: "#B8956A", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>−</button>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 500, color: "#1A1A1A", minWidth: 80, textAlign: "center" }}>
          {value || min}<span style={{ fontSize: 16, color: "#9B8C7D", marginLeft: 4 }}>{unit}</span>
        </span>
        <button onClick={() => onChange(Math.min(max, (value || min) + step))} style={{
          width: 40, height: 40, borderRadius: "50%", border: "1.5px solid #DDD5C8",
          background: "#FFF", fontSize: 20, color: "#B8956A", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>+</button>
      </div>
    </div>
  );
}

function ResultBlock({ result, onReset }: { result: any, onReset: any }) {
  return (
    <div>
      {/* Precio */}
      {result.esMediaMunicipal && (
        <div style={{
          background: "#FBF8F3", border: "1px solid #E8D9C4", borderLeft: "3px solid #B8956A",
          borderRadius: 10, padding: "12px 16px", marginBottom: 16,
          fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.5, color: "#6B6B6B"
        }}>
          No hemos podido localizar tu zona exacta{result.municipio ? " dentro de " + result.municipio : ""}, así que esta valoración se ha calculado sobre el <strong style={{ color: "#1A1A1A" }}>precio medio del municipio</strong>. Una visita gratuita nos permite afinarla según tu zona concreta.
        </div>
      )}
      <div style={{
        background: "linear-gradient(135deg, #FAF4EE 0%, #FFF8F0 100%)",
        border: "1px solid #E8D9C4", borderRadius: 16, padding: "28px 24px", marginBottom: 20,
        position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(184,149,106,0.08)" }} />
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#B8956A", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 16 }}>
          Valoración estimada
        </p>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#9B8C7D", marginBottom: 4 }}>Mínimo</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 500, color: "#6B6B6B", margin: 0 }}>{result.rango.min}</p>
          </div>
          <span style={{ fontSize: 16, color: "#D4AA80", paddingBottom: 4 }}>—</span>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#B8956A", marginBottom: 4 }}>Estimado</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 600, color: "#1A1A1A", margin: 0 }}>{result.rango.estimado}</p>
          </div>
          <span style={{ fontSize: 16, color: "#D4AA80", paddingBottom: 4 }}>—</span>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#9B8C7D", marginBottom: 4 }}>Óptimo</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 500, color: "#6B6B6B", margin: 0 }}>{result.rango.max}</p>
          </div>
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#9B8C7D", margin: 0 }}>
          Precio por m²: <strong style={{ color: "#B8956A" }}>{result.precioM2}</strong>
        </p>
      </div>

      {/* Factores */}
      {result.factores?.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#9B8C7D", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>
            Factores clave
          </p>
          {result.factores.map((f, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 10,
              padding: "10px 14px", background: "#FAFAF8",
              borderRadius: 10, border: "1px solid #EEE8E0", marginBottom: 8
            }}>
              <span style={{ color: "#B8956A", fontSize: 12, marginTop: 3, flexShrink: 0 }}>◆</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#4A4035", lineHeight: 1.5 }}>{f}</span>
            </div>
          ))}
        </div>
      )}

      {/* Recomendación */}
      <div style={{ background: "#1A1A1A", borderRadius: 14, padding: "20px 22px", marginBottom: 20 }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#B8956A", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>
          Recomendación Valdor
        </p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#F5F0EA", lineHeight: 1.6, margin: 0 }}>
          {result.recomendacion}
        </p>
      </div>

      {/* Mapa */}
      {result.direccion && (
        <div style={{ marginBottom: 20, borderRadius: 14, overflow: "hidden", border: "1px solid #EEE8E0" }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#9B8C7D", textTransform: "uppercase", letterSpacing: "0.12em", padding: "12px 16px 8px", margin: 0 }}>
            📍 Ubicación del inmueble
          </p>
          <iframe
            width="100%"
            height="200"
            style={{ border: "none", display: "block" }}
            loading="lazy"
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBIXoLby1u1ILtM7HHyhrdPXYv-uznUtrI&q=${encodeURIComponent(result.direccion)}&zoom=15&language=es`}
          />
        </div>
      )}

      {/* Disclaimer */}
      <div style={{ background: "linear-gradient(135deg, #FAF4EE, #FFF8F0)", border: "1px solid #E8D9C4", borderRadius: 12, padding: "14px 18px", marginBottom: 20 }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#6B5B45", lineHeight: 1.6, margin: 0 }}>
          💡 Esta estimación es orientativa. Nuestros expertos pueden precisar la valoración con una visita gratuita — una valoración presencial puede marcar una diferencia de hasta un 15%.
        </p>
      </div>

      {/* CTAs */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <a href="tel:+34623999568" style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          background: "linear-gradient(135deg, #B8956A, #C9A87A)",
          color: "#FFF", padding: "15px 24px", borderRadius: 50,
          fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15,
          textDecoration: "none", boxShadow: "0 4px 20px rgba(184,149,106,0.35)"
        }}>
          📞 Llamar ahora
        </a>
        <a href="https://wa.me/34623999568?text=Hola,%20acabo%20de%20usar%20el%20valorador%20de%20Valdor%20y%20quiero%20una%20valoración%20profesional%20gratuita" target="_blank" rel="noopener noreferrer" style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          background: "#25D366", color: "#FFF", padding: "14px 24px", borderRadius: 50,
          fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15,
          textDecoration: "none"
        }}>
          💬 Contactar por WhatsApp
        </a>
        <button onClick={onReset} style={{
          background: "none", border: "1.5px solid #DDD5C8", borderRadius: 50,
          color: "#9B8C7D", padding: "12px 24px", cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif", fontSize: 13
        }}>
          Valorar otro inmueble
        </button>
      </div>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#C0B5AB", textAlign: "center", marginTop: 16, lineHeight: 1.5 }}>
        * Valoración orientativa basada en datos de mercado 2025. No sustituye una tasación oficial.
      </p>
    </div>
  );
}


// Precios por distrito para grandes ciudades
const PRECIOS_DISTRITO = {
  // Barcelona distritos (idealista may 2026)
  "eixample": 6496, "sarrià": 7051, "sarria": 7051, "les corts": 6536,
  "gràcia": 5643, "gracia": 5643, "ciutat vella": 4805, "sants": 4574,
  "sant martí": 5097, "sant marti": 5097, "horta": 4076, "guinardó": 4076,
  "nou barris": 3193, "sant andreu": 3940, "besòs": 2500, "besos": 2500,
  "la mina": 2500, "poblenou": 4800, "diagonal": 6400, "pedralbes": 7000,
  // Madrid distritos
  "salamanca": 6200, "chamberí": 5500, "chamberi": 5500, "retiro": 5800,
  "centro": 5200, "chamartín": 5800, "chamartin": 5800, "moncloa": 5000,
  "arganzuela": 4200, "carabanchel": 2800, "vallecas": 2400, "hortaleza": 3200,
  "usera": 2800, "latina": 3000, "villaverde": 2200, "moratalaz": 3200,
};

const PRECIOS_BARRIO: { [muni: string]: { [barrio: string]: number } } = {
  "Sabadell": {
    "centre": 2824, "la creu alta": 2663, "la concòrdia": 2284, "can rull": 2284,
    "la creu de barberà": 2151, "eixample": 2151, "avinguda": 2151,
    "can feu": 1974, "arraona": 1974, "ca n'oriac": 1861, "can puiggener": 1861,
    "torre-romeu": 1448, "poble nou": 1448, "poblenou": 1448,
  },
  "Terrassa": {
    "centre": 2561, "nord-oest": 2347, "nord-oeste": 2347, "sud": 2132,
    "nord-est": 2038, "nord-este": 2038, "ponent": 1994, "llevant": 1834,
  },
};

function extractZonaFromPlace(place: any) {
  if (!place || !place.address_components) return null;
  const components = place.address_components;
  // Try to get sublocality (barrio/distrito) first
  const district = components.find(c => c.types.includes("sublocality_level_1") || c.types.includes("sublocality"));
  const neighborhood = components.find(c => c.types.includes("neighborhood"));
  const locality = components.find(c => c.types.includes("locality"));
  const adminArea = components.find(c => c.types.includes("administrative_area_level_2"));

  // Barrio acotado por municipio (Sabadell, Terrassa...) — sin colisiones entre pueblos
  if (locality && PRECIOS_BARRIO[locality.long_name]) {
    const barrios = PRECIOS_BARRIO[locality.long_name];
    const cands = [district, neighborhood].filter(Boolean);
    for (const c of cands) {
      const name = c.long_name.toLowerCase();
      const bKey = Object.keys(barrios).find(k => name.includes(k) || k.includes(name));
      if (bKey) return { zona: locality.long_name + " - " + c.long_name, precioOverride: barrios[bKey] };
    }
  }

  // Check for district price first (Barcelona/Madrid por nombre)
  if (district) {
    const dName = district.long_name.toLowerCase();
    const dKey = Object.keys(PRECIOS_DISTRITO).find(k => dName.includes(k) || k.includes(dName));
    if (dKey) return { zona: district.long_name, precioOverride: PRECIOS_DISTRITO[dKey] };
  }
  // Fall back to locality (municipality)
  if (locality) return { zona: locality.long_name, precioOverride: null };
  if (adminArea) return { zona: adminArea.long_name, precioOverride: null };
  return null;
}

function DireccionStep({ form, update, apiKey, required = false, optional = false }: { form: any, update: any, apiKey: string, required?: boolean, optional?: boolean }) {
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    function initAutocomplete() {
      if (!inputRef.current) return;
      const autocomplete = new (window as any).google.maps.places.Autocomplete(inputRef.current, {
        types: ["address"],
        componentRestrictions: { country: ["es"] },
        fields: ["formatted_address", "geometry", "address_components"]
      });
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          update("direccion", place.formatted_address);
          // Coordinate-based zone detection (most precise)
          if (place.geometry && place.geometry.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            update("coords", { lat, lng });
            const coordZone = getPrecioByCoords(lat, lng);
            if (coordZone) {
              update("zona", coordZone.zona);
              update("precioOverride", coordZone.precio);
              return;
            }
          }
          // Fallback: extract zone from address components
          const extracted = extractZonaFromPlace(place);
          if (extracted) {
            update("zona", extracted.zona);
            if (extracted.precioOverride) update("precioOverride", extracted.precioOverride);
          }
        }
      });
    }

    if ((window as any).google && (window as any).google.maps) { initAutocomplete(); return; }
    if (document.getElementById("gmaps-script")) {
      const interval = setInterval(() => {
        if ((window as any).google && (window as any).google.maps) { clearInterval(interval); initAutocomplete(); }
      }, 300);
      return () => clearInterval(interval);
    }
    (window as any).initGMaps = initAutocomplete;
    const script = document.createElement("script");
    script.id = "gmaps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBIXoLby1u1ILtM7HHyhrdPXYv-uznUtrI&libraries=places&callback=initGMaps&language=es&region=ES`;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  const headingStyle = { fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 500, color: "#1A1A1A", lineHeight: 1.3, margin: "0 0 8px", letterSpacing: "-0.01em" };

  return (
    <>
      <h2 style={headingStyle}>¿Cuál es la dirección del inmueble?</h2>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#6B6B6B", marginTop: 4, marginBottom: 20, lineHeight: 1.5 }}>
        {required ? "Necesitamos la dirección para calcular la valoración con precisión." : "Nos ayuda a afinar aún más la valoración."}
      </p>
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>📍</span>
        <input
          ref={inputRef}
          type="text"
          placeholder="Calle, número, ciudad..."
          defaultValue={form.direccion || ""}
          onChange={e => update("direccion", e.target.value)}
          style={{
            width: "100%", padding: "13px 16px 13px 42px",
            borderRadius: 12, border: "1.5px solid #DDD5C8",
            fontFamily: "'DM Sans', sans-serif", fontSize: 14,
            color: "#1A1A1A", outline: "none", boxSizing: "border-box", background: "#FAFAF8"
          }}
        />
      </div>
      {form.zona && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, padding: "8px 14px", background: "#FAF4EE", borderRadius: 8, border: "1px solid #E8D9C4" }}>
          <span style={{ fontSize: 14 }}>✅</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#8A6840" }}>Zona detectada: <strong>{form.zona}</strong></span>
        </div>
      )}
      {!required && (
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#C0B5AB", marginTop: 10, lineHeight: 1.5 }}>
          Puedes continuar sin rellenar este campo.
        </p>
      )}
    </>
  );
}

export default function ValdorValuador() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    tipo: "", zona: "", zonaCustom: "", metros: 80,
    habitaciones: 3, banos: 1, extras: [], estado: "", planta: "", direccion: "", precioOverride: null, coords: null, nombre: "", telefono: "", email: ""
  });
  const [result, setResult] = useState(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(t);
  }, [step]);

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const canNext = () => {
    if (step === 0) return !!form.tipo;
    if (step === 1) return !!(form.direccion && form.direccion.trim().length > 5);
    if (step === 2) return form.metros >= 20;
    if (step === 3) return form.habitaciones >= 0;
    if (step === 4) return !!form.estado;
    if (step === 5) {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email || "");
      return !!(form.nombre && form.nombre.trim().length > 1 && form.telefono && form.telefono.trim().length > 8 && emailOk);
    }
    return false;
  };

  const MAKE_WEBHOOK = "https://hook.eu1.make.com/98fql1pvcfa0n5oiqnbqwcvwp2umw4co";

  const enviarLeadMake = async (formData: any, valoracion: any) => {
    try {
      await fetch(MAKE_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre,
          telefono: formData.telefono,
          email: formData.email,
          direccion: formData.direccion || "",
          tipo_inmueble: formData.tipo,
          metros: formData.metros,
          habitaciones: formData.habitaciones,
          banos: formData.banos,
          extras: (formData.extras || []).join(", "),
          estado: formData.estado,
          planta: formData.planta || "",
          zona: formData.zona || "",
          precio_minimo: valoracion.rango.min,
          precio_estimado: valoracion.rango.estimado,
          precio_optimo: valoracion.rango.max,
          precio_m2: valoracion.precioM2,
          fecha: new Date().toISOString(),
          fuente: "Valorador Valdor Web"
        })
      });
    } catch (e) {
      console.error("Error enviando lead a Make:", e);
    }
  };

  const handleNext = () => {
    if (step === 5) {
      const res = { ...calcularValoracion({ ...form }), direccion: form.direccion };
      setResult(res);
      setStep(6);
      enviarLeadMake(form, res);
       if ((window as any).fbq) (window as any).fbq("track", "Lead");
       return;
    }
    setStep(s => s + 1);
  };

  const handleReset = () => {
    setStep(0);
    setForm({ tipo: "", zona: "", zonaCustom: "", metros: 80, habitaciones: 3, banos: 1, extras: [], estado: "", planta: "", direccion: "", precioOverride: null, coords: null, nombre: "", telefono: "", email: "" });
    setResult(null);
  };

  const headingStyle = {
    fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 500,
    color: "#1A1A1A", lineHeight: 1.3, margin: "0 0 8px", letterSpacing: "-0.01em"
  };

  const stepContent = () => {
    switch (step) {
      case 0: return (
        <>
          <h2 style={headingStyle}>¿Qué tipo de inmueble quieres valorar?</h2>
          <ChipSelect options={tiposInmueble} value={form.tipo} onChange={v => update("tipo", v)} />
        </>
      );
      case 1: return (
        <DireccionStep form={form} update={update} apiKey="AIzaSyBIXoLby1u1ILtM7HHyhrdPXYv-uznUtrI" required={true} />
      );
      case 2: return (
        <>
          <h2 style={headingStyle}>Superficie del inmueble</h2>
          <div style={{ marginTop: 24 }}>
            <NumberInput value={form.metros} onChange={v => update("metros", v)} min={20} max={2000} step={5} unit="m²" label="Metros útiles" />
          </div>
          <input type="range" min={20} max={500} step={5} value={form.metros}
            onChange={e => update("metros", parseInt(e.target.value))}
            style={{ width: "100%", marginTop: 20, accentColor: "#B8956A" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#C0B5AB" }}>
            <span>20 m²</span><span>500 m²</span>
          </div>
        </>
      );
      case 3: return (
        <>
          <h2 style={headingStyle}>Características</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 16 }}>
            <NumberInput value={form.habitaciones} onChange={v => update("habitaciones", v)} min={0} max={10} step={1} unit="hab." label="Habitaciones" />
            <NumberInput value={form.banos} onChange={v => update("banos", v)} min={1} max={6} step={1} unit="baños" label="Baños" />
          </div>
          <div style={{ marginTop: 20 }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#9B8C7D", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Extras</p>
            <ChipSelect
              options={["Parking", "Trastero", "Terraza", "Jardín", "Piscina comunitaria", "Ascensor", "Vistas", "Aire acondicionado"]}
              value={form.extras} onChange={v => update("extras", v)} multi={true} />
          </div>
        </>
      );
      case 4: return (
        <>
          <h2 style={headingStyle}>Estado del inmueble</h2>
          <ChipSelect options={estadosInmueble} value={form.estado} onChange={v => update("estado", v)} />
          <div style={{ marginTop: 20 }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#9B8C7D", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Planta (opcional)</p>
            <ChipSelect
              options={["Bajo", "Entreplanta", "1ª–3ª", "4ª–6ª", "7ª o superior", "Última planta"]}
              value={form.planta} onChange={v => update("planta", v)} />
          </div>
        </>
      );
      case 5: return (
        <>
          <h2 style={headingStyle}>¿Dónde enviamos tu valoración?</h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#6B6B6B", marginTop: 4, marginBottom: 20, lineHeight: 1.5 }}>
            Déjanos tus datos y accede al resultado ahora mismo. Sin compromiso.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { key: "nombre", placeholder: "Nombre", type: "text", icon: "👤" },
              { key: "telefono", placeholder: "Teléfono", type: "tel", icon: "📱" },
              { key: "email", placeholder: "Email", type: "email", icon: "✉️" },
            ].map(({ key, placeholder, type, icon }) => (
              <div key={key} style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>{icon}</span>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[key] || ""}
                  onChange={e => update(key, e.target.value)}
                  style={{
                    width: "100%", padding: "13px 16px 13px 42px",
                    borderRadius: 12, border: "1.5px solid #DDD5C8",
                    fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                    color: "#1A1A1A", outline: "none", boxSizing: "border-box",
                    background: "#FAFAF8", transition: "border-color 0.2s"
                  }}
                />
              </div>
            ))}
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#C0B5AB", marginTop: 14, lineHeight: 1.5 }}>
            🔒 Tus datos están seguros. Solo los usaremos para contactarte sobre tu valoración.
          </p>
        </>
      );
      case 6: return result ? <ResultBlock result={result} onReset={handleReset} /> : null;
      default: return null;
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "url('/hero-bg.png') center/cover no-repeat fixed",
      backgroundAttachment: "fixed",
      position: "relative",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 16px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: "linear-gradient(to bottom, rgba(20,15,8,0.45) 0%, rgba(20,15,8,0.35) 50%, rgba(20,15,8,0.55) 100%)" }} />
      <div style={{
        width: "100%", maxWidth: 480, background: "rgba(255,255,255,0.97)", borderRadius: 24, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        boxShadow: "0 8px 60px rgba(90,70,50,0.12), 0 2px 12px rgba(90,70,50,0.06)", overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{ padding: "28px 32px 20px", borderBottom: "1px solid #F0EAE2", background: "linear-gradient(180deg, #FFFCF9 0%, #FFFFFF 100%)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <img src="data:image/png;base64,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" alt="Valdor Real Estate" style={{ height: 36, width: "auto", objectFit: "contain" }} />
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#B8956A", margin: 0, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Valorador Inmobiliario
              </p>
            </div>
          </div>
          {step < 6 && (
            <>
              <ProgressBar step={step + 1} total={6} />
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#9B8C7D", margin: "10px 0 0", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Paso {step + 1} de 6
              </p>
            </>
          )}
          {step === 6 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#B8956A" }} />
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#B8956A", margin: 0 }}>Valoración completada</p>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{
          padding: "28px 32px 32px",
          opacity: animated ? 1 : 0,
          transform: animated ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.3s ease, transform 0.3s ease"
        }}>
          {stepContent()}
          {step < 6 && (
            <div style={{ marginTop: 32, display: "flex", gap: 10 }}>
              {step > 0 && (
                <button onClick={() => setStep(s => s - 1)} style={{
                  flex: 0, padding: "14px 20px", borderRadius: 50,
                  border: "1.5px solid #DDD5C8", background: "#FFF",
                  color: "#9B8C7D", fontFamily: "'DM Sans', sans-serif", fontSize: 14, cursor: "pointer"
                }}>←</button>
              )}
              <button onClick={handleNext} disabled={!canNext()} style={{
                flex: 1, padding: "15px 24px", borderRadius: 50, border: "none",
                background: canNext() ? "linear-gradient(135deg, #B8956A, #C9A87A)" : "#E8E0D6",
                color: canNext() ? "#FFF" : "#B0A899",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15,
                cursor: canNext() ? "pointer" : "not-allowed",
                boxShadow: canNext() ? "0 4px 20px rgba(184,149,106,0.35)" : "none",
                transition: "all 0.2s"
              }}>
                {step === 5 ? "Ver mi valoración →" : "Siguiente →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
