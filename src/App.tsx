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

// --- UI · estilo C de Valdor (08/11/2026): Baskerville en titulares, IBM Plex Sans fina, naranja como único acento ---

const C = {
  naranja: "#FF5733", negro: "#2E2B27", texto: "#2E2B27", gris: "#585757",
  warm: "#D7D2CB", linea: "#E3DFD9", fondo: "#F4F2EF", blanco: "#FFFFFF",
};
const SERIF = "'Libre Baskerville', Baskerville, Georgia, serif";
const SANS = "'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif";
const WA_VALIA = "34936419392";
const TEL = "+34623999568";

// "€171.000" → "171.000 €"
const eur = (s: string) => (s || "").replace(/^€\s?/, "") + " €";
// "€1764/m²" → "1.764"
const miles = (s: string) => String(parseInt(String(s || "").replace(/\D/g, ""), 10) || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

function Etiqueta({ children, color = C.gris }: { children: any, color?: string }) {
  return (
    <p style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: SANS, fontWeight: 500, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color, margin: "0 0 14px" }}>
      <span style={{ width: 32, height: 1, background: "currentColor", display: "inline-block" }} />{children}
    </p>
  );
}

function ProgressBar({ step, total }: { step: number, total: number }) {
  return (
    <div style={{ width: "100%", height: 2, background: C.linea }}>
      <div style={{ height: "100%", width: `${(step / total) * 100}%`, background: C.naranja, transition: "width 0.4s ease" }} />
    </div>
  );
}

function ChipSelect({ options, value, onChange, multi = false }: { options: any[], value: any, onChange: any, multi?: boolean }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
      {options.map(opt => {
        const selected = multi ? (value || []).includes(opt) : value === opt;
        return (
          <button key={opt} type="button" aria-pressed={selected} onClick={() => {
            if (multi) {
              const cur = value || [];
              onChange(selected ? cur.filter(x => x !== opt) : [...cur, opt]);
            } else { onChange(opt); }
          }} style={{
            padding: "11px 16px", borderRadius: 2,
            border: `1px solid ${selected ? C.negro : C.warm}`,
            background: selected ? C.negro : C.blanco,
            color: selected ? C.blanco : C.texto,
            fontFamily: SANS, fontSize: 14, fontWeight: 400, cursor: "pointer", transition: "all 0.15s",
          }}>{opt}</button>
        );
      })}
    </div>
  );
}

function NumberInput({ value, onChange, min, max, step = 1, unit, label }: { value: any, onChange: any, min: number, max: number, step?: number, unit: string, label?: string }) {
  const btn = { width: 44, height: 44, borderRadius: 2, border: `1px solid ${C.warm}`, background: C.blanco, fontSize: 20, fontWeight: 300, color: C.texto, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS } as any;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {label && <Etiqueta>{label}</Etiqueta>}
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <button type="button" aria-label="Menos" onClick={() => onChange(Math.max(min, (value || min) - step))} style={btn}>−</button>
        <span style={{ fontFamily: SANS, fontSize: 40, fontWeight: 300, color: C.texto, minWidth: 96, textAlign: "center" }}>
          {value || min}<span style={{ fontSize: 15, color: C.gris, marginLeft: 6 }}>{unit}</span>
        </span>
        <button type="button" aria-label="Más" onClick={() => onChange(Math.min(max, (value || min) + step))} style={btn}>+</button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "14px 16px", borderRadius: 2, border: `1px solid ${C.warm}`,
  fontFamily: SANS, fontSize: 15, fontWeight: 400, color: C.texto, outline: "none", boxSizing: "border-box", background: C.blanco,
} as any;

const botonPrincipal = (activo = true) => ({
  display: "flex", alignItems: "center", justifyContent: "center", gap: 10, width: "100%",
  padding: "16px 24px", borderRadius: 2, border: "none",
  background: activo ? C.naranja : C.warm, color: C.blanco,
  fontFamily: SANS, fontWeight: 500, fontSize: 13, letterSpacing: "0.16em", textTransform: "uppercase",
  textDecoration: "none", cursor: activo ? "pointer" : "not-allowed", boxSizing: "border-box",
} as any);
const botonSecundario = {
  display: "flex", alignItems: "center", justifyContent: "center", width: "100%",
  padding: "15px 24px", borderRadius: 2, border: `1px solid ${C.negro}`, background: C.blanco, color: C.negro,
  fontFamily: SANS, fontWeight: 500, fontSize: 13, letterSpacing: "0.16em", textTransform: "uppercase",
  textDecoration: "none", cursor: "pointer", boxSizing: "border-box",
} as any;

