import type { CaseData, PlayerCount } from "../types/game";

// Helper to create tailored dossiers for 4, 5, 6, 7 players
function adaptRolesForCount(
  allRoles: {
    roleId: string;
    roleName: string;
    isCulprit: boolean;
    dossier: {
      roleTitle: string;
      avatar: string;
      isCulprit: boolean;
      movements: { time: string; place: string; detail: string }[];
      knownInfo: string[];
      secretObjective: string;
      suspicionNotes?: string;
    };
    extraCluesIfFewerPlayers?: string[]; // clues to pass along if other roles are absent
  }[]
): Record<PlayerCount, { roles: any[] }> {
  const result: any = {};
  const counts: PlayerCount[] = [4, 5, 6, 7];

  for (const count of counts) {
    const selectedRoles = allRoles.slice(0, count);

    // If roles 4, 5 or 6 are excluded, distribute their essential clues to the remaining players
    const excludedRoles = allRoles.slice(count);
    const orphanClues: string[] = [];
    excludedRoles.forEach((r) => {
      if (r.extraCluesIfFewerPlayers) {
        orphanClues.push(...r.extraCluesIfFewerPlayers);
      }
    });

    const adaptedRoles = selectedRoles.map((r, idx) => {
      const extraClue = orphanClues[idx % orphanClues.length];
      return {
        roleId: r.roleId,
        roleName: r.roleName,
        isCulprit: r.isCulprit,
        dossier: {
          ...r.dossier,
          knownInfo: extraClue
            ? [...r.dossier.knownInfo, `Pista extra del entorno: ${extraClue}`]
            : [...r.dossier.knownInfo],
        },
      };
    });

    result[count] = { roles: adaptedRoles };
  }

  return result;
}