function ResultBlock({ result, onReset }: { result: any, onReset: any }) {
  const waTxt = encodeURIComponent("Hola, acabo de usar el valorador de Valdor y quiero una valoración profesional gratuita");
  return (
    <div>
      {result.esMediaMunicipal && (
        <p style={{ borderLeft: `2px solid ${C.negro}`, padding: "2px 0 2px 14px", margin: "0 0 22px", fontFamily: SANS, fontWeight: 300, fontSize: 14, lineHeight: 1.6, color: C.gris }}>
          No hemos podido situar tu zona exacta{result.municipio ? " dentro de " + result.municipio : ""}, así que el cálculo parte del <span style={{ fontWeight: 500, color: C.texto }}>precio medio del municipio</span>. En una visita gratuita lo afinamos con tu calle.
        </p>
      )}

      <Etiqueta>Valoración estimada</Etiqueta>
      <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: "clamp(40px, 11vw, 56px)", lineHeight: 1, color: C.naranja, margin: "0 0 18px", letterSpacing: "-0.01em" }}>
        {eur(result.rango.estimado)}
      </p>
      <div style={{ display: "flex", gap: 0, borderTop: `1px solid ${C.linea}`, borderBottom: `1px solid ${C.linea}`, marginBottom: 26 }}>
        {[["Mínimo", eur(result.rango.min)], ["Máximo", eur(result.rango.max)], ["Por m²", miles(result.precioM2) + " €/m²"]].map(([k, v], i) => (
          <div key={k} style={{ flex: 1, padding: "12px 0", paddingLeft: i ? 12 : 0, borderLeft: i ? `1px solid ${C.linea}` : "none" }}>
            <p style={{ fontFamily: SANS, fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: C.gris, margin: "0 0 4px" }}>{k}</p>
            <p style={{ fontFamily: SANS, fontSize: 17, fontWeight: 400, color: C.texto, margin: 0 }}>{v}</p>
          </div>
        ))}
      </div>

      {result.factores?.length > 0 && (
        <div style={{ marginBottom: 26 }}>
          <Etiqueta>Lo que más pesa</Etiqueta>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {result.factores.map((f, i) => (
              <li key={i} style={{ display: "flex", gap: 14, padding: "10px 0", borderBottom: `1px solid ${C.linea}`, fontFamily: SANS, fontWeight: 300, fontSize: 14, lineHeight: 1.55, color: C.texto }}>
                <span style={{ fontWeight: 500, color: C.gris, minWidth: 18 }}>{String(i + 1).padStart(2, "0")}</span><span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ background: C.negro, padding: "22px 22px 24px", marginBottom: 26 }}>
        <Etiqueta color={C.warm}>La recomendación de Valdor</Etiqueta>
        <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 15, color: C.blanco, lineHeight: 1.65, margin: 0 }}>{result.recomendacion}</p>
      </div>

      {result.direccion && (
        <div style={{ marginBottom: 26 }}>
          <Etiqueta>Ubicación</Etiqueta>
          <iframe title="Mapa del inmueble" width="100%" height="200" style={{ border: `1px solid ${C.linea}`, display: "block", filter: "grayscale(0.4)" }} loading="lazy"
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBIXoLby1u1ILtM7HHyhrdPXYv-uznUtrI&q=${encodeURIComponent(result.direccion)}&zoom=15&language=es`} />
        </div>
      )}

      <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 14, color: C.gris, lineHeight: 1.6, margin: "0 0 20px" }}>
        Es una estimación orientativa. En una visita gratuita vemos el piso, la calle y lo que se ha vendido cerca, y te damos un precio con el que salir al mercado.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <a href={`https://wa.me/${WA_VALIA}?text=${waTxt}`} target="_blank" rel="noopener noreferrer" style={botonPrincipal()}>Pedir la valoración gratuita</a>
        <a href={`tel:${TEL}`} style={botonSecundario}>Llamar · 623 99 95 68</a>
        <button type="button" onClick={onReset} style={{ background: "none", border: "none", color: C.gris, padding: "12px", cursor: "pointer", fontFamily: SANS, fontSize: 13, textDecoration: "underline", textUnderlineOffset: 3 }}>
          Valorar otro inmueble
        </button>
      </div>
      <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 11, color: C.gris, marginTop: 14, lineHeight: 1.5 }}>
        Valoración orientativa con datos de mercado de 2025. No sustituye a una tasación oficial.
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

function DireccionStep({ form, update, required = false }: { form: any, update: any, required?: boolean }) {
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

  return (
    <>
      <h2 style={headingStyle}>¿Dónde está el inmueble?</h2>
      <p style={subStyle}>
        {required ? "Con la dirección afinamos el precio de tu zona." : "Nos ayuda a afinar la valoración."}
      </p>
      <input
        ref={inputRef}
        type="text"
        aria-label="Dirección del inmueble"
        placeholder="Calle, número y población"
        defaultValue={form.direccion || ""}
        onChange={e => update("direccion", e.target.value)}
        style={inputStyle}
      />
      {form.zona && (
        <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 14, color: C.gris, marginTop: 12 }}>
          Zona: <span style={{ fontWeight: 500, color: C.texto }}>{form.zona}</span>
        </p>
      )}
    </>
  );
}