export const CASES: CaseData[] = [
  // ==========================================
  // CASO 1: LA NOCHE DE IBIZA
  // ==========================================
  {
    id: 1,
    slug: "noche-ibiza",
    title: "La Noche de Ibiza",
    subtitle: "El misterio de los 2.000 € en la caja fuerte de la villa",
    category: "Robo & Fiesta",
    emoji: "🍸",
    location: "Villa Can Jordi, San Antonio (Ibiza)",
    incidentTime: "Entre las 02:30 y las 03:10",
    synopsis:
      "Tras una noche de fiesta VIP en la discoteca, regresáis a la villa y a las 04:30 la anfitriona descubre que faltan 2.000 € en efectivo de la caja fuerte. La caja no fue forzada: alguien usó el código o la llave maestra escondida en el jarrón.",
    publicTimeline: [
      { time: "01:00", description: "Salís todas juntas de la villa hacia la discoteca.", location: "Villa" },
      { time: "02:00", description: "La cámara del porche de la villa deja de transmitir.", location: "Porche" },
      { time: "02:35", description: "Un vecino escucha la puerta principal abrirse.", location: "Entrada" },
      { time: "03:05", description: "El sensor de luz del vestidor de la suite se activa.", location: "Suite Principal" },
      { time: "04:30", description: "Se descubre que la caja fuerte está abierta y vacía.", location: "Caja Fuerte" }
    ],
    progressiveClues: [
      {
        minute: 3,
        title: "El Registro del Taxi",
        badge: "PRUEBA 1 · MIN 3",
        description: "El taxista de guardia confirma que llevó a una chica desde la discoteca a la villa a las 02:38. Llevaba una chaqueta blanca reflectante y pagó en efectivo con un billete arrugado de 50€.",
        impactQuestion: "¿Quién llevaba esa chaqueta blanca o quién la pidió prestada en la discoteca?"
      },
      {
        minute: 6,
        title: "La Copa de Cóctel en el Despacho",
        badge: "PRUEBA 2 · MIN 6",
        description: "Aparece un vaso de mojito con restos de pintalabios rojo carmín sobre la mesita junto a la caja fuerte. Solo dos chicas llevaban pintalabios de ese tono esta noche.",
        impactQuestion: "¿Quién pidió mojito en el club y quién tuvo tiempo de subir a la habitación?"
      }
    ],
    interrogationQuestions: [
      "¿Dónde estaba cada una exactamente entre las 02:30 y las 03:00?",
      "¿Quién sabía dónde estaba la llave de repuesto dentro del jarrón del recibidor?",
      "¿Quién vio a quién salir de la zona VIP de la discoteca?",
      "¿Quién tenía deudas urgentes o habló de pagar algo al día siguiente?"
    ],
    solution: {
      culpritNameRole: "Saray (La Amiga Fiestera / Papel 2)",
      crimeTime: "02:40",
      keyMethod: "Se escapó en taxi con la chaqueta blanca que cogió del ropero, usó la llave del jarrón que vio guardar el primer día y volvió a la discoteca a las 03:20 fingiendo que estaba en el baño.",
      fullStory:
        "Saray necesitaba dinero urgente para saldar una deuda con el promotor de las entradas VIP. A las 02:20 tomó prestada la chaqueta blanca de la zona VIP, pidió un taxi rápido hacia la villa (llegada 02:38), entró con la llave escondida en el jarrón, abrió la caja a las 02:45 cogiendo los 2.000€, dejó el vaso de mojito que traía en la mano y regresó al club en otro taxi a las 03:15 diciendo que había tenido un corte de digestión en el baño.",
      criticalClues: [
        "El taxi la dejó a las 02:38 con la chaqueta blanca.",
        "El carmín rojo del vaso coincide con su maquillaje.",
        "Nadie la vio en el club entre las 02:15 y las 03:15."
      ]
    },
    dossiersByPlayerCount: adaptRolesForCount([
      {
        roleId: "rol_1",
        roleName: "La Anfitriona de la Villa",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["La anfitriona vio que la llave del jarrón no estaba a las 04:00."],
        dossier: {
          roleTitle: "La Anfitriona Preocupada",
          avatar: "👑",
          isCulprit: false,
          movements: [
            { time: "01:30", place: "Discoteca", detail: "Bailando en la pista central con Marta." },
            { time: "02:30", place: "Barra VIP", detail: "Pediste una botella de cava con la tarjeta." },
            { time: "03:15", place: "Terraza", detail: "Buscabas a Saray porque llevaba mucho tiempo desaparecida." },
            { time: "04:15", place: "Regreso a la villa", detail: "Llegaste en la primera furgoneta con Paula." }
          ],
          knownInfo: [
            "Tú guardaste los 2.000 € para pagar el alquiler del barco de mañana.",
            "Solo tú y Saray visteis el primer día que la llave de emergencia estaba dentro del jarrón azul del recibidor.",
            "Viste que Saray llevaba pintalabios rojo pasión muy llamativo.",
            "A las 02:40 no viste a Saray ni a Lucía por ninguna parte en el club."
          ],
          secretObjective: "Demuestra que estuviste pagando en la barra a las 02:30 y averigua quién fue la primera en volver a la villa.",
          suspicionNotes: "No menciones de golpe lo del jarrón hasta que alguien hable de cómo se abrió la caja."
        }
      },
      {
        roleId: "rol_2",
        roleName: "La Amiga Fiestera",
        isCulprit: true, // CULPRIT!
        extraCluesIfFewerPlayers: ["Saray tenía una mancha de polvo del jarrón en el vestido."],
        dossier: {
          roleTitle: "La Amiga Impredecible (¡ERES LA CULPABLE!)",
          avatar: "🔥",
          isCulprit: true,
          movements: [
            { time: "01:30", place: "Discoteca VIP", detail: "Tomando chupitos con Ainara." },
            { time: "02:20", place: "Salida secreta", detail: "Dijiste que ibas al baño con náuseas, pero saliste a pillar un taxi." },
            { time: "02:40", place: "Villa", detail: "Entraste a toda prisa, cogiste la llave del jarrón, vaciaste la caja fuerte y guardaste el dinero en tu bolso." },
            { time: "03:20", place: "Discoteca VIP", detail: "Reapareciste retocándote el pelo diciendo que el baño tenía una cola infinita." }
          ],
          knownInfo: [
            "Tú robaste los 2.000 € porque tenías un pago inaplazable.",
            "Llevabas la chaqueta blanca que cogiste del ropero para que el taxista no te reconociera bien.",
            "Bebías mojito y te dejaste el vaso en la mesa de la suite por los nervios.",
            "Viste que Lucía salió a fumar con un chico italiano sobre las 02:15, puedes usar eso para culparla a ella."
          ],
          secretObjective: "Desvía la atención hacia Lucía o Marta. Si nadie te acusa o votan a otra, ganarás 3 puntos extra.",
          suspicionNotes: "Mantén que estuviste en la cola del baño del club entre las 02:20 y las 03:15 porque te sentó mal una copa."
        }
      },
      {
        roleId: "rol_3",
        roleName: "La Fotógrafa & DJ",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["En sus fotos de las 02:15 Saray estaba en la barra con copa de mojito."],
        dossier: {
          roleTitle: "La Observadora del Grupo",
          avatar: "📸",
          isCulprit: false,
          movements: [
            { time: "01:45", place: "Discoteca", detail: "Haciendo fotos y vídeos con tu móvil en la cabina del DJ." },
            { time: "02:25", place: "Entrada VIP", detail: "Viste a alguien con la chaqueta blanca de Ainara salir corriendo a la parada de taxis." },
            { time: "03:00", place: "Pista de baile", detail: "Bailando con Ainara y Elena." },
            { time: "03:45", place: "Guardarropa", detail: "Comprobaste que la chaqueta blanca de Ainara no estaba en la percha." }
          ],
          knownInfo: [
            "Tienes un selfie de las 02:10 donde Saray tiene en la mano un vaso de mojito con pintalabios rojo.",
            "Sabes que Ainara dejó su chaqueta blanca en el sofá VIP a la 01:45 y luego desapareció.",
            "A las 02:30 Marta te pidió dinero prestado para pagar una copa, diciendo que estaba a cero."
          ],
          secretObjective: "Revela la pista de la chaqueta blanca para descubrir quién la cogió del sofá VIP.",
          suspicionNotes: "Asegúrate de comprobar quién tenía pintalabios rojo carmín esa noche."
        }
      },
      {
        roleId: "rol_4",
        roleName: "La Relaciones Públicas",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["El taxista era conocido suyo y le confirmó que la chica se bajó en Can Jordi."],
        dossier: {
          roleTitle: "La Conectada",
          avatar: "✨",
          isCulprit: false,
          movements: [
            { time: "01:30", place: "Terraza VIP", detail: "Charlando con los relaciones públicas del local." },
            { time: "02:20", place: "Puerta del club", detail: "Viste salir a una chica del grupo tapándose la cara." },
            { time: "02:50", place: "Zona de reservados", detail: "Estuviste con Marta y Elena pidiendo agua." },
            { time: "03:30", place: "Salida", detail: "Recibiste un mensaje avisando de ruidos en la villa." }
          ],
          knownInfo: [
            "El portero te dijo que a las 02:22 una chica española pidió que le pararan un taxi con urgencia.",
            "Tú llevabas brillo de labios transparente, jamás usas pintalabios rojo.",
            "Sabías que Paula estuvo en la terraza hablando por teléfono casi media hora."
          ],
          secretObjective: "Descarta a las que no usaban pintalabios rojo y ayuda a ubicar a la persona que tomó el taxi.",
          suspicionNotes: "Pregunta a Saray y a Marta qué maquillaje llevaban exactamente."
        }
      },
      {
        roleId: "rol_5",
        roleName: "La Tranquila",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Paula vio a Saray volver al club jadeando y con el pelo revuelto a las 03:20."],
        dossier: {
          roleTitle: "La Testigo Silenciosa",
          avatar: "🧘‍♀️",
          isCulprit: false,
          movements: [
            { time: "01:45", place: "Sillones VIP", detail: "Descansando con los pies doloridos." },
            { time: "02:15", place: "Terraza exterior", detail: "Llamada con tu pareja de 25 minutos." },
            { time: "02:45", place: "Barra secundaria", detail: "Bebiendo agua con gas con Elena." },
            { time: "03:20", place: "Baños", detail: "Viste a Saray salir sofocada del baño mirándose al espejo con cara de nervios." }
          ],
          knownInfo: [
            "Cuando Saray salió del baño a las 03:20 no llevaba bolso, lo tenía escondido bajo el brazo.",
            "En tu llamada de las 02:15 escuchaste a alguien pedir un taxi hacia Can Jordi.",
            "Ainara estuvo contigo en los sillones hasta pasadas las 02:00."
          ],
          secretObjective: "Pregúntale a Saray por qué salió tan agitada del baño a las 03:20.",
          suspicionNotes: "Apoya a Ainara para contrastar horas exactas."
        }
      },
      {
        roleId: "rol_6",
        roleName: "La Deportista",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Elena vio que el bolso de Saray pesaba sospechosamente al volver a la villa."],
        dossier: {
          roleTitle: "La Despierta",
          avatar: "⚡",
          isCulprit: false,
          movements: [
            { time: "01:30", place: "Pista de baile", detail: "Dándolo todo sin parar de bailar." },
            { time: "02:40", place: "Barra central", detail: "Comprando agua y charlando con Marta." },
            { time: "03:10", place: "Terraza", detail: "Buscando aire fresco con Paula." },
            { time: "04:00", place: "Salida del club", detail: "Organizando el regreso en taxi de todas." }
          ],
          knownInfo: [
            "Marta estuvo contigo ininterrumpidamente desde las 02:35 hasta las 03:10.",
            "Viste que en la mesa VIP había quedado una chaqueta olvidada pero a las 02:30 ya no estaba.",
            "Saray te pidió fuego a las 03:25 y le temblaban las manos."
          ],
          secretObjective: "Proporciona la coartada perfecta para Marta y pon el foco en quién no tiene coartada entre las 02:30 y las 03:15.",
          suspicionNotes: "Marta no pudo ser porque estuvo contigo todo ese intervalo."
        }
      },
      {
        roleId: "rol_7",
        roleName: "La Fashionista",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Claudia prestó su pintalabios rojo a Saray antes de salir del hotel."],
        dossier: {
          roleTitle: "La Estilista",
          avatar: "💄",
          isCulprit: false,
          movements: [
            { time: "01:30", place: "Zona VIP", detail: "Retocando el maquillaje de todas las amigas." },
            { time: "02:10", place: "Baños de la discoteca", detail: "Le prestaste tu pintalabios rojo carmín exclusivo de Chanel a Saray." },
            { time: "02:45", place: "Pista", detail: "Bailando con el grupo de valencianos." },
            { time: "03:30", place: "Zona VIP", detail: "Le pediste a Saray tu pintalabios y te dijo que lo había perdido." }
          ],
          knownInfo: [
            "El pintalabios rojo carmín que apareció en el vaso de la villa es tu Chanel exclusivo, que le diste a Saray a las 02:10.",
            "Ainara llevaba brillo rosado y tú llevabas burdeos oscuro.",
            "Saray tenía el pelo peinado hacia atrás cuando reapareció, como si se hubiera quitado una capucha o chaqueta con cremallera."
          ],
          secretObjective: "Demuestra que Saray tenía tu pintalabios rojo carmín y que es el mismo del vaso encontrado.",
          suspicionNotes: "Esta prueba vincula directamente a Saray con el vaso hallado en la villa."
        }
      }
    ])
  },

  // ==========================================
  // CASO 2: EL ANILLO DE ROMA
  // ==========================================
  {
    id: 2,
    slug: "anillo-roma",
    title: "El Anillo de Roma",
    subtitle: "La sortija Cartier de diamantes desaparecida antes de la boda",
    category: "Joyas & Traición",
    emoji: "💍",
    location: "Suite Borghese, Hotel Splendido (Roma)",
    incidentTime: "Entre las 18:30 y las 19:15",
    synopsis:
      "A falta de 24 horas para la boda del año en Roma, el anillo de pedida de 15.000 € de la novia desaparece del joyero sobre el tocador de la suite. Solo el círculo íntimo de damas de honor tenía la tarjeta de acceso.",
    publicTimeline: [
      { time: "18:00", description: "La novia deja el anillo en el tocador antes de bajar al spa.", location: "Suite" },
      { time: "18:35", description: "El registro de la cerradura electrónica marca una apertura con la tarjeta #3.", location: "Puerta Suite" },
      { time: "18:50", description: "El servicio de habitaciones lleva toallas limpias pero nadie abre.", location: "Pasillo 4º Piso" },
      { time: "19:10", description: "El sensor de humo del baño de la suite se dispara brevemente.", location: "Baño Suite" },
      { time: "19:40", description: "La novia sube del spa y descubre el estuche abierto y vacío.", location: "Tocador" }
    ],
    progressiveClues: [
      {
        minute: 3,
        title: "El Recibo de Empeños en Via del Corso",
        badge: "PRUEBA 1 · MIN 3",
        description: "Se encuentra un folleto arrugado de una joyería de compra-venta de oro en la papelera del pasillo con una nota manuscrita: 'Tasación inmediata sin factura'.",
        impactQuestion: "¿Quién estuvo paseando por Via del Corso esa misma mañana sola?"
      },
      {
        minute: 6,
        title: "Cenizas y el Olor a Perfume Vainilla",
        badge: "PRUEBA 2 · MIN 6",
        description: "En el lavabo de la suite hay restos de una tarjeta de felicitación quemada que olía a perfume de vainilla oriental. Alguien intentó destruir un mensaje antes de marcharse.",
        impactQuestion: "¿Quién utiliza ese perfume de vainilla oriental tan característico?"
      }
    ],
    interrogationQuestions: [
      "¿Quién tenía en su poder la tarjeta electrónica #3 a las 18:35?",
      "¿Quién sabía que la novia no llevaba el anillo al spa?",
      "¿Quién tenía problemas económicos graves o envidia declarada del prometido?",
      "¿Dónde estaba cada una mientras la novia estaba en el masaje de 18:00 a 19:30?"
    ],
    solution: {
      culpritNameRole: "Elena (La Hermana Menor / Papel 3)",
      crimeTime: "18:35",
      keyMethod: "Usó la tarjeta #3 que robó del bolso de su hermana, cogió el anillo para empeñarlo y pagar una deuda de juego, y quemó una carta de disculpa en el lavabo presa del pánico.",
      fullStory:
        "Elena acumulaba una deuda enorme por apuestas online y sabía el valor incalculable del anillo. Cuando su hermana bajó al spa, Elena subió a la suite a las 18:35 con la tarjeta #3. Cogió el anillo del joyero, pero sintió tanta culpa que escribió una carta explicándolo; al oír llegar al camarero a las 18:50, le dio un ataque de pánico, quemó la carta en el lavabo (activando el sensor de humo a las 19:10) y huyó con el anillo escondido en el forro de su abrigo.",
      criticalClues: [
        "El perfume de vainilla oriental es el que ella siempre lleva puesto.",
        "Tenía en su poder la tarjeta #3 de la habitación.",
        "El folleto de la casa de empeños de Via del Corso tenía su letra en el reverso."
      ]
    },
    dossiersByPlayerCount: adaptRolesForCount([
      {
        roleId: "rol_1",
        roleName: "La Novia",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["La novia notó que faltaba la tarjeta #3 de su neceser."],
        dossier: {
          roleTitle: "La Novia Angustiada",
          avatar: "👰",
          isCulprit: false,
          movements: [
            { time: "17:45", place: "Suite", detail: "Te quitaste el anillo de diamantes y lo dejaste en el joyero de terciopelo." },
            { time: "18:05", place: "Ascensor al Spa", detail: "Bajaste con Marta hacia la piscina termal." },
            { time: "18:15", place: "Cabina de Masaje", detail: "Masaje relajante hasta las 19:25." },
            { time: "19:40", place: "Suite", detail: "Encontraste la caja vacía y la ventana entreabierta." }
          ],
          knownInfo: [
            "Dejaste la tarjeta #3 en la mesa del salón de la suite para que las damas pudieran entrar.",
            "Elena te pidió 3.000 € la semana pasada con excusas raras y tú te negaste.",
            "Marta estuvo contigo en el spa todo el tiempo recibiendo el tratamiento de piedras calientes."
          ],
          secretObjective: "Confirma la coartada de Marta y descubre quién tenía motivos ocultos para robar la joya.",
          suspicionNotes: "No acuses a tu hermana directamente sin pruebas de que subió a la habitación."
        }
      },
      {
        roleId: "rol_2",
        roleName: "La Dama de Honor Principal",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Marta olió el perfume de vainilla en el pasillo a las 18:40."],
        dossier: {
          roleTitle: "La Organizadora Leal",
          avatar: "💐",
          isCulprit: false,
          movements: [
            { time: "18:00", place: "Spa", detail: "Acompañaste a la novia a las termas romanas." },
            { time: "18:30", place: "Piscina termal", detail: "Haciendo circuito de aguas con la novia." },
            { time: "19:20", place: "Vestuario Spa", detail: "Duchándote y vistiéndote con la novia." },
            { time: "19:40", place: "Suite", detail: "Subiste con ella y viste el joyero vacío." }
          ],
          knownInfo: [
            "Tú estuviste físicamente pegada a la novia desde las 18:00 hasta las 19:40.",
            "Viste a Elena sobre las 18:25 salir sola del bar del hotel hacia los ascensores con prisa.",
            "Elena llevaba un aroma empalagoso a vainilla oriental que inundó el vestíbulo."
          ],
          secretObjective: "Demuestra tu coartada inquebrantable en el spa y testifica sobre la dirección que tomó Elena.",
          suspicionNotes: "El personal del spa puede verificar que tú nunca saliste de la zona de aguas."
        }
      },
      {
        roleId: "rol_3",
        roleName: "La Hermana de la Novia",
        isCulprit: true, // CULPRIT!
        extraCluesIfFewerPlayers: ["Elena tiene las uñas ahumadas de prender el mechero."],
        dossier: {
          roleTitle: "La Hermana en Apuros (¡ERES LA CULPABLE!)",
          avatar: "🥀",
          isCulprit: true,
          movements: [
            { time: "18:15", place: "Bar del Hotel", detail: "Tomaste un espresso fingiendo hablar por teléfono." },
            { time: "18:35", place: "Suite 4º Piso", detail: "Abriste con la tarjeta #3, abriste el joyero y guardaste el anillo en tu neceser." },
            { time: "18:55", place: "Baño Suite", detail: "Escribiste una nota de perdón pero te asustaste con los pasos fuera y la quemaste con el mechero." },
            { time: "19:20", place: "Terraza jardín", detail: "Bajaste por la escalera de incendios fingiendo que paseabas." }
          ],
          knownInfo: [
            "Tú tienes el anillo escondido en el forro de tu neceser de viaje.",
            "El humo de la nota quemada activó el sensor del baño y tuviste que apagarlo rápido con una toalla húmeda.",
            "Sabes que Saray estuvo en una tienda de ropa cerca de la Fontana di Trevi hasta las 19:00.",
            "Tu perfume de vainilla oriental de Yves Saint Laurent es inconfundible."
          ],
          secretObjective: "Convence a las demás de que un empleado del servicio de habitaciones entró a robar aprovechando el spa.",
          suspicionNotes: "Si preguntan por el olor a vainilla, di que abrazaste a la novia antes de que bajara al spa."
        }
      },
      {
        roleId: "rol_4",
        roleName: "La Estilista & Joyera",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Saray examinó el joyero y notó que el cierre no estaba forzado."],
        dossier: {
          roleTitle: "La Experta en Moda",
          avatar: "💎",
          isCulprit: false,
          movements: [
            { time: "18:00", place: "Tiendas de Roma", detail: "Comprando zapatos de repuesto para el vestido." },
            { time: "18:50", place: "Recepción", detail: "Dejando unas bolsas de compras con el conserje." },
            { time: "19:05", place: "Hall del 4º piso", detail: "Viste humo salir por debajo de la puerta de la suite y pensaste que era vapor del jacuzzi." },
            { time: "19:35", place: "Suite", detail: "Llegaste justo antes de que la novia abriera la puerta." }
          ],
          knownInfo: [
            "El joyero no tenía ni un rasguño: quien lo abrió conocía la combinación o estaba sin candado.",
            "A las 18:50 viste al camarero del servicio de habitaciones esperando en el pasillo con las toallas sin que nadie le abriera.",
            "A las 19:15 te cruzaste en la escalera con alguien que bajaba corriendo dejando estela de vainilla."
          ],
          secretObjective: "Aporta el dato crucial de que la persona que bajaba a las 19:15 olía a perfume de vainilla.",
          suspicionNotes: "Tú tienes el ticket de compra de los zapatos con hora exacta 18:42."
        }
      },
      {
        roleId: "rol_5",
        roleName: "La Amiga de la Infancia",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Paula vio a Elena con el mechero en la mano en el jardín a las 19:25."],
        dossier: {
          roleTitle: "La Pacificadora",
          avatar: "🕊️",
          isCulprit: false,
          movements: [
            { time: "18:10", place: "Jardín del hotel", detail: "Leyendo un libro y tomando una limonada." },
            { time: "18:45", place: "Lobby", detail: "Saludando a los familiares del novio que acababan de llegar." },
            { time: "19:20", place: "Jardín posterior", detail: "Viste a Elena salir por la puerta de emergencia con la respiración entrecortada." },
            { time: "19:45", place: "Suite", detail: "Subiste alarmada al escuchar los gritos de la novia." }
          ],
          knownInfo: [
            "Viste a Elena guardar un mechero dorado en su bolso a las 19:25 en el jardín.",
            "Elena tenía una mancha de ceniza gris en el puño de su blusa blanca.",
            "El novio te dijo que Elena le había pedido dinero prestado esa misma mañana."
          ],
          secretObjective: "Pon en evidencia la ceniza en el puño de Elena y su salida por la puerta de emergencia.",
          suspicionNotes: "Mantén la calma y pide explicaciones lógicas sobre la ceniza."
        }
      },
      {
        roleId: "rol_6",
        roleName: "La Influencer del Grupo",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Lucía grabó una historia de Instagram a las 18:35 en el bar donde se ve el reloj."],
        dossier: {
          roleTitle: "La Generadora de Contenido",
          avatar: "📱",
          isCulprit: false,
          movements: [
            { time: "18:00", place: "Piscina exterior", detail: "Grabando reels del atardecer sobre los tejados de Roma." },
            { time: "18:35", place: "Bar del hotel", detail: "Grabando un directo: en el fondo se ve a Elena levantarse de la mesa y dirigirse al ascensor." },
            { time: "19:10", place: "Recepción", detail: "Preguntando por la contraseña del wifi de alta velocidad." },
            { time: "19:40", place: "Pasillo suite", detail: "Subiste para hacerte fotos con la novia." }
          ],
          knownInfo: [
            "En tu directo de Instagram de las 18:35 queda registrado que Elena subió en el ascensor hacia las plantas altas.",
            "Tú estabas con el camarero del bar entre las 18:30 y las 19:00.",
            "Viste que Elena no llevaba bolso cuando bajó al jardín, solo su neceser de mano."
          ],
          secretObjective: "Muestra la prueba irrefutable de que Elena subió en el ascensor a las 18:35 en tu vídeo.",
          suspicionNotes: "El vídeo de Instagram desmonta cualquier coartada de que Elena estuvo en el bar todo el rato."
        }
      },
      {
        roleId: "rol_7",
        roleName: "La Abogada del Grupo",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Ainara comprobó el folleto de empeños y reconoció la letra cursiva."],
        dossier: {
          roleTitle: "La Mente Analítica",
          avatar: "⚖️",
          isCulprit: false,
          movements: [
            { time: "18:00", place: "Centro de negocios", detail: "Revisando contratos de trabajo urgentes por videollamada." },
            { time: "18:45", place: "Hall del hotel", detail: "Haciendo gestiones con el conserje para el transfer de la boda." },
            { time: "19:15", place: "Ascensor", detail: "Subiste a tu habitación en la 3ª planta." },
            { time: "19:40", place: "Suite", detail: "Llegaste nada más saltar la alarma de robo." }
          ],
          knownInfo: [
            "Comprobaste el registro de la cerradura electrónica: la tarjeta #3 fue la única que abrió entre las 18:00 y las 19:40.",
            "La tarjeta #3 estaba asignada originalmente al kit de Elena y la dama de honor.",
            "Elena tiene una cuenta bancaria bloqueada por deudas, algo que te confesó confidencialmente la semana pasada."
          ],
          secretObjective: "Expón la evidencia técnica de la tarjeta #3 y el móvil económico.",
          suspicionNotes: "Sé fría y pide que revisen los neceseres de todas las presentes."
        }
      }
    ])
  },

  // ==========================================
  // CASO 3: BACKSTAGE VIP EN EL FESTIVAL
  // ==========================================
  {
    id: 3,
    slug: "backstage-festival",
    title: "Backstage VIP & Festival",
    subtitle: "El pase de artista falsificado y los 3.000 € del camerino",
    category: "Música & Trapicheos",
    emoji: "🎪",
    location: "Zona Camerinos, Festival Sonorama Sound (Madrid)",
    incidentTime: "A las 23:45 durante el concierto principal",
    synopsis:
      "Durante la actuación estrella ante 30.000 personas, alguien entró al camerino privado del DJ principal con una acreditación clonada y se llevó un sobre con 3.000 € del caché y una chaqueta exclusiva de diseñador.",
    publicTimeline: [
      { time: "23:00", description: "Empieza la sesión del artista estrella en el escenario principal.", location: "Main Stage" },
      { time: "23:30", description: "El guardia de la valla VIP se ausenta 10 minutos para comer.", location: "Acceso Backstage" },
      { time: "23:45", description: "Las luces del camerino 4 se encienden y apagan dos veces.", location: "Camerino DJ" },
      { time: "00:05", description: "Termina el show y el mánager entra descubriendo el sobre abierto.", location: "Camerino DJ" },
      { time: "00:20", description: "Se cierran todas las salidas del backstage para inspección.", location: "Control de Seguridad" }
    ],
    progressiveClues: [
      {
        minute: 3,
        title: "La Pulsera Flúor Verde Cortada",
        badge: "PRUEBA 1 · MIN 3",
        description: "En el suelo del camerino aparece una pulsera de tela VIP de color verde flúor cortada con tijeras de manicura finas.",
        impactQuestion: "¿Quién llevaba tijeritas de uñas en su riñonera y pulsera verde?"
      },
      {
        minute: 6,
        title: "Purpurina Holográfica en la Caja Fuerte Portátil",
        badge: "PRUEBA 2 · MIN 6",
        description: "El maletín de seguridad del camerino está cubierto de purpurina holográfica plateada con forma de estrellitas diminutas.",
        impactQuestion: "¿Quién se maquilló los ojos y pómulos con purpurina de estrellitas antes del concierto?"
      }
    ],
    interrogationQuestions: [
      "¿Dónde estabais exactamente cuando sonó el hit principal a las 23:45?",
      "¿Quién tenía acceso a la zona restringida sin escolta?",
      "¿Por qué había purpurina de estrellitas en el maletín robado?",
      "¿Quién conocía al mánager del artista de antes?"
    ],
    solution: {
      culpritNameRole: "Paula (La Amiga Melómana / Papel 4)",
      crimeTime: "23:45",
      keyMethod: "Aprovechó el parón del guardia a las 23:35 para colarse con una acreditación falsificada, abrió el maletín dejando purpurina de sus pómulos y cortó su pulsera verde por error con sus tijeritas.",
      fullStory:
        "Paula estaba desesperada por conseguir fondos para costearse un viaje de fin de gira y sabía que el caché se pagaba en efectivo en el camerino 4. Usó una copia del pase que imprimió en el trabajo, entró mientras el guardia comía a las 23:40, forzó el maletín dejando impregnada su purpurina de estrellas, cogió los 3.000€ y la chaqueta de edición limitada, pero al salir se enganchó la pulsera verde y la cortó a prisa con sus tijeras de manicura.",
      criticalClues: [
        "Llevaba purpurina plateada con forma de estrellitas idéntica a la del maletín.",
        "En su bolso tenía las tijeritas de manicura con restos de tela verde flúor.",
        "Nadie la vio en el concierto durante la canción cumbre de las 23:45."
      ]
    },
    dossiersByPlayerCount: adaptRolesForCount([
      {
        roleId: "rol_1",
        roleName: "La Acreditada Oficial",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Ainara vio que Paula tenía las manos llenas de brillos estrellados."],
        dossier: {
          roleTitle: "La Invitada Especial",
          avatar: "🎫",
          isCulprit: false,
          movements: [
            { time: "23:10", place: "Front Row VIP", detail: "Grabando la intro del concierto con Elena." },
            { time: "23:40", place: "Barra Backstage", detail: "Tomando una cerveza con el técnico de sonido." },
            { time: "00:00", place: "Escenario", detail: "Esperando para saludar al artista al terminar." },
            { time: "00:20", place: "Control de Seguridad", detail: "Te pidieron la acreditación oficial con holograma auténtico." }
          ],
          knownInfo: [
            "Tu pase era el único oficial de artista, pero viste que alguien llevaba una réplica plastificada casera.",
            "Tú no usaste purpurina hoy porque eres alérgica al maquillaje con microplásticos.",
            "Elena estuvo contigo en el front row hasta las 23:30."
          ],
          secretObjective: "Demuestra que tu pase es original y pregunta quién llevaba purpurina de estrellitas.",
          suspicionNotes: "El técnico de sonido puede confirmar que estabas en la barra con él a las 23:40."
        }
      },
      {
        roleId: "rol_2",
        roleName: "La Fanática del DJ",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Saray notó que Paula desapareció en el tema más esperado."],
        dossier: {
          roleTitle: "La Súper Fan",
          avatar: "🎧",
          isCulprit: false,
          movements: [
            { time: "23:00", place: "Pista VIP", detail: "Saltando en primera fila cantando todas las canciones." },
            { time: "23:45", place: "Pista VIP", detail: "Llorando de emoción durante el solo de sintetizador con Marta." },
            { time: "00:10", place: "Puesto de Merchandising", detail: "Comprando una camiseta con tu tarjeta de crédito." },
            { time: "00:25", place: "Salida", detail: "Sorprendida por el despliegue policial." }
          ],
          knownInfo: [
            "Marta y tú estabais grabándoos en vídeo justo a las 23:45 cantando a grito pelado.",
            "Paula dijo a las 23:25 que tenía calor y se iba a la zona de césped sola.",
            "Viste que Paula llevaba en las mejillas purpurina plateada de estrellitas que compró en el bazar."
          ],
          secretObjective: "Muestra el vídeo cantando con Marta a las 23:45 y señala la ausencia de Paula.",
          suspicionNotes: "El vídeo tiene marca de tiempo exacta en los metadatos del smartphone."
        }
      },
      {
        roleId: "rol_3",
        roleName: "La Mánager Impaciente",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Marta vio que a Paula le faltaba la pulsera flúor al salir."],
        dossier: {
          roleTitle: "La Coordinadora del Grupo",
          avatar: "📋",
          isCulprit: false,
          movements: [
            { time: "23:15", place: "Carpa Chill-Out", detail: "Descansando los pies y respondiendo whatsapps." },
            { time: "23:45", place: "Pista VIP", detail: "Abrazada a Saray durante el tema principal." },
            { time: "00:05", place: "Camerinos", detail: "Fuiste a buscar agua embotellada y viste el revuelo del mánager." },
            { time: "00:20", place: "Puerta", detail: "Reuniste al grupo para ver qué pasaba." }
          ],
          knownInfo: [
            "A las 00:15 viste que Paula ya no llevaba puesta su pulsera verde del festival.",
            "Le preguntaste qué le había pasado a su pulsera y ella dijo que se le había desabrochado sola.",
            "Las pulseras de tela del festival son imposibles de quitar sin cortarlas con tijeras."
          ],
          secretObjective: "Pregúntale a Paula cómo diablos se 'desabrochó' una pulsera de tela con precinto de plástico.",
          suspicionNotes: "Céntrate en el detalle del precinto de seguridad irrompible."
        }
      },
      {
        roleId: "rol_4",
        roleName: "La Chica Alternativa",
        isCulprit: true, // CULPRIT!
        extraCluesIfFewerPlayers: ["Paula tiene el sobre de los 3.000€ escondido en la bota plataforma."],
        dossier: {
          roleTitle: "La Audaz (¡ERES LA CULPABLE!)",
          avatar: "⭐",
          isCulprit: true,
          movements: [
            { time: "23:20", place: "Gradas laterales", detail: "Dijiste que te agobiaba la multitud y te ibas a tomar el aire." },
            { time: "23:40", place: "Entrada Camerinos", detail: "Viste al de seguridad despistado y te colaste con tu credencial falsa." },
            { time: "23:48", place: "Camerino 4", detail: "Abriste el maletín, cogiste el fajo de billetes y lo metiste en la caña de tu bota." },
            { time: "00:10", place: "Baños químicos", detail: "Te lavaste la cara intentando quitarte la purpurina pero te quedaron restos." }
          ],
          knownInfo: [
            "Tú tienes los 3.000 € enrollados dentro del calcetín de tu bota con plataforma izquierda.",
            "Se te cayeron las tijeritas de manicura al cortar la pulsera porque se enganchó con el picaporte.",
            "Tus mejillas aún tienen restos de purpurina plateada con forma de estrellitas.",
            "Viste que Lucía estaba cerca de los camerinos buscando a su amigo a las 23:50: puedes acusarla a ella."
          ],
          secretObjective: "Siembra la duda sobre Lucía y asegura que perdiste la pulsera en el pogo del concierto.",
          suspicionNotes: "Mantén que fuiste al baño portátil porque te dio un bajón de tensión."
        }
      },
      {
        roleId: "rol_5",
        roleName: "La Buscavidas",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Elena vio a Paula meterse algo en las botas altas."],
        dossier: {
          roleTitle: "La Espabilada",
          avatar: "🔍",
          isCulprit: false,
          movements: [
            { time: "23:05", place: "Zona de Food Trucks", detail: "Comiendo unas patatas fritas con hamburguesa." },
            { time: "23:35", place: "Paseo de camerinos", detail: "Buscabas cobertura para hacer una llamada." },
            { time: "23:50", place: "Zona de baños", detail: "Viste a Paula agachada ajustándose la caña de sus botas altas nerviosa." },
            { time: "00:15", place: "Punto de encuentro", detail: "Buscando al resto de las amigas." }
          ],
          knownInfo: [
            "A las 23:50 viste que Paula caminaba cojeando de un pie como si llevara algo rígido en la bota.",
            "Paula no tenía la pulsera en la muñeca a las 23:50 y tenía la muñeca enrojecida.",
            "Tú no entraste a los camerinos porque el guardia te pidió el pase y no te dejó pasar."
          ],
          secretObjective: "Haz que Paula se quite las botas para comprobar qué lleva guardado.",
          suspicionNotes: "El gesto de cojear de Paula es la pista física más delatora."
        }
      },
      {
        roleId: "rol_6",
        roleName: "La Fiestera Despistada",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Claudia compró la purpurina de estrellas y solo se la dio a Paula."],
        dossier: {
          roleTitle: "La Fiestera Ingenua",
          avatar: "🎉",
          isCulprit: false,
          movements: [
            { time: "23:00", place: "Zona VIP", detail: "Bailando y maquillando a las chicas con tu purpurina." },
            { time: "23:30", place: "Barra de chupitos", detail: "Invitando a un grupo de chicos que conociste en la cola." },
            { time: "23:55", place: "Pista central", detail: "Perdiste las gafas de sol y estuviste buscándolas en el suelo." },
            { time: "00:20", place: "Control de seguridad", detail: "Intentando convencer al guardia de que te deje salir." }
          ],
          knownInfo: [
            "La purpurina de estrellitas plateadas la compraste tú en una tienda online y solo se la pusiste a Paula porque las demás no querían.",
            "Ainara llevaba purpurina dorada de puntos y Marta llevaba sombra de ojos mate.",
            "Paula fue la única persona en todo el grupo con esas estrellas plateadas exclusivas."
          ],
          secretObjective: "Aclara que nadie más en el grupo llevaba esas estrellas plateadas en la cara.",
          suspicionNotes: "Enséñale a todas el botecito de purpurina para que comparen las estrellas."
        }
      },
      {
        roleId: "rol_7",
        roleName: "La Seguridad & Control",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Lucía habló con el vigilante del camerino que vio entrar a una chica con botas altas."],
        dossier: {
          roleTitle: "La Prudente",
          avatar: "🛡️",
          isCulprit: false,
          movements: [
            { time: "23:10", place: "Entrada general", detail: "Acompañando a una amiga al puesto de Cruz Roja por una ampolla." },
            { time: "23:40", place: "Paseo central", detail: "Comprobando la batería portátil de los móviles." },
            { time: "00:00", place: "Puerta de camerinos", detail: "Escuchaste al guardia decir que la chica que vio entrar llevaba una melena morena y botas altas." },
            { time: "00:20", place: "Lobby VIP", detail: "Reunida con Ainara y Elena." }
          ],
          knownInfo: [
            "La descripción del guardia coincide al 100% con Paula (pelo moreno largo y botas altas militares con plataforma).",
            "Marta y Elena son rubias, y Ainara llevaba zapatillas deportivas blancas.",
            "El guardia recuerda que la intrusa tenía brillos muy llamativos en los pómulos."
          ],
          secretObjective: "Cruza la descripción física del guardia (botas altas y morena) con la vestimenta de Paula.",
          suspicionNotes: "El contraste de calzado y pelo descarta inmediatamente a las demás."
        }
      }
    ])
  },

  // ==========================================
  // CASO 4: DRAMA EN EL YATE DE FORMENTERA
  // ==========================================
  {
    id: 4,
    slug: "yate-formentera",
    title: "Drama en el Yate de Formentera",
    subtitle: "El bolso arrojado al mar con las llaves de la villa y pasaportes",
    category: "Venganza & Mar",
    emoji: "🛥️",
    location: "Catamarán privado fondeado en Illetes (Formentera)",
    incidentTime: "A las 19:15 al atardecer",
    synopsis:
      "Durante una jornada de navegación de lujo, el bolso de piel de la influencer del grupo aparece flotando en el agua a 50 metros del barco, completamente empapado y arruinado: contenía las llaves maestras de la villa alquilada, 1.500 € y su iPhone 16 Pro Max.",
    publicTimeline: [
      { time: "18:30", description: "El catamarán echa el ancla en la cala para ver la puesta de sol.", location: "Cala Illetes" },
      { time: "19:00", description: "Se abre el champán en la cubierta de proa.", location: "Proa" },
      { time: "19:15", description: "Un 'chof' seco en popa alerta al patrón del barco.", location: "Popa" },
      { time: "19:35", description: "La dueña del bolso va al camarote y descubre que no está en la litera.", location: "Camarote 2" },
      { time: "19:50", description: "El marinero rescata el bolso empapado flotando con un bichero.", location: "Agua de popa" }
    ],
    progressiveClues: [
      {
        minute: 3,
        title: "La Uña Acrílica Neón Fucsia en la Barandilla",
        badge: "PRUEBA 1 · MIN 3",
        description: "En el pasamanos de popa, justo encima de donde cayó el bolso, hay enganchada una uña postiza rota de gel de color fucsia flúor con purpurina.",
        impactQuestion: "¿Quién tiene una uña rota en la mano derecha de ese mismo color fucsia?"
      },
      {
        minute: 6,
        title: "El Mensaje de Voz Filtrado",
        badge: "PRUEBA 2 · MIN 6",
        description: "En el historial de audio de la grabadora del móvil rescatado se escucha una discusión susurrada grabada a las 19:10: 'No vas a subir esa foto mía con mi ex a tus redes, te lo juro'.",
        impactQuestion: "¿Quién estaba enfadada a muerte por esa foto comprometedora con su ex?"
      }
    ],
    interrogationQuestions: [
      "¿Quién estuvo en la popa del barco a las 19:15 durante el brindis de proa?",
      "¿Quién se rompió la uña fucsia durante la travesía y qué excusa dio?",
      "¿Quién temía que se publicara la foto del ex en redes sociales?",
      "¿Quién bajó a los camarotes mientras descorchaban el champán?"
    ],
    solution: {
      culpritNameRole: "Marta (La Amiga Celosa / Papel 2)",
      crimeTime: "19:15",
      keyMethod: "Bajó al camarote mientras todas brindaban en proa, cogió el bolso para destruir el móvil que guardaba la foto con su ex y lo lanzó por la borda rompiéndose la uña contra la barandilla.",
      fullStory:
        "Marta había descubierto que en el móvil de la influencer había una foto suya besándose con el ex de otra amiga del grupo. Si esa foto se publicaba o la veían las demás, su reputación quedaría destrozada. Aprovechó el ruido del champán a las 19:10 para bajar al camarote 2, agarró el bolso entero para no dejar huellas, lo tiró con furia desde la popa a las 19:15 partiéndose la uña postiza fucsia en la borda, y volvió a proa disimulando con la mano en el bolsillo del caftán.",
      criticalClues: [
        "Le falta exactamente la uña postiza del dedo anular derecho fucsia.",
        "Era la única persona con un motivo desesperado para destruir el móvil antes de llegar a puerto.",
        "El audio recuperado tiene su voz inconfundible amenazando con que la foto no saldría a la luz."
      ]
    },
    dossiersByPlayerCount: adaptRolesForCount([
      {
        roleId: "rol_1",
        roleName: "La Víctima & Influencer",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Ainara vio que Marta ocultaba la mano derecha todo el rato."],
        dossier: {
          roleTitle: "La Dueña del Bolso",
          avatar: "👜",
          isCulprit: false,
          movements: [
            { time: "18:45", place: "Camarote 2", detail: "Dejaste tu bolso sobre la cama antes de ponerte el bikini para la foto." },
            { time: "19:00", place: "Proa", detail: "Posando con la copa de champán frente a la puesta de sol." },
            { time: "19:25", place: "Proa", detail: "Bebiendo champán y pidiéndole a Marta que te hiciera un selfie." },
            { time: "19:35", place: "Camarote 2", detail: "Bajaste a por tu pintalabios y tu bolso de 3.000€ había desaparecido." }
          ],
          knownInfo: [
            "Tenías en el móvil una foto bomba de Marta con el ex de Saray tomada la noche anterior.",
            "Le habías avisado a Marta medio en broma que la ibas a subir a mejores amigos si no pagaba su parte del barco.",
            "Marta se puso histérica y te amenazó con que 'te arrepentirías'."
          ],
          secretObjective: "Exige que todas enseñen sus manos para ver quién tiene una uña rota fucsia.",
          suspicionNotes: "Explica a todas el chantaje de la foto para revelar el móvil de Marta."
        }
      },
      {
        roleId: "rol_2",
        roleName: "La Sospechosa de las Uñas",
        isCulprit: true, // CULPRIT!
        extraCluesIfFewerPlayers: ["Marta tiene la uña fucsia escondida dentro del dobladillo del bañador."],
        dossier: {
          roleTitle: "La Culpable Vengativa (¡ERES LA CULPABLE!)",
          avatar: "💅",
          isCulprit: true,
          movements: [
            { time: "18:55", place: "Proa", detail: "Dijiste que ibas a buscar una toalla porque tenías frío." },
            { time: "19:10", place: "Camarote 2", detail: "Entraste, susurraste al bolso enfadada, lo agarraste y subiste por la escalerilla trasera." },
            { time: "19:15", place: "Popa del yate", detail: "Lanzaste el bolso con fuerza al agua; al chocar la mano con el cable de acero se te quebró la uña postiza fucsia." },
            { time: "19:20", place: "Proa", detail: "Regresaste metiendo la mano derecha en el bolsillo de tu kimono playero." }
          ],
          knownInfo: [
            "Tú tiraste el bolso al mar para ahogar el teléfono y la foto con el ex de Saray.",
            "Te rompiste la uña fucsia del dedo anular de la mano derecha en la barandilla de popa.",
            "Si te piden ver las manos, di que te la rompiste abriendo una lata de refresco a las 17:00.",
            "Viste que Elena estuvo remando en la tabla de paddle surf: puedes culparla de haber golpeado el bolso con el remo."
          ],
          secretObjective: "No saques la mano derecha del bolsillo y desvía la culpa hacia la tabla de paddle surf de Elena.",
          suspicionNotes: "Mantén que te rompiste la uña al inicio de la tarde con una lata."
        }
      },
      {
        roleId: "rol_3",
        roleName: "La Patrona del Grupo",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Saray recuerda que Marta tenía las diez uñas perfectas a las 18:30."],
        dossier: {
          roleTitle: "La Amiga Observadora",
          avatar: "🧭",
          isCulprit: false,
          movements: [
            { time: "18:30", place: "Gobierno del barco", detail: "Ayudando al patrón a fondear el ancla." },
            { time: "19:00", place: "Proa", detail: "Descorchando la botella de champán francés." },
            { time: "19:15", place: "Paso lateral", detail: "Escuchaste el golpe en el agua y pensaste que era un pez grande o una ola." },
            { time: "19:45", place: "Popa", detail: "Viste la uña pegada en el cable de la barandilla con restos de barniz fucsia fresco." }
          ],
          knownInfo: [
            "A las 18:30 le hiciste una foto a la mano de Marta sosteniendo la copa y TENÍA LAS DIEZ UÑAS PUESTAS e impecables.",
            "La uña de la barandilla tiene el pegamento aún pegajoso: se arrancó hace menos de una hora.",
            "Marta no se rompió la uña a las 17:00, miente descaradamente."
          ],
          secretObjective: "Desmonta la mentira de Marta mostrando la foto de las 18:30 donde tenía todas las uñas enteras.",
          suspicionNotes: "Esa foto tumba por completo la coartada de la lata de refresco."
        }
      },
      {
        roleId: "rol_4",
        roleName: "La Deportista Acuática",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Elena vio desde el agua caer el bolso desde la popa alta."],
        dossier: {
          roleTitle: "La Aventurera del Mar",
          avatar: "🏄‍♀️",
          isCulprit: false,
          movements: [
            { time: "18:40", place: "Agua", detail: "Te tiraste al mar con la tabla de paddle surf." },
            { time: "19:14", place: "A 30 metros de la popa", detail: "Viste una figura con kimono blanco lanzar algo negro voluminoso al mar." },
            { time: "19:25", place: "Escalera de baño", detail: "Subiste empapada pidiendo que alguien te diera una toalla." },
            { time: "19:40", place: "Cubierta", detail: "Te enteraste de que el bolso había sido lanzado al agua." }
          ],
          knownInfo: [
            "Viste con total claridad que quien tiró el bolso llevaba un kimono blanco de seda.",
            "Marta era la única que llevaba ese kimono blanco sobre el bikini.",
            "Tus uñas son cortas y naturales sin pintar porque haces deporte."
          ],
          secretObjective: "Declara que viste al kimono blanco lanzar el bulto desde el agua a las 19:15.",
          suspicionNotes: "El testimonio visual desde la tabla de paddle surf es definitivo."
        }
      },
      {
        roleId: "rol_5",
        roleName: "La DJ de la Travesía",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Paula oyó pasos apresurados en la escalerilla trasera a las 19:13."],
        dossier: {
          roleTitle: "La Encargada de la Música",
          avatar: "🎶",
          isCulprit: false,
          movements: [
            { time: "18:45", place: "Mesa de sonido en popa", detail: "Poniendo la playlist de atardecer chill house." },
            { time: "19:05", place: "Altavoces de babor", detail: "Ajustando el volumen para el brindis de proa." },
            { time: "19:13", place: "Popa baja", detail: "Viste a Marta pasar a toda prisa con los ojos llorosos y un bulto bajo el brazo." },
            { time: "19:30", place: "Proa", detail: "Subiste para bailar con las chicas." }
          ],
          knownInfo: [
            "Viste a Marta bajar la mirada y ocultar algo bajo su kimono a las 19:13 dirigiéndose hacia la borda de popa.",
            "Escuchaste a Marta jurar por lo bajo 'hasta aquí hemos llegado'.",
            "Tú estabas con el móvil conectado por bluetooth todo el tiempo."
          ],
          secretObjective: "Testifica que viste a Marta con el bulto dirigiéndose a la popa dos minutos antes del ruido.",
          suspicionNotes: "Corrobora la versión de la deportista acuática."
        }
      },
      {
        roleId: "rol_6",
        roleName: "La Sommelier del Barco",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Lucía sirvió el champán a todas menos a Marta a las 19:15."],
        dossier: {
          roleTitle: "La Chica de las Copas",
          avatar: "🍾",
          isCulprit: false,
          movements: [
            { time: "18:50", place: "Nevera de proa", detail: "Sacando los cubitos de hielo y las copas de cristal acrílico." },
            { time: "19:10", place: "Proa", detail: "Llenando las copas de todas las que estaban en cubierta." },
            { time: "19:15", place: "Proa", detail: "Te sobró una copa llena porque faltaba Marta, que había desaparecido." },
            { time: "19:22", place: "Proa", detail: "Marta volvió jadeando y cogió la copa con la mano izquierda temblando." }
          ],
          knownInfo: [
            "Marta no estaba presente en el brindis oficial de las 19:15 aunque había dicho que 'solo iba un segundo'.",
            "Marta se negó a brindar con la mano derecha y no soltó el bolsillo de su caftán.",
            "Tú no bajaste al camarote en ningún momento."
          ],
          secretObjective: "Destaca que Marta fue la única ausente en el brindis de las 19:15.",
          suspicionNotes: "El brindis une a todas en proa excepto a Marta."
        }
      },
      {
        roleId: "rol_7",
        roleName: "La Médica del Grupo",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Claudia tiene el botiquín y examinó el corte en el dedo de Marta."],
        dossier: {
          roleTitle: "La Sanitaria",
          avatar: "🩺",
          isCulprit: false,
          movements: [
            { time: "18:30", place: "Solarium", detail: "Aplicándote crema solar factor 50 y charlando con Ainara." },
            { time: "19:00", place: "Proa", detail: "Brindando por las vacaciones." },
            { time: "19:35", place: "Camarote 1", detail: "Cogiste el botiquín cuando Marta pidió una tirita para su dedo sangrante." },
            { time: "19:45", place: "Popa", detail: "Inspeccionaste el dedo de Marta y comprobaste que la uña se había arrancado de raíz." }
          ],
          knownInfo: [
            "El sangrado del dedo de Marta era reciente de menos de 15 minutos: la sangre aún no había coagulado.",
            "Un tirón contra una barandilla metálica provoca exactamente ese tipo de desgarro que tenía Marta.",
            "Imposible que se hubiera hecho esa herida a las 17:00 con una lata de refresco sin haber sangrado antes en el solarium."
          ],
          secretObjective: "Presenta el dictamen médico sobre la frescura de la herida en el dedo de Marta.",
          suspicionNotes: "El informe médico desmonta cualquier duda temporal."
        }
      }
    ])
  },

  // ==========================================
  // CASO 5: ALTA COSTURA EN PARÍS
  // ==========================================
  {
    id: 5,
    slug: "alta-costura-paris",
    title: "Alta Costura en París",
    subtitle: "El sabotaje del vestido de novia minutos antes del desfile",
    category: "Moda & Traición",
    emoji: "👗",
    location: "Palais de Chaillot, Fashion Week (París)",
    incidentTime: "A las 20:20 entre bambalinas",
    synopsis:
      "A media hora de que se abran las puertas del desfile de la prestigiosa diseñadora, el vestido estrella de la colección de seda italiana aparece cortado de arriba a abajo con una cuchilla de precisión. El atelier está cerrado y solo su equipo de confianza tenía pase libre.",
    publicTimeline: [
      { time: "19:45", description: "El vestido queda planchado e impecable en el maniquí central.", location: "Atelier Principal" },
      { time: "20:00", description: "Todo el equipo asiste al briefing de maquillaje en la carpa anexa.", location: "Carpa Make-Up" },
      { time: "20:20", description: "Un crujido de perchas y un ruido sordo se escucha en el atelier.", location: "Atelier Principal" },
      { time: "20:35", description: "La jefa de taller entra para vestir a la modelo y pega un alarido.", location: "Atelier Principal" },
      { time: "20:45", description: "Seguridad retiene a todas las presentes en el backstage.", location: "Paso de Modelos" }
    ],
    progressiveClues: [
      {
        minute: 3,
        title: "La Cuchilla de Bisturí con Hilo de Seda",
        badge: "PRUEBA 1 · MIN 3",
        description: "Bajo la tarima aparece una cuchilla de bisturí de patronaje quirúrgico con restos de fibra de seda blanca y un número de serie grabado: 'PAT-04'.",
        impactQuestion: "¿Quién tiene el kit de patronaje con la numeración PAT-04 en su maletín?"
      },
      {
        minute: 6,
        title: "El Contrato de la Marca Rival en el Bolso",
        badge: "PRUEBA 2 · MIN 6",
        description: "Se halla una propuesta de contrato confidencial con la firma rival milanesa ofreciendo 40.000 € por director de diseño si este desfile fracasa estrepitosamente.",
        impactQuestion: "¿Quién estaba negociando su fichaje secreto con la competencia italiana?"
      }
    ],
    interrogationQuestions: [
      "¿Dónde estaba cada una a las 20:20 cuando se escuchó el crujido en el atelier?",
      "¿Quién tenía acceso a las cuchillas quirúrgicas de patronaje?",
      "¿Por qué alguien querría sabotear el vestido más valioso de la colección?",
      "¿Quién salió del briefing de maquillaje antes de tiempo?"
    ],
    solution: {
      culpritNameRole: "Lucía (La Primera Oficial de Costura / Papel 3)",
      crimeTime: "20:20",
      keyMethod: "Se escabulló del briefing fingiendo un ataque de tos, entró al atelier con su cuchilla PAT-04 y rajó la seda para garantizar el fracaso del desfile y firmar con la marca rival.",
      fullStory:
        "Lucía sentía que su trabajo nunca era reconocido por la diseñadora estrella y ya tenía apalabrado un contrato multimillonario en Milán condicionado a que la colección actual fuera un fiasco en prensa. A las 20:15 simuló un ataque de tos durante la charla de maquillaje, subió por la puerta trasera al atelier desierto a las 20:20, rasgó la cola de seda con su bisturí PAT-04 y lo tiró bajo la tarima pensando que nadie comprobaría el número de serie de su estuche.",
      criticalClues: [
        "El número PAT-04 corresponde a su kit personal de herramientas de costura.",
        "Tenía en su poder el borrador del contrato secreto de Milán.",
        "Salió del briefing de maquillaje entre las 20:15 y las 20:28."
      ]
    },
    dossiersByPlayerCount: adaptRolesForCount([
      {
        roleId: "rol_1",
        roleName: "La Diseñadora Principal",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Ainara asignó personalmente el kit PAT-04 a Lucía la semana pasada."],
        dossier: {
          roleTitle: "La Creadora",
          avatar: "🧵",
          isCulprit: false,
          movements: [
            { time: "19:45", place: "Atelier", detail: "Distéis los últimos retoques al vestido de seda en el maniquí con Lucía." },
            { time: "20:00", place: "Carpa Make-Up", detail: "Dando el discurso motivacional a todo el equipo." },
            { time: "20:30", place: "Pasarela", detail: "Recibiendo a los fotógrafos de Vogue y Harper's Bazaar." },
            { time: "20:35", place: "Atelier", detail: "Entraste y viste tu obra maestra completamente destruida en el suelo." }
          ],
          knownInfo: [
            "Tú personalmente compraste y numeraste los kits de bisturí: el PAT-04 fue asignado a Lucía.",
            "Notaste que Lucía estaba distante y respondía de malas ganas toda la tarde.",
            "El desfile está asegurado por 200.000€ pero tu reputación queda arruinada si no desfilas."
          ],
          secretObjective: "Revisa la lista de inventario de las cuchillas y demuestra quién tenía el estuche PAT-04.",
          suspicionNotes: "La coincidencia del número de serie PAT-04 es irrefutable."
        }
      },
      {
        roleId: "rol_2",
        roleName: "La Jefa de Modelos",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Saray vio a Lucía salir del atelier con la cuchilla en la mano a las 20:22."],
        dossier: {
          roleTitle: "La Coordinadora de Pasarela",
          avatar: "👠",
          isCulprit: false,
          movements: [
            { time: "19:50", place: "Probadores", detail: "Comprobando la altura de los tacones de las modelos." },
            { time: "20:15", place: "Pasillo trasero", detail: "Viste a alguien entrar a oscuras al atelier con abrigo negro." },
            { time: "20:22", place: "Pasillo trasero", detail: "Escuchaste el chasquido de perchas y viste salir a Lucía ajustándose la bufanda con cara de culpable." },
            { time: "20:35", place: "Atelier", detail: "Acompañaste a la diseñadora y descubristeis el corte." }
          ],
          knownInfo: [
            "Viste a Lucía salir a toda prisa del atelier a las 20:22 en dirección a los baños.",
            "Lucía no estaba en el briefing de maquillaje porque dijo que se ahogaba con el fijador de pelo.",
            "Tú estabas con la modelo estrella repasando el orden de salida."
          ],
          secretObjective: "Testifica que viste a Lucía salir del atelier exactamente a las 20:22.",
          suspicionNotes: "El horario en que viste salir a Lucía encaja con el ruido de las 20:20."
        }
      },
      {
        roleId: "rol_3",
        roleName: "La Primera Asistente",
        isCulprit: true, // CULPRIT!
        extraCluesIfFewerPlayers: ["Lucía tiene una pequeña herida de corte en la yema del pulgar."],
        dossier: {
          roleTitle: "La Traidora Ambiciosa (¡ERES LA CULPABLE!)",
          avatar: "✂️",
          isCulprit: true,
          movements: [
            { time: "20:00", place: "Carpa Make-Up", detail: "Asististe al inicio de la reunión." },
            { time: "20:14", place: "Salida fingida", detail: "Empezaste a toser fuerte diciendo que el spray de laca te daba alergia y te ibas a por agua." },
            { time: "20:20", place: "Atelier oscuro", detail: "Entraste, sacaste tu bisturí PAT-04, rebanaste la cola de seda de un tirón y arrojaste la cuchilla bajo el entarimado." },
            { time: "20:26", place: "Baños de producción", detail: "Te lavaste las manos temblando; te hiciste un cortecito en el pulgar con las prisas." }
          ],
          knownInfo: [
            "Tú saboteaste el vestido porque Milán te prometió el puesto de directora creativa si este show fracasa.",
            "Te dejaste la cuchilla PAT-04 bajo el entarimado por error.",
            "Tienes un corte pequeño en el pulgar tapado con una tirita color carne.",
            "Puedes culpar a Marta diciendo que ella quería vender una exclusiva a la prensa."
          ],
          secretObjective: "Culpa a la prensa o a Marta y oculta tu tirita en el pulgar.",
          suspicionNotes: "Di que el corte del pulgar te lo hiciste ayer abriendo una caja de alfileres."
        }
      },
      {
        roleId: "rol_4",
        roleName: "La Responsable de Prensa",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Marta grabó la entrada al atelier y tiene registrada la sombra de Lucía."],
        dossier: {
          roleTitle: "La Relaciones con Medios",
          avatar: "📰",
          isCulprit: false,
          movements: [
            { time: "19:40", place: "Photocall", detail: "Atendiendo a las celebridades e influencers internacionales." },
            { time: "20:10", place: "Sala de prensa", detail: "Repartiendo los dosieres de prensa oficiales." },
            { time: "20:30", place: "Entrada del backstage", detail: "Controlando el acceso de las cámaras de televisión." },
            { time: "20:40", place: "Atelier", detail: "Avisada por los gritos de pánico de la diseñadora." }
          ],
          knownInfo: [
            "Escuchaste a Lucía hace dos días en el hotel hablar en italiano diciendo 'tranquilo, el desfile de París no será ningún obstáculo'.",
            "Tú tenías la exclusiva pactada con Harper's Bazaar y este sabotaje te perjudica directamente.",
            "Tus herramientas de trabajo son tu tablet y teléfono móvil, jamás tocas herramientas de costura."
          ],
          secretObjective: "Saca a la luz la llamada en italiano de Lucía prometiendo que el desfile no sería un obstáculo.",
          suspicionNotes: "Esta conversación telefónica desvela el plan premeditado de Lucía."
        }
      },
      {
        roleId: "rol_5",
        roleName: "La Patronista Sénior",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Paula tiene el registro de los números de serie de los bisturís."],
        dossier: {
          roleTitle: "La Maestra Artesana",
          avatar: "📐",
          isCulprit: false,
          movements: [
            { time: "19:30", place: "Atelier", detail: "Revisaste las costuras con Ainara antes de guardarlo todo." },
            { time: "20:00", place: "Carpa Make-Up", detail: "Escuchaste el discurso de la jefa hasta el final sin moverte de tu silla." },
            { time: "20:25", place: "Carpa Make-Up", detail: "Charlando con Elena sobre las luces de la pasarela." },
            { time: "20:36", place: "Atelier", detail: "Entraste a socorrer a la diseñadora al escuchar los gritos." }
          ],
          knownInfo: [
            "Tu estuche de bisturí es el PAT-01 y lo tienes en tu riñonera cerrado con candado.",
            "Fuiste testigo de cómo Lucía se levantó de la charla a las 20:14 tosiendo exageradamente.",
            "Sabes que el corte del vestido fue limpio y hecho con pulso profesional de sastre, no por un aficionado."
          ],
          secretObjective: "Confirma que el corte fue hecho por alguien con técnica experta de costura y señala la ausencia de Lucía.",
          suspicionNotes: "Un intruso común habría desgarrado la tela, pero este corte fue milimétrico."
        }
      },
      {
        roleId: "rol_6",
        roleName: "La Iluminadora del Show",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Elena vio desde la pasarela la luz del atelier encenderse a las 20:19."],
        dossier: {
          roleTitle: "La Técnica de Luces",
          avatar: "💡",
          isCulprit: false,
          movements: [
            { time: "19:50", place: "Mesa de control", detail: "Comprobando los focos móviles del centro del escenario." },
            { time: "20:19", place: "Mesa de control", detail: "Viste el reflejo de la luz del atelier encenderse en una ventana lateral." },
            { time: "20:23", place: "Mesa de control", detail: "La luz del atelier se apagó de golpe." },
            { time: "20:40", place: "Escenario", detail: "Te pidieron encender las luces generales por la emergencia." }
          ],
          knownInfo: [
            "El panel de luces del atelier solo se activó entre las 20:19 y las 20:23.",
            "Todas las demás asistentes estaban en la carpa de maquillaje durante ese minuto exacto.",
            "La única persona ausente en esa ventana de 4 minutos fue Lucía."
          ],
          secretObjective: "Aporta el registro exacto de las luces del atelier activadas entre las 20:19 y las 20:23.",
          suspicionNotes: "El rango de 4 minutos acorrala a quien no tenga coartada entre las 20:19 y las 20:23."
        }
      },
      {
        roleId: "rol_7",
        roleName: "La Modelo de Prueba",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Claudia se probó el vestido a las 19:30 y estaba impoluto."],
        dossier: {
          roleTitle: "La Modelo Principal",
          avatar: "💃",
          isCulprit: false,
          movements: [
            { time: "19:30", place: "Atelier", detail: "Prueba final del vestido con tacones de 12 cm: estaba perfecto." },
            { time: "20:00", place: "Sillón de peluquería", detail: "Peinándote con extensiones durante 40 minutos seguidos." },
            { time: "20:35", place: "Atelier", detail: "Ibas lista para vestirte y te encontraste el drama." },
            { time: "20:45", place: "Backstage", detail: "Consolando a la diseñadora." }
          ],
          knownInfo: [
            "A las 19:40 el vestido estaba completamente impoluto, tú fuiste la última persona en probártelo.",
            "Durante todo el tiempo de 20:00 a 20:40 estuviste sentada bajo el secador de pelo con la peluquera.",
            "Lucía te ajustó la cremallera antes de las 20:00 y te dijo con rencor: 'disfrútalo mientras dure'."
          ],
          secretObjective: "Declara la frase siniestra que te soltó Lucía a las 19:40 ('disfrútalo mientras dure').",
          suspicionNotes: "Esta frase demuestra la premeditación y la envidia acumulada de Lucía."
        }
      }
    ])
  },

  // ==========================================
  // CASO 6: CABAÑA DE NIEVE EN ANDORRA
  // ==========================================
  {
    id: 6,
    slug: "cabana-andorra",
    title: "Nochevieja en la Cabaña de Andorra",
    subtitle: "El audio íntimo filtrado al grupo de ex y el corte de luz",
    category: "Gossip & Escándalo",
    emoji: "❄️",
    location: "Chalet Grandvalira, Canillo (Andorra)",
    incidentTime: "A las 23:15 durante la cena de Nochevieja",
    synopsis:
      "A 45 minutos de las campanadas de fin de año, se va la luz de golpe en la cabaña aislada por la nieve. En ese instante de caos, desde el móvil de la anfitriona se difunde un audio comprometedor de 2 minutos a un grupo de WhatsApp con todos los exnovios del grupo.",
    publicTimeline: [
      { time: "22:45", description: "Empieza la cena de gala junto a la chimenea encendida.", location: "Salón Principal" },
      { time: "23:10", description: "Alguien se levanta de la mesa diciendo que va a por más vino a la bodega.", location: "Bodega Subterránea" },
      { time: "23:15", description: "Saltan los plomos generales y la cabaña se queda a oscuras.", location: "Cuadro Eléctrico" },
      { time: "23:18", description: "Llegan decenas de notificaciones a los teléfonos: el audio ha sido enviado.", location: "Móviles" },
      { time: "23:25", description: "Se reactiva el generador de emergencia exterior.", location: "Cobertizo" }
    ],
    progressiveClues: [
      {
        minute: 3,
        title: "El Candado del Cuadro Eléctrico Forzado",
        badge: "PRUEBA 1 · MIN 3",
        description: "El diferencial general de la cabaña fue bajado a mano. En el suelo hay una horquilla de pelo metálica doblada que se usó para forzar la tapa del cuadro de fusibles.",
        impactQuestion: "¿Quién lleva puestas horquillas metálicas de ese mismo tamaño y forma?"
      },
      {
        minute: 6,
        title: "La Huella Dactilar en la Pantalla del Móvil",
        badge: "PRUEBA 2 · MIN 6",
        description: "En la pantalla del móvil emisor hay restos de crema de manos con olor a coco y menta. Solo una de vosotras se echó esa crema aromática antes de cenar.",
        impactQuestion: "¿Quién sacó el bote de crema de coco y menta en el aperitivo?"
      }
    ],
    interrogationQuestions: [
      "¿Quién bajó a la bodega o al sótano justo antes del apagón de las 23:15?",
      "¿Quién conocía la contraseña del teléfono de la anfitriona?",
      "¿A quién beneficiaba que ese audio íntimo saliera a la luz antes de las campanadas?",
      "¿De quién es la crema de manos de coco y menta?"
    ],
    solution: {
      culpritNameRole: "Elena (La Ex Amiga Traicionada / Papel 4)",
      crimeTime: "23:15",
      keyMethod: "Bajó al sótano con la excusa del vino, forzó el cuadro eléctrico con su horquilla para crear confusión, desbloqueó el teléfono que se sabía de memoria y envió el audio dejando restos de su crema de coco.",
      fullStory:
        "Elena estaba furiosa porque en ese audio la anfitriona revelaba que se había liado con el ex de Elena hace seis meses. Quería humillarla públicamente frente a todos sus amigos y exparejas antes de que empezara el año. Fingió ir a la bodega a por vino a las 23:12, bajó los plomos con su horquilla a las 23:15, subió sigilosamente en la oscuridad, agarró el teléfono de la anfitriona sobre el aparador, envió el audio guardado en favoritos y se frotó las manos con su crema de coco para calmar los nervios.",
      criticalClues: [
        "Usaba las horquillas metálicas exactas encontradas junto a los fusibles.",
        "Se echó crema de manos de coco y menta cinco minutos antes de la cena.",
        "Fue la persona que bajó hacia la bodega en el momento exacto del apagón."
      ]
    },
    dossiersByPlayerCount: adaptRolesForCount([
      {
        roleId: "rol_1",
        roleName: "La Anfitriona & Víctima",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Ainara vio que a Elena le faltaba una horquilla de su recogido."],
        dossier: {
          roleTitle: "La Dueña del Teléfono",
          avatar: "📱",
          isCulprit: false,
          movements: [
            { time: "22:45", place: "Mesa de comedor", detail: "Presidiendo la cena y sirviendo el asado." },
            { time: "23:10", place: "Mesa de comedor", detail: "Dejaste el móvil sobre el aparador junto a la puerta del salón." },
            { time: "23:15", place: "Salón", detail: "Gritaste por el apagón y encendiste una vela con mechero." },
            { time: "23:18", place: "Aparador", detail: "Sonó la alerta masiva de WhatsApp y viste que el mensaje salía de tu propio número." }
          ],
          knownInfo: [
            "El audio era una nota de voz privada donde contabas lo de tu rollo con el ex de Elena.",
            "Solo dos personas conocían el PIN de tu móvil (0404): tu mejor amiga Saray y Elena, que te vio teclearlo por la tarde.",
            "El cuadro eléctrico está en el rellano del sótano justo de camino a la bodega de vinos."
          ],
          secretObjective: "Averigua quién bajó al sótano y quién conocía tu clave de desbloqueo.",
          suspicionNotes: "El móvil nunca salió de la planta baja, quien lo cogió estaba en el salón o pasillo."
        }
      },
      {
        roleId: "rol_2",
        roleName: "La Reina del Brindis",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Saray olió la crema de coco en las manos de Elena al abrazarla en el apagón."],
        dossier: {
          roleTitle: "La Animadora",
          avatar: "🥂",
          isCulprit: false,
          movements: [
            { time: "22:50", place: "Mesa", detail: "Proponiendo juegos de beber y risas." },
            { time: "23:12", place: "Mesa", detail: "Le pediste a Elena que trajera otra botella de Rioja de la bodega." },
            { time: "23:15", place: "Mesa", detail: "En el apagón tiraste una copa de vino sin querer." },
            { time: "23:22", place: "Cocina", detail: "Buscando papel de cocina para limpiar el vino." }
          ],
          knownInfo: [
            "Tú mandaste a Elena a por la botella de vino justo tres minutos antes de que se fuera la luz.",
            "Elena tardó muchísimo en volver y cuando volvió no traía ninguna botella de vino en la mano.",
            "Tú no usas crema de coco porque odias el olor dulce."
          ],
          secretObjective: "Pregúntale a Elena dónde dejó la botella de vino que fue a buscar a la bodega.",
          suspicionNotes: "El hecho de que volviera con las manos vacías demuestra que no fue a por vino."
        }
      },
      {
        roleId: "rol_3",
        roleName: "La Amiga Conciliadora",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Marta recogió la horquilla del suelo y vio que era idéntica a las de Elena."],
        dossier: {
          roleTitle: "La Amante de la Paz",
          avatar: "🕊️",
          isCulprit: false,
          movements: [
            { time: "23:00", place: "Mesa", detail: "Comiendo turrón y charlando con Ainara." },
            { time: "23:15", place: "Junto a la chimenea", detail: "Te quedaste quieta junto al fuego cuando se fue la luz." },
            { time: "23:20", place: "Sótano", detail: "Bajaste con la linterna del móvil y encontraste la horquilla tirada frente al cuadro." },
            { time: "23:28", place: "Salón", detail: "Mostraste la horquilla doblada con restos de rayadura en la chapa." }
          ],
          knownInfo: [
            "La horquilla es de metal negro mate ondulada, exactamente las mismas que Elena compró en el pack de 50 en la farmacia.",
            "Elena llevaba un peinado recogido lleno de esas horquillas.",
            "A Elena le colgaba un mechón suelto en el lado izquierdo después del apagón."
          ],
          secretObjective: "Muestra la horquilla encontrada en el cuadro y compárala con el pelo de Elena.",
          suspicionNotes: "El mechón suelto de Elena es la prueba visual de que se quitó una horquilla."
        }
      },
      {
        roleId: "rol_4",
        roleName: "La Ex Dolida",
        isCulprit: true, // CULPRIT!
        extraCluesIfFewerPlayers: ["Elena tiene el bote de crema de coco en el bolsillo de su jersey."],
        dossier: {
          roleTitle: "La Vengadora Herida (¡ERES LA CULPABLE!)",
          avatar: "💔",
          isCulprit: true,
          movements: [
            { time: "23:10", place: "Mesa", detail: "Te ofreciste con entusiasmo a bajar a por el vino." },
            { time: "23:14", place: "Cuadro de fusibles", detail: "Te quitaste una horquilla del recogido, abriste la caja y bajaste el interruptor general." },
            { time: "23:16", place: "Aparador del salón", detail: "Subiste a gatas en la penumbra, pusiste el PIN 0404, entraste en WhatsApp y reenviaste el audio bomba al grupo masivo." },
            { time: "23:20", place: "Comedor", detail: "Te sentaste de golpe en tu silla fingiendo pánico por la oscuridad." }
          ],
          knownInfo: [
            "Tú filtraste el audio porque no soportabas que Ainara se hubiera acostado con tu ex a tus espaldas.",
            "Te echaste crema de coco en las manos en la mesa y dejaste la marca en la pantalla táctil.",
            "Perdiste la horquilla al doblarla contra el pestillo del cuadro eléctrico.",
            "Puedes culpar a Paula diciendo que ella odia a los ex del grupo y quería reírse de todos."
          ],
          secretObjective: "Siembra sospechas sobre Paula o di que te caíste en la escalera del sótano por culpa del apagón.",
          suspicionNotes: "Justifica que volviste sin la botella diciendo que te dio miedo seguir bajando a oscuras."
        }
      },
      {
        roleId: "rol_5",
        roleName: "La Influencer de TikTok",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Paula estaba grabando un vlog justo en el segundo del apagón."],
        dossier: {
          roleTitle: "La Creadora de Contenido",
          avatar: "📹",
          isCulprit: false,
          movements: [
            { time: "23:05", place: "Salón", detail: "Grabando un vídeo de la mesa decorada para TikTok." },
            { time: "23:15", place: "Salón", detail: "Tu aro de luz se apagó al irse la corriente; tu cámara siguió grabando en modo nocturno." },
            { time: "23:17", place: "Salón", detail: "En tu vídeo nocturno se aprecia una silueta arrastrándose hacia el aparador del teléfono." },
            { time: "23:25", place: "Mesa", detail: "Revisando el clip de vídeo con todas." }
          ],
          knownInfo: [
            "Tu vídeo en modo nocturno captó que la silueta que se acercó al aparador llevaba un jersey de lana con mangas anchas acampanadas.",
            "Elena era la única vestida con un jersey de mangas acampanadas de punto grueso.",
            "Tú estuviste de pie frente al trípode todo el tiempo."
          ],
          secretObjective: "Enseña el vídeo en modo noche que delata la silueta del jersey con mangas acampanadas de Elena.",
          suspicionNotes: "Las mangas acampanadas eliminan cualquier otra sospechosa."
        }
      },
      {
        roleId: "rol_6",
        roleName: "La Chef de la Nochevieja",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Lucía vio el bote de crema de coco sobre el plato de Elena."],
        dossier: {
          roleTitle: "La Cocinera",
          avatar: "👩‍🍳",
          isCulprit: false,
          movements: [
            { time: "22:50", place: "Cocina", detail: "Vigilando el asado en el horno eléctrico." },
            { time: "23:15", place: "Cocina", detail: "Maldijiste en voz alta porque el horno se apagó a mitad de cocción." },
            { time: "23:20", place: "Salón", detail: "Saliste con una vela exigiendo saber quién había tocado los plomos." },
            { time: "23:30", place: "Cocina", detail: "Intentando salvar el postre." }
          ],
          knownInfo: [
            "El horno consume mucha potencia pero el limitador no saltó: fue el diferencial manual el que se accionó.",
            "Elena te pidió prestado el delantal a las 23:00 y olía intensamente a coco.",
            "Tú tenías las manos llenas de harina y aceite, imposible haber tocado la pantalla del móvil sin pringarla de comida."
          ],
          secretObjective: "Explica la diferencia técnica entre que salte el automático por sobrecarga o que alguien baje la palanca aposta.",
          suspicionNotes: "El sabotaje fue manual e intencionado, no un fallo eléctrico por cocinar."
        }
      },
      {
        roleId: "rol_7",
        roleName: "La Experta en Redes",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Claudia comprobó la sesión de WhatsApp Web y vio que se envió desde el móvil local."],
        dossier: {
          roleTitle: "La Especialista Digital",
          avatar: "💻",
          isCulprit: false,
          movements: [
            { time: "23:00", place: "Mesa", detail: "Programando las felicitaciones de fin de año en su teléfono." },
            { time: "23:15", place: "Mesa", detail: "Activaste los datos móviles cuando se cayó el wifi por el apagón." },
            { time: "23:18", place: "Mesa", detail: "Fuiste la primera en abrir el audio en el grupo y alertar a todas." },
            { time: "23:25", place: "Aparador", detail: "Inspeccionaste el teléfono de la anfitriona y viste el rastro de crema aromática." }
          ],
          knownInfo: [
            "El mensaje fue enviado directamente desde la app nativa de WhatsApp en ese mismo aparato a las 23:16.",
            "No fue un hackeo remoto ni un virus: alguien puso el código PIN con dedos llenos de crema.",
            "Elena no tenía el móvil en la mano porque lo había dejado cargando en la planta alta."
          ],
          secretObjective: "Demuestra que el mensaje se envió de forma física con el móvil desbloqueado a mano a las 23:16.",
          suspicionNotes: "Cierra la posibilidad de un ataque informático externo."
        }
      }
    ])
  },

  // ==========================================
  // CASO 7: RETIRO GLAMOUR EN MARBELLA
  // ==========================================
  {
    id: 7,
    slug: "retiro-marbella",
    title: "El Spa de Lujo en Marbella",
    subtitle: "El frasco de la fórmula cosmética millonaria sustraído de la suite",
    category: "Lujo & Espionaje",
    emoji: "🧖‍♀️",
    location: "Villa Termal & Spa, Puerto Banús (Marbella)",
    incidentTime: "A las 16:30 durante el circuito de aguas",
    synopsis:
      "Una de las amigas, creadora de una línea de cosmética de lujo a punto de venderse a una multinacional por dos millones de euros, guarda el frasco prototipo con la fórmula botánica secreta en la caja refrigerada de su suite privada. A las 17:00 el frasco ha desaparecido.",
    publicTimeline: [
      { time: "15:30", description: "Empieza la sesión privada de sauna y baño turco para el grupo.", location: "Zona Termas" },
      { time: "16:15", description: "Se apagan las luces del baño turco para la sesión de aromaterapia.", location: "Baño Turco" },
      { time: "16:30", description: "Una silueta en albornoz blanco sube por la escalera del spa a las suites.", location: "Escalera Suites" },
      { time: "16:45", description: "Se escucha un pitido breve de alarma de temperatura de la nevera.", location: "Suite 101" },
      { time: "17:05", description: "La anfitriona sube a cambiarse y descubre la nevera abierta y sin el frasco.", location: "Suite 101" }
    ],
    progressiveClues: [
      {
        minute: 3,
        title: "La Toalla con Restos de Eucalipto y Escarcha",
        badge: "PRUEBA 1 · MIN 3",
        description: "En el cesto de ropa sucia del vestíbulo de la suite aparece una toalla enrollada con restos de escarcha de nitrógeno líquido y perfume de eucalipto del baño turco.",
        impactQuestion: "¿Quién salió del baño turco empapada en esencia de eucalipto a las 16:25?"
      },
      {
        minute: 6,
        title: "El Sobre de Fedex Internacional en la Maleta",
        badge: "PRUEBA 2 · MIN 6",
        description: "En la papelera del pasillo aparece un albarán de recogida express de mensajería con destino a un laboratorio farmacéutico suizo programado para esa misma tarde a las 18:00.",
        impactQuestion: "¿Quién tiene familia o contactos directos en Ginebra (Suiza)?"
      }
    ],
    interrogationQuestions: [
      "¿Quién salió de la sesión de aromaterapia antes de que terminara a las 16:40?",
      "¿Quién sabía que la fórmula requería refrigeración especial para no degradarse?",
      "¿Quién reservó el envío urgente a Suiza?",
      "¿Quién tenía deudas con inversores o una marca competidora?"
    ],
    solution: {
      culpritNameRole: "Saray (La Amiga Química / Papel 2)",
      crimeTime: "16:30",
      keyMethod: "Salió del baño turco con la excusa del mareo por calor, subió en albornoz a la suite 101, envolvió el frasco en una toalla para no quemarse con la escarcha criogénica y lo escondió en su neceser para mandarlo a Suiza.",
      fullStory:
        "Saray había trabajado en el equipo inicial del laboratorio pero se sentía estafada con el porcentaje acordado en la venta a la multinacional. Un laboratorio suizo le ofreció 300.000 € bajo cuerda si les entregaba la muestra activa antes de la firma oficial. A las 16:25 fingió un mareo en el baño turco cargado de eucalipto, subió a la suite 101, abrió la nevera criogénica envolviendo el bote en una toalla, lo ocultó en su equipaje y preparó el albarán de Fedex para entregarlo al mensajero en la recepción.",
      criticalClues: [
        "Olía fuertemente a eucalipto tras regresar del supuesto 'mareo'.",
        "Tenía en su poder el albarán con destino al laboratorio en Ginebra.",
        "Tiene conocimientos avanzados de química para saber cómo conservar la fórmula."
      ]
    },
    dossiersByPlayerCount: adaptRolesForCount([
      {
        roleId: "rol_1",
        roleName: "La Empresaria Cosmética",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Ainara vio que Saray tenía el ticket de mensajería de Fedex en la mano."],
        dossier: {
          roleTitle: "La Creadora de la Fórmula",
          avatar: "🧪",
          isCulprit: false,
          movements: [
            { time: "15:30", place: "Piscina hidrotermal", detail: "Relajándote con Paula y charlando sobre la venta de la empresa." },
            { time: "16:15", place: "Baño turco", detail: "Entraste a la sesión de aromaterapia con eucalipto." },
            { time: "16:45", place: "Tumbonas de relax", detail: "Bebiendo té verde hasta las 17:00." },
            { time: "17:05", place: "Suite 101", detail: "Subiste a vestirte y la nevera criogénica estaba a cero grados pero vacía." }
          ],
          knownInfo: [
            "La fórmula vale 2 millones de euros si el frasco prototipo se analiza intacto este lunes.",
            "Solo Saray sabía exactamente a qué temperatura exacta se conserva el compuesto activo.",
            "Saray te miraba con rencor cuando celebrasteis la oferta de compra."
          ],
          secretObjective: "Pregunta a Saray por sus contactos en Suiza y su conocimiento de la temperatura criogénica.",
          suspicionNotes: "Nadie más en el grupo tiene formación en bioquímica."
        }
      },
      {
        roleId: "rol_2",
        roleName: "La Socia Científica",
        isCulprit: true, // CULPRIT!
        extraCluesIfFewerPlayers: ["Saray tiene el frasco envuelto en una bolsa térmica dentro de su maleta."],
        dossier: {
          roleTitle: "La Química Ambiciosa (¡ERES LA CULPABLE!)",
          avatar: "🧴",
          isCulprit: true,
          movements: [
            { time: "16:15", place: "Baño turco", detail: "Entraste con las demás y te empapaste de aceite de eucalipto." },
            { time: "16:25", place: "Salida del spa", detail: "Dijiste que la tensión te había bajado y que ibas a tumbarte a la sala fría." },
            { time: "16:35", place: "Suite 101", detail: "Entraste con la llave de repuesto, abriste la nevera, envolviste el frasco en una toalla para evitar la quemadura por frío y lo metiste en tu bolsa térmica." },
            { time: "16:50", place: "Recepción", detail: "Preguntaste al conserje a qué hora pasaba la furgoneta de Fedex Express." }
          ],
          knownInfo: [
            "Tú tienes el frasco escondido en tu maleta dentro de una bolsa hermética con gel frío.",
            "Tiraste el albarán de Fedex en la papelera del pasillo creyendo que nadie lo miraría.",
            "Tus manos olían intensamente a eucalipto porque saliste directamente del baño turco a robar la fórmula.",
            "Puedes culpar a Marta diciendo que ella tiene una tienda de estética y quería copiar los ingredientes."
          ],
          secretObjective: "Asegura que estuviste en la sala de hielo recuperándote del mareo y culpa a Marta.",
          suspicionNotes: "Si preguntan por el albarán, di que era para enviar unos zapatos que olvidaste en casa."
        }
      },
      {
        roleId: "rol_3",
        roleName: "La Terapeuta Holística",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Marta vio a Saray salir de la suite 101 con la bolsa térmica a las 16:42."],
        dossier: {
          roleTitle: "La Amante del Bienestar",
          avatar: "🌿",
          isCulprit: false,
          movements: [
            { time: "15:45", place: "Sauna finlandesa", detail: "Haciendo ejercicios de respiración consciente." },
            { time: "16:15", place: "Baño turco", detail: "Echaste las gotas de aceite puro de eucalipto al difusor de vapor." },
            { time: "16:35", place: "Pasillo central", detail: "Fuiste a pedir más agua de limón y te cruzaste con una persona que subía en albornoz a la 1ª planta." },
            { time: "17:00", place: "Piscina exterior", detail: "Esperando para la clase de yoga." }
          ],
          knownInfo: [
            "La persona que subió la escalera a las 16:30 dejaba un olor concentrado a eucalipto idéntico al del difusor.",
            "Saray fue la única que salió del baño turco en ese momento.",
            "Tú sabes que la sala fría estaba vacía a las 16:30 porque fuiste a comprobar el termostato."
          ],
          secretObjective: "Desmiente que Saray estuviera en la sala fría a las 16:30.",
          suspicionNotes: "El hecho de que la sala fría estuviera vacía desmonta la coartada de Saray."
        }
      },
      {
        roleId: "rol_4",
        roleName: "La Influencer de Belleza",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Paula vio a Saray hablando con el mensajero en la puerta a las 16:55."],
        dossier: {
          roleTitle: "La Embajadora de Marcas",
          avatar: "💄",
          isCulprit: false,
          movements: [
            { time: "16:00", place: "Piscina climatizada", detail: "Grabando historias sobre el retiro de lujo en Marbella." },
            { time: "16:30", place: "Recepción del spa", detail: "Tomando una infusión détox y revisando tus estadísticas." },
            { time: "16:52", place: "Lobby", detail: "Viste a Saray en el mostrador preguntando nerviosa por la recogida de mensajería internacional." },
            { time: "17:10", place: "Suite 101", detail: "Subiste alertada por la anfitriona." }
          ],
          knownInfo: [
            "Viste que Saray llevaba un sobre de Fedex con una etiqueta morada de 'Priority International Express'.",
            "Saray no llevaba el pelo mojado del spa, se lo había secado a toda prisa.",
            "Tú no sabías nada de la fórmula secreta porque solo te encargas del marketing exterior."
          ],
          secretObjective: "Testifica que viste a Saray con el sobre de Fedex Priority en recepción a las 16:52.",
          suspicionNotes: "El sobre internacional confirma la pista del albarán de Suiza."
        }
      },
      {
        roleId: "rol_5",
        roleName: "La Inversora Financiera",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Elena revisó el buzón de la suite y encontró la toalla con escarcha."],
        dossier: {
          roleTitle: "La Analista de Riesgos",
          avatar: "📈",
          isCulprit: false,
          movements: [
            { time: "15:30", place: "Hamacas", detail: "Revisando el contrato de venta con los abogados por teléfono." },
            { time: "16:20", place: "Terraza solarium", detail: "Tomando el sol y contestando emails de inversión." },
            { time: "16:45", place: "Pasillo suites", detail: "Escuchaste el pitido de la nevera de la suite 101 al pasar hacia el baño." },
            { time: "17:05", place: "Suite 101", detail: "Ayudaste a buscar el frasco en todos los armarios." }
          ],
          knownInfo: [
            "El pitido de las 16:45 se produce cuando la puerta criogénica queda abierta más de 60 segundos.",
            "Saray se quejó amargamente ayer de que el 5% que le tocaba de la venta era una miseria comparado con el trabajo que hizo.",
            "Tú cobras el 15% de comisión si la venta se cierra con éxito: te convenía al 100% que la fórmula estuviera a salvo."
          ],
          secretObjective: "Destaca el motivo económico y el rencor de Saray con el reparto de la venta.",
          suspicionNotes: "El rencor laboral y económico es la prueba del móvil del crimen."
        }
      },
      {
        roleId: "rol_6",
        roleName: "La Asistente Personal",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Lucía tiene la lista de quién pidió toallas adicionales en la suite."],
        dossier: {
          roleTitle: "La Secretaria Eficiente",
          avatar: "📑",
          isCulprit: false,
          movements: [
            { time: "15:40", place: "Recepción", detail: "Pagando los suplementos del spa y reservando la cena." },
            { time: "16:15", place: "Vestuarios", detail: "Guardando los albornoces limpios en las taquillas." },
            { time: "16:40", place: "Escalera", detail: "Viste una toalla con manchas azuladas en el cesto sucio que olía a químicos criogénicos." },
            { time: "17:05", place: "Suite 101", detail: "Comprobaste la cerradura de la nevera." }
          ],
          knownInfo: [
            "La toalla criogénica tenía restos de escarcha azulada que solo genera ese modelo específico de nevera.",
            "Saray tenía las llaves maestras de las habitaciones porque se ofreció a organizar las maletas por la mañana.",
            "Tú estabas con el recepcionista hablando de la reserva del restaurante de las 16:10 a las 16:30."
          ],
          secretObjective: "Aporta el testimonio de la toalla con restos criogénicos y la llave maestra en manos de Saray.",
          suspicionNotes: "Saray era la única que tenía acceso sin forzar la puerta."
        }
      },
      {
        roleId: "rol_7",
        roleName: "La Masajista Invitada",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Claudia olió el vapor de eucalipto en la ropa de calle de Saray."],
        dossier: {
          roleTitle: "La Fisioterapeuta",
          avatar: "💆‍♀️",
          isCulprit: false,
          movements: [
            { time: "15:30", place: "Cabina 2", detail: "Dando un masaje descontracturante en la espalda a Ainara." },
            { time: "16:20", place: "Sala de descanso", detail: "Tomando un té de menta y estirando los brazos." },
            { time: "16:45", place: "Cabina 2", detail: "Limpiando los aceites y toallas de la camilla." },
            { time: "17:10", place: "Lobby", detail: "Te enteraste de la desaparición del frasco." }
          ],
          knownInfo: [
            "Ainara estuvo tumbada en tu camilla boca abajo recibiendo masaje hasta las 16:10, es imposible que fuera ella.",
            "Viste a Saray pasar por delante de tu cabina a las 16:28 casi corriendo en albornoz.",
            "Saray no tenía cara de enferma ni de mareada: iba muy decidida y mirando a los lados."
          ],
          secretObjective: "Confirma que Saray no parecía mareada en absoluto a las 16:28.",
          suspicionNotes: "El falso mareo queda desenmascarado por la masajista."
        }
      }
    ])
  },

  // ==========================================
  // CASO 8: FIN DE SEMANA EN LONDRES
  // ==========================================
  {
    id: 8,
    slug: "fin-semana-londres",
    title: "Fin de Semana en Londres",
    subtitle: "El cargo de 3.500 € en la tarjeta compartida en Harrods",
    category: "Compras & Fraude",
    emoji: "🛍️",
    location: "Hotel Savoy & Grandes Almacenes Harrods (Londres)",
    incidentTime: "A las 16:15 en la sección de joyería y bolsos de lujo",
    synopsis:
      "Durante una escapada de compras navideñas en Londres, el banco emite una alerta urgente: alguien ha realizado un cargo de 3.500 £ (4.100 €) en la tarjeta de crédito conjunta que el grupo abrió para gastos comunes de hoteles y vuelos.",
    publicTimeline: [
      { time: "15:00", description: "El grupo se separa en la planta baja de Harrods para compras libres.", location: "Harrods Ground Floor" },
      { time: "16:15", description: "Se procesa el pago de 3.500 £ en la boutique de Chanel de la 1ª planta.", location: "Chanel Harrods" },
      { time: "16:22", description: "Llega la notificación SMS al teléfono móvil de la administradora de la tarjeta.", location: "Móvil Administradora" },
      { time: "16:45", description: "El grupo se reúne de emergencia en el Salón de Té del 4º piso.", location: "Tea Room Harrods" },
      { time: "17:15", description: "Seguridad de la tienda revisa el ticket de compra con firma manuscrita.", location: "Atención al Cliente" }
    ],
    progressiveClues: [
      {
        minute: 3,
        title: "La Bolsa Negra de Chanel en la Consigna",
        badge: "PRUEBA 1 · MIN 3",
        description: "En el guardarropa de abrigos de Harrods hay depositada una bolsa negra con un bolso de piel acolchado con el ticket de 3.500 £ pagado con la tarjeta común a las 16:15.",
        impactQuestion: "¿Quién tiene la ficha número 73 del guardarropa en su cartera?"
      },
      {
        minute: 6,
        title: "El Perfume Chanel Nº5 de Muestra en el Bolsillo",
        badge: "PRUEBA 2 · MIN 6",
        description: "Junto al bolso comprado de Chanel regalaron un frasquito de muestra exclusivo de Chanel Nº5 que solo se entrega a quien realiza compras superiores a 3.000 £ hoy.",
        impactQuestion: "¿Quién lleva ese frasquito de muestra dorado en el bolsillo de su abrigo?"
      }
    ],
    interrogationQuestions: [
      "¿Dónde estuvo cada una exactamente entre las 16:00 y las 16:30?",
      "¿Quién tenía en mano la tarjeta física del fondo común?",
      "¿De quién es la ficha 73 del guardarropa?",
      "¿Quién tiene la muestra de perfume exclusiva de Chanel en su bolsillo?"
    ],
    solution: {
      culpritNameRole: "Marta (La Adicta a las Marcas / Papel 3)",
      crimeTime: "16:15",
      keyMethod: "Se quedó con la tarjeta física diciendo que pagaría la cuenta del té por adelantado, fue a Chanel, compró el bolso de sus sueños, lo dejó en la consigna con la ficha 73 y se guardó la muestra de regalo.",
      fullStory:
        "Marta estaba obsesionada con tener el bolso clásico de Chanel antes de regresar a España pero no tenía saldo en sus tarjetas personales por exceso de deudas. Aprovechó que le tocaba custodiar la tarjeta común para pagar el té, subió a la boutique a las 16:10, pagó los 3.500 £ imitando una firma rápida, guardó la bolsa en el guardarropa con la ficha 73 para que nadie la viera con ella y bajó a reunirse con las demás disimulando.",
      criticalClues: [
        "Tiene la ficha número 73 del guardarropa en su bolso.",
        "Tiene la muestra exclusiva dorada de Chanel Nº5 en el bolsillo de su abrigo.",
        "Nadie la vio en ninguna otra tienda entre las 16:05 y las 16:35."
      ]
    },
    dossiersByPlayerCount: adaptRolesForCount([
      {
        roleId: "rol_1",
        roleName: "La Administradora de la Tarjeta",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Ainara vio que Marta tenía la muestra dorada en el bolsillo."],
        dossier: {
          roleTitle: "La Titular de la Cuenta",
          avatar: "💳",
          isCulprit: false,
          movements: [
            { time: "15:10", place: "Sección perfumería", detail: "Comprando cremas faciales con tu dinero personal." },
            { time: "16:00", place: "Librería Harrods", detail: "Mirando libros de decoración y arte." },
            { time: "16:22", place: "Pasillo central", detail: "Te vibró el móvil con el SMS: 'Cargo de 3.500£ en Chanel Boutique'." },
            { time: "16:45", place: "Salón de té", detail: "Convocaste a todas gritando furiosa por la estafa." }
          ],
          knownInfo: [
            "Le diste la tarjeta física a Marta a las 15:45 porque ella dijo que subiría al salón de té a dejar la fianza de la mesa.",
            "La tarjeta requiere PIN para pagos de más de 100£ salvo si se firma en caja como tarjeta turística española.",
            "Tú jamás autorizaste comprar ningún bolso con el fondo del grupo."
          ],
          secretObjective: "Pregúntale a Marta por qué tardó tanto en reservar la mesa del té y dónde dejó la tarjeta física.",
          suspicionNotes: "Marta tenía la tarjeta en su poder en el minuto exacto del cargo (16:15)."
        }
      },
      {
        roleId: "rol_2",
        roleName: "La Buscadora de Gangas",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Saray vio a Marta salir de la boutique de Chanel a las 16:20."],
        dossier: {
          roleTitle: "La Cazadora de Ofertas",
          avatar: "🏷️",
          isCulprit: false,
          movements: [
            { time: "15:20", place: "Planta sótano", detail: "Revisando souvenirs y tés ingleses rebajados." },
            { time: "16:10", place: "Escaleras mecánicas egipcias", detail: "Subiendo hacia la 2ª planta." },
            { time: "16:20", place: "Paso frente a Chanel", detail: "Viste a Marta salir de la boutique de Chanel recogiendo un ticket largo de compra." },
            { time: "16:45", place: "Salón de té", detail: "Llegaste a la reunión de emergencia." }
          ],
          knownInfo: [
            "Viste a Marta salir de Chanel a las 16:20 mirando nerviosa a ambos lados.",
            "Marta caminaba hacia el guardarropa central de la 1ª planta.",
            "Tú compraste una caja de té de 12£ con tu tarjeta y tienes el recibo horario."
          ],
          secretObjective: "Testifica que viste a Marta saliendo de Chanel a las 16:20 con el recibo.",
          suspicionNotes: "El testimonio visual en la puerta de la boutique sitúa a Marta en la escena."
        }
      },
      {
        roleId: "rol_3",
        roleName: "La Fashion Victim",
        isCulprit: true, // CULPRIT!
        extraCluesIfFewerPlayers: ["Marta tiene la ficha de consigna 73 escondida en el tarjetero."],
        dossier: {
          roleTitle: "La Caprichosa (¡ERES LA CULPABLE!)",
          avatar: "👜",
          isCulprit: true,
          movements: [
            { time: "15:45", place: "Ascensor", detail: "Cogiste la tarjeta común con la excusa de la fianza del té." },
            { time: "16:10", place: "Boutique Chanel", detail: "Pediste el bolso negro clásico acolchado y firmaste el voucher de 3.500 £ con garabato ilegible." },
            { time: "16:25", place: "Guardarropa", detail: "Dejaste la bolsa de Chanel en el guardarropa y te dieron la ficha metálica 73." },
            { time: "16:40", place: "Salón de té", detail: "Llegaste fingiendo que te habías perdido en la sección de zapatería." }
          ],
          knownInfo: [
            "Tú compraste el bolso de 3.500 £ con la tarjeta de todas porque tu banco te había denegado el crédito.",
            "Pensabas devolver el dinero en tres meses sin que nadie supiera quién fue.",
            "Llevas la ficha número 73 escondida en tu tarjetero y la miniatura dorada de perfume en el bolsillo.",
            "Puedes culpar a Paula diciendo que ella estuvo hablando de ese mismo bolso ayer en el avión."
          ],
          secretObjective: "Desvía la atención hacia Paula o di que la tarjeta común fue clonada por internet.",
          suspicionNotes: "Si encuentran la miniatura de perfume, di que te la regalaron en la planta baja por probar una crema."
        }
      },
      {
        roleId: "rol_4",
        roleName: "La Ahorradora Estricta",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Paula le pidió la tarjeta a Marta a las 16:30 y Marta se la dio temblando."],
        dossier: {
          roleTitle: "La Contable del Grupo",
          avatar: "📊",
          isCulprit: false,
          movements: [
            { time: "15:15", place: "Sección de papelería", detail: "Mirando libretas y bolígrafos ingleses." },
            { time: "16:05", place: "Planta de caballeros", detail: "Comprando una bufanda para tu hermano con tu dinero." },
            { time: "16:30", place: "Frente al salón de té", detail: "Te encontraste con Marta y le pediste la tarjeta común para guardarla; te la dio fría y temblorosa." },
            { time: "16:45", place: "Salón de té", detail: "Comprobaste en la app del banco que el cargo se hizo a las 16:15." }
          ],
          knownInfo: [
            "Marta tenía la tarjeta común en la mano a las 16:30.",
            "Marta no había reservado ninguna mesa de té: el metre te dijo que nadie había pagado ninguna fianza previa.",
            "Marta mintió descaradamente sobre para qué quería la tarjeta."
          ],
          secretObjective: "Demuestra que la fianza del té era una mentira total: el metre lo desmiente.",
          suspicionNotes: "La mentira de la reserva de la mesa desmonta su motivo para tener la tarjeta."
        }
      },
      {
        roleId: "rol_5",
        roleName: "La Modelo de Instagram",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Elena vio a Marta meterse algo dorado en el bolsillo del abrigo a las 16:28."],
        dossier: {
          roleTitle: "La Creadora Visual",
          avatar: "📸",
          isCulprit: false,
          movements: [
            { time: "15:30", place: "Escalera Egipcia", detail: "Haciendo fotos estéticas para tu muro." },
            { time: "16:15", place: "Sección de sombreros", detail: "Probándote boinas inglesas frente a los espejos." },
            { time: "16:28", place: "Pasillo guardarropa", detail: "Viste a Marta guardar una ficha redonda en su tarjetero y un tubito dorado en su abrigo." },
            { time: "16:50", place: "Salón de té", detail: "Llegaste y viste la crisis de la tarjeta." }
          ],
          knownInfo: [
            "Viste el tubito dorado que Marta se guardó en el abrigo a las 16:28.",
            "Ese tubito dorado es el envase exclusivo de la muestra de perfume Chanel Nº5 de edición limitada.",
            "Solo lo entregan en mano a clientes VIP que compran en la boutique."
          ],
          secretObjective: "Pide que Marta enseñe lo que tiene guardado en el bolsillo del abrigo.",
          suspicionNotes: "El tubito dorado es la prueba material que vincula a Marta con la compra."
        }
      },
      {
        roleId: "rol_6",
        roleName: "La Abogada Mercantil",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Lucía habló con la dependienta de Chanel que atendió a Marta."],
        dossier: {
          roleTitle: "La Legalista",
          avatar: "⚖️",
          isCulprit: false,
          movements: [
            { time: "15:30", place: "Cafetería de la 3ª planta", detail: "Tomando un café solo y contestando mensajes del bufete." },
            { time: "16:25", place: "Pasillo central", detail: "Caminando hacia el punto de encuentro." },
            { time: "17:00", place: "Atención al Cliente Harrods", detail: "Acompañaste a Ainara a pedir la copia del ticket firmado en Chanel." },
            { time: "17:15", place: "Boutique Chanel", detail: "La dependienta te confirmó que la clienta dejó la bolsa en la consigna con la ficha 73." }
          ],
          knownInfo: [
            "La dependienta de Chanel describió que la compradora llevaba un abrigo camel y bufanda de cuadros.",
            "Marta era la única vestida con abrigo camel y bufanda de cuadros.",
            "El ticket tiene el código de consigna 'CLOAK-73' impreso en el dorso."
          ],
          secretObjective: "Muestra el código de consigna CLOAK-73 y exige ver los bolsillos del abrigo camel.",
          suspicionNotes: "La ropa y el ticket de consigna cierran el caso sin escapatoria."
        }
      },
      {
        roleId: "rol_7",
        roleName: "La Traductora Bilingüe",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Claudia tradujo la conversación con el personal de seguridad de Harrods."],
        dossier: {
          roleTitle: "La Intérprete",
          avatar: "🇬🇧",
          isCulprit: false,
          movements: [
            { time: "15:15", place: "Librería Waterstones cercana", detail: "Comprando revistas de diseño británicas." },
            { time: "16:10", place: "Entrada principal Harrods", detail: "Entrando de nuevo al edificio pasando el arco de seguridad." },
            { time: "16:45", place: "Salón de té", detail: "Llegaste justo cuando Ainara mostraba el SMS de la estafa." },
            { time: "17:10", place: "Seguridad", detail: "Hablaste en inglés con el jefe de planta de Harrods." }
          ],
          knownInfo: [
            "El jefe de seguridad te mostró en pantalla la foto de la chica en caja pagando con la tarjeta.",
            "La chica de la pantalla tiene el peinado de media melena castaña idéntico al de Marta.",
            "Tú acababas de entrar por la puerta principal a las 16:10, tienes la grabación del acceso de seguridad exterior."
          ],
          secretObjective: "Confirma que la imagen de la cámara de seguridad de caja corresponde a la media melena castaña de Marta.",
          suspicionNotes: "La grabación de las cámaras despeja cualquier duda sobre la identidad de la compradora."
        }
      }
    ])
  },

  // ==========================================
  // CASO 9: DESPEDIDA EN MYKONOS
  // ==========================================
  {
    id: 9,
    slug: "despedida-mykonos",
    title: "Despedida en Mykonos",
    subtitle: "El beso prohibido con el barman y la cámara polaroid escondida",
    category: "Gossip & Pasión",
    emoji: "🇬🇷",
    location: "Beach Club Cavo Paradiso, Mykonos (Grecia)",
    incidentTime: "A las 03:00 en la piscina privada del reservado",
    synopsis:
      "En plena despedida de soltera, la prometida o una de las amigas se besa apasionadamente con el atractivo barman griego en una esquina oscura de la piscina. Alguien tomó una foto Polaroid instantánea del beso. A las 03:30, la cámara Polaroid y la fotografía han sido robadas de la mesa para evitar que el secreto salga a la luz antes de la boda.",
    publicTimeline: [
      { time: "02:00", description: "El grupo alquila la zona VIP con camas balinesas junto a la piscina.", location: "Cama Balinesa 1" },
      { time: "02:45", description: "La cámara Polaroid queda sobre la mesa del reservado tras hacer fotos del grupo.", location: "Mesa VIP" },
      { time: "03:00", description: "Ocurre el beso prohibido en la zona oscura de los olivos de la piscina.", location: "Zona Olivos" },
      { time: "03:10", description: "El flash característico de la Polaroid ilumina la arboleda.", location: "Zona Olivos" },
      { time: "03:30", description: "La dueña de la cámara va a buscar la foto y descubre que la cámara y la foto han desaparecido.", location: "Mesa VIP" }
    ],
    progressiveClues: [
      {
        minute: 3,
        title: "El Cartucho de Papel Fotográfico en la Maceta",
        badge: "PRUEBA 1 · MIN 3",
        description: "En el fondo de una tinaja de barro aparece el envoltorio de aluminio negro del cartucho de fotos instantáneas con restos de crema solar brillante con olor a mango.",
        impactQuestion: "¿Quién se embadurnó de crema con purpurina y olor a mango antes de salir de fiesta?"
      },
      {
        minute: 6,
        title: "La Toalla de Playa Azul Empapada",
        badge: "PRUEBA 2 · MIN 6",
        description: "Bajo la tumbona de una de las amigas hay enrollada una toalla azul turquesa mojada que oculta en su interior la cámara Polaroid sin el carrete de fotos.",
        impactQuestion: "¿Quién pidió esa toalla azul turquesa al camarero del club a las 03:15?"
      }
    ],
    interrogationQuestions: [
      "¿Quién estuvo cerca de los olivos a las 03:00 cuando ocurrió el beso?",
      "¿Quién vio dispararse el flash a las 03:10?",
      "¿Quién tenía crema con purpurina y aroma a mango?",
      "¿De quién es la toalla azul donde apareció la cámara escondida?"
    ],
    solution: {
      culpritNameRole: "Paula (La Amiga que Besó al Barman / Papel 4)",
      crimeTime: "03:15",
      keyMethod: "Fue ella quien besó al barman; al ver el flash a las 03:10 entró en pánico de que la foto arruinara su relación formal en España, robó la cámara de la mesa, extrajo la foto comprometedora y la escondió en la toalla azul.",
      fullStory:
        "Paula tiene pareja formal en Madrid pero tras varias copas de tequila no pudo resistirse al barman griego en los olivos. Cuando vio que alguien disparó un flash Polaroid a las 03:10, supo que su vida se arruinaría si esa foto circulaba. Fue a la mesa a las 03:15, cogió la cámara Polaroid dejando el rastro de su crema de mango, arrancó la foto para quemarla o romperla, y escondió la cámara en la toalla azul que había pedido al camarero para que nadie pudiera volver a hacer fotos.",
      criticalClues: [
        "Llevaba la crema corporal con brillo y fragancia de mango inconfundible.",
        "Pidió personalmente la toalla azul en la que se encontró la cámara.",
        "Tenía marcas de pintalabios en el cuello de su propia copa idénticas a las del barman."
      ]
    },
    dossiersByPlayerCount: adaptRolesForCount([
      {
        roleId: "rol_1",
        roleName: "La Futura Novia",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Ainara vio que Paula tenía restos de purpurina de mango en las manos."],
        dossier: {
          roleTitle: "La Novia Celebrada",
          avatar: "👰‍♀️",
          isCulprit: false,
          movements: [
            { time: "02:15", place: "Pista central", detail: "Bailando con tu velo de novia puesto y chupito en mano." },
            { time: "02:50", place: "Cama balinesa", detail: "Descansando y bebiendo agua mineral con gas." },
            { time: "03:10", place: "Piscina", detail: "Viste el fogonazo blanco del flash entre los olivos pero pensaste que eran fuegos artificiales." },
            { time: "03:30", place: "Mesa VIP", detail: "Fuiste a ver las fotos Polaroid de tu despedida y la cámara no estaba." }
          ],
          knownInfo: [
            "Tú estuviste en la cama balinesa hablando con Elena de 02:45 a 03:20 sin levantarte.",
            "La cámara era tuya, un regalo de tu prometido para guardar recuerdos de la despedida.",
            "Tú jamás te besaste con el barman: estás profundamente enamorada de tu prometido."
          ],
          secretObjective: "Aclara que tú estuviste en la cama balinesa y exige saber quién fue la del beso y quién robó tu cámara.",
          suspicionNotes: "Elena puede corroborar tu presencia permanente en la cama balinesa."
        }
      },
      {
        roleId: "rol_2",
        roleName: "La Fotógrafa de la Despedida",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Saray vio a Paula acercarse a la mesa a las 03:15 a por la cámara."],
        dossier: {
          roleTitle: "La Cazadora de Momentos",
          avatar: "📸",
          isCulprit: false,
          movements: [
            { time: "02:30", place: "Zona de fotos", detail: "Haciendo fotos polaroid a todas las amigas con accesorios graciosos." },
            { time: "03:00", place: "Paseo junto a los olivos", detail: "Paseabas para buscar aire fresco y viste a dos personas besándose apasionadamente contra un árbol." },
            { time: "03:10", place: "Zona olivos", detail: "Disparaste la cámara para gastar una broma sin saber quién era hasta que el flash reveló la cara de Paula." },
            { time: "03:25", place: "Mesa VIP", detail: "Dejaste la cámara un minuto en la mesa para ir a pedir una copa y cuando volviste ya no estaba." }
          ],
          knownInfo: [
            "TÚ DISPARASTE LA FOTO A LAS 03:10: Viste claramente que era Paula besando al barman griego.",
            "Paula te miró con ojos de terror absoluto cuando saltó el flash.",
            "Dejaste la cámara en la mesa a las 03:14 y a las 03:16 ya había desaparecido."
          ],
          secretObjective: "Revela la verdad: fuiste tú quien hizo la foto y viste a Paula besando al barman.",
          suspicionNotes: "Tu testimonio de primera mano como autora de la foto es demoledor."
        }
      },
      {
        roleId: "rol_3",
        roleName: "La Reina del Tequila",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Marta olió la crema de mango en la toalla azul donde estaba la cámara."],
        dossier: {
          roleTitle: "La Fiestera Desatada",
          avatar: "🍹",
          isCulprit: false,
          movements: [
            { time: "02:00", place: "Barra principal", detail: "Pidiendo la ronda de chupitos de tequila con sal y lima." },
            { time: "03:05", place: "Baños VIP", detail: "Retocándote el pelo con Saray." },
            { time: "03:15", place: "Pasillo de toallas", detail: "Viste a Paula pedirle al chico del servicio una toalla azul turquesa grande." },
            { time: "03:35", place: "Mesa", detail: "Buscando la cámara para seguir haciéndoos fotos." }
          ],
          knownInfo: [
            "Viste a Paula pedir la toalla azul turquesa al empleado del club a las 03:15 con prisas.",
            "Paula tenía las mejillas rojas y no paraba de mirar hacia atrás.",
            "Tú estabas con Saray en los baños a la hora exacta del beso."
          ],
          secretObjective: "Confirma que Paula pidió la toalla azul turquesa donde apareció la cámara.",
          suspicionNotes: "El registro del empleado confirma que la toalla fue entregada a Paula."
        }
      },
      {
        roleId: "rol_4",
        roleName: "La Amiga Comprometida",
        isCulprit: true, // CULPRIT!
        extraCluesIfFewerPlayers: ["Paula tiene la foto Polaroid doblada dentro de su sujetador."],
        dossier: {
          roleTitle: "La Culpable Apurada (¡ERES LA CULPABLE!)",
          avatar: "💋",
          isCulprit: true,
          movements: [
            { time: "02:45", place: "Barra lateral", detail: "Llevabas un rato tonteando con Nikos, el barman griego de ojos azules." },
            { time: "03:00", place: "Rincón de los olivos", detail: "Te besaste con él apasionadamente entre las sombras." },
            { time: "03:10", place: "Rincón de los olivos", detail: "¡FLASHAZO! Viste la cámara apuntándote y entraste en pánico por tu novio en Madrid." },
            { time: "03:15", place: "Mesa VIP", detail: "Corriste a la mesa, agarraste la cámara, sacaste la foto fresca, la doblaste y te la metiste en el escote; luego envolviste la cámara en la toalla azul y la metiste bajo la tumbona." }
          ],
          knownInfo: [
            "Tú te besaste con el barman y tienes la foto Polaroid doblada dentro de tu escote.",
            "Te embadurnaste con crema de mango y purpurina antes de salir y pringaste la cámara.",
            "Ocultaste la cámara en la toalla azul bajo la tumbona para que nadie pudiera imprimir más copias.",
            "Puedes acusar a Elena diciendo que ella siempre le echa el ojo a los chicos del servicio."
          ],
          secretObjective: "Oculta la foto de tu escote a toda costa y asegura que la novia se besó con el barman.",
          suspicionNotes: "Si intentan culparte del beso, di que te estabas tomando un mojito en la barra."
        }
      },
      {
        roleId: "rol_5",
        roleName: "La Confidente de la Novia",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Elena vio a Paula meterse algo en el escote a las 03:16."],
        dossier: {
          roleTitle: "La Guardiana de Secretos",
          avatar: "🤫",
          isCulprit: false,
          movements: [
            { time: "02:30", place: "Cama balinesa", detail: "Charlando con la novia sobre los preparativos de la boda." },
            { time: "03:10", place: "Cama balinesa", detail: "Viste a Paula salir corriendo despavorida de la arboleda de los olivos." },
            { time: "03:16", place: "Camino de tumbonas", detail: "Viste a Paula doblar un trozo de papel brillante cuadrado y metérselo a toda prisa en el escote." },
            { time: "03:30", place: "Mesa VIP", detail: "Te enteraste de la desaparición de la cámara." }
          ],
          knownInfo: [
            "Viste a Paula meterse el papel cuadrado rígido en el escote a las 03:16: las medidas son idénticas a una foto Polaroid.",
            "Paula olía intensamente a la crema corporal de mango con purpurina.",
            "Tú estuviste sentada junto a la novia todo el rato, ella nunca se acercó a los olivos."
          ],
          secretObjective: "Exige que Paula enseñe lo que se guardó en el escote a las 03:16.",
          suspicionNotes: "El papel cuadrado en el escote es la prueba definitiva de la foto robada."
        }
      },
      {
        roleId: "rol_6",
        roleName: "La Amiga Sensata",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Lucía habló con el barman Nikos que le confirmó que besó a una morena con crema de mango."],
        dossier: {
          roleTitle: "La Mediadora",
          avatar: "🕊️",
          isCulprit: false,
          movements: [
            { time: "02:20", place: "Tumbonas", detail: "Cuidando los bolsos y los teléfonos del grupo." },
            { time: "03:00", place: "Paseo de la piscina", detail: "Comprando una botella de agua al barman Nikos." },
            { time: "03:20", place: "Mesa VIP", detail: "Repartiendo toallitas húmedas a las que volvían de la pista." },
            { time: "03:35", place: "Tumbona 4", detail: "Encontraste la toalla azul abultada bajo la tumbona y viste la cámara dentro." }
          ],
          knownInfo: [
            "Nikos el barman te susurró con una sonrisa: 'vuestra amiga morena de la crema dulce besa increíble'.",
            "La única amiga morena que se echó esa crema dulce de mango fue Paula.",
            "La novia es rubia y Marta tiene el pelo corto y pelirrojo."
          ],
          secretObjective: "Aporta la confesión del propio barman sobre la chica morena de la crema dulce.",
          suspicionNotes: "El testimonio del barman no deja escapatoria posible a Paula."
        }
      },
      {
        roleId: "rol_7",
        roleName: "La Estilista de Fiesta",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Claudia tiene el bote de crema de mango que le prestó a Paula."],
        dossier: {
          roleTitle: "La Maquilladora",
          avatar: "✨",
          isCulprit: false,
          movements: [
            { time: "02:00", place: "Tocador del reservado", detail: "Retocando los brillos y glitter de todas las chicas." },
            { time: "02:40", place: "Pista de baile", detail: "Bailando con Saray y Marta al ritmo de música griega moderna." },
            { time: "03:15", place: "Tocador", detail: "Comprobaste que el bote de loción de mango que le prestaste a Paula estaba sin tapa y manchado." },
            { time: "03:35", place: "Mesa VIP", detail: "Examinaste la cámara rescatada y reconociste tus partículas de glitter de mango en el disparador." }
          ],
          knownInfo: [
            "Tú compraste ese bote de crema de mango exclusivo en el duty-free del aeropuerto y se lo diste en mano a Paula.",
            "Nadie más se lo puso porque a las demás no les gustaba el tacto pringoso.",
            "Las partículas de purpurina dorada del disparador de la cámara coinciden 100% con esa crema."
          ],
          secretObjective: "Confirma que el glitter de mango en el disparador de la cámara solo lo llevaba Paula.",
          suspicionNotes: "La huella cosmética en el botón disparador vincula a Paula con la manipulación de la cámara."
        }
      }
    ])
  },

  // ==========================================
  // CASO 10: LA MANSIÓN DE BARCELONA
  // ==========================================
  {
    id: 10,
    slug: "mansion-barcelona",
    title: "La Mansión de Pedralbes",
    subtitle: "El pendrive con los contratos secretos y los audios bomba",
    category: "Espionaje & Chantaje",
    emoji: "🏰",
    location: "Mansión de lujo en Pedralbes (Barcelona)",
    incidentTime: "A las 01:15 en el despacho del segundo piso",
    synopsis:
      "Durante una fiesta privada exclusiva en una mansión de Pedralbes, desaparece un pendrive de titanio encriptado del despacho blindado. El pendrive contiene grabaciones de audio y contratos secretos sobre un negocio millonario de influencers que salpica a varias de vosotras.",
    publicTimeline: [
      { time: "00:30", description: "El dueño de la mansión muestra el despacho y su colección de arte al grupo.", location: "Despacho 2º Piso" },
      { time: "01:00", description: "Todos los invitados bajan a la piscina climatizada del jardín inferior.", location: "Jardín & Piscina" },
      { time: "01:15", description: "La alarma silenciosa del ordenador del despacho envía un aviso de desconexión USB.", location: "Ordenador Despacho" },
      { time: "01:35", description: "Una persona vestida de negro desciende por la escalera de servicio.", location: "Escalera de Servicio" },
      { time: "02:00", description: "El anfitrión sube a revisar un archivo y descubre el puerto USB vacío y el cajón abierto.", location: "Despacho 2º Piso" }
    ],
    progressiveClues: [
      {
        minute: 3,
        title: "La Copa de Gin-Tonic con Pepino en la Moqueta",
        badge: "PRUEBA 1 · MIN 3",
        description: "En el suelo del despacho, junto a la torre del ordenador, hay restos de tónica derramada y una rodaja de pepino fresco. Solo una persona pidió ginebra Hendrick's con pepino esta noche.",
        impactQuestion: "¿Quién pidió Hendrick's con rodaja de pepino al camarero de la fiesta?"
      },
      {
        minute: 6,
        title: "El Adaptador USB-C a Lightning en el Zapato",
        badge: "PRUEBA 2 · MIN 6",
        description: "En el baño de la planta baja aparece un adaptador de conector para volcar archivos del pendrive a un iPhone de última generación.",
        impactQuestion: "¿Quién necesitaba descargar los archivos en su iPhone urgentemente?"
      }
    ],
    interrogationQuestions: [
      "¿Dónde estaba cada una a las 01:15 cuando se desconectó el pendrive?",
      "¿Quién tomaba ginebra con rodaja de pepino?",
      "¿Quién tenía deudas con la agencia de influencers y necesitaba los contratos para chantajear?",
      "¿Quién conocía la clave de acceso del ordenador del despacho?"
    ],
    solution: {
      culpritNameRole: "Ainara (La Influencer Rebelde / Papel 1)",
      crimeTime: "01:15",
      keyMethod: "Subió con su copa de Hendrick's con pepino mientras todas estaban en la piscina, introdujo la clave que vio en el tour, extrajo el pendrive, derramó unas gotas de tónica en la moqueta y bajó por la escalera de servicio.",
      fullStory:
        "Ainara descubrió que en ese pendrive había una copia de su contrato de exclusividad con cláusulas abusivas que le impedían firmar con otra agencia por medio millón de euros. Aprovechó el baño colectivo en la piscina a las 01:10 para subir al despacho con su copa de Hendrick's con pepino en la mano. Tecleó la contraseña que memorizó en el tour de las 00:30, arrancó el pendrive USB desconectándolo a las 01:15, tiró sin querer una rodaja de pepino por los nervios, y bajó sigilosamente por la escalera de servicio para esconder el pendrive en el doble fondo de su bolso.",
      criticalClues: [
        "Pidió y bebió la única copa de ginebra con rodaja de pepino de toda la noche.",
        "Se memorizó la clave del despacho durante la visita de las 00:30.",
        "Tenía en su poder el adaptador USB para iPhone y el móvil de chantaje contra la agencia."
      ]
    },
    dossiersByPlayerCount: adaptRolesForCount([
      {
        roleId: "rol_1",
        roleName: "La Influencer Rebelde",
        isCulprit: true, // CULPRIT!
        extraCluesIfFewerPlayers: ["Ainara tiene el pendrive de titanio en el bolsillo interior del forro de su abrigo."],
        dossier: {
          roleTitle: "La Culpable Audaz (¡ERES LA CULPABLE!)",
          avatar: "👑",
          isCulprit: true,
          movements: [
            { time: "00:30", place: "Despacho", detail: "Miraste por encima del hombro del dueño cuando tecleó el código del ordenador (7890)." },
            { time: "01:05", place: "Jardín", detail: "Dijiste que ibas al baño a retocarte el peinado llevando tu copa de Hendrick's con pepino." },
            { time: "01:15", place: "Despacho 2º Piso", detail: "Pusiste la clave 7890, extrajiste el pendrive de titanio, pero se te cayó la rodaja de pepino al sobresaltarte por un ruido." },
            { time: "01:35", place: "Escalera de servicio", detail: "Bajaste en silencio y te guardaste el pendrive en el forro de tu abrigo." }
          ],
          knownInfo: [
            "Tú tienes el pendrive de titanio cosido en el forro de tu abrigo negro.",
            "Bebías ginebra Hendrick's con pepino y perdiste la rodaja en la moqueta del despacho.",
            "Querías romper el contrato con la agencia para no pagar la penalización de 100.000€.",
            "Puedes culpar a Saray diciendo que ella quería vender las grabaciones a la prensa del corazón."
          ],
          secretObjective: "Oculta el pendrive del abrigo y argumenta que dejaste tu copa en la barra antes de la piscina.",
          suspicionNotes: "Si preguntan por el pepino, di que varias chicas compartieron tu copa."
        }
      },
      {
        roleId: "rol_2",
        roleName: "La Periodista de Exclusivas",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Saray vio a Ainara con la copa de pepino subir las escaleras a las 01:08."],
        dossier: {
          roleTitle: "La Investigadora",
          avatar: "🎙️",
          isCulprit: false,
          movements: [
            { time: "00:45", place: "Jardín", detail: "Entrevistando a los invitados de la fiesta para tu podcast." },
            { time: "01:08", place: "Hall principal", detail: "Viste a Ainara subir la escalera hacia el segundo piso llevando su copa con rodaja de pepino." },
            { time: "01:25", place: "Barra del jardín", detail: "Bebiendo champán con Marta y Elena." },
            { time: "02:00", place: "Despacho", detail: "Subiste cuando saltó el escándalo del pendrive robado." }
          ],
          knownInfo: [
            "Viste con tus propios ojos a Ainara subir al 2º piso a las 01:08 con la copa de Hendrick's y su rodaja de pepino flotando.",
            "Nadie más en la fiesta tomó pepino porque el camarero solo tenía un pepino que cortó exclusivamente para Ainara.",
            "Tú estabas buscando una exclusiva legal pero jamás cometerías un delito de allanamiento informático."
          ],
          secretObjective: "Testifica que viste a Ainara subir al despacho a las 01:08 con la copa de pepino.",
          suspicionNotes: "El detalle de que solo había un pepino en toda la fiesta es irrefutable."
        }
      },
      {
        roleId: "rol_3",
        roleName: "La Abogada Corporativa",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Marta redactó el contrato de Ainara y sabe la penalización millonaria."],
        dossier: {
          roleTitle: "La Especialista en Leyes",
          avatar: "💼",
          isCulprit: false,
          movements: [
            { time: "00:30", place: "Despacho", detail: "Examinaste la caja fuerte y el equipo informático durante el tour." },
            { time: "01:00", place: "Piscina", detail: "Nadando con Elena y Paula en el agua climatizada." },
            { time: "01:30", place: "Sauna del jardín", detail: "Charlando sobre negocios con el dueño de la mansión." },
            { time: "02:05", place: "Despacho", detail: "Analizaste el log de desconexión del USB con el anfitrión." }
          ],
          knownInfo: [
            "El archivo sustraído era el contrato maestro de Ainara con la cláusula de rescisión de 100.000€.",
            "Ainara era la única persona con un beneficio económico directo gigantesco por la desaparición de ese archivo.",
            "Tú estuviste en la piscina bajo la mirada del anfitrión desde las 01:00 hasta las 01:30."
          ],
          secretObjective: "Expón el motivo legal y económico de Ainara para hacer desaparecer el contrato.",
          suspicionNotes: "El móvil económico de Ainara es abrumadoramente superior al de cualquier otra."
        }
      },
      {
        roleId: "rol_4",
        roleName: "La Diseñadora de Interiores",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Paula vio la sombra descender por la escalera de servicio a las 01:35."],
        dossier: {
          roleTitle: "La Experta en Espacios",
          avatar: "🏛️",
          isCulprit: false,
          movements: [
            { time: "00:35", place: "Despacho", detail: "Admirando la moqueta de lana importada de Nueva Zelanda." },
            { time: "01:10", place: "Piscina climatizada", detail: "Tomando una piña colada junto al borde." },
            { time: "01:35", place: "Acceso de servicio", detail: "Fuiste a buscar una toalla seca y viste a una chica con vestido de lentejuelas negro salir de la escalera de servicio." },
            { time: "02:00", place: "Salón", detail: "Reunida con todas al sonar la alarma." }
          ],
          knownInfo: [
            "Viste a la chica del vestido de lentejuelas negro salir de la escalera de servicio a las 01:35.",
            "Ainara era la única que llevaba vestido de lentejuelas negro con la espalda descubierta.",
            "La moqueta del despacho es tan delicada que cualquier líquido como ginebra deja una mancha visible de inmediato."
          ],
          secretObjective: "Señala que viste a la chica de las lentejuelas negras salir de la escalera de servicio.",
          suspicionNotes: "El vestido de lentejuelas negras es una identificación visual inequívoca."
        }
      },
      {
        roleId: "rol_5",
        roleName: "La Cantante & Artista",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Elena escuchó el portazo del despacho a las 01:16."],
        dossier: {
          roleTitle: "La Músico",
          avatar: "🎤",
          isCulprit: false,
          movements: [
            { time: "00:50", place: "Piano del salón", detail: "Tocando baladas mientras servían las copas." },
            { time: "01:15", place: "Terraza intermedia", detail: "Tomando aire fresco y escuchaste pasos rápidos en el piso superior." },
            { time: "01:30", place: "Piscina", detail: "Bajaste a unirte a Marta y Paula." },
            { time: "02:05", place: "Despacho", detail: "Viste la copa rota y la rodaja de pepino tirada." }
          ],
          knownInfo: [
            "A las 01:15 escuchaste claramente tacones de aguja finos corriendo por el parquet del 2º piso.",
            "Ainara llevaba tacones de aguja Louboutin que hacían un chasquido metálico inconfundible.",
            "Tú llevabas sandalias planas romanas que no hacen ruido."
          ],
          secretObjective: "Declara que el sonido de tacones de aguja a las 01:15 coincide con los Louboutin de Ainara.",
          suspicionNotes: "El sonido de los tacones de aguja ubica los pasos en el despacho a las 01:15."
        }
      },
      {
        roleId: "rol_6",
        roleName: "La Barman de la Fiesta",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Lucía sirvió la copa con la única rodaja de pepino a Ainara."],
        dossier: {
          roleTitle: "La Coctelera Profesional",
          avatar: "🍸",
          isCulprit: false,
          movements: [
            { time: "00:40", place: "Barra de licores", detail: "Preparando cócteles premium para los 15 asistentes." },
            { time: "01:00", place: "Barra de licores", detail: "Ainara te pidió un gin-tonic de Hendrick's con pepino cortado muy fino." },
            { time: "01:20", place: "Cocina", detail: "Reponiendo hielo y limpiando copas." },
            { time: "02:00", place: "Barra", detail: "Avisada por el anfitrión de la búsqueda general." }
          ],
          knownInfo: [
            "Ainara fue la ÚNICA persona en toda la fiesta a quien le serviste pepino: se acabó el pepino con su copa.",
            "Ainara se llevó la copa en la mano hacia las escaleras interiores a la 01:05.",
            "Cuando Ainara volvió al jardín a las 01:40 ya no tenía la copa en la mano y dijo que la había dejado arriba."
          ],
          secretObjective: "Confirma como barman que solo Ainara tenía la copa con pepino en toda la velada.",
          suspicionNotes: "El testimonio de la camarera es concluyente: el pepino solo estaba en la copa de Ainara."
        }
      },
      {
        roleId: "rol_7",
        roleName: "La Experta en Ciberseguridad",
        isCulprit: false,
        extraCluesIfFewerPlayers: ["Claudia comprobó el adaptador encontrado en el baño."],
        dossier: {
          roleTitle: "La Hacker Ética",
          avatar: "💻",
          isCulprit: false,
          movements: [
            { time: "00:30", place: "Despacho", detail: "Viste la torre del ordenador y el pendrive Kingston IronKey de titanio enchufado." },
            { time: "01:00", place: "Piscina", detail: "En la piscina con Marta y Paula hasta la 01:30." },
            { time: "01:45", place: "Baño de invitados", detail: "Encontraste el adaptador de USB-C a Lightning sobre el lavabo." },
            { time: "02:05", place: "Despacho", detail: "Comprobaste los registros del sistema operativo." }
          ],
          knownInfo: [
            "El registro muestra que el pendrive fue desconectado a las 01:15:32 tras meter la contraseña correcta al primer intento.",
            "El adaptador encontrado en el baño sirve para conectar ese modelo exacto de pendrive a un iPhone.",
            "Ainara tiene un iPhone 15 Pro Max con conector Lightning / USB-C."
          ],
          secretObjective: "Explica la evidencia forense digital de la desconexión a las 01:15 y el adaptador del baño.",
          suspicionNotes: "La desconexión a las 01:15 coincide con los tacones escuchados y la subida de Ainara."
        }
      }
    ])
  }
];