const headingStyle = {
  fontFamily: SERIF, fontSize: "clamp(24px, 6vw, 30px)", fontWeight: 400,
  color: C.texto, lineHeight: 1.25, margin: "0 0 10px", letterSpacing: "-0.005em"
} as any;
const subStyle = { fontFamily: SANS, fontWeight: 300, fontSize: 15, color: C.gris, margin: "0 0 22px", lineHeight: 1.55 } as any;

const FORM_VACIO = { tipo: "", zona: "", zonaCustom: "", metros: 80, habitaciones: 3, banos: 1, extras: [], estado: "", planta: "", direccion: "", precioOverride: null, coords: null, nombre: "", telefono: "", email: "" };

export default function ValdorValuador() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<any>(FORM_VACIO);
  const [result, setResult] = useState(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 30);
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

  const handleReset = () => { setStep(0); setForm(FORM_VACIO); setResult(null); };

  const stepContent = () => {
    switch (step) {
      case 0: return (
        <>
          <h2 style={headingStyle}>¿Qué quieres valorar?</h2>
          <p style={subStyle}>Seis preguntas y tienes una primera cifra, gratis y sin compromiso.</p>
          <ChipSelect options={tiposInmueble} value={form.tipo} onChange={v => update("tipo", v)} />
        </>
      );
      case 1: return <DireccionStep form={form} update={update} required={true} />;
      case 2: return (
        <>
          <h2 style={headingStyle}>¿Cuántos metros tiene?</h2>
          <div style={{ marginTop: 18 }}>
            <NumberInput value={form.metros} onChange={v => update("metros", v)} min={20} max={2000} step={5} unit="m²" label="Metros útiles" />
          </div>
          <input type="range" min={20} max={500} step={5} value={form.metros} aria-label="Metros útiles"
            onChange={e => update("metros", parseInt(e.target.value))}
            style={{ width: "100%", marginTop: 22, accentColor: C.naranja }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: SANS, fontSize: 12, color: C.gris }}>
            <span>20 m²</span><span>500 m²</span>
          </div>
        </>
      );
      case 3: return (
        <>
          <h2 style={headingStyle}>Cuéntanos cómo es</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 22, marginTop: 14 }}>
            <NumberInput value={form.habitaciones} onChange={v => update("habitaciones", v)} min={0} max={10} step={1} unit="hab." label="Habitaciones" />
            <NumberInput value={form.banos} onChange={v => update("banos", v)} min={1} max={6} step={1} unit="baños" label="Baños" />
          </div>
          <div style={{ marginTop: 24 }}>
            <Etiqueta>Extras</Etiqueta>
            <ChipSelect
              options={["Parking", "Trastero", "Terraza", "Jardín", "Piscina comunitaria", "Ascensor", "Vistas", "Aire acondicionado"]}
              value={form.extras} onChange={v => update("extras", v)} multi={true} />
          </div>
        </>
      );
      case 4: return (
        <>
          <h2 style={headingStyle}>¿En qué estado está?</h2>
          <ChipSelect options={estadosInmueble} value={form.estado} onChange={v => update("estado", v)} />
          <div style={{ marginTop: 24 }}>
            <Etiqueta>Planta (si es un piso)</Etiqueta>
            <ChipSelect
              options={["Bajo", "Entreplanta", "1ª–3ª", "4ª–6ª", "7ª o superior", "Última planta"]}
              value={form.planta} onChange={v => update("planta", v)} />
          </div>
        </>
      );
      case 5: return (
        <>
          <h2 style={headingStyle}>¿A quién le damos el resultado?</h2>
          <p style={subStyle}>Lo ves en la pantalla en cuanto termines. Te llamamos solo si tú quieres afinarlo.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { key: "nombre", placeholder: "Nombre", type: "text", ac: "name" },
              { key: "telefono", placeholder: "Teléfono", type: "tel", ac: "tel" },
              { key: "email", placeholder: "Email", type: "email", ac: "email" },
            ].map(({ key, placeholder, type, ac }) => (
              <input key={key} type={type} autoComplete={ac} aria-label={placeholder} placeholder={placeholder}
                value={form[key] || ""} onChange={e => update(key, e.target.value)} style={inputStyle} />
            ))}
          </div>
          <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 12, color: C.gris, marginTop: 14, lineHeight: 1.5 }}>
            Usamos tus datos solo para hablar contigo de esta valoración.
          </p>
        </>
      );
      case 6: return result ? <ResultBlock result={result} onReset={handleReset} /> : null;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: `${C.negro} url('/hero-bg.png') center/cover no-repeat`, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px", boxSizing: "border-box" }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500&family=Libre+Baskerville&display=swap" rel="stylesheet" />
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "rgba(46,43,39,0.45)" }} />
      <div style={{ position: "relative", width: "100%", maxWidth: 500, background: C.blanco }}>
        {/* Cabecera: bloque naranja macizo con el titular dentro (el gesto de la web) */}
        <div style={{ background: C.naranja, padding: "26px 28px 24px", color: C.blanco }}>
          <img src="/logo-valdor.png" alt="Valdor Real Estate" style={{ height: 34, width: "auto", display: "block", filter: "brightness(0) invert(1)", marginBottom: 18 }} />
          <p style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: SANS, fontWeight: 500, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 8px" }}>
            <span style={{ width: 32, height: 1, background: "currentColor", display: "inline-block" }} />Valorador
          </p>
          <p style={{ fontFamily: SERIF, fontSize: 22, lineHeight: 1.3, margin: 0 }}>
            {step < 6 ? "¿Cuánto vale tu casa?" : "Tu valoración"}
          </p>
        </div>

        {step < 6 && (
          <div style={{ padding: "16px 28px 0" }}>
            <ProgressBar step={step + 1} total={6} />
            <p style={{ fontFamily: SANS, fontSize: 11, fontWeight: 500, color: C.gris, margin: "10px 0 0", letterSpacing: "0.18em", textTransform: "uppercase" }}>
              Paso {step + 1} de 6
            </p>
          </div>
        )}

        <div style={{ padding: "22px 28px 30px", opacity: animated ? 1 : 0, transform: animated ? "none" : "translateY(8px)", transition: "opacity 0.25s ease, transform 0.25s ease" }}>
          {stepContent()}
          {step < 6 && (
            <div style={{ marginTop: 30, display: "flex", gap: 10 }}>
              {step > 0 && (
                <button type="button" aria-label="Atrás" onClick={() => setStep(s => s - 1)} style={{ ...botonSecundario, width: 56, flex: "0 0 56px", padding: "15px 0" }}>←</button>
              )}
              <button type="button" onClick={handleNext} disabled={!canNext()} style={botonPrincipal(canNext())}>
                {step === 5 ? "Ver mi valoración" : "Siguiente"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
